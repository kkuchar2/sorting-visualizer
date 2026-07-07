import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { useThrottleCallback } from '@react-hook/throttle'
import { Canvas } from '@react-three/fiber'

import { SoundEngine } from '@/audio/soundEngine'
import { CalculationState } from '@/components/common.types'
import { ControlButtons } from '@/components/ControlButtons/ControlButtons'
import { Slider } from '@/components/Slider/Slider'
import { SoundModeSelector } from '@/components/SoundModeSelector/SoundModeSelector'
import { VisualModeSelector } from '@/components/VisualModeSelector/VisualModeSelector'
import styles from '@/components/Visualiser/Visualiser.module.scss'
import { DEFAULT_SAMPLE_COUNT, MAX_SAMPLE_VALUE, SLOWDOWN_FACTOR_MS, SortAlgorithm, imageSortingAlgorithm, sortingAlgorithms } from '@/config'
import { IMAGE_PATH } from '@/config/imageMode'
import { SoundMode } from '@/config/soundModes'
import { VisualMode } from '@/config/visualModes'
import { ChartView } from '@/three/canvas/ChartView'
import { ChartCamera } from '@/three/canvas/ChartCamera'
import { createSAB16, createSAB32, createSAB8 } from '@/util/util'
import { loadImagePixels, type ImagePixelData } from '@/util/imageData'
import { registerSortWorker, sendMessage, unregisterWorker } from '@/workers/workers'
import type { SortWorkerOutboundMessage } from '@/workers/worker.types'

interface VisualiserProps {
  algorithm: SortAlgorithm
  onSelectedAlgorithmChanged: (algorithm: SortAlgorithm) => void
  onVisualModeChanged?: (mode: VisualMode) => void
  onSortingChanged?: (sorting: boolean) => void
}

export const Visualiser = (props: VisualiserProps) => {
  const { algorithm, onSelectedAlgorithmChanged, onVisualModeChanged, onSortingChanged } = props

  const soundEngineRef = useRef<SoundEngine | null>(null)

  const calculationState = useRef<CalculationState>({
    controlData: createSAB8(3),
    soundData: createSAB32(2),
    data: createSAB16(DEFAULT_SAMPLE_COUNT),
    sampleCount: DEFAULT_SAMPLE_COUNT,
    dirty: true,
    locked: false,
  })

  const [soundMode, setSoundMode] = useState<SoundMode>('pluck')
  const [visualMode, setVisualMode] = useState<VisualMode>('bars')
  const [sampleCount, setSampleCount] = useState(DEFAULT_SAMPLE_COUNT)
  const [scramblePercent, setScramblePercent] = useState(100)
  const [imagePixels, setImagePixels] = useState<ImagePixelData | null>(null)
  const [sorted, setSorted] = useState(false)
  const [sorting, setSorting] = useState(false)
  const [scrambling, setScrambling] = useState(false)
  const [paused, setPaused] = useState(false)

  const worker = useRef<Worker | null>(null)
  const pendingSampleCountRef = useRef<number | null>(null)
  const pendingIdentityInitRef = useRef(false)
  const pendingUseUint32Ref = useRef(false)
  const pendingScrambleRef = useRef<number | null>(null)
  const savedChartSampleCountRef = useRef(DEFAULT_SAMPLE_COUNT)
  const savedChartAlgorithmRef = useRef<SortAlgorithm>(sortingAlgorithms[3])
  const scramblePercentRef = useRef(100)
  const visualModeRef = useRef<VisualMode>('bars')
  const applySampleCountRef = useRef<(count: number, identityInit?: boolean, useUint32?: boolean) => void>(() => {})

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    visualModeRef.current = visualMode
    scramblePercentRef.current = scramblePercent
    onVisualModeChanged?.(visualMode)
  }, [visualMode, scramblePercent, onVisualModeChanged])

  useEffect(() => {
    onSortingChanged?.(sorting)
  }, [sorting, onSortingChanged])

  const requestScramble = useCallback((percent: number) => {
    setScrambling(true)
    setSorted(percent === 0)
    sendMessage(worker.current, 'shuffle', { scramblePercent: percent })
  }, [])

  const onVisualModeSelected = useCallback(
    (mode: VisualMode) => {
      if (visualMode === 'image' && mode !== 'image') {
        setImagePixels(null)
        applySampleCountRef.current(savedChartSampleCountRef.current)
        onSelectedAlgorithmChanged(savedChartAlgorithmRef.current)
      } else if (mode === 'image' && visualMode !== 'image') {
        savedChartSampleCountRef.current = sampleCount
        savedChartAlgorithmRef.current = algorithm
        onSelectedAlgorithmChanged(imageSortingAlgorithm)
      }

      setVisualMode(mode)
    },
    [visualMode, sampleCount, algorithm, onSelectedAlgorithmChanged],
  )

  useEffect(() => {
    if (visualMode !== 'image') return

    let cancelled = false

    loadImagePixels(IMAGE_PATH)
      .then((pixels) => {
        if (cancelled) return

        setImagePixels(pixels)
        pendingScrambleRef.current = scramblePercentRef.current
        applySampleCountRef.current(pixels.pixelCount, true, pixels.pixelCount > 65536)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      cancelled = true
    }
  }, [visualMode])

  useEffect(() => {
    worker.current = registerSortWorker((e: MessageEvent<SortWorkerOutboundMessage>) => {
      switch (e.data.type) {
        case 'init': {
          calculationState.current.locked = false
          const pendingCount = pendingSampleCountRef.current
          pendingSampleCountRef.current = null
          if (pendingCount !== null && pendingCount !== calculationState.current.sampleCount) {
            applySampleCountRef.current(pendingCount, pendingIdentityInitRef.current, pendingUseUint32Ref.current)
            pendingIdentityInitRef.current = false
            pendingUseUint32Ref.current = false
          } else {
            pendingIdentityInitRef.current = false
            pendingUseUint32Ref.current = false
            const pendingScramble = pendingScrambleRef.current
            pendingScrambleRef.current = null
            if (pendingScramble !== null && visualModeRef.current === 'image') {
              requestScramble(pendingScramble)
            }
          }
          forceUpdate()
          break
        }
        case 'sort': {
          const freq = Array.from(calculationState.current.soundData)[0]
          soundEngineRef.current?.play(freq)
          forceUpdate()
          break
        }
        case 'shuffle':
          setScrambling(false)
          if (visualModeRef.current === 'image') {
            setSorted(scramblePercentRef.current === 0)
          } else {
            setSorted(false)
          }
          calculationState.current.dirty = true
          forceUpdate()
          break
        case 'sortFinished':
          soundEngineRef.current?.suspend()
          setSorting(false)
          setSorted(e.data.payload.sorted)
          forceUpdate()
          break
      }
    })

    sendMessage(worker.current, 'initSharedData', {
      buffer: calculationState.current.data,
      controlData: calculationState.current.controlData,
      soundData: calculationState.current.soundData,
      maxValue: MAX_SAMPLE_VALUE,
    })

    const soundEngine = new SoundEngine()
    soundEngine.init()
    soundEngineRef.current = soundEngine

    return () => {
      soundEngineRef.current?.dispose()
      soundEngineRef.current = null

      if (worker.current) {
        unregisterWorker(worker.current)
      }
    }
  }, [])

  useEffect(() => {
    soundEngineRef.current?.setMode(soundMode)
  }, [soundMode])

  const onSortButtonPressed = useCallback(() => {
    soundEngineRef.current?.resume()
    calculationState.current.dirty = false
    calculationState.current.controlData[0] = 0
    calculationState.current.controlData[1] = 0
    calculationState.current.controlData[2] = SLOWDOWN_FACTOR_MS
    setPaused(false)
    setSorting(true)
    const sortAlgorithm = visualModeRef.current === 'image' ? imageSortingAlgorithm.value : algorithm.value
    sendMessage(worker.current, 'sort', { algorithm: sortAlgorithm })
  }, [algorithm])

  const onStopButtonPressed = useCallback(() => {
    soundEngineRef.current?.suspend()
    calculationState.current.controlData[1] = 1
    setPaused(false)
    setSorting(false)
  }, [calculationState])

  const onPauseButtonPressed = useCallback(() => {
    soundEngineRef.current?.suspend()
    setPaused(true)
    calculationState.current.controlData[0] = 1
  }, [calculationState])

  const onResumeButtonPressed = useCallback(() => {
    soundEngineRef.current?.resume()
    setPaused(false)
    calculationState.current.controlData[0] = 0
  }, [calculationState])

  const requestShuffleData = useCallback(() => {
    setSorting(false)
    if (visualModeRef.current === 'image') {
      requestScramble(scramblePercentRef.current)
      return
    }

    sendMessage(worker.current, 'shuffle', { maxValue: MAX_SAMPLE_VALUE })
  }, [requestScramble])

  const applySampleCount = useCallback((newSampleCount: number, identityInit = false, useUint32 = false) => {
    setSorted(false)

    if (calculationState.current.locked) {
      pendingSampleCountRef.current = newSampleCount
      pendingIdentityInitRef.current = identityInit
      pendingUseUint32Ref.current = useUint32
      return
    }

    const newData = useUint32 ? createSAB32(newSampleCount) : createSAB16(newSampleCount)

    calculationState.current = {
      controlData: calculationState.current.controlData,
      data: newData,
      soundData: calculationState.current.soundData,
      sampleCount: newSampleCount,
      dirty: true,
      locked: true,
    }

    setSampleCount(newSampleCount)

    sendMessage(worker.current, 'initSharedData', {
      buffer: newData,
      controlData: calculationState.current.controlData,
      soundData: calculationState.current.soundData,
      maxValue: MAX_SAMPLE_VALUE,
      identityInit,
    })
  }, [])

  applySampleCountRef.current = applySampleCount

  const throttledApplySampleCount = useThrottleCallback(applySampleCount, 120)

  const onSampleCountChange = useCallback(
    (newSampleCount: number) => {
      setSampleCount(newSampleCount)
      throttledApplySampleCount(newSampleCount)
    },
    [throttledApplySampleCount],
  )

  const onSampleCountCommit = useCallback(
    (newSampleCount: number) => {
      setSampleCount(newSampleCount)
      applySampleCount(newSampleCount)
    },
    [applySampleCount],
  )

  const applyScramblePercent = useCallback(
    (percent: number) => {
      if (visualModeRef.current !== 'image' || sorting || scrambling) return
      requestScramble(percent)
    },
    [requestScramble, sorting, scrambling],
  )

  const onScramblePercentChange = useCallback((percent: number) => {
    setScramblePercent(percent)
  }, [])

  const onScramblePercentCommit = useCallback(
    (percent: number) => {
      setScramblePercent(percent)
      applyScramblePercent(percent)
    },
    [applyScramblePercent],
  )

  const isImageMode = visualMode === 'image'

  return (
    <div className={styles.visualiser} data-image-mode={isImageMode ? '' : undefined}>
      <div className={styles.toolbar}>
        <div className={styles.transportRow}>
          <ControlButtons
            sorted={sorted}
            sorting={sorting}
            shuffleDisabled={scrambling}
            paused={paused}
            requestShuffleData={requestShuffleData}
            onPauseButtonPressed={onPauseButtonPressed}
            onResumeButtonPressed={onResumeButtonPressed}
            onStopButtonPressed={onStopButtonPressed}
            onSortButtonPressed={onSortButtonPressed}
          />
        </div>

        <div className={styles.settingsGrid}>
          <div className={styles.samplesField}>
            <div className={styles.samplesHeader}>
              <label className={styles.samplesLabel} htmlFor={isImageMode ? 'scramble-range' : 'samples-range'}>
                {isImageMode ? 'Scramble' : 'Samples'}
              </label>
              <span className={[styles.sampleCount, scrambling ? styles.sampleCountLoading : ''].join(' ')}>
                {scrambling ? 'Applying…' : isImageMode ? `${scramblePercent}%` : sampleCount}
              </span>
            </div>
            {isImageMode ? (
              <Slider
                id={'scramble-range'}
                min={0}
                max={100}
                disabled={sorting || scrambling || !imagePixels}
                value={scramblePercent}
                onChange={onScramblePercentChange}
                onCommit={onScramblePercentCommit}
              />
            ) : (
              <Slider
                id={'samples-range'}
                min={10}
                max={5000}
                disabled={sorting}
                value={sampleCount}
                onChange={onSampleCountChange}
                onCommit={onSampleCountCommit}
              />
            )}
          </div>

          <SoundModeSelector currentMode={soundMode} onModeSelected={setSoundMode} />
          <VisualModeSelector disabled={sorting} currentMode={visualMode} onModeSelected={onVisualModeSelected} />
        </div>
      </div>

      <div className={styles.chartShell}>
        <div className={styles.chartInner}>
          <Canvas orthographic>
            <ChartCamera />
            <ChartView
              mode={visualMode}
              imagePixels={imagePixels}
              data={Array.from(calculationState.current.data)}
              marker={
                sorting ? calculationState.current.soundData[1] : sorted ? calculationState.current.sampleCount - 1 : undefined
              }
              sampleCount={calculationState.current.sampleCount}
            />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

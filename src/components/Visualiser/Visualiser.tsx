import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { useThrottleCallback } from '@react-hook/throttle'
import { Canvas } from '@react-three/fiber'

import { SoundEngine } from '@/audio/soundEngine'
import { AlgorithmSelector } from '@/components/AlgorithmSelector/AlgorithmSelector'
import { CalculationState } from '@/components/common.types'
import { ControlButtons } from '@/components/ControlButtons/ControlButtons'
import pageStyles from '@/components/Pages/IndexPage/IndexPage.module.scss'
import { Slider } from '@/components/Slider/Slider'
import { SoundModeSelector } from '@/components/SoundModeSelector/SoundModeSelector'
import { VisualModeSelector } from '@/components/VisualModeSelector/VisualModeSelector'
import styles from '@/components/Visualiser/Visualiser.module.scss'
import { DEFAULT_SAMPLE_COUNT, MAX_SAMPLE_VALUE, SLOWDOWN_FACTOR_MS, SortAlgorithm, sortingAlgorithms } from '@/config'
import { SoundMode } from '@/config/soundModes'
import { VisualMode } from '@/config/visualModes'
import { ChartView } from '@/three/canvas/ChartView'
import { ChartCamera } from '@/three/canvas/ChartCamera'
import { createSAB16, createSAB32, createSAB8 } from '@/util/util'
import { registerSortWorker, sendMessage, unregisterWorker } from '@/workers/workers'

interface VisualiserProps {
  algorithm: SortAlgorithm
  onSelectedAlgorithmChanged: (algorithm: SortAlgorithm) => void
  onShowSelectAlgorithmModal?: () => void
}

export const Visualiser = (props: VisualiserProps) => {
  const { algorithm, onSelectedAlgorithmChanged, onShowSelectAlgorithmModal } = props

  const soundEngineRef = useRef<SoundEngine | null>(null)

  const calculationState = useRef<CalculationState>({
    controlData: createSAB8(3),
    soundData: createSAB32(2),
    data: createSAB16(DEFAULT_SAMPLE_COUNT),
    sampleCount: DEFAULT_SAMPLE_COUNT,
    dirty: true,
    locked: false,
  })

  const [soundMode, setSoundMode] = useState<SoundMode>('triangle')
  const [visualMode, setVisualMode] = useState<VisualMode>('bars')
  const [sorted, setSorted] = useState(false)
  const [sorting, setSorting] = useState(false)
  const [paused, setPaused] = useState(false)

  const worker = useRef(null)

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    worker.current = registerSortWorker((e) => {
      switch (e.data.type) {
        case 'init':
          calculationState.current.locked = false
          forceUpdate()
          break
        case 'sort':
          const freq = Array.from(calculationState.current.soundData)[0]
          soundEngineRef.current?.play(freq)
          forceUpdate()
          break
        case 'shuffle':
          setSorted(false)
          calculationState.current.dirty = true
          forceUpdate()
          break
        case 'sortFinished':
          soundEngineRef.current?.suspend()
          setSorting(false)
          setSorted(e.data.payload.sorted)
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
    sendMessage(worker.current, 'sort', { algorithm: algorithm.value })
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
    sendMessage(worker.current, 'shuffle', { maxValue: MAX_SAMPLE_VALUE })
  }, [worker])

  const updateSampleCount = useThrottleCallback((newSampleCount) => {
    setSorted(false)

    if (calculationState.current.locked) {
      return
    }

    const newData = createSAB16(newSampleCount)

    calculationState.current = {
      controlData: calculationState.current.controlData,
      data: newData,
      soundData: calculationState.current.soundData,
      sampleCount: newSampleCount,
      dirty: true,
      locked: true,
    }

    sendMessage(worker.current, 'initSharedData', {
      buffer: newData,
      controlData: calculationState.current.controlData,
      soundData: calculationState.current.soundData,
      maxValue: MAX_SAMPLE_VALUE,
    })
  }, 60)

  return (
    <div className={styles.visualiser}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTop}>
          <AlgorithmSelector
            disabled={sorting}
            algorithms={sortingAlgorithms}
            currentAlgorithm={algorithm}
            onSelectedAlgorithmSelected={onSelectedAlgorithmChanged}
          />
          <button
            className={[pageStyles.showSelectAlgorithmModalButton, sorting && pageStyles.disabled].join(' ')}
            onClick={sorting ? undefined : onShowSelectAlgorithmModal}
          >
            {'Select Algorithm'}
          </button>
        </div>

        <div className={pageStyles.selectedAlgorithm}>{algorithm.label}</div>

        <div className={styles.samplesBlock}>
          <div className={pageStyles.samplesRow}>
            <span className={pageStyles.samplesLabel}>{'Sample count'}</span>
            <span className={pageStyles.sampleCount}>{calculationState.current.sampleCount}</span>
          </div>
          <Slider
            id={'samples-range'}
            min={10}
            max={5000}
            disabled={sorting}
            value={calculationState.current.sampleCount}
            onChange={updateSampleCount}
          />
        </div>

        <div className={styles.soundBlock}>
          <span className={pageStyles.samplesLabel}>{'Sound'}</span>
          <SoundModeSelector disabled={sorting} currentMode={soundMode} onModeSelected={setSoundMode} />
        </div>

        <div className={styles.visualBlock}>
          <span className={pageStyles.samplesLabel}>{'View'}</span>
          <VisualModeSelector disabled={sorting} currentMode={visualMode} onModeSelected={setVisualMode} />
        </div>

        <ControlButtons
          sorted={sorted}
          sorting={sorting}
          paused={paused}
          requestShuffleData={requestShuffleData}
          onPauseButtonPressed={onPauseButtonPressed}
          onResumeButtonPressed={onResumeButtonPressed}
          onStopButtonPressed={onStopButtonPressed}
          onSortButtonPressed={onSortButtonPressed}
        />
      </div>

      <div className={styles.chartShell}>
        <div className={styles.chartInner}>
          <Canvas orthographic>
            <ChartCamera />
            <ChartView
              mode={visualMode}
              data={Array.from(calculationState.current.data)}
              marker={Array.from(calculationState.current.soundData)[1]}
              sampleCount={calculationState.current.sampleCount}
            />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { useThrottleCallback } from '@react-hook/throttle';
import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { AlgorithmSelector } from '@/components/AlgorithmSelector/AlgorithmSelector';
import { CalculationState } from '@/components/common.types';
import { ControlButtons } from '@/components/ControlButtons/ControlButtons';
import styles from '@/components/Pages/IndexPage/IndexPage.module.scss';
import { Slider } from '@/components/Slider/Slider';
import { DEFAULT_SAMPLE_COUNT, MAX_SAMPLE_VALUE, SLOWDOWN_FACTOR_MS, SortAlgorithm, sortingAlgorithms } from '@/config';
import { Bar } from '@/three/canvas/Examples';
import { createSAB16, createSAB32, createSAB8 } from '@/util/util';
import { registerSortWorker, sendMessage, unregisterWorker } from '@/workers/workers';

interface VisualiserProps {
    algorithm: SortAlgorithm;
    onSelectedAlgorithmChanged: (algorithm: SortAlgorithm) => void;
    onShowSelectAlgorithmModal?: () => void;
}

export const Visualiser = (props: VisualiserProps) => {

    const { algorithm, onSelectedAlgorithmChanged, onShowSelectAlgorithmModal } = props;

    const osc = useRef(null);

    const calculationState = useRef<CalculationState>({
        controlData: createSAB8(3),
        soundData: createSAB32(2),
        data: createSAB16(DEFAULT_SAMPLE_COUNT),
        sampleCount: DEFAULT_SAMPLE_COUNT,
        dirty: true,
        locked: false
    });

    const audioContextRef = useRef<AudioContext>();

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);

    const worker = useRef(null);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        worker.current = registerSortWorker(e => {
            switch (e.data.type) {
                case 'init':
                    calculationState.current.locked = false;
                    forceUpdate();
                    break;
                case 'sort':
                    const freq = Array.from(calculationState.current.soundData)[0];
                    osc.current.frequency.value = freq;
                    forceUpdate();
                    break;
                case 'shuffle':
                    setSorted(false);
                    calculationState.current.dirty = true;
                    forceUpdate();
                    break;
                case 'sortFinished':
                    audioContextRef.current.suspend();
                    setSorting(false);
                    setSorted(e.data.payload.sorted);
                    break;
            }
        });

        sendMessage(worker.current, 'initSharedData', {
            buffer: calculationState.current.data,
            controlData: calculationState.current.controlData,
            soundData: calculationState.current.soundData,
            maxValue: MAX_SAMPLE_VALUE
        });

        const audioContext = new AudioContext();

        osc.current = audioContext.createOscillator();
        const node = audioContext.createGain();
        node.gain.value = 0.05;

        osc.current.type = 'triangle';

        osc.current.connect(node);
        node.connect(audioContext.destination);
        osc.current.start();

        audioContextRef.current = audioContext;
        audioContext.suspend();

        return () => {

            if (osc.current?.context.state === 'running') {
                osc.current?.stop();
            }

            if (worker.current) {
                unregisterWorker(worker.current);
            }
        };
    }, []);

    const onSortButtonPressed = useCallback(() => {
        audioContextRef.current.resume();
        calculationState.current.dirty = false;
        calculationState.current.controlData[0] = 0;
        calculationState.current.controlData[1] = 0;
        calculationState.current.controlData[2] = SLOWDOWN_FACTOR_MS;
        setPaused(false);
        setSorting(true);
        sendMessage(worker.current, 'sort', { algorithm: algorithm.value });
    }, [algorithm]);

    const onStopButtonPressed = useCallback(() => {
        audioContextRef.current.suspend();
        calculationState.current.controlData[1] = 1;
        setPaused(false);
        setSorting(false);
    }, [calculationState]);

    const onPauseButtonPressed = useCallback(() => {
        audioContextRef.current.suspend();
        setPaused(true);
        calculationState.current.controlData[0] = 1;
    }, [calculationState]);

    const onResumeButtonPressed = useCallback(() => {
        audioContextRef.current.resume();
        setPaused(false);
        calculationState.current.controlData[0] = 0;
    }, [calculationState]);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker.current, 'shuffle', { maxValue: MAX_SAMPLE_VALUE });
    }, [worker]);

    const updateSampleCount = useThrottleCallback(newSampleCount => {

        setSorted(false);

        if (calculationState.current.locked) {
            return;
        }

        const newData = createSAB16(newSampleCount);

        calculationState.current = {
            controlData: calculationState.current.controlData,
            data: newData,
            soundData: calculationState.current.soundData,
            sampleCount: newSampleCount,
            dirty: true,
            locked: true
        };

        sendMessage(worker.current, 'initSharedData', {
            buffer: newData,
            controlData: calculationState.current.controlData,
            soundData: calculationState.current.soundData,
            maxValue: MAX_SAMPLE_VALUE
        });

    }, 60);

    return <div className={'flex h-full w-full flex-col gap-[30px]'}>
        <div className={'grid w-full place-items-center'}>
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

        <div className={'w-full'}>
            <div className={'flex w-full items-center justify-center p-3'}>
                <div className={styles.samplesLabel}>
                    {'Samples'}
                </div>
                <div className={styles.sampleCount}>
                    {calculationState.current.sampleCount}
                </div>
            </div>
            <Slider id={'samples-range'}
                min={10}
                max={5000}
                disabled={sorting}
                value={calculationState.current.sampleCount}
                onChange={updateSampleCount}/>
        </div>

        <div className={'grid w-full place-items-center'}>
            <div className={'flex max-w-[600px] flex-wrap justify-center gap-3'}>
                <AlgorithmSelector
                    algorithms={sortingAlgorithms}
                    currentAlgorithm={algorithm}
                    onSelectedAlgorithmSelected={onSelectedAlgorithmChanged}
                />
                <button className={styles.showSelectAlgorithmModalButton} onClick={onShowSelectAlgorithmModal}>
                    {'Select Algorithm'}
                </button>
            </div>
        </div>

        <div className={'relative grid w-full grow place-items-center'}>
            <Canvas>
                <Bar data={Array.from(calculationState.current.data)}
                    marker={Array.from(calculationState.current.soundData)[1]}
                    sampleCount={calculationState.current.sampleCount}/>
                <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={1}/>
            </Canvas>
        </div>
    </div>;
};
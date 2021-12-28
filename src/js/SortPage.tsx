import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Button, Select, Slider, Text, Input} from "kuchkr-react-component-library";
import {BarsView} from "components/BarsView/BarsView";
import {createSAB, useEffectWithNonNull} from 'util/util';

import {registerSortWorker, sendMessage, unregisterWorker} from './workers/workers';

import {
    inputErrorTextTheme,
    samplesTextTheme,
    samplesValueInputTheme,
    selectTheme,
    shuffleButtonTheme,
    sliderTheme,
    sortButtonTheme,
    sortTextTheme,
    stopPauseButtonTheme,
    StyledChart,
    StyledControlsSection,
    StyledDoubleButton,
    StyledShuffle,
    StyledSortButtonContent,
    StyledSortPage,
    StyledStopStartPauseButtons
} from "./style";

const sortingAlgorithms = [
    {value: "MergeSort", label: "MergeSort"},
    {value: "BubbleSort", label: "BubbleSort"},
    {value: "InsertionSort", label: "InsertionSort"},
    {value: "QuickSort", label: "QuickSort"}
];

export const SortPage = () => {

    const MIN_SAMPLE_COUNT = 10;
    const MAX_SAMPLE_COUNT = 1000;
    const DEFAULT_SAMPLE_COUNT = 100;
    const MAX_SAMPLE_VALUE = 256;
    const SLOWDOWN_FACTOR_MS = 1;

    /**
     * Control data is also SharedArrayBuffer
     * to avoid delays in communication between worker and component
     *
     * controlData[0] = 0 - not paused, 1 - paused
     * controlData[1] = 0 - not aborted, 1 - aborted
     * controlData[2] = value - slowdown factor of notifications from worker
     */
    const [calculationState, setCalculationState] = useState({
        controlData: createSAB(3),
        data: createSAB(DEFAULT_SAMPLE_COUNT),
        sampleCount: DEFAULT_SAMPLE_COUNT
    });

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);

    const [worker, setWorker] = useState(null);
    const [color] = useState("#606060");
    const [colorDisabled] = useState("#2f2f2f");
    const [dirty, setDirty] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const messageHandlersMap = {
        "sort": () => forceUpdate(),
        "shuffle": () => onShuffleDataReceived(),
        "sortFinished": payload => onSortFinished(payload.sorted),
    };

    useEffect(() => {
        const onMessageReceived = e => messageHandlersMap[e.data.type](e.data.payload);
        setWorker(registerSortWorker(onMessageReceived, calculationState.data, calculationState.controlData));
        return () => unregisterWorker(worker);
    }, []);

    useEffectWithNonNull(() => {
        initializeData();
        requestShuffleData();
    }, [worker, calculationState]);

    const onShuffleDataReceived = useCallback(() => {
        setSorted(false);
        setDirty(true);
        forceUpdate();
    }, []);

    const onSortFinished = useCallback(isSorted => {
        setSorting(false);
        setSorted(isSorted);
    }, []);

    const onSortButtonPressed = useCallback(() => {
        setDirty(false);
        calculationState.controlData[0] = 0;
        calculationState.controlData[1] = 0;
        calculationState.controlData[2] = SLOWDOWN_FACTOR_MS;
        setPaused(false);
        setSorting(true);
        sendMessage(worker, "sort", {algorithm: selectedAlgorithm.value});
    }, [worker, sorting, sorted, selectedAlgorithm, paused]);

    const onStopButtonPressed = useCallback(() => {
        calculationState.controlData[1] = 1;
        setPaused(false);
        setSorting(false);
    }, [worker]);

    const onPauseButtonPressed = useCallback(() => {
        setPaused(true);
        calculationState.controlData[0] = 1;
    }, [worker]);

    const onResumeButtonPressed = useCallback(() => {
        setPaused(false);
        calculationState.controlData[0] = 0;
    }, []);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker, "shuffle", {maxValue: MAX_SAMPLE_VALUE});
    }, [worker]);

    const initializeData = useCallback(() => {
        sendMessage(worker, "initSharedData", {
            buffer: calculationState.data,
            controlData: calculationState.controlData,
        });
    }, [calculationState, worker]);

    const updateSampleCount = useCallback(newSampleCount => {

        if (!worker) {
            return;
        }

        if (!isSampleCountValid(newSampleCount)) {
            setCalculationState({
                controlData: calculationState.controlData,
                data: calculationState.data,
                sampleCount: Math.min(MAX_SAMPLE_COUNT, newSampleCount)
            });
            return;
        }

        const newData = createSAB(newSampleCount);

        sendMessage(worker, "initSharedData", {
            buffer: newData,
            controlData: calculationState.controlData,
        });

        sendMessage(worker, "shuffle", {maxValue: MAX_SAMPLE_VALUE});

        setCalculationState({
            controlData: calculationState.controlData,
            data: newData,
            sampleCount: newSampleCount
        });
    }, [calculationState, worker]);

    const renderButton = useCallback(() => {
        if (sorting && !paused) {
            return <StyledDoubleButton>
                <Button theme={stopPauseButtonTheme} onClick={onPauseButtonPressed} text={"Pause"}/>
                <Button theme={stopPauseButtonTheme} onClick={onStopButtonPressed} text={"Stop"}/>
            </StyledDoubleButton>;
        } else if (paused) {
            return <StyledDoubleButton>
                <Button theme={stopPauseButtonTheme} onClick={onResumeButtonPressed} text={"Resume"}/>
                <Button theme={stopPauseButtonTheme} onClick={onStopButtonPressed} text={"Stop"}/>
            </StyledDoubleButton>;
        }

        const operationsDisabled = sorted || !(isSampleCountValid(calculationState.sampleCount));

        return <Button
            theme={sortButtonTheme}
            onClick={onSortButtonPressed}
            title={sorted ? 'Shuffle first please' : 'Click to sort data'}
            disabled={operationsDisabled}>
            <StyledSortButtonContent>
                <Text theme={sortTextTheme(operationsDisabled)} text={"Sort!"}/>
            </StyledSortButtonContent>
        </Button>;

    }, [sorting, sorted, paused, onSortButtonPressed, onPauseButtonPressed, onStopButtonPressed, onResumeButtonPressed, calculationState]);

    const isSampleCountValid = useCallback((v) => {
        return v >= MIN_SAMPLE_COUNT && v <= MAX_SAMPLE_COUNT;
    }, []);

    const renderInputError = useCallback(() => {
        if (isSampleCountValid(calculationState.sampleCount)) {
            return null;
        }

        return <Text theme={inputErrorTextTheme}
                     text={`Must be number in [${MIN_SAMPLE_COUNT}, ${MAX_SAMPLE_COUNT}] range`}/>
    }, [calculationState]);

    const operationsDisabled = !isSampleCountValid(calculationState.sampleCount);

    let sliderValue;

    if (isNaN(calculationState.sampleCount)) {
        sliderValue = 0;
    } else {
        sliderValue = Math.max(calculationState.data.length, calculationState.sampleCount);
    }

    return <StyledSortPage>
        <StyledControlsSection>
            <Select
                style={{marginTop: 20}}
                theme={selectTheme}
                placeholder={'Select sorting algorithm'}
                disabled={sorting}
                isSearchable={false}
                options={sortingAlgorithms}
                value={selectedAlgorithm}
                onChange={setSelectedAlgorithm}>
            </Select>

            <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text theme={samplesTextTheme} text={`Samples:`}/>
                <Input
                    onChange={updateSampleCount}
                    style={{marginTop: 20, marginBottom: 20}}
                    theme={samplesValueInputTheme}
                    title={null}
                    value={isNaN(calculationState.sampleCount) ? '0' : calculationState.sampleCount.toString()}
                    placeholder={'Enter sample count'}
                    initialValue={`${calculationState.sampleCount}`}/>
                {renderInputError()}
            </div>

            <Slider
                style={{marginBottom: 30, zIndex: 0}}
                text={"Sample count:"}
                logarithmic={true}
                value={sliderValue}
                min={MIN_SAMPLE_COUNT}
                theme={sliderTheme}
                max={MAX_SAMPLE_COUNT}
                useMarks={false}
                innerModernSlider={true}
                disabled={sorting}
                onChange={updateSampleCount}>
            </Slider>

            <StyledShuffle>
                <Button theme={shuffleButtonTheme} text={"Shuffle"} disabled={operationsDisabled || sorting}
                        onClick={requestShuffleData}/>
            </StyledShuffle>

            <StyledStopStartPauseButtons>
                {renderButton()}
            </StyledStopStartPauseButtons>
        </StyledControlsSection>

        <StyledChart>
            <BarsView
                samples={Math.max(calculationState.data.length, calculationState.sampleCount)}
                maxValue={MAX_SAMPLE_VALUE}
                data={Array.from(calculationState.data)}
                color={isSampleCountValid(calculationState.sampleCount) ? color : colorDisabled}
                algorithm={selectedAlgorithm}
                dirty={dirty}/>
        </StyledChart>
    </StyledSortPage>;
};
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Button, Select, Slider, Text, Input} from "kuchkr-react-component-library";
import {BarsView} from "components/BarsView/BarsView";
import {createSharedArrayBuffer, useEffectWithNonNull} from 'util/util';

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
    StyledStopStartPauseButtons,
    StyledTitleSection,
    titleTextTheme
} from "./style";

const sortingAlgorithms = [
    {value: "MergeSort", label: "MergeSort"},
    {value: "BubbleSort", label: "BubbleSort"},
    {value: "InsertionSort", label: "InsertionSort"},
    {value: "QuickSort", label: "QuickSort"}
];

export const SortPage = () => {

    const minSampleCount = 10;
    const maxSampleCount = 1000;

    const minSlowdownFactor = 1;
    const maxSlowdownFactor = 60;

    /**
     * Control data is also SharedArrayBuffer
     * to avoid delays in communication between worker and component
     *
     * controlData[0] = 0 - not paused, 1 - paused
     * controlData[1] = 0 - not aborted, 1 - aborted
     * controlData[2] = value - slowdown factor of notifications from worker
     */
    const [controlData] = useState(createSharedArrayBuffer(3));

    const [main, setMain] = useState({
        controlData: createSharedArrayBuffer(3),
        data: createSharedArrayBuffer(20),
        sampleCount: 20
    });

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);
    const [slowdownFactor, setSlowdownFactor] = useState(minSlowdownFactor);
    const [worker, setWorker] = useState(null);
    const [color] = useState("#606060");
    const [colorDisabled] = useState("#2f2f2f");
    const [dirty, setDirty] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const messageHandlersMap = {
        "sort": () => {
            forceUpdate();
        },
        "shuffle": () => onShuffleDataReceived(),
        "sortFinished": payload => onSortFinished(payload.sorted),
    };

    useEffect(() => {
        const onMessageReceived = e => messageHandlersMap[e.data.type](e.data.payload);
        setWorker(registerSortWorker(onMessageReceived, main.data, controlData));
        return () => unregisterWorker(worker);
    }, []);

    useEffectWithNonNull(() => {
        initializeData();
        requestShuffleData();
    }, [worker, main]);

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
        main.controlData[0] = 0;
        main.controlData[1] = 0;
        setPaused(false);
        setSorting(true);
        sendMessage(worker, "sort", {algorithm: selectedAlgorithm.value});
    }, [worker, sorting, sorted, selectedAlgorithm, paused, slowdownFactor]);

    const onStopButtonPressed = useCallback(() => {
        main.controlData[1] = 1;
        setPaused(false);
        setSorting(false);
    }, [worker]);

    const onPauseButtonPressed = useCallback(() => {
        setPaused(true);
        main.controlData[0] = 1;
    }, [worker]);

    const onResumeButtonPressed = useCallback(() => {
        setPaused(false);
        main.controlData[0] = 0;
    }, []);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker, "shuffle", {maxValue: 256});
    }, [worker]);

    const initializeData = useCallback(() => {
        sendMessage(worker, "initSharedData", {
            buffer: main.data,
            controlData: main.controlData,
        });
    }, [main, worker]);

    useEffect(() => {
        main.controlData[2] = slowdownFactor;
    }, [slowdownFactor]);

    useEffectWithNonNull(() => {
        sendMessage(worker, "setSlowdownFactor", {value: slowdownFactor});
    }, [slowdownFactor, worker]);

    const updateSampleCount = useCallback(newSampleCount => {

        if (!worker) {
            return;
        }

        if (!isSampleCountValid(newSampleCount)) {
            setMain({
                controlData: main.controlData,
                data: main.data,
                sampleCount: newSampleCount
            });
            return;
        }

        const newData = createSharedArrayBuffer(newSampleCount);

        sendMessage(worker, "initSharedData", {
            buffer: newData,
            controlData: main.controlData,
        });

        sendMessage(worker, "shuffle", {maxValue: 256});

        setMain({
            controlData: main.controlData,
            data: newData,
            sampleCount: newSampleCount
        });
    }, [main, worker]);

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

        const operationsDisabled = sorted || !(main.sampleCount >= minSampleCount && main.sampleCount <= maxSampleCount);

        return <Button
            theme={sortButtonTheme}
            onClick={onSortButtonPressed}
            title={sorted ? 'Shuffle first please' : 'Click to sort data'}
            disabled={operationsDisabled}>
            <StyledSortButtonContent>
                <Text theme={sortTextTheme(operationsDisabled)} text={"Sort!"}/>
            </StyledSortButtonContent>
        </Button>;

    }, [sorting, sorted, paused, onSortButtonPressed, onPauseButtonPressed, onStopButtonPressed, onResumeButtonPressed, main]);

    const isSampleCountValid = useCallback((v) => {
        return v >= minSampleCount && v <= maxSampleCount;
    }, [main]);

    const renderInputError = useCallback(() => {
        if (main.sampleCount >= minSampleCount && main.sampleCount <= maxSampleCount) {
            return null;
        }

        return <Text theme={inputErrorTextTheme} text={`Must be number in [${minSampleCount}, ${maxSampleCount}] range`} />
    }, [main]);

    const operationsDisabled = !(main.sampleCount >= minSampleCount && main.sampleCount <= maxSampleCount);

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
                    value={main.sampleCount.toString()}
                    placeholder={'Enter sample count'}
                    initialValue={`${main.sampleCount}`}/>
                {renderInputError()}
            </div>

            <Slider
                style={{marginBottom: 30, zIndex: 0}}
                text={"Sample count:"}
                logarithmic={true}
                value={Math.max(main.data.length, main.sampleCount)}
                min={minSampleCount}
                theme={sliderTheme}
                max={maxSampleCount}
                useMarks={false}
                innerModernSlider={true}
                disabled={sorting}
                onChange={updateSampleCount}>
            </Slider>

            <StyledShuffle>
                <Button theme={shuffleButtonTheme} text={"Shuffle"} disabled={operationsDisabled} onClick={requestShuffleData}/>
            </StyledShuffle>

            <StyledStopStartPauseButtons>
                {renderButton()}
            </StyledStopStartPauseButtons>
        </StyledControlsSection>

        <StyledChart>
            <BarsView
                samples={Math.max(main.data.length, main.sampleCount)}
                maxValue={256}
                data={Array.from(main.data)}
                color={isSampleCountValid(main.sampleCount) ? color : colorDisabled}
                algorithm={selectedAlgorithm}
                dirty={dirty}/>
        </StyledChart>
    </StyledSortPage>;
};
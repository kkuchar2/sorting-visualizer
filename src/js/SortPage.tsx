import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {Button, Slider, Text} from "kuchkr-react-component-library";

import {BarsView} from "components/BarsView/BarsView";
import {createSharedArrayBuffer, getRandomUInt8, useEffectWithNonNull} from 'util/util';

import {registerSortWorker, sendMessage, unregisterWorker} from './workers/workers';

import {
    animatedWindowProps2,
    animatedWindowProps3,
    descriptionTextTheme,
    fieldDescriptionTextTheme,
    shuffleButtonTheme,
    sliderTheme,
    sortButtonTheme,
    stopButtonTheme,
    StyledChart,
    StyledDescriptionWrapper,
    StyledSortVisualiserWindow,
    StyledSelect,
    StyledStopStartButtons,
    StyledTitleWrapper,
    StyledToolbar,
    titleTextTheme,
    StyledSortPage
} from "./style.js";

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
        data: createSharedArrayBuffer(10),
        marks: createSharedArrayBuffer(10),
        sampleCount: 10
    });

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);
    const [slowdownFactor, setSlowdownFactor] = useState(minSlowdownFactor);
    const [worker, setWorker] = useState(null);
    const [color] = useState("#0085FF");
    const [dirty, setDirty] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const windowRef = useRef(null);

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
        windowRef.current.scrollTop = -windowRef.current.scrollHeight;
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

    const onStartPauseButtonPressed = useCallback(() => {
        setDirty(false);

        if (sorted) {
            return;
        }

        if (sorting && !paused) {
            setPaused(true);
            main.controlData[0] = 1;
        } else if (!sorting && paused) {
            main.controlData[0] = 0;
            setPaused(false);
        } else if (sorting && paused && !sorted) {
            main.controlData[0] = 0;
            setPaused(false);
        } else if (!sorting && !sorted) {
            main.controlData[0] = 0;
            main.controlData[1] = 0;
            setPaused(false);
            setSorting(true);
            sendMessage(worker, "sort", {algorithm: selectedAlgorithm.value});
        }
    }, [worker, sorting, sorted, selectedAlgorithm, paused, slowdownFactor]);

    const onStopButtonPressed = useCallback(() => {
        main.controlData[1] = 1;
    }, [worker]);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker, "shuffle", {maxValue: 256});
    }, [worker]);

    const initializeData = useCallback(() => {
        sendMessage(worker, "initSharedData", {
            buffer: main.data,
            controlData: main.controlData,
            marksData: main.marks
        });
    }, [main, worker]);

    useEffect(() => {
        main.controlData[2] = slowdownFactor;
    }, [slowdownFactor]);

    useEffectWithNonNull(() => {
        sendMessage(worker, "setSlowdownFactor", {value: slowdownFactor});
    }, [slowdownFactor, worker]);

    const getPlayPauseIcon = useCallback(() => {
        return !sorting || paused ? 'images/play_icon.png' : 'images/pause_icon.png';
    }, [sorting, paused]);

    const getStartButtonText = useCallback(() => !sorting || paused ? "Sort" : "Pause", [sorting, paused]);

    const onSampleCountSliderChange = useCallback(newSampleCount => {

        const newData = createSharedArrayBuffer(newSampleCount);

        for (let i = 0; i < newData.length; i++) {
            newData[i] = getRandomUInt8(1, 256);
        }

        setMain({
            controlData: main.controlData,
            data: newData,
            marks: createSharedArrayBuffer(newSampleCount),
            sampleCount: newSampleCount
        });
    }, [main]);

    return <StyledSortPage>
        <StyledSortVisualiserWindow ref={windowRef}>
            <StyledToolbar {...animatedWindowProps3}>

                <StyledTitleWrapper {...animatedWindowProps2}>
                    <Text theme={titleTextTheme} text={"Sorting Visualiser"}/>
                </StyledTitleWrapper>

                <StyledDescriptionWrapper {...animatedWindowProps2}>
                    <Text theme={descriptionTextTheme} text={"Realtime visualizer for common sorting algorithms"}/>
                </StyledDescriptionWrapper>

                <StyledSelect
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    placeholder={'Select sorting algorithm'}
                    disabled={sorting}
                    isSearchable={false}
                    options={sortingAlgorithms}
                    value={selectedAlgorithm}
                    onChange={setSelectedAlgorithm}>
                </StyledSelect>

                <StyledStopStartButtons>
                    <Button
                        theme={stopButtonTheme}
                        onClick={onStopButtonPressed}
                        text={"Stop"}
                        disabled={!sorting || paused}>
                        <img src={'/images/stop_icon.png'} width={12} height={12} alt={""}/>
                    </Button>

                    <Button
                        theme={sortButtonTheme}
                        onClick={onStartPauseButtonPressed}
                        text={getStartButtonText()}
                        disabled={sorted}>
                        <img src={getPlayPauseIcon()} width={12} height={12} alt={""}/>
                    </Button>

                    <Button
                        style={{marginLeft: 10}}
                        theme={shuffleButtonTheme}
                        text={"Shuffle"}
                        onClick={requestShuffleData}
                        disabled={sorting}>
                        <img src={'/images/shuffle_icon.png'} width={12} height={12} alt={""}/>
                    </Button>
                </StyledStopStartButtons>

                <Text theme={fieldDescriptionTextTheme} text={`Samples: ${main.sampleCount}`}/>

                <Slider
                    style={{marginBottom: 40}}
                    text={"Sample count:"}
                    logarithmic={true}
                    markValues={[250, 500, 750]}
                    value={main.sampleCount}
                    min={minSampleCount}
                    theme={sliderTheme}
                    max={maxSampleCount}
                    innerModernSlider={true}
                    disabled={sorting}
                    onChange={onSampleCountSliderChange}>
                </Slider>

                <Text theme={fieldDescriptionTextTheme} text={`Slowdown ${slowdownFactor} [ms]:`}/>

                <Slider
                    text={"Slowdown factor [ms]:"}
                    logarithmic={true}
                    markValues={[10, 20, 30, 40, 50]}
                    value={slowdownFactor}
                    min={minSlowdownFactor}
                    theme={sliderTheme}
                    innerModernSlider={true}
                    max={maxSlowdownFactor}
                    onChange={setSlowdownFactor}>
                </Slider>
            </StyledToolbar>

            <StyledChart>
                <BarsView
                    samples={main.sampleCount}
                    maxValue={256}
                    data={Array.from(main.data)}
                    color={color}
                    marks={main.marks}
                    algorithm={selectedAlgorithm}
                    dirty={dirty}/>
            </StyledChart>
        </StyledSortVisualiserWindow>
    </StyledSortPage>;
};
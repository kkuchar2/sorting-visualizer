import {Button, Slider, Text} from "kuchkr-react-component-library";
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {BarsView} from "components/BarsView/BarsView";

import {registerSortWorker, sendMessage, unregisterWorker} from './workers/workers';
import {useEffectWithNonNull} from 'util/util';
import validator from 'validator';

import {
    descriptionTextTheme,
    fieldDescriptionTextTheme,
    shuffleButtonTheme,
    sliderTheme,
    sortButtonTheme,
    stopButtonTheme,
    StyledMainSection,
    StyledDescriptionWrapper,
    StyledOverChartSection,
    StyledSelect,
    StyledStopStartButtons,
    StyledTitleWrapper,
    titleTextTheme,
    StyledChartSection, animatedWindowProps, animatedWindowProps2, StyledToolbarSection, animatedWindowProps3
} from "./style.js";

import "styles/SortPage.scss";
import {useMediaQuery} from "@material-ui/core";

const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;

const sortingAlgorithms = [
    {value: "MergeSort", label: "MergeSort"},
    {value: "BubbleSort", label: "BubbleSort"},
    {value: "InsertionSort", label: "InsertionSort"},
    {value: "QuickSort", label: "QuickSort"}
];

export const SortPage = () => {

    const matches = useMediaQuery('(min-width:1200px)');

    console.log(matches)

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
    const [controlData] = useState(new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3)));

    const [main, setMain] = useState({
        controlData: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3)),
        data: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100)),
        marks: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100)),
        sampleCount: 100
    });

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);
    const [slowdownFactor, setSlowdownFactor] = useState(minSlowdownFactor);
    const [worker, setWorker] = useState(null);
    const [color] = useState("#0085FF");
    const [dirty, setDirty] = useState(false);

    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const messageHandlersMap = {
        "sort": payload => forceUpdate(),
        "shuffle": payload => onShuffleDataReceived(payload),
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

    const onShuffleDataReceived = useCallback(receivedData => {
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

        console.log(`Sorting: ${sorting} paused: ${paused} sorted: ${sorted}`);

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
        sendMessage(worker, "shuffle", {maxValue: maxSampleCount});
    }, [worker]);

    const initializeData = useCallback(() => {
        sendMessage(worker, "initSharedData", {
            buffer: main.data,
            controlData: main.controlData,
            marksData: main.marks
        });
    }, [main, worker]);

    const onSlowdownFactorChange = useCallback((e) => {
        const value = validator.toInt(e.target.value);

        if (value >= 1 && value <= 50) {
            setSlowdownFactor(value);
        }
    }, []);

    const validateRangeInt = (str, left, right, onValidateSuccess) => {
        const value = validator.toInt(str);

        if (value >= left && value <= right) {
            onValidateSuccess(value);
        }
    };

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

    const onSampleCountSliderChange = useCallback(v => {

        const newData = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * v));

        for (let i = 0; i < newData.length; i++) {
            newData[i] = getRandomInt(1, maxSampleCount);
        }

        setMain({
            controlData: main.controlData,
            data: newData,
            marks: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * v)),
            sampleCount: v
        });
    }, [main]);

    const renderDesktopShuffleButton = useCallback(() => {
        if (!matches) {
            return;
        }
        return <Button
            theme={shuffleButtonTheme}
            text={"Shuffle"}
            onClick={requestShuffleData}
            disabled={sorting}>
            <img src={'/images/shuffle_icon.png'} width={12} height={12} alt={""}/>
        </Button>;
    }, [matches]);

    const renderMobileShuffleButton = useCallback(() => {
        if (matches) {
            return;
        }
        return <Button
            style={{marginLeft: 10}}
            theme={shuffleButtonTheme}
            text={"Shuffle"}
            onClick={requestShuffleData}
            disabled={sorting}>
            <img src={'/images/shuffle_icon.png'} width={12} height={12} alt={""}/>
        </Button>;
    }, [matches]);

    return <div className={"sortPage"}>
        <div className={"window"}>
            <StyledMainSection>
                <StyledToolbarSection {...animatedWindowProps3}>

                    <StyledTitleWrapper {...animatedWindowProps2}>
                        <Text theme={titleTextTheme} text={"Sorting Visualiser"}/>
                    </StyledTitleWrapper>

                    <StyledDescriptionWrapper {...animatedWindowProps2}>
                        <Text theme={descriptionTextTheme} text={"Realtime visualizer for common sorting algorithms"}/>
                    </StyledDescriptionWrapper>

                    <StyledSelect
                        menuPortalTarget={document.body}
                        placeholder={'Select sorting algorithm'}
                        disabled={sorting}
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

                        {renderMobileShuffleButton()}
                    </StyledStopStartButtons>

                    <Text theme={fieldDescriptionTextTheme} text={"Number of samples:"}/>

                    <Slider
                        text={"Sample count:"}
                        logarithmic={true}
                        markValues={[250, 500, 750]}
                        value={main.sampleCount}
                        min={minSampleCount}
                        theme={sliderTheme}
                        max={maxSampleCount}
                        disabled={sorting}
                        onChange={onSampleCountSliderChange}>
                    </Slider>

                    <Text theme={fieldDescriptionTextTheme} text={"Slowdown factor [ms]:"}/>

                    <Slider
                        text={"Slowdown factor [ms]:"}
                        logarithmic={true}
                        markValues={[10, 20, 30, 40, 50]}
                        value={slowdownFactor}
                        min={minSlowdownFactor}
                        theme={sliderTheme}
                        max={maxSlowdownFactor}
                        onChange={setSlowdownFactor}>
                    </Slider>
                </StyledToolbarSection>

                <div className={"chart"}>
                    <StyledOverChartSection {...animatedWindowProps3}>
                        {renderDesktopShuffleButton()}
                    </StyledOverChartSection>

                    <StyledChartSection {...animatedWindowProps}>
                        <BarsView
                            samples={main.sampleCount}
                            maxValue={maxSampleCount}
                            data={Array.from(main.data)}
                            color={color}
                            marks={main.marks}
                            algorithm={selectedAlgorithm}
                            dirty={dirty}/>
                    </StyledChartSection>
                </div>
            </StyledMainSection>
        </div>
    </div>;
};
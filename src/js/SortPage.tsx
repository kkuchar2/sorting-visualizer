import {Button, Select, Text} from "kuchkr-react-component-library";
import React, {useCallback, useEffect, useState} from 'react';

import {BarsView} from "components/BarsView/BarsView";
import {SliderWithInput} from "components/SliderWithInput/SliderWithInput";
import {HexColorPicker} from "react-colorful";

import {registerSortWorker, sendMessage, unregisterWorker} from './workers/workers';
import {useEffectWithNonNull} from 'util/util';
import validator from 'validator';

import "styles/SortPage.scss";

const buttonTheme = {
    width: "150px",
    height: "40px",
    background: "#1d1d1d",
    disabledBackground: "rgba(47,47,47,0.43)",
    hoverBackground: "#212121",
    textColor: "#e5e5e5",
    disabledTextColor: "rgba(255,255,255,0.20)",
    textColorHover: "#ffffff",
    border: "none"
}

const selectTheme = {
    width: "250px",
    height: "50px",
    border: 'none',
    borderRadius: '5px',
    textColor: '#959595',
    disabledTextColor: '#616161',
    backgroundColor: '#232323',
    disabledBackgroundColor: 'rgba(49,49,49,0.75)',
    hoverBackgroundColor: '#212121',
    iconColor: "#959595",
    disabledIconColor: "#4c4c4c",

    listStyle: {
        background: "#313131",

        listItemStyle: {
            textColor: "#868686",
            disabledTextColor: "#525252",
            textColorHover: "#868686",
            background: "#363636",
            disabledBackground: "#2b2b2b",
            backgroundHover: "#424242",
            paddingLeft: "15px",
            paddingRight: "15px"
        }
    }
}

const sortingAlgorithms = [
    {value: "MergeSort"},
    {value: "BubbleSort"},
    {value: "InsertionSort"},
    {value: "QuickSort"}
];


export const SortPage = () => {
    const minSampleCount = 10;
    const maxSampleCount = 300;

    const minSlowdownFactor = 1;
    const maxSlowdownFactor = 60;

    const [data, setData] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);
    const [sampleCount, setSampleCount] = useState(100);
    const [slowdownFactor, setSlowdownFactor] = useState(minSlowdownFactor);
    const [worker, setWorker] = useState(null);
    const [color, setColor] = useState("#555555");
    const [dirty, setDirty] = useState(false);
    const [marks, setMarks] = useState([]);

    const messageHandlersMap = {
        "sort": payload => {
            setData(payload.data)
            setMarks(payload.marks)
        },
        "shuffle": payload => onShuffleDataReceived(payload),
        "sortFinished": payload => onSortFinished(payload.sorted),
    };

    useEffect(() => {
        const onMessageReceived = e => messageHandlersMap[e.data.type](e.data.payload);
        setWorker(registerSortWorker(onMessageReceived));
        return () => unregisterWorker(worker);
    }, []);

    useEffectWithNonNull(() => onShuffleRequest(sampleCount), [worker]);

    const onShuffleDataReceived = useCallback(receivedData => {
        setData(receivedData);
        setSorted(false);
        setDirty(true);
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

        if (sorting) {
            setSorting(false);
            setPaused(!paused);
            sendMessage(worker, "pause");
        } else {
            setPaused(false);
            setSorting(true);
            sendMessage(worker, "sort", {algorithm: selectedAlgorithm.value});
        }
    }, [worker, sorting, sorted, selectedAlgorithm]);

    const onStopButtonPressed = useCallback(() => sendMessage(worker, "stop"), [worker]);

    const onShuffleRequest = useCallback(samples => {
        setSorting(false);
        sendMessage(worker, "shuffle", {sampleCount: samples, maxValue: maxSampleCount});
    }, [worker]);

    const onSlowdownFactorChange = useCallback((e) => {
        const value = validator.toInt(e.target.value);

        if (value >= 1 && value <= 50) {
            setSlowdownFactor(value)
        }
    }, []);

    const validateRangeInt = (str, left, right, onValidateSuccess) => {
        const value = validator.toInt(str);

        if (value >= left && value <= right) {
            onValidateSuccess(value)
        }
    }

    const onSampleCountInputChange = useCallback(e => {
        validateRangeInt(e.target.value, 1, maxSampleCount, setSampleCount)
    }, []);

    useEffectWithNonNull(() => onShuffleRequest(sampleCount), [sampleCount, worker])

    useEffectWithNonNull(() => {
        sendMessage(worker, "setSlowdownFactor", {value: slowdownFactor});
    }, [slowdownFactor, worker])

    const getPlayPauseIcon = useCallback(() => {
        return !sorting || paused ? 'images/play_icon.png' : 'images/pause_icon.png';
    }, [sorting, paused]);

    const getStartButtonText = useCallback(() => !sorting || paused ? "Sort" : "Pause", [sorting, paused])

    const onSelectedAlgorithmChange = useCallback((index, item) => setSelectedAlgorithm(item), []);

    return <div className={"sortPage"}>
        <div className={"window"}>
            <div className={"toolbar"}>
                <Text theme={Text.darkTheme} className="sortTitle" text={"Sorting algorithms visualizer"}/>

                <Text theme={Text.darkTheme} className="sortDescription"
                      text={"Tool that displays visualisation of common sorting algorithms"}/>

                <Text theme={Text.darkTheme} className="sortDescription"
                      text={"Algorithms code is placed and running on worker thread, while notifying UI components in real time"}/>

                <div className={"algorithmSelectSection"}>
                    <div className={"algorithmSelectTitle"}>
                        <Text theme={Text.darkTheme} disabled={sorting} className={"title"}
                              text={"Sorting algorithm:"}/>
                    </div>

                    <Select
                        theme={selectTheme}
                        style={{marginLeft: 20}}
                        className={"sorting-algorithm-select"}
                        title={selectedAlgorithm.value}
                        disabled={sorting}
                        items={sortingAlgorithms}
                        value={selectedAlgorithm.value}
                        itemValueProvider={v => <div>{v.value}</div>}
                        dataItemRenderer={item => <p>{item.value}</p>}
                        onChange={onSelectedAlgorithmChange}>
                    </Select>
                </div>

                <SliderWithInput
                    text={"Number of samples:"}
                    description={"Number of samples that will be sorted and visualized"}
                    logarithmic={true}
                    markValues={[100, 200]}
                    value={sampleCount}
                    min={minSampleCount}
                    max={maxSampleCount}
                    disabled={sorting}
                    onSliderChange={setSampleCount}
                    onInputChange={onSampleCountInputChange}>
                </SliderWithInput>

                <SliderWithInput
                    text={"Slowdown factor [ms]:"}
                    description={"Delay of miliseconds to wait before each visual state to update (less = faster)"}
                    logarithmic={true}
                    markValues={[10, 20, 30, 40, 50]}
                    value={slowdownFactor}
                    min={minSlowdownFactor}
                    max={maxSlowdownFactor}
                    onSliderChange={setSlowdownFactor}
                    onInputChange={onSlowdownFactorChange}>
                </SliderWithInput>

                <Text theme={Text.darkTheme} className={"title"} text={"Bars color:"}/>

                <HexColorPicker color={color} onChange={setColor}/>

                <div className={"buttonsSection"}>
                    <Button
                        theme={buttonTheme}
                        className={"chartButton"}
                        text={"Shuffle"}
                        onClick={() => onShuffleRequest(sampleCount)}
                        disabled={sorting}>
                        <img src={'/images/shuffle_icon.png'} width={12} height={12} alt={""}/>
                    </Button>

                    <Button
                        theme={buttonTheme}
                        style={{marginLeft: 10}}
                        className={"chartButton playButton"}
                        onClick={onStartPauseButtonPressed}
                        text={getStartButtonText()}
                        disabled={sorted}>
                        <img src={getPlayPauseIcon()} width={12} height={12} alt={""}/>
                    </Button>

                    <Button
                        theme={buttonTheme}
                        style={{marginLeft: 10}}
                        className={"chartButton stopButton"}
                        onClick={onStopButtonPressed}
                        text={"Stop"}
                        disabled={!sorting || paused}>
                        <img src={'/images/stop_icon.png'} width={12} height={12} alt={""}/>
                    </Button>
                </div>
            </div>


            <div className={"chart"}>
                <BarsView
                    samples={sampleCount}
                    maxValue={maxSampleCount}
                    data={data}
                    color={color}
                    marks={marks}
                    algorithm={selectedAlgorithm}
                    dirty={dirty}/>
            </div>

        </div>
    </div>;
}
import React, {useCallback, useEffect, useReducer, useState} from 'react';

import {Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text} from '@chakra-ui/react';

import {
    DEFAULT_SAMPLE_COUNT,
    MAX_SAMPLE_COUNT,
    MAX_SAMPLE_VALUE,
    MIN_SAMPLE_COUNT,
    SLOWDOWN_FACTOR_MS,
    sortingAlgorithms
} from '../config';
import {createSAB, useEffectWithNonNull} from '../util/util';
import {registerSortWorker, sendMessage, unregisterWorker} from '../workers/workers';

import {BarsView} from 'components/BarsView/BarsView';
import {CustomToolTip} from 'components/CustomTooltip/CustomTooltip';
import TopBar from 'components/TopBar/TopBar';

const { Select } = require('chakra-react-select');

const Index = () => {

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
    const [color] = useState('#b2b2b2');
    const [colorDisabled] = useState('#2f2f2f');
    const [dirty, setDirty] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const messageHandlersMap = {
        'sort': () => forceUpdate(),
        'shuffle': () => onShuffleDataReceived(),
        'sortFinished': payload => onSortFinished(payload.sorted),
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
        sendMessage(worker, 'sort', { algorithm: selectedAlgorithm.value });
    }, [worker, sorting, sorted, selectedAlgorithm, paused]);

    const onStopButtonPressed = useCallback(() => {
        calculationState.controlData[1] = 1;
        setPaused(false);
        setSorting(false);
    }, [worker]);

    const onPauseButtonPressed = useCallback(() => {
        setPaused(true);
        calculationState.controlData[0] = 1;
    }, [calculationState.controlData]);

    const onResumeButtonPressed = useCallback(() => {
        setPaused(false);
        calculationState.controlData[0] = 0;
    }, []);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker, 'shuffle', { maxValue: MAX_SAMPLE_VALUE });
    }, [worker]);

    const initializeData = useCallback(() => {
        sendMessage(worker, 'initSharedData', {
            buffer: calculationState.data,
            controlData: calculationState.controlData,
        });
    }, [calculationState, worker]);

    const updateSampleCount = useCallback(newSampleCount => {
        if (!worker) {
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

        sendMessage(worker, 'initSharedData', {
            buffer: newData,
            controlData: calculationState.controlData,
        });

        sendMessage(worker, 'shuffle', { maxValue: MAX_SAMPLE_VALUE });

        setCalculationState({
            controlData: calculationState.controlData,
            data: newData,
            sampleCount: newSampleCount
        });
    }, [calculationState, worker]);

    const isSampleCountValid = useCallback((v) => {
        return v >= MIN_SAMPLE_COUNT && v <= MAX_SAMPLE_COUNT;
    }, []);

    const operationsDisabled = !isSampleCountValid(calculationState.sampleCount);

    let sliderValue;

    if (isNaN(calculationState.sampleCount)) {
        sliderValue = 0;
    }
    else {
        sliderValue = Math.max(calculationState.data.length, calculationState.sampleCount);
    }

    return <Box display={'flex'} justifyContent={'center'} padding={'20px'} height={'100%'}>
        <TopBar sorting={sorting} paused={paused} sorted={sorted} operationsDisabled={operationsDisabled}
                requestShuffleData={requestShuffleData} onSortButtonPressed={onSortButtonPressed}
                onPauseButtonPressed={onPauseButtonPressed} onResumeButtonPressed={onResumeButtonPressed}
                onStopButtonPressed={onStopButtonPressed}/>
        <Box display={'flex'} flexDirection={'column'} marginTop={'100px'} gap={'40px'}
             width={{ base: '100%', md: 'auto' }}>

            <Text fontSize={'22px'} fontWeight={'semibold'} alignSelf={'center'}>{`Samples: ${sliderValue}`}</Text>

            <Box width={{ base: '100%', sm: '300px' }} alignSelf={'center'}>
                <Slider isDisabled={sorting} aria-label={'slider-ex-1'} defaultValue={100} min={MIN_SAMPLE_COUNT}
                        max={MAX_SAMPLE_COUNT} step={10}
                        onChange={updateSampleCount}>
                    <SliderTrack bg={'green.100'}>
                        <Box position={'relative'} right={10}/>
                        <SliderFilledTrack bg={'green'}/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>
            </Box>

            <Box width={{ base: '100%', sm: '300px' }}>
                <Select value={selectedAlgorithm}
                        bg={'#3e3e3e'}
                        onChange={setSelectedAlgorithm}
                        alignSelf={'flex-start'}
                        options={sortingAlgorithms}
                        isDisabled={sorting}>
                </Select>
            </Box>

            <CustomToolTip/>

            <Box
                height={{ base: '200px', md: '600px' }}
                boxSizing={'border-box'}
                border={`2px solid ${'#383838'}`}
                width={{ base: '100%', md: '800px', lg: '1000px', xl: '1000px' }}>
                <BarsView
                    samples={Math.max(calculationState.data.length, calculationState.sampleCount)}
                    maxValue={MAX_SAMPLE_VALUE}
                    data={Array.from(calculationState.data)}
                    color={isSampleCountValid(calculationState.sampleCount) ? color : colorDisabled}
                    algorithm={selectedAlgorithm}
                    dirty={dirty}/>
            </Box>
        </Box>
    </Box>;
};

export default Index;
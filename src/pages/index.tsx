import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';

import {Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text} from '@chakra-ui/react';

import {
    DEFAULT_SAMPLE_COUNT,
    MAX_SAMPLE_COUNT,
    MAX_SAMPLE_VALUE,
    MIN_SAMPLE_COUNT,
    SLOWDOWN_FACTOR_MS,
    sortingAlgorithms
} from '../config';
import {registerSortWorker, sendMessage, unregisterWorker} from '../workers/workers';

import {BarsView} from 'components/BarsView/BarsView';
import {CustomToolTip} from 'components/CustomTooltip/CustomTooltip';
import TopBar from 'components/TopBar/TopBar';
import {createSAB} from 'util/util';

const { Select } = require('chakra-react-select');

interface CalculationState {
    controlData: Uint8Array,
    data: Uint8Array,
    sampleCount: number,
    dirty: boolean,
    locked: boolean
}

const Index = () => {

    /**
     * Control data is also SharedArrayBuffer
     * to avoid delays in communication between worker and component
     *
     * controlData[0] = 0 - not paused, 1 - paused
     * controlData[1] = 0 - not aborted, 1 - aborted
     * controlData[2] = value - slowdown factor of notifications from worker
     */
    const calculationState = useRef<CalculationState>(null);

    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0]);

    const worker = useRef(null);
    const [color] = useState('#b2b2b2');

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const messageHandlersMap = {
        'init': () => {
            calculationState.current.locked = false;
            forceUpdate();
        },
        'sort': () => {
            forceUpdate();
        },
        'shuffle': () => {
            onShuffleDataReceived();
        },
        'sortFinished': payload => {
            onSortFinished(payload.sorted);
        },
    };

    useEffect(() => {
        calculationState.current = {
            controlData: createSAB(3),
            data: createSAB(DEFAULT_SAMPLE_COUNT),
            sampleCount: DEFAULT_SAMPLE_COUNT,
            dirty: true,
            locked: false
        };

        worker.current = registerSortWorker(e => messageHandlersMap[e.data.type](e.data.payload));

        sendMessage(worker.current, 'initSharedData', {
            buffer: calculationState.current.data,
            controlData: calculationState.current.controlData,
            maxValue: MAX_SAMPLE_VALUE
        });

        return () => {
            if (worker.current) {
                unregisterWorker(worker.current);
            }
        };
    }, []);

    const onShuffleDataReceived = useCallback(() => {
        setSorted(false);
        calculationState.current.dirty = true;
        forceUpdate();
    }, []);

    const onSortFinished = useCallback(isSorted => {
        setSorting(false);
        setSorted(isSorted);
    }, []);

    const onSortButtonPressed = useCallback(() => {
        calculationState.current.dirty = false;
        calculationState.current.controlData[0] = 0;
        calculationState.current.controlData[1] = 0;
        calculationState.current.controlData[2] = SLOWDOWN_FACTOR_MS;
        setPaused(false);
        setSorting(true);
        sendMessage(worker.current, 'sort', { algorithm: selectedAlgorithm.value });
    }, [sorting, sorted, selectedAlgorithm, paused]);

    const onStopButtonPressed = useCallback(() => {
        calculationState.current.controlData[1] = 1;
        setPaused(false);
        setSorting(false);
    }, [calculationState]);

    const onPauseButtonPressed = useCallback(() => {
        setPaused(true);
        calculationState.current.controlData[0] = 1;
    }, [calculationState]);

    const onResumeButtonPressed = useCallback(() => {
        setPaused(false);
        calculationState.current.controlData[0] = 0;
    }, [calculationState]);

    const requestShuffleData = useCallback(() => {
        setSorting(false);
        sendMessage(worker.current, 'shuffle', { maxValue: MAX_SAMPLE_VALUE });
    }, [worker]);

    const updateSampleCount = useCallback(newSampleCount => {
        if (calculationState.current.locked) {
            return;
        }

        const newData = createSAB(newSampleCount);

        calculationState.current = {
            controlData: calculationState.current.controlData,
            data: newData,
            sampleCount: newSampleCount,
            dirty: true,
            locked: true
        };

        sendMessage(worker.current, 'initSharedData', {
            buffer: newData,
            controlData: calculationState.current.controlData,
            maxValue: MAX_SAMPLE_VALUE
        });

    }, [worker, calculationState]);

    if (!calculationState.current)
    {
        return <></>;
    }

    return <Box display={'flex'} justifyContent={'center'} padding={'20px'} height={'100%'}>
        <TopBar sorting={sorting} paused={paused} sorted={sorted} operationsDisabled={false}
                requestShuffleData={requestShuffleData} onSortButtonPressed={onSortButtonPressed}
                onPauseButtonPressed={onPauseButtonPressed} onResumeButtonPressed={onResumeButtonPressed}
                onStopButtonPressed={onStopButtonPressed}/>
        <Box display={'flex'} flexDirection={'column'} marginTop={'100px'} gap={'40px'}
             width={{ base: '100%', md: 'auto' }}>

            <Text fontSize={'22px'} fontWeight={'semibold'} alignSelf={'center'}>{`Samples: ${calculationState.current.sampleCount}`}</Text>

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
                    samples={calculationState.current.sampleCount}
                    maxValue={MAX_SAMPLE_VALUE}
                    data={Array.from(calculationState.current.data)}
                    color={color}
                    algorithm={selectedAlgorithm}
                    dirty={calculationState.current.dirty}/>
            </Box>
        </Box>
    </Box>;
};

export default Index;
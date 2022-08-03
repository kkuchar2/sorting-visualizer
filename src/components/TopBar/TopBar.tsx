import React, {useMemo} from 'react';

import {Box, Button, Text} from '@chakra-ui/react';
import {PauseIcon, PlayIcon, StopIcon} from '@heroicons/react/solid';

interface TopBarProps {
    sorting: boolean;
    paused: boolean;
    sorted: boolean;
    operationsDisabled: boolean;
    requestShuffleData: () => void;
    onSortButtonPressed: () => void;
    onPauseButtonPressed: () => void;
    onStopButtonPressed: () => void;
    onResumeButtonPressed: () => void;
}

const TopBar = (props: TopBarProps) => {

    const {
        sorting,
        paused,
        sorted,
        operationsDisabled,
        requestShuffleData,
        onSortButtonPressed,
        onPauseButtonPressed,
        onStopButtonPressed,
        onResumeButtonPressed
    } = props;

    const pauseStopResumeButtons = useMemo(() => {
        if (sorting && !paused) {
            return <Box display={'flex'} gap={'10px'}>
                <Button onClick={onPauseButtonPressed} height={'32px'}
                        fontSize={'14px'}
                        borderRadius={'20px'}>
                    <Text>{'Pause'}</Text>
                    <PauseIcon width={20} style={{ marginLeft: 10 }} color={'#ffff00'}/>
                </Button>
                <Button onClick={onStopButtonPressed} height={'32px'}
                        fontSize={'14px'}
                        borderRadius={'20px'}>
                    <Text>{'Stop'}</Text>
                    <StopIcon width={20} style={{ marginLeft: 10 }} color={'red'}/>
                </Button>
            </Box>;
        }
        else if (paused) {
            return <Box display={'flex'} gap={'10px'}>
                <Button onClick={onResumeButtonPressed} height={'32px'}
                        fontSize={'14px'}
                        borderRadius={'20px'}>
                    <Text>{'Resume'}</Text>
                    <PlayIcon width={20} style={{ marginLeft: 10 }} color={'lightgreen'}/>
                </Button>
                <Button onClick={onStopButtonPressed} height={'32px'}
                        fontSize={'14px'}
                        borderRadius={'20px'}>
                    <Text>{'Stop'}</Text>
                    <StopIcon width={20} style={{ marginLeft: 10 }} color={'red'}/>
                </Button>
            </Box>;
        }

        return <Button
            onClick={onSortButtonPressed}
            height={'32px'}
            fontSize={'14px'}
            borderRadius={'20px'}
            title={sorted ? 'Shuffle first please' : 'Click to sort data'}
            disabled={sorted}>
            <Text>{'Sort!'}</Text>
            <PlayIcon width={20} style={{ marginLeft: 10 }} color={'lightgreen'}/>
        </Button>;

    }, [sorting, sorted, paused, onSortButtonPressed, onPauseButtonPressed, onStopButtonPressed, onResumeButtonPressed]);

    return <Box width={'100%'}
                display={'flex'}
                paddingTop={'10px'}
                paddingBottom={'10px'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                position={'fixed'}
                gap={'20px'}
                bg={'#1e1e1e'}
                zIndex={20000}
                top={0}
                left={0}>
        <Box
            bg={'rainbow'}
            bgClip={'text'}
            fontWeight={'black'}
            fontSize={'16px'}>
            {'Sorting Visualizer'}
        </Box>
        <Box width={'800px'}
             display={'flex'}
             alignItems={'center'}
             justifyContent={'center'}
             paddingLeft={{ base: '10px', sm: '0' }}
             gap={'10px'}>
            <Button disabled={operationsDisabled || sorting} onClick={requestShuffleData}
                    height={'32px'}
                    fontSize={'14px'}
                    borderRadius={'20px'}>{'Shuffle'}</Button>
            {pauseStopResumeButtons}
        </Box>
    </Box>;
};

export default TopBar;
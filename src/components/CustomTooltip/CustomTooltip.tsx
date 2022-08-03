import React, {forwardRef, LegacyRef, ReactNode} from 'react';

import {Box, Tag, Text, Tooltip} from '@chakra-ui/react';
import {QuestionMarkCircleIcon} from '@heroicons/react/solid';

const CustomCard = forwardRef(({ children, ...rest } : {children: ReactNode}, ref: LegacyRef<HTMLSpanElement>) => {
    return <Box>
        <Tag bg={'none'} padding={0} borderRadius={'0'} ref={ref} {...rest}>
            {children}
            <QuestionMarkCircleIcon width={20} style={{ marginLeft: 10 }} color={'#cccccc'}/>
        </Tag>
    </Box>;
});

CustomCard.displayName = 'CustomCard';

export const CustomToolTip = () => (
    <Tooltip label={'Total width is changing to have constant best spacing between bars to fit chart scene'}>
        <CustomCard>
            <Text fontSize={'14px'} color={'#cccccc'}>{'Why the width of chart is changing?'}</Text>
        </CustomCard>
    </Tooltip>
);

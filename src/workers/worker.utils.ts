import { MAX_SAMPLE_VALUE } from '@/config';
import { getRandomUInt16 } from '@/util/util';
import bubbleSort from '@/workers/sorts/bubble.sort';
import insertionSort from '@/workers/sorts/insertion.sort';
import mergeSortRecursive from '@/workers/sorts/merge.recursive.sort';
import quickSort from '@/workers/sorts/quick.sort';

let SLOWDOWN_FACTOR_MS = 1;
export const MIN_FREQ = 80;
export const MAX_FREQ = 700;

export const getSound = (value: number) => ((MAX_FREQ - MIN_FREQ) / MAX_SAMPLE_VALUE) * value + MIN_FREQ;

export const setSound = (index: number) => {
    sortState.soundData[0] = getSound(sortState.data[index]);
    sortState.soundData[1] = index;
};

export const sortState = {
    data: [],
    marks: [],
    soundData: [440],
    controlData: [0, 0, 1]
};

export const sortAlgorithmMap = {
    'QuickSort': quickSort,
    'BubbleSort': bubbleSort,
    'InsertionSort': insertionSort,
    'MergeSort': mergeSortRecursive
};

let previousTime = new Date().getTime();
let firstTime = true;

export const notify = (type, payload, skipMessagesByTime = false, slowDownFactorUsed = true, skipTimeInMs = 33) => {
    let currentTime = new Date().getTime();

    if (skipMessagesByTime) {
        if (currentTime - previousTime > skipTimeInMs || firstTime) {
            firstTime = false;
            postMessage({ type: type, payload: payload });
            previousTime = currentTime;
        }
    }
    else {
        postMessage({ type: type, payload: payload });
    }

    SLOWDOWN_FACTOR_MS = slowDownFactorUsed ? sortState.controlData[2] : 1;

    while (new Date().getTime() - currentTime < SLOWDOWN_FACTOR_MS) {
    }
};

export const notifySortDataShuffled = () => notify('shuffle', [], false, false);

export const notifySortDataInitComplete = () => notify('init', [], false, false);

export const notifySortUpdate = (forceSend = false) => {
    notify('sort', { marks: sortState.marks }, !forceSend, true, 16);
};

export const mark = (idx, color = 0) => {
    sortState.marks[idx] = color;
};

export const markExclusive = (idx, color = 0) => {
    for (let i = 0; i < sortState.marks.length; i++) {
        sortState.marks[i] = 0;
    }
    sortState.marks[idx] = color;
};

export const unmark = (idx) => {
    sortState.marks[idx] = 0;
};

export const setSlowdownFactor = (m) => SLOWDOWN_FACTOR_MS = m.value;

export const onSortMethodExit = () => postMessage({ type: 'sortFinished', payload: { 'sorted': !IsAborted() } });

export const getSortMethod = (algorithm) => sortAlgorithmMap[algorithm];

export const initSharedData = async (buffer, controlBuffer, soundBuffer, maxValue) => {
    sortState.data = buffer;
    for (let i = 0; i < sortState.data.length; i++) {
        sortState.data[i] = getRandomUInt16(1, maxValue);
    }
    sortState.controlData = controlBuffer;
    sortState.soundData = soundBuffer;
    sortState.marks = [];
};

export const shuffle = async (maxValue) => {
    for (let i = 0; i < sortState.data.length; i++) {
        sortState.data[i] = getRandomUInt16(1, maxValue);
    }
};

export const PromiseTimeout = delay => {
    return new Promise((resolve,) => setTimeout(resolve, delay));
};

export const CheckSortPause = async (delay = 0) => {
    while (sortState.controlData[0] === 1) {
        await PromiseTimeout(delay);
    }
};

export const IsAborted = () => sortState.controlData[1] === 1;
import {bubbleSort, insertionSort, mergeSortRecursive, quickSort} from "workers/sorts";

let SLOWDOWN_FACTOR_MS = 1;

export const sortState = {
    pause: false,
    abort: false,
    data: [],
    marks: []
};

export const resetState = () => {
    sortState.pause = false;
    sortState.abort = false;
};

export const sortAlgorithmMap = {
    "QuickSort": quickSort,
    "BubbleSort": bubbleSort,
    "InsertionSort": insertionSort,
    "MergeSort": mergeSortRecursive
};

let previousTime = new Date().getTime();
let firstTime = true;

export const notify = (type, payload, skipMessagesByTime = false, skipTimeInMs = 33) => {
    let currentTime = new Date().getTime();

    if (skipMessagesByTime) {
        if (currentTime - previousTime > skipTimeInMs || firstTime) {
            firstTime = false;
            postMessage({type: type, payload: payload});
            previousTime = currentTime;
        }
    }
    else {
        postMessage({type: type, payload: payload});
    }

    while (new Date().getTime() - currentTime < SLOWDOWN_FACTOR_MS) {
    }
};

export const notifySortDataShuffled = () => notify("shuffle", sortState.data, true);

export const notifySortUpdate = (forceSend = false) => {
    notify("sort", {
        data: sortState.data,
        marks: sortState.marks
    }, !forceSend, 16);
}

export const clearMarks = () => sortState.marks = [];

export const mark = (idx, color = 0) => {
    sortState.marks.push({ idx: idx, color: color})
}

export const markExclusive = (idx, color = 0) => {
    sortState.marks = [{ idx: idx, color: color}]
}

export const unmark = (idx) => {
    sortState.marks = sortState.marks.filter(item => item.idx === idx);
}

export const setSlowdownFactor = (m) => SLOWDOWN_FACTOR_MS = m.value;

export const onSortMethodExit = () => {
    clearMarks();

    for (let i = 0; i < sortState.data.length; i++) {
        mark(i, 3);
        notifySortUpdate();
    }
    notifySortUpdate(true);
    clearMarks();
    postMessage({type: "sortFinished", payload: {"sorted": !sortState.abort}});
}

export const getSortMethod = (algorithm) => sortAlgorithmMap[algorithm];

export const shuffle = async (size, maxValue) => {
    sortState.data = new Array(size);

    for (let i = 0; i < size; i++) {
        sortState.data[i] = getRandomInt(1, maxValue)
    }
};

export const PromiseTimeout = delay => {
    return new Promise((resolve, reject) => setTimeout(resolve, delay));
};

export const CheckSortPause = async (delay = 0) => {
    await PromiseTimeout(delay);
    while (sortState.pause) {
        await PromiseTimeout(delay);
    }
};

export const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;
import {
    getSortMethod, initSharedData,
    notifySortDataShuffled,
    onSortMethodExit,
    setSlowdownFactor,
    shuffle
} from "./worker.utils";

/* -------------- Main message handler ------------------ */

self.onmessage = message => requestMap[message.data.type](message.data.payload);

/* ------------------------------------------------------ */

const requestMap = {
    "initSharedData" : e => onSharedDataInitRequest(e),
    "sort": e => onSortRequest(e),
    "shuffle": e => onShuffleRequest(e),
    "setSlowdownFactor" : e => setSlowdownFactor(e)
};

const onSharedDataInitRequest = msg => {
    initSharedData(msg.buffer, msg.controlData, msg).then(() => {});
};

const onSortRequest = msg => {
    getSortMethod(msg.algorithm)().then(onSortMethodExit);
};

const onShuffleRequest = msg => {
    shuffle(msg.maxValue).then(notifySortDataShuffled);
};
import {
    getSortMethod, initSharedData,
    notifySortDataShuffled,
    onSortMethodExit,
    setSlowdownFactor,
    shuffle
} from "workers/worker.utils.js";

/* -------------- Main message handler ------------------ */

self.onmessage = message => requestMap[message.data.type](message.data.payload);

/* ------------------------------------------------------ */

const requestMap = {
    "initSharedData" : e => onSharedDataInitRequest(e),
    "sort": e => onSortRequest(e),
    "shuffle": e => onShuffleRequest(e),
    "setSlowdownFactor" : e => setSlowdownFactor(e)
};

const onSharedDataInitRequest = message_data => {
    initSharedData(message_data.buffer, message_data.controlData, message_data).then(() => {});
};

const onSortRequest = message_data => {
    getSortMethod(message_data.algorithm)().then(onSortMethodExit);
};

const onShuffleRequest = message_data => {
    shuffle(message_data.maxValue).then(notifySortDataShuffled);
};
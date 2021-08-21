export const workers = [];

const registerWorker = (worker, handler) => {
    worker.onmessage = handler;
    workers.push(worker);
    return worker;
};

export const unregisterWorker = (worker) => {
    const registeredWorker = workers.find(w => w === worker);
    if (registeredWorker !== undefined) {
        registeredWorker.terminate();
        const index = workers.indexOf(worker);
        if (index > -1) {
            workers.splice(index, 1);
        }
    }
};

export const sendMessage = (worker, messageType, payload = []) => {
    worker.postMessage({ type: messageType, payload: payload });
};

export const registerSortWorker = (handler, sharedBuffer, controlSharedBuffer, marksSharedBuffer) => {
    const worker = registerWorker(new Worker(new URL('sort.worker.js', import.meta.url)), handler);
    sendMessage(worker, "initSharedData", {
        buffer: sharedBuffer,
        controlData: controlSharedBuffer,
        marksData: marksSharedBuffer
    });
    return worker;
};

import {useEffect} from 'react';

export const getParentHeight = thisMount => thisMount.current.offsetHeight;

export const getParentWidth = thisMount => thisMount.current.offsetWidth;

export const retry = (func, retriesLeft = 5, interval = 1000) =>
    new Promise((resolve, reject) => func()
        .then(resolve)
        .catch((error) => {
            setTimeout(() => {
                if (retriesLeft === 1) {
                    reject(error);
                    return;
                }
                retry(func, retriesLeft - 1, interval).then(resolve, reject);
            }, interval);
        }));

// Trigger hook on deps change only if all deps are not null and not undefined
export const useEffectWithNonNull = (func, deps) =>
    useEffect(() => {
        for (let i = 0; i < deps.length; i++) {
            let dep = deps[i];
            if (dep === null || dep === undefined || dep == 0 || dep == null || dep === 0) {
                return;
            }
        }
        func();
    }, deps);

// Trigger hook on deps change only if boolVar is true
export const useEffectOnTrue = (boolVar, func, deps) =>
    useEffect(() => {
        if (boolVar === true) {
            func();
        }
    }, deps);

export const withStatus = (status, statusName, func) => {
    if (status === statusName) {
        return func();
    }
};

export const withNotStatus = (status, statusName, func) => {
    if (status !== statusName) {
        return func();
    }
};
export const logarithmicSliderValue = (position, min, max) => {
    const minPosition = 0;
    const maxPosition = 100;
    const minValue = Math.log(min);
    const maxValue = Math.log(max);
    const scale = (maxValue - minValue) / (maxPosition - minPosition);
    return Math.exp(minValue + scale * (position - minPosition));
};

export const getRandomUInt8 = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createSAB = (count) => {
    return new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * count));
};
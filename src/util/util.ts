import {useEffect} from 'react';

export const getParentHeight = thisMount => thisMount.current.offsetHeight;

export const getParentWidth = thisMount => thisMount.current.offsetWidth;

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

export const getRandomUInt8 = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createSAB = (count) => {
    return new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * count));
};
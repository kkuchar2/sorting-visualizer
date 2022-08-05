export const getParentHeight = (thisMount) => {
    return thisMount.current.offsetHeight;
};

export const getParentWidth = (thisMount) => {
    return thisMount.current.offsetWidth;
};

export const getRandomUInt8 = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createSAB = (elementsCount: number) => {
    return new Uint8Array(
        new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * elementsCount)
    );
};
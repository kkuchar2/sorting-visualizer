export const getRandomUInt8 = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomUInt16 = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const createSAB8 = (elementsCount: number) => {
    return new Uint8Array(
        new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * elementsCount)
    );
};

export const createSAB16 = (elementsCount: number) => {
    return new Uint16Array(
        new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * elementsCount)
    );
};

export const createSAB32 = (elementsCount: number) => {
    return new Uint32Array(
        new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * elementsCount)
    );
};
const sortingAlgorithms = [
    { value: 'MergeSort', label: 'MergeSort' },
    { value: 'BubbleSort', label: 'BubbleSort' },
    { value: 'InsertionSort', label: 'InsertionSort' },
    { value: 'QuickSort', label: 'QuickSort' }
];

const MIN_SAMPLE_COUNT = 10;
const MAX_SAMPLE_COUNT = 1000;
const DEFAULT_SAMPLE_COUNT = 100;
const MAX_SAMPLE_VALUE = 256;
const SLOWDOWN_FACTOR_MS = 1;

export {
    sortingAlgorithms,
    MIN_SAMPLE_COUNT,
    MAX_SAMPLE_COUNT,
    DEFAULT_SAMPLE_COUNT,
    MAX_SAMPLE_VALUE,
    SLOWDOWN_FACTOR_MS
};
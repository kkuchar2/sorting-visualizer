export interface SortAlgorithm {
    value: string;
    label: string;
}

const DEFAULT_SAMPLE_COUNT = 100;
const MAX_SAMPLE_VALUE = 65536;
const SLOWDOWN_FACTOR_MS = 1;

const sortingAlgorithms = [
    { value: 'MergeSort', label: 'MergeSort' },
    { value: 'BubbleSort', label: 'BubbleSort' },
    { value: 'InsertionSort', label: 'InsertionSort' },
    { value: 'QuickSort', label: 'QuickSort' },
    { value: 'CocktailShakerSort', label: 'CocktailShakerSort' }
] as SortAlgorithm[];

export {
    sortingAlgorithms,
    DEFAULT_SAMPLE_COUNT,
    MAX_SAMPLE_VALUE,
    SLOWDOWN_FACTOR_MS
};
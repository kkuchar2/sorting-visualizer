export const sortAlgorithmNames = [
  'MergeSort',
  'BubbleSort',
  'InsertionSort',
  'QuickSort',
  'CocktailShakerSort',
] as const

export type SortAlgorithmName = (typeof sortAlgorithmNames)[number]

export interface SortAlgorithm {
  value: SortAlgorithmName
  label: string
}

const DEFAULT_SAMPLE_COUNT = 100
const MAX_SAMPLE_VALUE = 65536
const SLOWDOWN_FACTOR_MS = 1

const sortingAlgorithms: SortAlgorithm[] = [
  { value: 'MergeSort', label: 'MergeSort' },
  { value: 'BubbleSort', label: 'BubbleSort' },
  { value: 'InsertionSort', label: 'InsertionSort' },
  { value: 'QuickSort', label: 'QuickSort' },
  { value: 'CocktailShakerSort', label: 'CocktailShakerSort' },
]

export { sortingAlgorithms, DEFAULT_SAMPLE_COUNT, MAX_SAMPLE_VALUE, SLOWDOWN_FACTOR_MS }

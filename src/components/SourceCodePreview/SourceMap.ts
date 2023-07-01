// @ts-nocheck

import bubbleSortSrc from '!!raw-loader!./../../workers/sorts/bubble.sort.ts';
import cocktailShakerSortSrc from '!!raw-loader!./../../workers/sorts/cocktailShakerSort.sort.ts';
import insertionSortSrc from '!!raw-loader!./../../workers/sorts/insertion.sort.ts';
import mergeSortSrc from '!!raw-loader!./../../workers/sorts/merge.recursive.sort.ts';
import quickSortSrc from '!!raw-loader!./../../workers/sorts/quick.sort.ts';

export const sourceMap = {
    'BubbleSort': bubbleSortSrc,
    'InsertionSort': insertionSortSrc,
    'MergeSort': mergeSortSrc,
    'QuickSort': quickSortSrc,
    'CocktailShakerSort': cocktailShakerSortSrc
};
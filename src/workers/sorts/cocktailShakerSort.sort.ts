import { CheckSortPause, IsAborted, notifySortUpdate, setSound, sortState } from '../worker.utils';

async function cocktailShakerSortSort() {
    let len = sortState.data.length;
    let left = 0;
    let right = len - 1;
    let swapped;

    do {
        swapped = false;

        // Perform a bubble sort from left to right
        for (let i = left; i < right; i++) {
            if (sortState.data[i] > sortState.data[i + 1]) {
                setSound(i);
                // Swap elements
                [sortState.data[i], sortState.data[i + 1]] = [sortState.data[i + 1], sortState.data[i]];
                swapped = true;
                notifySortUpdate();
            }

            await CheckSortPause();

            if (IsAborted()) {
                return;
            }
        }

        if (!swapped) {
            // If no swaps were made, the array is already sorted
            break;
        }

        swapped = false;

        // Decrement the right pointer and perform a bubble sort from right to left
        right--;

        for (let i = right; i >= left; i--) {
            if (sortState.data[i] > sortState.data[i + 1]) {
                setSound(i);
                // Swap elements
                [sortState.data[i], sortState.data[i + 1]] = [sortState.data[i + 1], sortState.data[i]];
                swapped = true;
                notifySortUpdate();
            }

            await CheckSortPause();

            if (IsAborted()) {
                return;
            }
        }

        // Increment the left pointer
        left++;
        notifySortUpdate();
    } while (swapped);
}

export default cocktailShakerSortSort;
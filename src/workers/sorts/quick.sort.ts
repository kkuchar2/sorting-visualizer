import { CheckSortPause, IsAborted, notifySortUpdate, setSound, sortState } from '../worker.utils';

async function quickSort() {
    await quickSortImpl(0, sortState.data.length - 1);
}

function swap(leftIndex, rightIndex) {
    setSound(leftIndex);
    const temp = sortState.data[leftIndex];
    sortState.data[leftIndex] = sortState.data[rightIndex];
    sortState.data[rightIndex] = temp;
}

function partition(left, right) {
    const pivot = sortState.data[Math.floor((right + left) / 2)];
    let // Middle element
        i = left, // Left pointer/**/
        j = right; // Right pointer
    while (i <= j) {
        while (sortState.data[i] < pivot) {
            i++;
        }
        while (sortState.data[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(i, j); // Swap two elements
            i++;
            j--;
        }
        notifySortUpdate();
    }
    return i;
}

async function quickSortImpl(left, right) {
    await CheckSortPause();

    if (IsAborted()) {
        return;
    }

    let index;
    if (sortState.data.length > 1) {
        index = partition(left, right); // Index returned from partition

        if (left < index - 1) { // More elements on the left side of the pivot
            await quickSortImpl(left, index - 1);
        }
        if (index < right) { // More elements on the right side of the pivot
            await quickSortImpl(index, right);
        }
    }
}

export default quickSort;

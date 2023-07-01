import { CheckSortPause, IsAborted, notifySortUpdate, setSound, sortState } from '../worker.utils';

async function merge(start, mid, end) {
    if (IsAborted()) {
        return;
    }
    notifySortUpdate();

    let merged = [];
    let leftIdx = start;
    let rightIdx = mid + 1;

    while (leftIdx <= mid && rightIdx <= end) {
        if (sortState.data[leftIdx] < sortState.data[rightIdx]) {
            merged.push(sortState.data[leftIdx]);
            leftIdx += 1;
        }
        else {
            merged.push(sortState.data[rightIdx]);
            rightIdx += 1;
        }
    }

    while (leftIdx <= mid) {
        merged.push(sortState.data[leftIdx]);
        leftIdx += 1;
    }

    while (rightIdx <= end) {
        merged.push(sortState.data[rightIdx]);
        rightIdx += 1;
    }

    notifySortUpdate();

    for (let i = 0; i < merged.length; i++) {
        setSound(start + i);
        sortState.data[start + i] = merged[i];
        notifySortUpdate();
    }

    notifySortUpdate();

    await CheckSortPause();
}

async function mergeSort(start, end) {
    if (IsAborted()) {
        return;
    }

    if (end <= start) {
        return;
    }

    const middle = Math.floor(start + ((end - start + 1) / 2)) - 1;

    await mergeSort(start, middle);
    await mergeSort(middle + 1, end);
    await merge(start, middle, end);

    notifySortUpdate();
}

async function mergeSortRecursive() {
    await mergeSort(0, sortState.data.length - 1);
}

export default mergeSortRecursive;
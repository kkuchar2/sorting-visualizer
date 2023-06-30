import { CheckSortPause, IsAborted, mark, notifySortUpdate, setSound, sortState, unmark } from '../worker.utils';

async function insertionSort() {

    let length = sortState.data.length;
    for (let i = 1; i < length; i++) {

        await CheckSortPause();

        if (IsAborted()) {
            return;
        }

        mark(i, 2);

        let key = sortState.data[i];
        let j = i - 1;

        while (j >= 0 && sortState.data[j] > key) {
            setSound(j);
            sortState.data[j + 1] = sortState.data[j];
            mark(j, 0);
            notifySortUpdate();
            j = j - 1;
        }
        sortState.data[j + 1] = key;

        unmark(i);
    }
}

export default insertionSort;
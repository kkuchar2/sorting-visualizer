import { CheckSortPause, IsAborted, notifySortUpdate, setSound, sortState } from '../worker.utils'

async function bubbleSort() {
  const len = sortState.data.length

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      await CheckSortPause()

      if (IsAborted()) {
        return
      }

      if (sortState.data[j] > sortState.data[j + 1]) {
        const tmp = sortState.data[j]
        setSound(j)
        sortState.data[j] = sortState.data[j + 1]
        sortState.data[j + 1] = tmp
        notifySortUpdate()
      }
    }
  }
}

export default bubbleSort

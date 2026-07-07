import { IMAGE_SORT_STEP_DELAY_MS, IMAGE_SORT_WRITE_BATCH } from '@/config/imageMode'

import {
  CheckSortPause,
  IsAborted,
  notifySortUpdate,
  PromiseTimeout,
  setSound,
  sortState,
} from '../worker.utils'

async function notifyStep(index: number) {
  await CheckSortPause()

  if (IsAborted()) {
    return false
  }

  setSound(index)
  notifySortUpdate(true)
  await PromiseTimeout(IMAGE_SORT_STEP_DELAY_MS)

  return true
}

async function countingSort() {
  const data = sortState.data
  const n = data.length

  if (n <= 1) {
    return
  }

  const counts = new Uint32Array(n)
  for (let i = 0; i < n; i++) {
    counts[data[i]]++
  }

  let pos = 0
  for (let value = 0; value < n; value++) {
    const end = pos + counts[value]

    while (pos < end) {
      data[pos] = value
      pos++

      if (pos % IMAGE_SORT_WRITE_BATCH === 0) {
        const shouldContinue = await notifyStep(pos - 1)
        if (!shouldContinue) {
          return
        }
      }
    }
  }

  if (n % IMAGE_SORT_WRITE_BATCH !== 0) {
    const shouldContinue = await notifyStep(n - 1)
    if (!shouldContinue) {
      return
    }
  }

  notifySortUpdate(true)
}

export default countingSort

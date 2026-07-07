import { MAX_SAMPLE_VALUE } from '@/config'
import {
  getSortMethod,
  initSharedData,
  notifySortDataInitComplete,
  notifySortDataShuffled,
  onSortMethodExit,
  scramble,
  setSlowdownFactor,
  shuffle,
} from './worker.utils'
import type {
  InitSharedDataPayload,
  SetSlowdownFactorPayload,
  ShufflePayload,
  SortPayload,
  SortWorkerInboundType,
} from './worker.types'

/* -------------- Main message handler ------------------ */

self.onmessage = (message: MessageEvent<{ type: SortWorkerInboundType; payload: unknown }>) => {
  const { type, payload } = message.data

  switch (type) {
    case 'initSharedData':
      onSharedDataInitRequest(payload as InitSharedDataPayload)
      break
    case 'sort':
      void onSortRequest(payload as SortPayload)
      break
    case 'shuffle':
      onShuffleRequest(payload as ShufflePayload)
      break
    case 'setSlowdownFactor':
      setSlowdownFactor(payload as SetSlowdownFactorPayload)
      break
  }
}

/* ------------------------------------------------------ */

const onSharedDataInitRequest = (msg: InitSharedDataPayload) => {
  initSharedData(msg.buffer, msg.controlData, msg.soundData, msg.maxValue, msg.identityInit).then(notifySortDataInitComplete)
}

const onSortRequest = async (msg: SortPayload) => {
  await getSortMethod(msg.algorithm)()
  onSortMethodExit()
}

const onShuffleRequest = (msg: ShufflePayload) => {
  if (msg.scramblePercent !== undefined) {
    scramble(msg.scramblePercent).then(notifySortDataShuffled)
    return
  }

  shuffle(msg.maxValue ?? MAX_SAMPLE_VALUE).then(notifySortDataShuffled)
}

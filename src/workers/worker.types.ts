import type { SortAlgorithmName } from '@/config'

import type { SortDataBuffer } from '@/components/common.types'

export type SortWorkerInboundType = 'initSharedData' | 'sort' | 'shuffle' | 'setSlowdownFactor'

export interface InitSharedDataPayload {
  buffer: SortDataBuffer
  controlData: Uint8Array
  soundData: Uint32Array
  maxValue: number
  identityInit?: boolean
}

export interface SortPayload {
  algorithm: SortAlgorithmName
}

export interface ShufflePayload {
  maxValue?: number
  scramblePercent?: number
}

export interface SetSlowdownFactorPayload {
  value: number
}

export interface SortWorkerInboundPayloadMap {
  initSharedData: InitSharedDataPayload
  sort: SortPayload
  shuffle: ShufflePayload
  setSlowdownFactor: SetSlowdownFactorPayload
}

export type SortWorkerOutboundType = 'init' | 'sort' | 'shuffle' | 'sortFinished'

export interface SortFinishedPayload {
  sorted: boolean
}

export type SortWorkerOutboundMessage =
  | { type: 'init'; payload: [] }
  | { type: 'sort'; payload: Record<string, never> }
  | { type: 'shuffle'; payload: [] }
  | { type: 'sortFinished'; payload: SortFinishedPayload }

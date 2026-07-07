import type { SortAlgorithmName } from '@/config'

export type SortWorkerInboundType = 'initSharedData' | 'sort' | 'shuffle' | 'setSlowdownFactor'

export interface InitSharedDataPayload {
  buffer: Uint16Array
  controlData: Uint8Array
  soundData: Uint32Array
  maxValue: number
}

export interface SortPayload {
  algorithm: SortAlgorithmName
}

export interface ShufflePayload {
  maxValue: number
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

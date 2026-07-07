import type { SortWorkerInboundPayloadMap, SortWorkerInboundType, SortWorkerOutboundMessage } from './worker.types'

const workers: Worker[] = []

const registerWorker = (worker: Worker, handler: (event: MessageEvent<SortWorkerOutboundMessage>) => void) => {
  worker.onmessage = handler as (event: MessageEvent) => void
  workers.push(worker)
  return worker
}

export const unregisterWorker = (worker: Worker) => {
  const registeredWorker = workers.find((w) => w === worker)
  if (registeredWorker !== undefined) {
    registeredWorker.terminate()
    const index = workers.indexOf(worker)
    if (index > -1) {
      workers.splice(index, 1)
    }
  }
}

export const sendMessage = <T extends SortWorkerInboundType>(
  worker: Worker | null,
  messageType: T,
  payload: SortWorkerInboundPayloadMap[T],
) => {
  if (!worker) {
    return
  }

  worker.postMessage({ type: messageType, payload })
}

export const registerSortWorker = (handler: (event: MessageEvent<SortWorkerOutboundMessage>) => void) =>
  registerWorker(new Worker(new URL('sort.worker.ts', import.meta.url)), handler)

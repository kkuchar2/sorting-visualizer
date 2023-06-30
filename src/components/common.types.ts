export interface CalculationState {
    /**
     * Control data is also SharedArrayBuffer
     * to avoid delays in communication between worker and component
     *
     * controlData[0] = 0 - not paused, 1 - paused
     * controlData[1] = 0 - not aborted, 1 - aborted
     * controlData[2] = value - slowdown factor of notifications from worker
     *
     * soundData[0] = what frequency to play
     */
    controlData: Uint8Array,
    soundData: Uint32Array,
    data: Uint16Array,
    sampleCount: number,
    dirty: boolean,
    locked: boolean
}
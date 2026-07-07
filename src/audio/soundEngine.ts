export type SoundMode = 'triangle' | 'sine' | 'square' | 'sawtooth' | 'pluck' | 'noise' | 'off'

export interface SoundModeOption {
  value: SoundMode
  label: string
}

export const soundModes: SoundModeOption[] = [
  { value: 'triangle', label: 'Tone' },
  { value: 'sine', label: 'Sine' },
  { value: 'square', label: 'Chip' },
  { value: 'sawtooth', label: 'Buzz' },
  { value: 'pluck', label: 'Pluck' },
  { value: 'noise', label: 'Noise' },
  { value: 'off', label: 'Off' },
]

type ContinuousSoundMode = Extract<SoundMode, OscillatorType>

const CONTINUOUS_MODES: ContinuousSoundMode[] = ['triangle', 'sine', 'square', 'sawtooth']

const isContinuousMode = (mode: SoundMode): mode is ContinuousSoundMode => CONTINUOUS_MODES.includes(mode as ContinuousSoundMode)

const createNoiseBuffer = (context: AudioContext) => {
  const buffer = context.createBuffer(1, context.sampleRate * 0.08, context.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  return buffer
}

export class SoundEngine {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillator: OscillatorNode | null = null
  private oscillatorGain: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private mode: SoundMode = 'sine'

  init() {
    const context = new AudioContext()
    const masterGain = context.createGain()
    masterGain.gain.value = 0.05
    masterGain.connect(context.destination)

    this.context = context
    this.masterGain = masterGain
    this.noiseBuffer = createNoiseBuffer(context)
    this.setMode('sine')
    void context.suspend()
  }

  setMode(mode: SoundMode) {
    this.mode = mode

    if (isContinuousMode(mode)) {
      this.startContinuousOscillator(mode)
      return
    }

    this.stopContinuousOscillator()
  }

  play(frequency: number) {
    if (!this.context || !this.masterGain || this.mode === 'off') {
      return
    }

    if (isContinuousMode(this.mode)) {
      if (this.oscillator) {
        this.oscillator.frequency.value = frequency
      }
      return
    }

    if (this.mode === 'pluck') {
      this.playPluck(frequency)
      return
    }

    if (this.mode === 'noise') {
      this.playNoise(frequency)
    }
  }

  resume() {
    void this.context?.resume()
  }

  suspend() {
    void this.context?.suspend()
  }

  dispose() {
    this.stopContinuousOscillator()
    void this.context?.close()
    this.context = null
    this.masterGain = null
    this.noiseBuffer = null
  }

  private startContinuousOscillator(mode: ContinuousSoundMode) {
    if (!this.context || !this.masterGain) {
      return
    }

    this.stopContinuousOscillator()

    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    gain.gain.value = 1

    oscillator.type = mode
    oscillator.frequency.value = 440
    oscillator.connect(gain)
    gain.connect(this.masterGain)
    oscillator.start()

    this.oscillator = oscillator
    this.oscillatorGain = gain
  }

  private stopContinuousOscillator() {
    if (this.oscillator) {
      this.oscillator.stop()
      this.oscillator.disconnect()
      this.oscillator = null
    }

    if (this.oscillatorGain) {
      this.oscillatorGain.disconnect()
      this.oscillatorGain = null
    }
  }

  private playPluck(frequency: number) {
    if (!this.context || !this.masterGain) {
      return
    }

    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

    oscillator.connect(gain)
    gain.connect(this.masterGain)
    oscillator.start(now)
    oscillator.stop(now + 0.13)
  }

  private playNoise(frequency: number) {
    if (!this.context || !this.masterGain || !this.noiseBuffer) {
      return
    }

    const now = this.context.currentTime
    const source = this.context.createBufferSource()
    const filter = this.context.createBiquadFilter()
    const gain = this.context.createGain()

    source.buffer = this.noiseBuffer
    filter.type = 'bandpass'
    filter.frequency.value = frequency
    filter.Q.value = 8

    gain.gain.setValueAtTime(0.7, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    source.start(now)
    source.stop(now + 0.07)
  }
}

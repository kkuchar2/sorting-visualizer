import styles from './SoundModeSelector.module.scss'

import { ToggleButton } from '@/components/ToggleButton/ToggleButton'
import { SoundMode, soundModes } from '@/config/soundModes'

interface SoundModeSelectorProps {
  disabled?: boolean
  currentMode: SoundMode
  onModeSelected: (mode: SoundMode) => void
}

export const SoundModeSelector = (props: SoundModeSelectorProps) => {
  const { currentMode, onModeSelected, disabled } = props

  return (
    <div className={styles.soundModeSelector}>
      {soundModes.map((mode) => (
        <ToggleButton
          key={mode.value}
          disabled={disabled}
          active={mode.value === currentMode}
          onClick={() => onModeSelected(mode.value)}
        >
          {mode.label}
        </ToggleButton>
      ))}
    </div>
  )
}

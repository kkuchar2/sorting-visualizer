import styles from './VisualModeSelector.module.scss'

import { ToggleButton } from '@/components/ToggleButton/ToggleButton'
import { VisualMode, visualModes } from '@/config/visualModes'

interface VisualModeSelectorProps {
  disabled?: boolean
  currentMode: VisualMode
  onModeSelected: (mode: VisualMode) => void
}

export const VisualModeSelector = (props: VisualModeSelectorProps) => {
  const { currentMode, onModeSelected, disabled } = props

  return (
    <div className={styles.visualModeSelector}>
      {visualModes.map((mode) => (
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

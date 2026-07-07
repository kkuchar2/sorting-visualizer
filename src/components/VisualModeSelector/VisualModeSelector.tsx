import { SelectField } from '@/components/SelectField/SelectField'
import { VisualMode, visualModes } from '@/config/visualModes'

interface VisualModeSelectorProps {
  disabled?: boolean
  currentMode: VisualMode
  onModeSelected: (mode: VisualMode) => void
}

export const VisualModeSelector = (props: VisualModeSelectorProps) => {
  const { currentMode, onModeSelected, disabled } = props

  return (
    <SelectField
      id={'visual-mode-select'}
      label={'View'}
      value={currentMode}
      disabled={disabled}
      options={visualModes}
      onChange={onModeSelected}
    />
  )
}

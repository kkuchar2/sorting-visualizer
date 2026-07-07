import { SelectField } from '@/components/SelectField/SelectField'
import { SoundMode, soundModes } from '@/config/soundModes'

interface SoundModeSelectorProps {
  disabled?: boolean
  currentMode: SoundMode
  onModeSelected: (mode: SoundMode) => void
}

export const SoundModeSelector = (props: SoundModeSelectorProps) => {
  const { currentMode, onModeSelected, disabled } = props

  return (
    <SelectField
      id={'sound-mode-select'}
      label={'Sound'}
      value={currentMode}
      disabled={disabled}
      options={soundModes}
      onChange={onModeSelected}
    />
  )
}

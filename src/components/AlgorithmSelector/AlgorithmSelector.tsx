import { SelectField } from '@/components/SelectField/SelectField'
import { SortAlgorithm } from '@/config'

interface AlgorithmSelectorProps {
  disabled?: boolean
  currentAlgorithm: SortAlgorithm
  algorithms: SortAlgorithm[]
  onSelectedAlgorithmSelected: (algorithm: SortAlgorithm) => void
}

export const AlgorithmSelector = (props: AlgorithmSelectorProps) => {
  const { currentAlgorithm, algorithms, onSelectedAlgorithmSelected, disabled } = props

  return (
    <SelectField
      id={'algorithm-select'}
      label={'Algorithm'}
      value={currentAlgorithm.value}
      disabled={disabled}
      options={algorithms.map((algorithm) => ({
        value: algorithm.value,
        label: algorithm.label,
      }))}
      onChange={(value) => {
        const algorithm = algorithms.find((item) => item.value === value)
        if (algorithm) {
          onSelectedAlgorithmSelected(algorithm)
        }
      }}
    />
  )
}

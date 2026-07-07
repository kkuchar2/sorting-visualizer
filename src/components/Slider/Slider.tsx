import { useCallback, useMemo, type ChangeEvent, type KeyboardEvent, type PointerEvent } from 'react'

import styles from './Slider.module.scss'

interface SliderProps {
  id: string
  value: number
  disabled?: boolean
  onChange: (value: number) => void
  onCommit?: (value: number) => void
  min?: number
  max?: number
}

export const Slider = (props: SliderProps) => {
  const { id, value, disabled, onChange, onCommit, min = 0, max = 100 } = props

  const fillPercent = useMemo(() => {
    if (max <= min) {
      return 0
    }
    return ((value - min) / (max - min)) * 100
  }, [value, min, max])

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value, 10))
    },
    [onChange],
  )

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      onCommit?.(parseInt(e.currentTarget.value, 10))
    },
    [disabled, onCommit],
  )

  const onKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      onCommit?.(parseInt(e.currentTarget.value, 10))
    },
    [disabled, onCommit],
  )

  return (
    <div className={[styles.sliderRoot, disabled ? styles.disabled : ''].join(' ')}>
      <div className={styles.track} aria-hidden={'true'}>
        <div className={styles.fill} style={{ width: `${fillPercent}%` }} />
      </div>
      <input
        id={id}
        className={styles.input}
        type={'range'}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={onInput}
        onPointerUp={onPointerUp}
        onKeyUp={onKeyUp}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  )
}

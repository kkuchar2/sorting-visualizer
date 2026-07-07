import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import styles from './SelectField.module.scss'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectFieldProps<T extends string> {
  id: string
  label: string
  value: T
  options: SelectOption<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}

export const SelectField = <T extends string>(props: SelectFieldProps<T>) => {
  const { id, label, value, options, disabled, onChange } = props

  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  const close = useCallback(() => {
    setOpen(false)
    setHighlightIndex(-1)
  }, [])

  const selectOption = useCallback(
    (optionValue: T) => {
      onChange(optionValue)
      close()
    },
    [close, onChange],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    menuRef.current?.focus()

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [close, open])

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault()
        setOpen(true)
        setHighlightIndex(options.findIndex((option) => option.value === value))
        break
      default:
        break
    }
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setHighlightIndex((index) => (index + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setHighlightIndex((index) => (index <= 0 ? options.length - 1 : index - 1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (highlightIndex >= 0) {
          selectOption(options[highlightIndex].value)
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        close()
        break
      default:
        break
    }
  }

  return (
    <div className={styles.field} ref={rootRef}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>

      <button
        id={id}
        type={'button'}
        className={[styles.trigger, open ? styles.triggerOpen : '', disabled ? styles.disabled : ''].join(' ')}
        disabled={disabled}
        aria-haspopup={'listbox'}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={`${id}-label`}
        onClick={() => {
          if (disabled) {
            return
          }
          setOpen((current) => !current)
          setHighlightIndex(options.findIndex((option) => option.value === value))
        }}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={styles.triggerLabel}>{selectedOption?.label}</span>
        <svg className={styles.chevron} viewBox={'0 0 12 12'} aria-hidden={'true'}>
          <path
            d={'M2.5 4.5L6 8l3.5-3.5'}
            fill={'none'}
            stroke={'currentColor'}
            strokeWidth={'1.5'}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={menuRef}
          id={listboxId}
          className={styles.menu}
          role={'listbox'}
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const selected = option.value === value
            const highlighted = index === highlightIndex

            return (
              <li key={option.value} role={'presentation'}>
                <button
                  type={'button'}
                  role={'option'}
                  aria-selected={selected}
                  className={[
                    styles.option,
                    selected ? styles.optionSelected : '',
                    highlighted ? styles.optionHighlighted : '',
                  ].join(' ')}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

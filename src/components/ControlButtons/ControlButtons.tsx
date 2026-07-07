import styles from './ControlButtons.module.scss'

interface ControlButtonsProps {
  sorting: boolean
  shuffleDisabled?: boolean
  paused: boolean
  sorted: boolean
  requestShuffleData: () => void
  onPauseButtonPressed: () => void
  onResumeButtonPressed: () => void
  onStopButtonPressed: () => void
  onSortButtonPressed: () => void
}

export const ControlButtons = (props: ControlButtonsProps) => {
  const {
    sorting,
    shuffleDisabled = false,
    paused,
    sorted,
    requestShuffleData,
    onPauseButtonPressed,
    onResumeButtonPressed,
    onStopButtonPressed,
    onSortButtonPressed,
  } = props

  if (sorting) {
    return (
      <div className={styles.controlButtons}>
        {paused ? (
          <button className={styles.primary} onClick={onResumeButtonPressed}>
            {'Resume'}
          </button>
        ) : (
          <button onClick={onPauseButtonPressed}>
            {'Pause'}
          </button>
        )}
        <button className={styles.danger} onClick={onStopButtonPressed}>
          {'Stop'}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.controlButtons}>
      <button disabled={shuffleDisabled} onClick={requestShuffleData}>
        {'Shuffle'}
      </button>
      <button className={styles.primary} disabled={sorted} onClick={onSortButtonPressed}>
        {'Sort'}
      </button>
    </div>
  )
}

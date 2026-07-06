import styles from './ControlButtons.module.scss'

interface ControlButtonsProps {
  sorting: boolean
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
    paused,
    sorted,
    requestShuffleData,
    onPauseButtonPressed,
    onResumeButtonPressed,
    onStopButtonPressed,
    onSortButtonPressed,
  } = props

  return (
    <div className={styles.controlButtons}>
      <button disabled={sorting} onClick={requestShuffleData}>
        {'Shuffle'}
      </button>
      <button disabled={paused || !sorting} onClick={onPauseButtonPressed}>
        {'Pause'}
      </button>
      <button disabled={!paused} onClick={onResumeButtonPressed}>
        {'Resume'}
      </button>
      <button className={styles.danger} disabled={!sorting} onClick={onStopButtonPressed}>
        {'Stop'}
      </button>
      <button
        className={styles.primary}
        disabled={sorting || paused || sorted}
        onClick={onSortButtonPressed}
      >
        {'Sort'}
      </button>
    </div>
  )
}

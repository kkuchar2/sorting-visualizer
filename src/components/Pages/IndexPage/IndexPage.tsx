'use client'

import { useEffect, useState } from 'react'

import styles from './IndexPage.module.scss'

import { AlgorithmSelector } from '@/components/AlgorithmSelector/AlgorithmSelector'
import Modal from '@/components/ModalSystem/Modal'
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview'
import { sourceMap } from '@/components/SourceCodePreview/SourceMap'
import { Visualiser } from '@/components/Visualiser/Visualiser'
import { GITHUB_REPO_URL, SortAlgorithm, imageSortingAlgorithm, sortingAlgorithms } from '@/config'
import { VisualMode } from '@/config/visualModes'

export default function IndexPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>(sortingAlgorithms[1])
  const [sourceModalOpen, setSourceModalOpen] = useState(false)
  const [visualMode, setVisualMode] = useState<VisualMode>('bars')
  const [sorting, setSorting] = useState(false)

  const headerAlgorithms = visualMode === 'image' ? [imageSortingAlgorithm] : sortingAlgorithms

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.indexPage}>
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{'Sorting visualizer'}</h1>
            <a
              href={GITHUB_REPO_URL}
              className={styles.githubLink}
              target={'_blank'}
              rel={'noopener noreferrer'}
              aria-label={'View source on GitHub'}
            >
              <svg className={styles.githubIcon} viewBox={'0 0 24 24'} aria-hidden={'true'}>
                <path
                  fill={'currentColor'}
                  d={
                    'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.37-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.31 0-1.17.42-2.13 1.11-2.88-.11-.28-.48-1.43.11-2.98 0 0 .9-.29 2.96 1.13.86-.24 1.78-.36 2.7-.37.92.01 1.84.13 2.7.37 2.06-1.42 2.96-1.13 2.96-1.13.59 1.55.22 2.7.11 2.98.69.75 1.11 1.71 1.11 2.88 0 4-2.8 5-5.48 5.21.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z'
                  }
                />
              </svg>
            </a>
          </div>
          <div className={styles.headerRow}>
            <div className={styles.algorithmField}>
              <AlgorithmSelector
                disabled={sorting || visualMode === 'image'}
                algorithms={headerAlgorithms}
                currentAlgorithm={selectedAlgorithm}
                onSelectedAlgorithmSelected={setSelectedAlgorithm}
              />
            </div>
            <button type={'button'} className={styles.sourceButton} onClick={() => setSourceModalOpen(true)}>
              {'View source'}
            </button>
          </div>
        </header>

        <Visualiser
          algorithm={selectedAlgorithm}
          onSelectedAlgorithmChanged={setSelectedAlgorithm}
          onVisualModeChanged={setVisualMode}
          onSortingChanged={setSorting}
        />
      </div>

      {sourceModalOpen && (
        <Modal
          size={'wide'}
          title={selectedAlgorithm.label}
          onClose={() => setSourceModalOpen(false)}
        >
          <div className={styles.modalCode}>
            <SourceCodePreview sourceCode={sourceMap[selectedAlgorithm.value]} />
          </div>
        </Modal>
      )}
    </div>
  )
}

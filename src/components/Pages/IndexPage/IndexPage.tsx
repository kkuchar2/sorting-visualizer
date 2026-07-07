'use client'

import { useEffect, useState } from 'react'

import styles from './IndexPage.module.scss'

import { AlgorithmSelector } from '@/components/AlgorithmSelector/AlgorithmSelector'
import Modal from '@/components/ModalSystem/Modal'
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview'
import { sourceMap } from '@/components/SourceCodePreview/SourceMap'
import { Visualiser } from '@/components/Visualiser/Visualiser'
import { SortAlgorithm, imageSortingAlgorithm, sortingAlgorithms } from '@/config'
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
          <h1 className={styles.title}>{'Sorting visualizer'}</h1>
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

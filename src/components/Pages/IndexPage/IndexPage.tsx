'use client'

import { useEffect, useState } from 'react'

import styles from './IndexPage.module.scss'

import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview'
import { sourceMap } from '@/components/SourceCodePreview/SourceMap'
import { Visualiser } from '@/components/Visualiser/Visualiser'
import { SortAlgorithm, sortingAlgorithms } from '@/config'

export default function IndexPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>(sortingAlgorithms[1])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.indexPage}>
      <aside className={styles.codePanel}>
        <h2 className={styles.panelTitle}>{selectedAlgorithm.label}</h2>
        <div className={styles.codeFrame}>
          <SourceCodePreview sourceCode={sourceMap[selectedAlgorithm.value]} />
        </div>
      </aside>

      <section className={styles.visualPanel}>
        <h1 className={styles.title}>{'Sorting visualizer'}</h1>

        <Visualiser onSelectedAlgorithmChanged={setSelectedAlgorithm} algorithm={selectedAlgorithm} />
      </section>
    </div>
  )
}

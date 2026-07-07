'use client'

import '@wooorm/starry-night/style/dark'

import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

import { cleanSource } from '@/components/SourceCodePreview/formatter'
import { javascriptScope, loadStarryNight } from '@/components/SourceCodePreview/starryNightClient'
import { useFitCode } from '@/components/SourceCodePreview/useFitCode'
import styles from '@/components/SourceCodePreview/SourceCodePreview.module.scss'

interface SourceCodePreviewProps {
  sourceCode: string
}

export const SourceCodePreview = (props: SourceCodePreviewProps) => {
  const formattedSource = useMemo(() => cleanSource(props.sourceCode), [props.sourceCode])
  const { containerRef, contentRef } = useFitCode(formattedSource)
  const [highlightedCode, setHighlightedCode] = useState<ReactNode>(formattedSource)

  useEffect(() => {
    let cancelled = false

    loadStarryNight()
      .then((starryNight) => {
        if (cancelled) {
          return
        }

        const tree = starryNight.highlight(formattedSource, javascriptScope)
        const nodes = toJsxRuntime(tree, { Fragment, jsx, jsxs })
        setHighlightedCode(nodes)
      })
      .catch(() => {
        if (!cancelled) {
          setHighlightedCode(formattedSource)
        }
      })

    return () => {
      cancelled = true
    }
  }, [formattedSource])

  return (
    <div className={styles.preview}>
      <div ref={containerRef} className={styles.viewport}>
        <pre ref={contentRef} className={styles.pre}>
          <code className={styles.code}>{highlightedCode}</code>
        </pre>
      </div>
    </div>
  )
}

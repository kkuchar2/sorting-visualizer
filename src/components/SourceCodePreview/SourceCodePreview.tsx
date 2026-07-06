'use client'

import { useMemo } from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow as style } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { cleanSource } from '@/components/SourceCodePreview/formatter'

interface SourceCodePreviewProps {
  sourceCode: string
}

export const SourceCodePreview = (props: SourceCodePreviewProps) => {
  const formattedSource = useMemo(() => cleanSource(props.sourceCode), [props.sourceCode])

  return (
    <SyntaxHighlighter
      customStyle={{
        height: '100%',
        maxHeight: '100%',
        margin: 0,
        padding: '1.25rem',
        borderRadius: 0,
        background: 'transparent',
        fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
        fontSize: '0.82rem',
        lineHeight: 1.65,
        boxSizing: 'border-box',
      }}
      language={'javascript'}
      style={style}
    >
      {formattedSource}
    </SyntaxHighlighter>
  )
}

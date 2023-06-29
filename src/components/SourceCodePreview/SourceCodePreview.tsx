import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { processSource } from '@/components/SourceCodePreview/formatter';

interface SourceCodePreviewProps {
    sourceCode: string;
}

export const SourceCodePreview = (props: SourceCodePreviewProps) => {
    return <SyntaxHighlighter
        customStyle={{
            maxHeight: '100%',
            margin: 0,
            fontSize: '15px',
            background: '#232323',
            borderRadius: '20px',
            padding: '20px',
            boxSizing: 'border-box',
        }}
        language={'javascript'} style={style}>
        {processSource(props.sourceCode)}
    </SyntaxHighlighter>;
};
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import '../styles/globals.css'
import '../styles/modal.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sorting Visualizer',
  description: 'Visualisation of common sorting algorithms with ThreeJS and web workers',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={'en'}>
      <body className={`${inter.variable} font-sans`}>
        <main>{children}</main>
        <div id={'modal-root'} className={'modal-root'} />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import '../styles/globals.css'
import '../styles/modal.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Sorting Visualizer',
  description: 'Visualisation of common sorting algorithms with ThreeJS and web workers',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
  manifest: '/favicons/site.webmanifest',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={'en'}>
      <body className={jetbrains.variable}>
        <main>{children}</main>
        <div id={'modal-root'} className={'modal-root'} />
      </body>
    </html>
  )
}

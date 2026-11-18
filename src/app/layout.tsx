import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import SiteExtras from '@/components/SiteExtras'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quran Reading System - Best Institute to Read and Learn Quran',
  description: 'Quran Reading System is the best institute that helps people read and learn Quran with expert teachers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <SiteExtras />
        </Providers>
      </body>
    </html>
  )
}

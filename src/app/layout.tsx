import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

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
          {/* Floating WhatsApp Button */}
          <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
            <a
              href="https://wa.me/923215507499"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp: +92 321 5507499"
              className="inline-flex items-center justify-center hover:opacity-90"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                width="56"
                height="56"
                className="block"
              />
            </a>
          </div>
        </Providers>
      </body>
    </html>
  )
}

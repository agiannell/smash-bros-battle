import type { Metadata } from 'next'
import { Bangers, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
})

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: 'Super Smash Bros. Battle',
  icons: {
    icon: '/favicons/smash-icon-red.svg',
    apple: '/favicons/smash-icon-red.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bangers.variable} ${notoSansKr.variable}`}>
        {children}
      </body>
    </html>
  )
}

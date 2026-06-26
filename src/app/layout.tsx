// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/ui/Providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Alex Mercer — Full-Stack Engineer',
    template: '%s | Alex Mercer',
  },
  description: 'Full-stack engineer building scalable systems and intuitive interfaces. Available for freelance and full-time roles.',
  keywords: ['software engineer', 'full-stack', 'React', 'Next.js', 'TypeScript', 'MongoDB'],
  authors: [{ name: 'Alex Mercer' }],
  creator: 'Alex Mercer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Alex Mercer Portfolio',
    title: 'Alex Mercer — Full-Stack Engineer',
    description: 'Full-stack engineer building scalable systems and intuitive interfaces.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Mercer — Full-Stack Engineer',
    description: 'Full-stack engineer building scalable systems and intuitive interfaces.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

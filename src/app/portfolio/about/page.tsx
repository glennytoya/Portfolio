// src/app/portfolio/about/page.tsx
import type { Metadata } from 'next'
import { AboutSection } from '@/components/portfolio/AboutSection'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Alex Mercer — full-stack engineer, background, and values.',
}

export default function AboutPage() {
  return <AboutSection />
}

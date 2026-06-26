// src/app/portfolio/experience/page.tsx
import type { Metadata } from 'next'
import { ExperienceSection } from '@/components/portfolio/ExperienceSection'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience — roles, companies, and key achievements.',
}

export const revalidate = 120

export default function ExperiencePage() {
  return <ExperienceSection />
}

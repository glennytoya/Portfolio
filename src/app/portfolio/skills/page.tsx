// src/app/portfolio/skills/page.tsx
import type { Metadata } from 'next'
import { SkillsSection } from '@/components/portfolio/SkillsSection'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills across frontend, backend, database, and DevOps.',
}

export const revalidate = 120

export default function SkillsPage() {
  return <SkillsSection />
}

// src/app/portfolio/projects/page.tsx
import type { Metadata } from 'next'
import { ProjectsSection } from '@/components/portfolio/ProjectsSection'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work — full-stack projects, open-source tools, and client work.',
}

export const revalidate = 60

export default function ProjectsPage() {
  return <ProjectsSection />
}

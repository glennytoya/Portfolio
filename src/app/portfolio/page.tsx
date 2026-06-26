// src/app/portfolio/page.tsx
import type { Metadata } from 'next'
import { HeroSection }    from '@/components/portfolio/HeroSection'
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects'
import { SkillsPreview }  from '@/components/portfolio/SkillsPreview'
import { CtaSection }     from '@/components/portfolio/CtaSection'

export const metadata: Metadata = {
  title: 'Alex Mercer — Full-Stack Engineer',
  description: 'Building scalable systems and intuitive interfaces.',
}

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <SkillsPreview />
      <CtaSection />
    </>
  )
}

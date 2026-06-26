// src/app/portfolio/contact/page.tsx
import type { Metadata } from 'next'
import { ContactSection } from '@/components/portfolio/ContactSection'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch — available for freelance projects and full-time roles.',
}

export default function ContactPage() {
  return <ContactSection />
}

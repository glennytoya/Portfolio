// src/components/portfolio/CtaSection.tsx
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-dots-dark opacity-30" />
          <div className="relative z-10">
            <p className="text-violet-200 text-sm font-mono font-medium tracking-widest uppercase mb-4">
              Open to opportunities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let&apos;s build something great together
            </h2>
            <p className="text-violet-200 text-base mb-8 max-w-md mx-auto">
              Available for freelance projects and select full-time roles. If you have an interesting problem, I&apos;d love to hear about it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/portfolio/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors shadow-lg">
                <Mail size={16} />
                Get in touch
              </Link>
              <Link href="/portfolio/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                View projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

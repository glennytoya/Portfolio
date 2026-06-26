// src/components/portfolio/HeroSection.tsx
import Link from 'next/link'
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-violet-950/20" />
      <div className="absolute inset-0 bg-dots-light dark:bg-dots-dark" />
      {/* Glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 py-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300 font-mono">Available for work</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-up">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Alex Mercer
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 animate-fade-up animate-delay-100 font-light leading-relaxed">
            Full-stack engineer building{' '}
            <span className="text-gray-900 dark:text-gray-200 font-medium">scalable systems</span>{' '}
            and{' '}
            <span className="text-gray-900 dark:text-gray-200 font-medium">intuitive interfaces</span>.
          </p>

          <p className="text-base text-gray-500 dark:text-gray-500 mb-10 max-w-xl animate-fade-up animate-delay-200">
            5+ years shipping production software across fintech, SaaS, and developer tooling.
            I care about clean APIs, great DX, and code that&apos;s easy to delete.
          </p>

          <div className="flex flex-wrap items-center gap-3 animate-fade-up animate-delay-300">
            <Link href="/portfolio/projects" className="btn-primary">
              View my work
              <ArrowRight size={16} />
            </Link>
            <Link href="/portfolio/contact" className="btn-secondary">
              Get in touch
            </Link>
            <a
              href="/resume.pdf"
              download
              className="btn-ghost"
            >
              <Download size={16} />
              Resume
            </a>
          </div>

          <div className="flex items-center gap-4 mt-10 animate-fade-up animate-delay-400">
            <span className="text-xs text-gray-400 font-mono">Find me on</span>
            {[
              { Icon: Github,   href: 'https://github.com/alexmercer',      label: 'GitHub' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/alexmercer', label: 'LinkedIn' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

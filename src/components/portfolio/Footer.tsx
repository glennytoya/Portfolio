import Link from 'next/link'
import { Github, Linkedin, Twitter, Code2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/portfolio" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
              glenn.dev
            </span>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} G1ne. Built with Next.js &amp; MongoDB.
          </p>

          <div className="flex items-center gap-3">
            {[
              {
                Icon: Github,
                href: 'https://github.com/glennytoya',
                label: 'GitHub',
              },
              {
                Icon: Linkedin,
                href: 'https://linkedin.com/in/glenny',
                label: 'LinkedIn',
              },
              {
                Icon: Twitter,
                href: 'https://twitter.com/mg1ne',
                label: 'Twitter',
              },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

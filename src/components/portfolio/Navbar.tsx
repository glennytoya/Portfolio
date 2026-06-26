'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Code2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/portfolio',            label: 'Home' },
  { href: '/portfolio/about',      label: 'About' },
  { href: '/portfolio/skills',     label: 'Skills' },
  { href: '/portfolio/projects',   label: 'Projects' },
  { href: '/portfolio/experience', label: 'Experience' },
  { href: '/portfolio/contact',    label: 'Contact' },
]

export function Navbar() {
  const pathname   = usePathname()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm'
        : 'bg-transparent'
    )}>
      <nav className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/portfolio" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="text-sm font-mono">glenn.dev</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/portfolio' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200',
                    active
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/portfolio' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}

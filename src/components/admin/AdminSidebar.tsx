// src/components/admin/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Cpu, Briefcase, MessageSquare, ExternalLink, LogOut, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import toast from 'react-hot-toast'
import { JwtPayload } from '@/lib/auth'

const NAV = [
  { href: '/admin/dashboard',   Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects',    Icon: FolderKanban,    label: 'Projects' },
  { href: '/admin/skills',      Icon: Cpu,             label: 'Skills' },
  { href: '/admin/experience',  Icon: Briefcase,       label: 'Experience' },
  { href: '/admin/messages',    Icon: MessageSquare,   label: 'Messages' },
]

export function AdminSidebar({ user }: { user: JwtPayload }) {
  const pathname = usePathname()
  const router   = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <Code2 size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              )}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-1">
          <a href="/portfolio" target="_blank"
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ExternalLink size={13} /> View site
          </a>
          <ThemeToggle className="w-8 h-8" />
          <button onClick={logout}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}

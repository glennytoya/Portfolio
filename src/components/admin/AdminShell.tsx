// src/components/admin/AdminShell.tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FolderKanban, Wrench, Briefcase,
  MessageSquare, LogOut, Code2, Menu, X, ExternalLink,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV = [
  { href: '/admin/dashboard',   label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/admin/projects',    label: 'Projects',   Icon: FolderKanban },
  { href: '/admin/skills',      label: 'Skills',     Icon: Wrench },
  { href: '/admin/experience',  label: 'Experience', Icon: Briefcase },
  { href: '/admin/messages',    label: 'Messages',   Icon: MessageSquare },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user, setUser]     = useState<{ name: string; email: string } | null>(null)
  const [sideOpen, setSideOpen] = useState(false)
  const [checking, setChecking] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.replace('/admin/login'); return }
      const data = await res.json()
      setUser(data.data)
    } catch {
      router.replace('/admin/login')
    } finally {
      setChecking(false)
    }
  }, [router])

  useEffect(() => {
    if (pathname === '/admin/login') { setChecking(false); return }
    checkAuth()
  }, [pathname, checkAuth])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <Code2 size={14} className="text-white" />
        </div>
        <span className="font-mono text-sm font-semibold text-white">admin panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSideOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + actions */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-4 space-y-2">
        {user && (
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-gray-300">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
        )}
        <a
          href="/portfolio"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <ExternalLink size={16} /> View site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-gray-900 border-r border-gray-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSideOpen(false)} />
          <aside className="relative w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {sideOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="hidden lg:block text-sm text-gray-500 font-mono">
            {NAV.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'}
          </div>
          <ThemeToggle className="!bg-gray-800 !text-gray-400 hover:!bg-gray-700" />
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

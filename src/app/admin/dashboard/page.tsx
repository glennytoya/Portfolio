// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import Skill from '@/models/Skill'
import Experience from '@/models/Experience'
import Message from '@/models/Message'
import Link from 'next/link'
import { FolderKanban, Cpu, Briefcase, MessageSquare, ArrowRight } from 'lucide-react'

async function getStats() {
  await connectDB()
  const [projects, skills, experience, messages, unread] = await Promise.all([
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ status: 'unread' }),
  ])
  return { projects, skills, experience, messages, unread }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const stats = await getStats()

  const STAT_CARDS = [
    { label: 'Projects',    value: stats.projects,   Icon: FolderKanban, href: '/admin/projects',   color: 'violet' },
    { label: 'Skills',      value: stats.skills,     Icon: Cpu,          href: '/admin/skills',     color: 'blue' },
    { label: 'Experiences', value: stats.experience, Icon: Briefcase,    href: '/admin/experience', color: 'emerald' },
    { label: 'Messages',    value: stats.messages,   Icon: MessageSquare,href: '/admin/messages',   color: 'amber', badge: stats.unread },
  ]

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {session.name}. Here&apos;s an overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, Icon, href, badge }) => (
          <Link key={label} href={href}
            className="card card-hover group relative">
            {badge ? (
              <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {badge}
              </span>
            ) : null}
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
              <Icon size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-violet-500" />
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/projects" className="btn-secondary text-sm justify-center">Add project</Link>
          <Link href="/admin/skills"   className="btn-secondary text-sm justify-center">Add skill</Link>
          <Link href="/admin/messages" className="btn-secondary text-sm justify-center">
            View messages {stats.unread > 0 && <span className="ml-1 badge bg-red-100 text-red-600">{stats.unread} new</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}

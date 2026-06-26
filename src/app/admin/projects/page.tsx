// src/app/admin/projects/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import { IProject } from '@/types'
import { ProjectsAdmin } from '@/components/admin/ProjectsAdmin'

async function getProjects(): Promise<IProject[]> {
  await connectDB()
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(projects))
}

export default async function AdminProjectsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const projects = await getProjects()
  return <ProjectsAdmin initialProjects={projects} />
}

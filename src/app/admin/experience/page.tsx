// src/app/admin/experience/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { IExperience } from '@/types'
import { ExperienceAdmin } from '@/components/admin/ExperienceAdmin'

async function getExperience(): Promise<IExperience[]> {
  await connectDB()
  const exp = await Experience.find().sort({ order: 1, startDate: -1 }).lean()
  return JSON.parse(JSON.stringify(exp))
}

export default async function AdminExperiencePage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const experiences = await getExperience()
  return <ExperienceAdmin initialExperiences={experiences} />
}

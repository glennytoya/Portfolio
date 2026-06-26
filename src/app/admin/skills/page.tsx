// src/app/admin/skills/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { ISkill } from '@/types'
import { SkillsAdmin } from '@/components/admin/SkillsAdmin'

async function getSkills(): Promise<ISkill[]> {
  await connectDB()
  const skills = await Skill.find().sort({ category: 1, order: 1 }).lean()
  return JSON.parse(JSON.stringify(skills))
}

export default async function AdminSkillsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const skills = await getSkills()
  return <SkillsAdmin initialSkills={skills} />
}

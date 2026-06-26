// src/components/portfolio/SkillsPreview.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { ISkill } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps', tools: 'Tools', other: 'Other',
}

async function getTopSkills(): Promise<ISkill[]> {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ level: -1 }).limit(8).lean()
    return JSON.parse(JSON.stringify(skills))
  } catch { return [] }
}

export async function SkillsPreview() {
  const skills = await getTopSkills()

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-eyebrow">What I Work With</p>
            <h2 className="section-title">Top Skills</h2>
          </div>
          <Link href="/portfolio/skills" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline">
            All skills <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center gap-4">
              <div className="w-28 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
              <span className="text-xs badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {CATEGORY_LABELS[skill.category] || skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

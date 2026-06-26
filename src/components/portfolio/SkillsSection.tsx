// src/components/portfolio/SkillsSection.tsx
import { connectDB } from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { ISkill } from '@/types'

const CATEGORY_ORDER = ['frontend', 'backend', 'database', 'devops', 'tools', 'other']
const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps & Cloud', tools: 'Tools', other: 'Other',
}

async function getSkills(): Promise<ISkill[]> {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean()
    return JSON.parse(JSON.stringify(skills))
  } catch { return [] }
}

export async function SkillsSection() {
  const skills = await getSkills()

  const grouped = CATEGORY_ORDER.reduce<Record<string, ISkill[]>>((acc, cat) => {
    const items = skills.filter(s => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="section-container">
          <p className="section-eyebrow">Technical Skills</p>
          <h1 className="section-title mb-4">What I know</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-16 max-w-xl">
            A snapshot of the tools and technologies I use daily and the depth I&apos;ve reached in each.
          </p>

          <div className="space-y-14">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-sm font-mono font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-6">
                  {CATEGORY_LABELS[category] || category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5">
                  {items.map((skill) => (
                    <div key={skill._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                        <span className="text-xs font-mono text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-24 text-gray-500">
              <p>No skills yet. Run <code className="text-violet-600">/api/seed</code> to populate.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

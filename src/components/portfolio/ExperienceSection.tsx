// src/components/portfolio/ExperienceSection.tsx
import { MapPin, CalendarDays, Briefcase } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { IExperience } from '@/types'
import { formatDate } from '@/lib/utils'

async function getExperience(): Promise<IExperience[]> {
  try {
    await connectDB()
    const exp = await Experience.find().sort({ order: 1, startDate: -1 }).lean()
    return JSON.parse(JSON.stringify(exp))
  } catch { return [] }
}

const TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time', 'part-time': 'Part-time',
  contract: 'Contract', freelance: 'Freelance', internship: 'Internship',
}

export async function ExperienceSection() {
  const experiences = await getExperience()

  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <p className="section-eyebrow">Career</p>
          <h1 className="section-title mb-4">Experience</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-16 max-w-xl">
            Roles I&apos;ve held and problems I&apos;ve solved.
          </p>

          {experiences.length === 0 ? (
            <div className="text-center py-24 text-gray-500">No experience entries yet.</div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500 via-violet-300 to-transparent dark:from-violet-600 dark:via-violet-800 hidden md:block" />

              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp._id} className="md:pl-14 relative">
                    {/* Timeline dot */}
                    <div className="absolute left-2 top-6 w-4 h-4 rounded-full border-2 border-violet-500 bg-white dark:bg-gray-950 hidden md:block" />

                    <div className="card card-hover">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h2 className="font-bold text-gray-900 dark:text-white text-lg">{exp.role}</h2>
                          <p className="text-violet-600 dark:text-violet-400 font-medium">{exp.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                            <CalendarDays size={12} />
                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={11} /> {exp.location}
                            </span>
                            <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Briefcase size={10} />
                              {TYPE_LABELS[exp.type] || exp.type}
                            </span>
                            {exp.current && (
                              <span className="badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {exp.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-violet-500 mt-0.5 shrink-0">▸</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

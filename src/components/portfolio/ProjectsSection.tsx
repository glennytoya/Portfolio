// src/components/portfolio/ProjectsSection.tsx
import { ExternalLink, Github } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import { IProject } from '@/types'

async function getProjects(): Promise<IProject[]> {
  try {
    await connectDB()
    const projects = await Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(projects))
  } catch { return [] }
}

export async function ProjectsSection() {
  const projects = await getProjects()

  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="section-container">
          <p className="section-eyebrow">Portfolio</p>
          <h1 className="section-title mb-4">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-16 max-w-xl">
            A selection of things I&apos;ve built — side projects, client work, and open-source tools.
          </p>

          {projects.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <p>No published projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <article key={project._id} className="card card-hover group flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {project.title}
                        </h2>
                        {project.featured && (
                          <span className="badge bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                          <Github size={16} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {project.longDescription && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 mb-4 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                      {project.longDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    {project.techStack.map(tech => (
                      <span key={tech} className="badge bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

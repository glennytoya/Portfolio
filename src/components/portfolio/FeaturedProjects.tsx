// src/components/portfolio/FeaturedProjects.tsx
import Link from 'next/link'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import { IProject } from '@/types'

async function getFeaturedProjects(): Promise<IProject[]> {
  try {
    await connectDB()
    const projects = await Project.find({ featured: true, status: 'published' })
      .sort({ order: 1 })
      .limit(3)
      .lean()
    return JSON.parse(JSON.stringify(projects))
  } catch {
    return []
  }
}

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects()

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-eyebrow">Selected Work</p>
            <h2 className="section-title">Featured Projects</h2>
          </div>
          <Link href="/portfolio/projects" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-sm">No projects yet. Seed the database to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article key={project._id} className="card card-hover group flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <Github size={14} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.techStack.slice(0, 4).map(tech => (
                    <span key={tech} className="badge bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500">+{project.techStack.length - 4}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

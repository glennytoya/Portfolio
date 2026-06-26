// src/components/admin/ProjectsAdmin.tsx
'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Github, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { IProject } from '@/types'
import { cn } from '@/lib/utils'

const EMPTY: Partial<IProject> = {
  title: '', slug: '', description: '', longDescription: '',
  techStack: [], githubUrl: '', liveUrl: '', featured: false, order: 0, status: 'published',
}

export function ProjectsAdmin({ initialProjects }: { initialProjects: IProject[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<IProject>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openNew  = () => { setEditing(EMPTY); setModalOpen(true) }
  const openEdit = (p: IProject) => { setEditing(p); setModalOpen(true) }

  const handleSave = async () => {
    if (!editing.title) return toast.error('Title is required')
    setSaving(true)
    try {
      const isEdit = !!(editing as IProject)._id
      const url    = isEdit ? `/api/projects/${(editing as IProject)._id}` : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'
      const body   = { ...editing, techStack: typeof editing.techStack === 'string'
        ? (editing.techStack as string).split(',').map((s: string) => s.trim()).filter(Boolean)
        : editing.techStack }

      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setProjects(prev =>
        isEdit ? prev.map(p => p._id === data.data._id ? data.data : p) : [data.data, ...prev]
      )
      toast.success(isEdit ? 'Project updated' : 'Project created')
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProjects(prev => prev.filter(p => p._id !== id))
      toast.success('Project deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleteId(null)
    }
  }

  const F = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setEditing(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} total</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> New project</button>
      </div>

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="card text-center py-16 text-gray-500">
            <p className="mb-3">No projects yet</p>
            <button onClick={openNew} className="btn-primary mx-auto"><Plus size={16} /> Add first project</button>
          </div>
        )}
        {projects.map(project => (
          <div key={project._id} className="card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{project.title}</h3>
                {project.featured && <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />}
                <span className={cn('badge shrink-0', project.status === 'published'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500')}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 5).map(t => (
                  <span key={t} className="badge bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2"><Github size={15} /></a>}
              {project.liveUrl  && <a href={project.liveUrl}  target="_blank" rel="noopener noreferrer" className="btn-ghost p-2"><ExternalLink size={15} /></a>}
              <button onClick={() => openEdit(project)} className="btn-ghost p-2"><Pencil size={15} /></button>
              <button onClick={() => handleDelete(project._id)} disabled={deleteId === project._id} className="btn-danger p-2">
                {deleteId === project._id ? <Spinner className="w-4 h-4" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={(editing as IProject)._id ? 'Edit project' : 'New project'} className="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Title *</label>
              <input className="input" placeholder="Project name" value={editing.title || ''} onChange={F('title')} />
            </div>
            <div>
              <label className="label">Slug</label>
              <input className="input" placeholder="auto-generated" value={editing.slug || ''} onChange={F('slug')} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={editing.status || 'published'} onChange={F('status')}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Short description *</label>
              <textarea className="input resize-none" rows={2} placeholder="One-line description" value={editing.description || ''} onChange={F('description')} />
            </div>
            <div className="col-span-2">
              <label className="label">Long description</label>
              <textarea className="input resize-none" rows={3} placeholder="Detailed description (optional)" value={editing.longDescription || ''} onChange={F('longDescription')} />
            </div>
            <div className="col-span-2">
              <label className="label">Tech stack (comma-separated)</label>
              <input className="input" placeholder="React, TypeScript, MongoDB" value={Array.isArray(editing.techStack) ? editing.techStack.join(', ') : (editing.techStack || '')} onChange={F('techStack')} />
            </div>
            <div>
              <label className="label">GitHub URL</label>
              <input className="input" placeholder="https://github.com/..." value={editing.githubUrl || ''} onChange={F('githubUrl')} />
            </div>
            <div>
              <label className="label">Live URL</label>
              <input className="input" placeholder="https://..." value={editing.liveUrl || ''} onChange={F('liveUrl')} />
            </div>
            <div>
              <label className="label">Order</label>
              <input className="input" type="number" value={editing.order ?? 0} onChange={F('order')} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={!!editing.featured}
                onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 accent-violet-600" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner className="w-4 h-4" /> : null}
              {saving ? 'Saving...' : 'Save project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

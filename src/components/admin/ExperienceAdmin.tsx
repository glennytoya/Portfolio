// src/components/admin/ExperienceAdmin.tsx
'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, MapPin, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { IExperience } from '@/types'
import { formatDate } from '@/lib/utils'

const EMPTY: Partial<IExperience> = {
  company: '', role: '', description: '', highlights: [],
  startDate: '', current: false, location: 'Remote', type: 'full-time', order: 0,
}

export function ExperienceAdmin({ initialExperiences }: { initialExperiences: IExperience[] }) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState<Partial<IExperience>>(EMPTY)
  const [saving, setSaving]           = useState(false)
  const [highlightsText, setHighlightsText] = useState('')

  const openNew  = () => { setEditing(EMPTY); setHighlightsText(''); setModalOpen(true) }
  const openEdit = (e: IExperience) => {
    setEditing(e)
    setHighlightsText(e.highlights.join('\n'))
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!editing.company || !editing.role) return toast.error('Company and role required')
    setSaving(true)
    try {
      const isEdit  = !!(editing as IExperience)._id
      const url     = isEdit ? `/api/experience/${(editing as IExperience)._id}` : '/api/experience'
      const method  = isEdit ? 'PUT' : 'POST'
      const payload = { ...editing, highlights: highlightsText.split('\n').map(s => s.trim()).filter(Boolean) }
      const res     = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data    = await res.json()
      if (!res.ok) throw new Error(data.error)
      setExperiences(prev => isEdit ? prev.map(e => e._id === data.data._id ? data.data : e) : [data.data, ...prev])
      toast.success(isEdit ? 'Updated' : 'Created')
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
    if (res.ok) { setExperiences(prev => prev.filter(e => e._id !== id)); toast.success('Deleted') }
    else toast.error('Delete failed')
  }

  const F = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setEditing(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h1>
          <p className="text-sm text-gray-500 mt-0.5">{experiences.length} entries</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> Add role</button>
      </div>

      <div className="space-y-3">
        {experiences.length === 0 && (
          <div className="card text-center py-16 text-gray-500">
            <p className="mb-3">No experience entries yet</p>
            <button onClick={openNew} className="btn-primary mx-auto"><Plus size={16} /> Add first role</button>
          </div>
        )}
        {experiences.map(exp => (
          <div key={exp._id} className="card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                  <p className="text-violet-600 dark:text-violet-400 text-sm font-medium">{exp.company}</p>
                </div>
                {exp.current && <span className="badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">Current</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDate(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {exp.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(exp)} className="btn-ghost p-2"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(exp._id)} className="btn-danger p-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={(editing as IExperience)._id ? 'Edit experience' : 'Add experience'} className="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <input className="input" placeholder="Acme Corp" value={editing.company || ''} onChange={F('company')} />
            </div>
            <div>
              <label className="label">Role *</label>
              <input className="input" placeholder="Senior Engineer" value={editing.role || ''} onChange={F('role')} />
            </div>
            <div>
              <label className="label">Start date</label>
              <input className="input" type="date" value={editing.startDate ? editing.startDate.toString().slice(0,10) : ''} onChange={F('startDate')} />
            </div>
            <div>
              <label className="label">End date</label>
              <input className="input" type="date" value={editing.endDate ? editing.endDate.toString().slice(0,10) : ''} onChange={F('endDate')} disabled={!!editing.current} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Remote" value={editing.location || ''} onChange={F('location')} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={editing.type || 'full-time'} onChange={F('type')}>
                {['full-time','part-time','contract','freelance','internship'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={2} value={editing.description || ''} onChange={F('description')} />
            </div>
            <div className="col-span-2">
              <label className="label">Highlights (one per line)</label>
              <textarea className="input resize-none" rows={4} placeholder="Reduced API latency by 40%..." value={highlightsText} onChange={e => setHighlightsText(e.target.value)} />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="current" checked={!!editing.current}
                onChange={e => setEditing(p => ({ ...p, current: e.target.checked, endDate: e.target.checked ? undefined : p.endDate }))}
                className="w-4 h-4 accent-violet-600" />
              <label htmlFor="current" className="text-sm text-gray-700 dark:text-gray-300">Current position</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner className="w-4 h-4" /> : null}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

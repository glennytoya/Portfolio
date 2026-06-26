// src/components/admin/SkillsAdmin.tsx
'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { ISkill } from '@/types'

const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'tools', 'other'] as const
const EMPTY: Partial<ISkill> = { name: '', category: 'frontend', level: 75, order: 0 }

export function SkillsAdmin({ initialSkills }: { initialSkills: ISkill[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<ISkill>>(EMPTY)
  const [saving, setSaving] = useState(false)

  const openNew  = () => { setEditing(EMPTY); setModalOpen(true) }
  const openEdit = (s: ISkill) => { setEditing(s); setModalOpen(true) }

  const handleSave = async () => {
    if (!editing.name) return toast.error('Name is required')
    setSaving(true)
    try {
      const isEdit = !!(editing as ISkill)._id
      const url    = isEdit ? `/api/skills/${(editing as ISkill)._id}` : '/api/skills'
      const method = isEdit ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
      const data   = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSkills(prev => isEdit ? prev.map(s => s._id === data.data._id ? data.data : s) : [data.data, ...prev])
      toast.success(isEdit ? 'Skill updated' : 'Skill added')
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    if (res.ok) { setSkills(prev => prev.filter(s => s._id !== id)); toast.success('Deleted') }
    else toast.error('Delete failed')
  }

  const grouped = CATEGORIES.reduce<Record<string, ISkill[]>>((acc, cat) => {
    const items = skills.filter(s => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-sm text-gray-500 mt-0.5">{skills.length} total</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> Add skill</button>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs font-mono font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3 capitalize">{cat}</h2>
          <div className="space-y-2">
            {items.map(skill => (
              <div key={skill._id} className="card flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{skill.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="skill-bar w-48">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(skill)} className="btn-ghost p-2"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(skill._id)} className="btn-danger p-2"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="card text-center py-16 text-gray-500">
          <p className="mb-3">No skills yet</p>
          <button onClick={openNew} className="btn-primary mx-auto"><Plus size={16} /> Add first skill</button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={(editing as ISkill)._id ? 'Edit skill' : 'Add skill'} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input className="input" placeholder="TypeScript" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={editing.category || 'frontend'} onChange={e => setEditing(p => ({ ...p, category: e.target.value as ISkill['category'] }))}>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Proficiency: {editing.level ?? 75}%</label>
            <input type="range" min={1} max={100} value={editing.level ?? 75}
              onChange={e => setEditing(p => ({ ...p, level: Number(e.target.value) }))}
              className="w-full accent-violet-600" />
          </div>
          <div>
            <label className="label">Order</label>
            <input className="input" type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} />
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

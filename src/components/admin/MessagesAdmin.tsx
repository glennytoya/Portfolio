// src/components/admin/MessagesAdmin.tsx
'use client'
import { useState } from 'react'
import { Trash2, Mail, MailOpen, CheckCheck, Archive } from 'lucide-react'
import toast from 'react-hot-toast'
import { IMessage } from '@/types'
import { formatDateFull } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  unread:   { label: 'Unread',   classes: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  read:     { label: 'Read',     classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
  replied:  { label: 'Replied',  classes: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' },
  archived: { label: 'Archived', classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
}

export function MessagesAdmin({ initialMessages }: { initialMessages: IMessage[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [selected, setSelected] = useState<IMessage | null>(null)
  const [filter, setFilter]     = useState<string>('all')

  const updateStatus = async (id: string, status: IMessage['status']) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m))
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success(`Marked as ${status}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessages(prev => prev.filter(m => m._id !== id))
      if (selected?._id === id) setSelected(null)
      toast.success('Deleted')
    }
  }

  const handleSelect = async (msg: IMessage) => {
    setSelected(msg)
    if (msg.status === 'unread') updateStatus(msg._id, 'read')
  }

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter)
  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <div className="p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {messages.length} total{unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {['all', 'unread', 'read', 'replied', 'archived'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-200px)]">
        {/* List */}
        <div className="lg:col-span-2 space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">No messages in this filter</div>
          )}
          {filtered.map(msg => (
            <button key={msg._id} onClick={() => handleSelect(msg)} className={cn(
              'w-full text-left card transition-all',
              selected?._id === msg._id ? 'border-violet-400 dark:border-violet-600 bg-violet-50/50 dark:bg-violet-900/10' : 'card-hover',
              msg.status === 'unread' && 'border-l-2 border-l-blue-500'
            )}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={cn('text-sm font-medium truncate', msg.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>{msg.name}</p>
                <span className={cn('badge shrink-0', STATUS_CONFIG[msg.status]?.classes)}>{STATUS_CONFIG[msg.status]?.label}</span>
              </div>
              <p className="text-xs text-violet-600 dark:text-violet-400 truncate mb-1">{msg.subject}</p>
              <p className="text-xs text-gray-400 truncate">{msg.message.slice(0, 80)}</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{formatDateFull(msg.createdAt)}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card h-full flex flex-col overflow-hidden">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{selected.subject}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    From <span className="font-medium text-gray-700 dark:text-gray-300">{selected.name}</span>
                    {' · '}<a href={`mailto:${selected.email}`} className="text-violet-600 hover:underline">{selected.email}</a>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDateFull(selected.createdAt)}</p>
                </div>
                <span className={cn('badge', STATUS_CONFIG[selected.status]?.classes)}>{STATUS_CONFIG[selected.status]?.label}</span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap">
                <button onClick={() => updateStatus(selected._id, 'read')}
                  disabled={selected.status === 'read'}
                  className="btn-ghost text-xs gap-1.5"><MailOpen size={13} /> Mark read</button>
                <button onClick={() => updateStatus(selected._id, 'replied')}
                  disabled={selected.status === 'replied'}
                  className="btn-ghost text-xs gap-1.5"><CheckCheck size={13} /> Mark replied</button>
                <button onClick={() => updateStatus(selected._id, 'archived')}
                  disabled={selected.status === 'archived'}
                  className="btn-ghost text-xs gap-1.5"><Archive size={13} /> Archive</button>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="btn-primary text-xs gap-1.5 ml-auto"><Mail size={13} /> Reply by email</a>
                <button onClick={() => handleDelete(selected._id)} className="btn-danger text-xs gap-1.5"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Mail size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Here's the corrected file with your details:

```tsx
// src/components/portfolio/ContactSection.tsx
'use client'
import { useState } from 'react'
import { Send, Mail, Github, Linkedin, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      toast.success(data.message || 'Message sent!')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="section-container max-w-5xl">
          <p className="section-eyebrow">Get In Touch</p>
          <h1 className="section-title mb-4">Contact</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-16 max-w-xl">
            Have a project in mind or want to chat? Fill out the form or reach out directly.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Let&apos;s talk</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Available for freelance projects and select full-time roles. Response time is usually within 24 hours.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { Icon: Mail,     label: 'Email',    value: 'glennnderitu@gmail.com',      href: 'glennnderitu@gmail.com' },
                  { Icon: Github,   label: 'GitHub',   value: 'github.com/glennytoya',       href: 'https://github.com/glennytoya' },
                  { Icon: Linkedin, label: 'LinkedIn', value: 'in/glenny',               href: 'https://linkedin.com/in/glennytoya' },
                  { Icon: MapPin,   label: 'Location', value: 'Nairobi, Kenya',              href: undefined },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-mono">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 card space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" className="input" placeholder="Your name" required value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" type="email" className="input" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="subject">Subject</label>
                <input id="subject" className="input" placeholder="What's this about?" required value={form.subject} onChange={set('subject')} />
              </div>
              <div>
                <label className="label" htmlFor="message">Message</label>
                <textarea id="message" rows={5} className={cn('input resize-none')} placeholder="Tell me about your project or opportunity..." required value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <Spinner className="w-4 h-4" /> : <Send size={16} />}
                {loading ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

import { Code2, Cpu, Globe, Coffee } from 'lucide-react'

const VALUES = [
  { Icon: Code2,  title: 'Clean Code',      desc: 'I write code I want to maintain. Readable, tested, easy to delete.' },
  { Icon: Cpu,    title: 'Systems Thinking', desc: 'I understand what happens before and after my layer in the stack.' },
  { Icon: Globe,  title: 'User Focus',       desc: 'Every abstraction I build is in service of the person using the product.' },
  { Icon: Coffee, title: 'Craft',            desc: 'I care about the details — performance, accessibility, DX, and taste.' },
]

export function AboutSection() {
  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="section-container max-w-4xl">
          <p className="section-eyebrow">About Me</p>
          <h1 className="section-title mb-8">
            Building software that<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              actually ships
            </span>
          </h1>
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-5 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            <p>
              I&apos;m Glenn, a full-stack engineer with a year of experience across the entire
              web stack — from database schema design and server architecture to pixel-perfect UI and
              performance optimisation. I thrive at the intersection of backend reliability and frontend experience.
            </p>
            <p>
              I take on selected freelance projects and consult on architecture decisions for early-stage teams.
            </p>
            <p>
              Outside work: networking, specialty coffee, trail running, and widening knowledge on emerging trends
            </p>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="section-container">
          <p className="section-eyebrow">How I Work</p>
          <h2 className="section-title mb-12">What I value</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ Icon, title, desc }) => (
              <div key={title} className="card card-hover">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

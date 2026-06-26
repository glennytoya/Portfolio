// src/app/api/seed/route.ts
// Run once: GET /api/seed?secret=YOUR_ADMIN_PASSWORD
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import Project from '@/models/Project'
import Skill from '@/models/Skill'
import Experience from '@/models/Experience'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.dev'
  const adminPass  = process.env.ADMIN_PASSWORD || 'changeme'
  const existing   = await Admin.findOne({ email: adminEmail })
  if (!existing) {
    const hashed = await bcrypt.hash(adminPass, 12)
    await Admin.create({ email: adminEmail, password: hashed, name: 'Alex Mercer' })
  }

  // Skills
  const skillCount = await Skill.countDocuments()
  if (skillCount === 0) {
    await Skill.insertMany([
      { name: 'TypeScript',   category: 'frontend',  level: 92, order: 1 },
      { name: 'React',        category: 'frontend',  level: 90, order: 2 },
      { name: 'Next.js',      category: 'frontend',  level: 88, order: 3 },
      { name: 'Tailwind CSS', category: 'frontend',  level: 85, order: 4 },
      { name: 'Node.js',      category: 'backend',   level: 87, order: 5 },
      { name: 'Go',           category: 'backend',   level: 75, order: 6 },
      { name: 'REST / GraphQL',category: 'backend',  level: 85, order: 7 },
      { name: 'PostgreSQL',   category: 'database',  level: 80, order: 8 },
      { name: 'MongoDB',      category: 'database',  level: 85, order: 9 },
      { name: 'Redis',        category: 'database',  level: 72, order: 10 },
      { name: 'Docker',       category: 'devops',    level: 78, order: 11 },
      { name: 'AWS',          category: 'devops',    level: 70, order: 12 },
      { name: 'Vercel',       category: 'devops',    level: 90, order: 13 },
      { name: 'Git',          category: 'tools',     level: 95, order: 14 },
    ])
  }

  // Experience
  const expCount = await Experience.countDocuments()
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company: 'Veritas Systems',
        role: 'Senior Full-Stack Engineer',
        description: 'Led development of the core product platform used by 50k+ users.',
        highlights: ['Reduced API latency by 40% via caching layer', 'Built real-time collaboration features with WebSockets', 'Mentored team of 4 junior engineers'],
        startDate: new Date('2022-03-01'),
        current: true,
        location: 'Remote',
        type: 'full-time',
        order: 1,
      },
      {
        company: 'Flux Technologies',
        role: 'Full-Stack Developer',
        description: 'Built and maintained fintech platform processing $2M+ in daily transactions.',
        highlights: ['Designed PostgreSQL schema for financial data', 'Integrated Plaid and Stripe APIs', 'Implemented PCI-compliant payment flows'],
        startDate: new Date('2020-06-01'),
        endDate: new Date('2022-02-28'),
        current: false,
        location: 'Nairobi, KE',
        type: 'full-time',
        order: 2,
      },
      {
        company: 'Freelance',
        role: 'Frontend Developer',
        description: 'Delivered responsive web applications for clients across e-commerce and SaaS.',
        highlights: ['10+ client projects delivered on time', 'Specialised in React and Next.js', 'SEO optimisation and Core Web Vitals'],
        startDate: new Date('2019-01-01'),
        endDate: new Date('2020-05-31'),
        current: false,
        location: 'Remote',
        type: 'freelance',
        order: 3,
      },
    ])
  }

  // Projects
  const projCount = await Project.countDocuments()
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: 'Nexus API Gateway',
        slug: 'nexus-api-gateway',
        description: 'High-throughput API gateway handling 50k req/s with rate limiting, JWT auth, and real-time analytics.',
        techStack: ['Go', 'Redis', 'React', 'PostgreSQL', 'Docker'],
        githubUrl: 'https://github.com/alexmercer/nexus',
        featured: true,
        order: 1,
        status: 'published',
      },
      {
        title: 'Forma Design System',
        slug: 'forma-design-system',
        description: 'Component library used across 4 products with Figma sync and automated a11y testing.',
        techStack: ['TypeScript', 'React', 'Storybook', 'CSS-in-JS'],
        githubUrl: 'https://github.com/alexmercer/forma',
        featured: true,
        order: 2,
        status: 'published',
      },
      {
        title: 'Ledger Finance Tracker',
        slug: 'ledger-finance-tracker',
        description: 'Personal finance app with Plaid integration, ML categorisation, 3k+ active users.',
        techStack: ['Next.js', 'Plaid', 'Python', 'MongoDB', 'Tailwind'],
        liveUrl: 'https://ledger.alexmercer.dev',
        featured: true,
        order: 3,
        status: 'published',
      },
      {
        title: 'Pulsar Collaboration',
        slug: 'pulsar-collaboration',
        description: 'Real-time CRDT collaborative editor with WebSocket sync and offline support.',
        techStack: ['CRDT', 'WebSockets', 'Node.js', 'IndexedDB'],
        githubUrl: 'https://github.com/alexmercer/pulsar',
        featured: false,
        order: 4,
        status: 'published',
      },
    ])
  }

  return NextResponse.json({
    success: true,
    message: 'Database seeded. Remove or protect this route before production.',
  })
}

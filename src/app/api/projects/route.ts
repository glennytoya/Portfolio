// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import { getTokenFromRequest } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status   = searchParams.get('status')
    const featured = searchParams.get('featured')

    const filter: Record<string, unknown> = {}
    if (status)           filter.status   = status
    if (featured === '1') filter.featured = true

    // Public requests only see published
    const session = getTokenFromRequest(req)
    if (!session && !status) filter.status = 'published'

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: projects })
  } catch (err) {
    console.error('GET /api/projects:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()
    const slug = body.slug || slugify(body.title || '')

    const project = await Project.create({ ...body, slug })
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string }
    if (error.code === 11000) return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    console.error('POST /api/projects:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// src/app/api/skills/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { getTokenFromRequest } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!skill) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: skill })
  } catch (err) {
    console.error('PUT /api/skills/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const skill = await Skill.findByIdAndDelete(id)
    if (!skill) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (err) {
    console.error('DELETE /api/skills/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

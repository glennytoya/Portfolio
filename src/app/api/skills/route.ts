// src/app/api/skills/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean()
    return NextResponse.json({ success: true, data: skills })
  } catch (err) {
    console.error('GET /api/skills:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()
    const skill = await Skill.create(body)
    return NextResponse.json({ success: true, data: skill }, { status: 201 })
  } catch (err) {
    console.error('POST /api/skills:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

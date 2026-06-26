// src/app/api/experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const exp = await Experience.find().sort({ order: 1, startDate: -1 }).lean()
    return NextResponse.json({ success: true, data: exp })
  } catch (err) {
    console.error('GET /api/experience:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const body = await req.json()
    const exp = await Experience.create(body)
    return NextResponse.json({ success: true, data: exp }, { status: 201 })
  } catch (err) {
    console.error('POST /api/experience:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// src/app/api/experience/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { getTokenFromRequest } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const exp = await Experience.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!exp) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: exp })
  } catch (err) {
    console.error('PUT /api/experience/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const exp = await Experience.findByIdAndDelete(id)
    if (!exp) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (err) {
    console.error('DELETE /api/experience/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

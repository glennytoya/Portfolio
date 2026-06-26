// src/app/api/contact/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'
import { getTokenFromRequest } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const { status } = await req.json()
    const msg = await Message.findByIdAndUpdate(id, { status }, { new: true }).lean()
    if (!msg) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: msg })
  } catch (err) {
    console.error('PATCH /api/contact/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { id } = await params
    const msg = await Message.findByIdAndDelete(id)
    if (!msg) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (err) {
    console.error('DELETE /api/contact/[id]:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

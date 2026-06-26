// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getTokenFromRequest(req)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const filter = status ? { status } : {}

    const messages = await Message.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: messages })
  } catch (err) {
    console.error('GET /api/contact:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    await connectDB()
    const msg = await Message.create({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim() })
    return NextResponse.json({ success: true, data: { id: msg._id }, message: "Message received! I'll get back to you soon." }, { status: 201 })
  } catch (err) {
    console.error('POST /api/contact:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

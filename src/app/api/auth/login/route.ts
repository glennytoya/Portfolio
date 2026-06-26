// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()
    const admin = await Admin.findOne({ email: email.toLowerCase() })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email, name: admin.name })
    const cookie = setAuthCookie(token)

    const response = NextResponse.json({
      success: true,
      data: { name: admin.name, email: admin.email },
      message: 'Logged in successfully',
    })
    response.cookies.set(cookie)
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

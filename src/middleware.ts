// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest } from '@/lib/auth'
export const runtime = 'nodejs' 

const PROTECTED_PATHS = ['/admin/dashboard', '/admin/projects', '/admin/skills', '/admin/experience', '/admin/messages']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes (except login)
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (isProtected) {
    const session = getTokenFromRequest(req)
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Redirect /admin to /admin/dashboard
  if (pathname === '/admin') {
    const session = getTokenFromRequest(req)
    return NextResponse.redirect(new URL(session ? '/admin/dashboard' : '/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

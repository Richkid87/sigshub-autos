import { NextResponse } from 'next/server'
import { verifySessionToken } from './app/lib/auth'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect all /admin/dashboard routes with HMAC verification
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('admin_session')
    const secret = process.env.ADMIN_PASSWORD

    const isValid = session?.value && secret
      ? await verifySessionToken(session.value, secret)
      : false

    if (!isValid) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ── Security headers ──────────────────────────────────────
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    // Protect admin dashboard
    '/admin/dashboard/:path*',
    // Apply security headers to all non-static routes
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
}

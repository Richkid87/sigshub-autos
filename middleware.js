import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect all /admin/dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('admin_session')
    const isValid = session?.value === process.env.ADMIN_PASSWORD

    if (!isValid) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}

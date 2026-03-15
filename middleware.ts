import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/signup/classify', '/pricing', '/news', '/insights', '/interviews']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/news/') || pathname.startsWith('/insights/') || pathname.startsWith('/interviews/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('requisti_auth')?.value

  const isAuthenticated = authCookie === '1'

  // Routes that require authentication
  const requiresAuth =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/directory') ||
    pathname.startsWith('/signup/classify') ||
    pathname.startsWith('/signup/agency') ||
    pathname.startsWith('/signup/production') ||
    pathname.startsWith('/signup/client') ||
    pathname.startsWith('/signup/talent')

  if (requiresAuth && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/directory/:path*',
    '/signup/classify',
    '/signup/agency',
    '/signup/production',
    '/signup/client',
    '/signup/talent',
  ],
}

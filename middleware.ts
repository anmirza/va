import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/signup/classify', '/pricing', '/news', '/insights', '/interviews']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p =>
    pathname === p ||
    pathname.startsWith('/news/') ||
    pathname.startsWith('/insights/') ||
    pathname.startsWith('/interviews/')
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('requisti_auth')?.value
  const roleCookie = request.cookies.get('requisti_role')?.value

  const isAuthenticated = authCookie === '1'
  const isAdminRole = roleCookie === 'admin' || roleCookie === 'super_admin'

  // Admin routes require admin role
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!isAdminRole) {
      // Non-admins trying to access admin panel → redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

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
    '/admin/:path*',
    '/dashboard/:path*',
    '/directory/:path*',
    '/signup/classify',
    '/signup/agency/:path*',
    '/signup/production/:path*',
    '/signup/client',
    '/signup/talent',
  ],
}

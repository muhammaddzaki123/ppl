import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  const isApi = pathname.startsWith('/api/');
  const isAuthApi = pathname.startsWith('/api/auth');
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  if (isAuthApi) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;

  if (isLoginPage && payload) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  if (isAdminPage && !payload) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (!isApi) return NextResponse.next();

  const protectApi =
    pathname.startsWith('/api/admins') || pathname.startsWith('/api/upload');

  if (!protectApi) return NextResponse.next();

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/login'],
};

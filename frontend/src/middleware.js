import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken')?.value || request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/auth';
  const hasToken = !!(accessToken || refreshToken);

  if (!hasToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  if (hasToken && isPublicPath) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
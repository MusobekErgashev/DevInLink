import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken')?.value || request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const hasToken = !!(accessToken || refreshToken);

  const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/');

  // Protected paths that strictly require authentication
  const protectedPaths = ['/', '/profile', '/community', '/quotes', '/settings'];
  const isExplicitlyProtected = protectedPaths.some(path =>
    path === '/' ? pathname === '/' : (pathname === path || pathname.startsWith(path + '/'))
  );

  // Explore page is public
  const isExplorePage = pathname === '/explore' || pathname.startsWith('/explore/');

  // Single-segment username route e.g. /username (e.g. /musobek, /john)
  const segments = pathname.split('/').filter(Boolean);
  const isUsernameProfile = segments.length === 1 && !isExplicitlyProtected && !isAuthPage && !isExplorePage;

  const isPublicPage = isAuthPage || isExplorePage || isUsernameProfile;

  // If user is not authenticated and trying to access a non-public path
  if (!hasToken && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If user is authenticated and trying to access auth page
  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
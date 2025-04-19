import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/courses') && pathname.includes('/enroll')) {
    const isAuthenticated = request.cookies.get('auth_token');
    const userRole = request.cookies.get('user_role');
    
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    if (userRole && userRole !== 'student') {
      return NextResponse.redirect(new URL('/auth/access-denied', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/courses/:path*/enroll'],
};
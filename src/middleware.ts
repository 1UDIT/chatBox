import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashBorad/:path*', '/chatBox/:path*','/Sign-in', '/Sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/Sign-in') ||
      url.pathname.startsWith('/Sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL(`/dashBorad/${token.username}`, request.url));
  }

  if (!token && url.pathname.startsWith('/dashBorad')|| !token && url.pathname.startsWith('/chatBox')) {
    return NextResponse.redirect(new URL('/Sign-in', request.url));
  }

  return NextResponse.next();
}
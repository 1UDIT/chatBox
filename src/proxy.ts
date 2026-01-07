import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashBorad/:path*', '/Sign-in', '/Sign-up', '/', '/verify/:path*'],
};

export async function proxy(request: NextRequest) {
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
    return NextResponse.redirect(new URL(`/dashBoard/${token.username}`, request.url));
  }

  if (!token && url.pathname.startsWith('/dashBoard') || !token && url.pathname.startsWith('/chatBox')) {
    return NextResponse.redirect(new URL('/Sign-in', request.url));
  }
  if (!token && url.pathname.startsWith('/dashBoard')) {
    return NextResponse.redirect(new URL('/Sign-in', request.url));
  }

  return NextResponse.next();
}
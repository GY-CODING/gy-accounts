import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const requireAuth = withMiddlewareAuthRequired();

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Development only: /v2?demo previews the prototype dashboard with sample data, without
  // signing in. In production every page still requires a session.
  if (
    process.env.NODE_ENV === 'development' &&
    ((req.nextUrl.pathname.startsWith('/v2') &&
      req.nextUrl.searchParams.has('demo')) ||
      // …and the public images that page shows (logo, icons).
      /\.(png|svg|ico|webp|jpg)$/.test(req.nextUrl.pathname))
  ) {
    return NextResponse.next();
  }
  return requireAuth(req, event);
}

export const config = {
  matcher: [
    '/((?!api/auth|api/public|_next/static|_next/image|gy-logo.ico).*)',
  ],
};

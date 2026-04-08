import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/((?!api/auth|api/public|_next/static|_next/image|gy-logo.ico).*)',
  ],
};

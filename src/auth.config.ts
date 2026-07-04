import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Redirect resolved against the REAL incoming request's Host header (we run
 * with `trustHost: true`), never against AUTH_URL/NEXTAUTH_URL — so it always
 * stays on the domain the visitor is actually on and can never point at
 * localhost in production. Absolute URL required: Auth.js parses the Location
 * header with `new URL()` and throws "Invalid URL" on host-less paths.
 */
function requestRedirect(req: { headers: Headers }, path: string) {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host = req.headers.get('host') ?? 'localhost:3000';
  return NextResponse.redirect(new URL(path, `${proto}://${host}`));
}

/**
 * Edge-safe auth config (no Prisma, no bcrypt).
 * Used by middleware for route protection and shared by the full Node config.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [], // real providers are attached in src/auth.ts (Node runtime)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // `role` exists on our augmented User; default to CUSTOMER
        token.role = (user as { role?: 'CUSTOMER' | 'ADMIN' }).role ?? 'CUSTOMER';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = (token.role as 'CUSTOMER' | 'ADMIN') ?? 'CUSTOMER';
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;
      const { pathname, search } = request.nextUrl;
      const callbackUrl = encodeURIComponent(pathname + search);

      // Admin area — requires ADMIN role
      if (pathname.startsWith('/admin')) {
        if (isLoggedIn && role === 'ADMIN') return true;
        return requestRedirect(request, isLoggedIn ? '/' : `/login?callbackUrl=${callbackUrl}`);
      }

      // Customer account — requires any logged-in user
      if (pathname.startsWith('/account')) {
        if (isLoggedIn) return true;
        return requestRedirect(request, `/login?callbackUrl=${callbackUrl}`);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

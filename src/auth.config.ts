import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Build a relative (host-less) redirect. The browser resolves the `Location`
 * header against the current request origin, so it ALWAYS stays on the live
 * domain (Vercel / custom) and can never point at localhost — independent of
 * AUTH_URL / NEXTAUTH_URL.
 */
function relativeRedirect(path: string) {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;
      const { pathname, search } = nextUrl;
      const callbackUrl = encodeURIComponent(pathname + search);

      // Admin area — requires ADMIN role
      if (pathname.startsWith('/admin')) {
        if (isLoggedIn && role === 'ADMIN') return true;
        return relativeRedirect(isLoggedIn ? '/' : `/login?callbackUrl=${callbackUrl}`);
      }

      // Customer account — requires any logged-in user
      if (pathname.startsWith('/account')) {
        if (isLoggedIn) return true;
        return relativeRedirect(`/login?callbackUrl=${callbackUrl}`);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

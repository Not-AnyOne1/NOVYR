import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Edge-safe auth middleware — uses only the lightweight config (no Prisma).
export default NextAuth(authConfig).auth;

export const config = {
  // Protect the customer account area and the admin dashboard.
  matcher: ['/account/:path*', '/admin/:path*'],
};

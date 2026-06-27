import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { Session } from 'next-auth';

/** Server-component guard: require any authenticated user. */
export async function requireUser(callbackUrl = '/account'): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return session;
}

/** Server-component guard: require an ADMIN. */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/admin');
  if (session.user.role !== 'ADMIN') redirect('/');
  return session;
}

/** API guard: returns the session if admin, otherwise null. */
export async function getAdminSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

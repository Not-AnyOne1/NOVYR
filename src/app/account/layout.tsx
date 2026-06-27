import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AccountNav } from '@/components/account/AccountNav';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/account');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="eyebrow">My Account</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">
          Hey{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

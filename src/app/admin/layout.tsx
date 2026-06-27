import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guards';
import { AdminNav } from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-charcoal-border bg-ink-900 p-4 lg:block">
        <AdminNav />
      </aside>

      {/* Mobile top nav */}
      <div className="border-b border-charcoal-border bg-ink-900 p-4 lg:hidden">
        <AdminNav />
      </div>

      <main className="min-w-0 bg-ink p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

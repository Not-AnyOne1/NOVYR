import { prisma } from '@/lib/prisma';
import { formatMAD, formatDate } from '@/lib/utils';

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: { orders: { select: { totalCents: true, status: true } } },
    take: 200,
  });

  const rows = users.map((u) => {
    const delivered = u.orders.filter((o) => o.status === 'DELIVERED');
    return {
      id: u.id,
      name: u.name ?? '—',
      email: u.email,
      phone: u.phone,
      orderCount: u.orders.length,
      spent: delivered.reduce((n, o) => n + o.totalCents, 0),
      createdAt: u.createdAt,
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Customers</h1>
        <p className="mt-1 text-sm text-smoke">{rows.length} registered customers</p>
      </header>

      {rows.length === 0 ? (
        <div className="card p-12 text-center text-sm text-smoke">No customers yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wider text-smoke">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">Lifetime value</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{r.name}</div>
                      <div className="text-xs text-smoke-dark">{r.email}</div>
                    </td>
                    <td className="px-4 py-3 text-smoke-light">{r.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-smoke-light">{r.orderCount}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatMAD(r.spent)}</td>
                    <td className="px-4 py-3 text-smoke">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

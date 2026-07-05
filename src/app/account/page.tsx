import Link from 'next/link';
import { Package, Heart, ArrowRight, ShoppingBag, LayoutDashboard } from 'lucide-react';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getUserOrders } from '@/lib/queries';
import { formatMAD, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/account/StatusBadge';

export default async function AccountOverview() {
  const session = await auth();
  const userId = session!.user.id;
  const isAdmin = session!.user.role === 'ADMIN';

  const [orders, wishlistCount] = await Promise.all([
    getUserOrders(userId),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  const totalSpent = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: 'Total orders', value: orders.length, icon: Package, href: '/account/orders' },
    { label: 'Wishlist items', value: wishlistCount, icon: Heart, href: '/account/wishlist' },
    { label: 'Total spent', value: formatMAD(totalSpent), icon: ShoppingBag, href: '/account/orders' },
  ];

  return (
    <div className="space-y-8">
      {isAdmin && (
        <Link
          href="/admin"
          className="card group flex items-center justify-between gap-4 border-electric/30 bg-electric/5 p-5 transition-colors hover:border-electric/60"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric-300">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin Dashboard</p>
              <p className="text-xs text-smoke">Manage orders, products, and site content.</p>
            </div>
          </div>
          <ArrowRight size={16} className="shrink-0 text-electric-300 transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card group p-5 transition-colors hover:border-electric/40">
            <div className="flex items-center justify-between">
              <s.icon size={20} className="text-electric" />
              <ArrowRight size={16} className="text-smoke-dark transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-smoke">{s.label}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-electric-300 hover:text-electric">View all</Link>
        </div>

        {orders.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 p-10 text-center">
            <Package size={28} className="text-smoke" />
            <p className="text-sm text-smoke">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.orderNumber}`} className="card flex items-center justify-between gap-4 p-4 transition-colors hover:border-electric/40">
                  <div>
                    <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                    <p className="text-xs text-smoke">{formatDate(order.createdAt)} · {order.items.length} items</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">{formatMAD(order.totalCents)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

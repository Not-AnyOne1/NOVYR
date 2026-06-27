import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, Package } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { formatMAD, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/account/StatusBadge';
import { SalesChart } from '@/components/admin/SalesChart';

const PAID: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

export default async function AdminDashboard() {
  const now = new Date();
  const since30 = new Date(now.getTime() - 30 * 86_400_000);
  const since14 = new Date(now.getTime() - 13 * 86_400_000);
  since14.setHours(0, 0, 0, 0);

  const [revenueAgg, revenue30Agg, orders30Count, ordersCount, pendingCount, customersCount, recentOrders, lowStock, last14, topItems] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: { in: PAID } } }),
      prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: { in: PAID }, createdAt: { gte: since30 } } }),
      prisma.order.count({ where: { status: { in: PAID }, createdAt: { gte: since30 } } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { items: { select: { id: true } } } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        orderBy: { stock: 'asc' },
        take: 8,
        include: { product: { select: { name: true, slug: true } } },
      }),
      prisma.order.findMany({ where: { createdAt: { gte: since14 }, status: { in: PAID } }, select: { createdAt: true, totalCents: true } }),
      prisma.orderItem.groupBy({ by: ['productName'], _sum: { quantity: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 5 }),
    ]);

  const totalRevenue = revenueAgg._sum?.totalCents ?? 0;
  const revenue30 = revenue30Agg._sum?.totalCents ?? 0;
  const orders30 = orders30Count;
  const aov = orders30 > 0 ? Math.round(revenue30 / orders30) : 0;

  // Bucket last 14 days
  const buckets = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since14.getTime() + i * 86_400_000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of last14) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + o.totalCents);
  }
  const chartData = Array.from(buckets.entries()).map(([date, value]) => ({
    label: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    value,
  }));

  const kpis = [
    { label: 'Total revenue', value: formatMAD(totalRevenue), icon: DollarSign, sub: 'All confirmed orders' },
    { label: 'Revenue (30d)', value: formatMAD(revenue30), icon: TrendingUp, sub: `${orders30} orders` },
    { label: 'Avg order value', value: formatMAD(aov), icon: ShoppingCart, sub: 'Last 30 days' },
    { label: 'Customers', value: customersCount.toString(), icon: Users, sub: `${pendingCount} pending · ${ordersCount} total orders` },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-smoke">Your store at a glance.</p>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-smoke">{k.label}</span>
              <k.icon size={18} className="text-electric" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-white">{k.value}</p>
            <p className="mt-1 text-xs text-smoke-dark">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Sales chart */}
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Revenue · last 14 days</h2>
          </div>
          <SalesChart data={chartData} />
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Top products</h2>
          {topItems.length === 0 ? (
            <p className="text-sm text-smoke">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {topItems.map((t, i) => (
                <li key={t.productName} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-700 text-xs font-bold text-smoke-light">{i + 1}</span>
                  <span className="flex-1 truncate text-sm text-white">{t.productName}</span>
                  <span className="text-sm font-semibold text-electric-300">{t._sum.quantity ?? 0} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent orders */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-electric-300 hover:text-electric">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-smoke">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-charcoal-border">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
                    <div>
                      <p className="text-sm font-medium text-white">{o.orderNumber}</p>
                      <p className="text-xs text-smoke">{o.customerName} · {formatDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{formatMAD(o.totalCents)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white">
            <AlertTriangle size={15} className="text-amber-400" /> Low stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-smoke"><Package size={15} /> Everything is well stocked.</p>
          ) : (
            <ul className="space-y-2.5">
              {lowStock.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-smoke-light">{v.product.name} · {v.size}</span>
                  <span className={`shrink-0 font-semibold ${v.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`}>{v.stock} left</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inventory" className="mt-4 inline-block text-sm text-electric-300 hover:text-electric">Manage inventory →</Link>
        </div>
      </div>
    </div>
  );
}

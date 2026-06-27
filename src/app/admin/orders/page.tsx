import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { formatMAD, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_LABEL } from '@/lib/constants';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = status && FILTERS.includes(status) ? status : 'ALL';

  const orders = await prisma.order.findMany({
    where: active === 'ALL' ? {} : { status: active as never },
    orderBy: { createdAt: 'desc' },
    include: { items: { select: { id: true } } },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Orders</h1>
        <p className="mt-1 text-sm text-smoke">{orders.length} orders</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === 'ALL' ? '/admin/orders' : `/admin/orders?status=${f}`}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              active === f ? 'border-electric bg-electric/10 text-electric-300' : 'border-charcoal-border text-smoke-light hover:text-white'
            )}
          >
            {f === 'ALL' ? 'All' : ORDER_STATUS_LABEL[f]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center text-sm text-smoke">No orders in this view.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wider text-smoke">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-white hover:text-electric-300">{o.orderNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-smoke-light">
                      <div>{o.customerName}</div>
                      <div className="text-xs text-smoke-dark">{o.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-smoke">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-smoke">{o.items.length}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatMAD(o.totalCents)}</td>
                    <td className="px-4 py-3"><OrderStatusSelect orderId={o.id} current={o.status} /></td>
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

import Link from 'next/link';
import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { formatMAD, formatDate } from '@/lib/utils';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { PaymentStatusSelect } from '@/components/admin/PaymentStatusSelect';
import { OrdersToolbar } from '@/components/admin/OrdersToolbar';
import { ExportOrdersButton, type ExportOrderRow } from '@/components/admin/ExportOrdersButton';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; pay?: string; from?: string; to?: string }>;
}) {
  const { q, status, pay, from, to } = await searchParams;

  const where: Prisma.OrderWhereInput = {};
  if (status && ORDER_STATUSES.includes(status)) where.status = status as never;
  if (pay && PAYMENT_STATUSES.includes(pay)) where.paymentStatus = pay as never;
  if (from || to) {
    where.createdAt = {};
    if (from && !Number.isNaN(Date.parse(from))) where.createdAt.gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999); // inclusive end of day
      where.createdAt.lte = end;
    }
  }
  if (q?.trim()) {
    const term = q.trim();
    where.OR = [
      { orderNumber: { contains: term, mode: 'insensitive' } },
      { customerName: { contains: term, mode: 'insensitive' } },
      { customerPhone: { contains: term } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { items: { select: { productName: true, size: true, quantity: true } } },
    take: 200,
  });

  const exportRows: ExportOrderRow[] = orders.map((o) => ({
    orderId: o.orderNumber,
    date: formatDate(o.createdAt),
    customer: o.customerName,
    phone: o.customerPhone,
    products: o.items.map((i) => `${i.productName} (${i.size}) ×${i.quantity}`).join('; '),
    qty: o.items.reduce((n, i) => n + i.quantity, 0),
    total: formatMAD(o.totalCents),
    paymentMethod: o.paymentMethod === 'COD' ? 'Cash on Delivery' : o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.status,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Orders</h1>
          <p className="mt-1 text-sm text-smoke">{orders.length} orders in this view</p>
        </div>
        <ExportOrdersButton rows={exportRows} />
      </header>

      <OrdersToolbar />

      {orders.length === 0 ? (
        <div className="card p-12 text-center text-sm text-smoke">No orders match this view.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wider text-smoke">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Payment Status</th>
                  <th className="px-4 py-3 font-medium">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-white hover:text-electric-300">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-smoke">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-smoke-light">
                      <div>{o.customerName}</div>
                      <div className="text-xs text-smoke-dark">{o.customerPhone}</div>
                    </td>
                    <td className="max-w-[260px] px-4 py-3 text-smoke-light">
                      <span className="line-clamp-2 text-xs">
                        {o.items.map((i) => `${i.productName} (${i.size}) ×${i.quantity}`).join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-smoke">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatMAD(o.totalCents)}</td>
                    <td className="px-4 py-3 text-xs text-smoke-light">COD</td>
                    <td className="px-4 py-3"><PaymentStatusSelect orderId={o.id} current={o.paymentStatus} /></td>
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

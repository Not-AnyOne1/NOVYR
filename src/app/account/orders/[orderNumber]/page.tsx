import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Banknote } from 'lucide-react';

import { auth } from '@/auth';
import { getUserOrderByNumber } from '@/lib/queries';
import { formatMAD, formatDateTime } from '@/lib/utils';
import { OrderStatusTimeline } from '@/components/account/OrderStatusTimeline';
import { StatusBadge } from '@/components/account/StatusBadge';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await auth();
  const order = await getUserOrderByNumber(session!.user.id, orderNumber);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-smoke-light hover:text-white">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{order.orderNumber}</h2>
          <p className="text-xs text-smoke">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="card p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Tracking</h3>
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Items</h3>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <Link href={item.productSlug ? `/product/${item.productSlug}` : '#'} className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                {item.image && <Image src={item.image} alt={item.productName} fill sizes="56px" className="object-cover" />}
              </Link>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.productName}</p>
                <p className="text-xs text-smoke">Size {item.size} · Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-white">{formatMAD(item.unitCents * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 border-t border-charcoal-border pt-5 text-sm">
          <div className="flex justify-between"><span className="text-smoke">Subtotal</span><span className="text-white">{formatMAD(order.subtotalCents)}</span></div>
          {order.discountCents > 0 && <div className="flex justify-between"><span className="text-smoke">Discount {order.discountCode ? `(${order.discountCode})` : ''}</span><span className="text-electric-300">−{formatMAD(order.discountCents)}</span></div>}
          <div className="flex justify-between"><span className="text-smoke">Delivery</span><span className="text-electric-300">Free</span></div>
          <div className="flex justify-between border-t border-charcoal-border pt-3"><span className="text-smoke">Total</span><span className="font-display text-xl font-bold text-white">{formatMAD(order.totalCents)}</span></div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke"><MapPin size={14} /> Delivery address</p>
          <p className="text-sm font-medium text-white">{order.customerName}</p>
          <p className="text-sm text-smoke-light">{order.shippingAddress}</p>
          <p className="text-sm text-smoke-light">{order.shippingCity}{order.shippingRegion ? `, ${order.shippingRegion}` : ''}</p>
          <p className="text-sm text-smoke-light">{order.customerPhone}</p>
        </div>
        <div className="card p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke"><Banknote size={14} /> Payment</p>
          <p className="text-sm font-medium text-white">Cash on Delivery</p>
          <p className="text-sm text-smoke-light">{formatMAD(order.totalCents)} payable on delivery.</p>
          {order.shippingNote && <p className="mt-2 text-xs text-smoke">Note: {order.shippingNote}</p>}
        </div>
      </div>
    </div>
  );
}

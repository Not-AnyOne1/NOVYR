import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Mail, StickyNote } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { formatMAD, formatDateTime } from '@/lib/utils';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { OrderStatusTimeline } from '@/components/account/OrderStatusTimeline';

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-smoke-light hover:text-white">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{order.orderNumber}</h1>
          <p className="text-xs text-smoke">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-smoke">Update status</span>
          <OrderStatusSelect orderId={order.id} current={order.status} />
        </div>
      </div>

      <div className="card p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Items</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                  {item.image && <Image src={item.image} alt={item.productName} fill sizes="56px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.productName}</p>
                  <p className="text-xs text-smoke">Size {item.size} · Qty {item.quantity} · {formatMAD(item.unitCents)} each</p>
                </div>
                <span className="text-sm font-semibold text-white">{formatMAD(item.unitCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-charcoal-border pt-5 text-sm">
            <div className="flex justify-between"><span className="text-smoke">Subtotal</span><span className="text-white">{formatMAD(order.subtotalCents)}</span></div>
            {order.discountCents > 0 && <div className="flex justify-between"><span className="text-smoke">Discount {order.discountCode ? `(${order.discountCode})` : ''}</span><span className="text-electric-300">−{formatMAD(order.discountCents)}</span></div>}
            <div className="flex justify-between"><span className="text-smoke">Delivery</span><span className="text-electric-300">Free</span></div>
            <div className="flex justify-between border-t border-charcoal-border pt-3"><span className="text-smoke">Total (COD)</span><span className="font-display text-xl font-bold text-white">{formatMAD(order.totalCents)}</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white">Customer</h2>
            <p className="text-sm font-medium text-white">{order.customerName}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-smoke-light"><Phone size={14} /> {order.customerPhone}</p>
            {order.customerEmail && <p className="flex items-center gap-2 text-sm text-smoke-light"><Mail size={14} /> {order.customerEmail}</p>}
          </div>
          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white"><MapPin size={14} /> Shipping</h2>
            <p className="text-sm text-smoke-light">{order.shippingAddress}</p>
            <p className="text-sm text-smoke-light">{order.shippingCity}{order.shippingRegion ? `, ${order.shippingRegion}` : ''}</p>
          </div>
          {order.shippingNote && (
            <div className="card p-5">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white"><StickyNote size={14} /> Note</h2>
              <p className="text-sm text-smoke-light">{order.shippingNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

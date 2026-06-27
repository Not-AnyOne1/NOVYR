import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Package, MapPin, Banknote } from 'lucide-react';

import { getOrderByNumber } from '@/lib/queries';
import { formatMAD } from '@/lib/utils';
import { ORDER_STATUS_LABEL } from '@/lib/constants';
import { OrderStatusTimeline } from '@/components/account/OrderStatusTimeline';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber).catch(() => null) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-electric/15 text-electric">
          <CheckCircle2 size={34} />
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white">Order Confirmed</h1>
        <p className="mt-3 max-w-md text-sm text-smoke">
          Thank you for your order. We&apos;ve received it and will call to confirm your delivery shortly. Pay cash when it arrives.
        </p>
        {order && (
          <p className="mt-4 rounded-full border border-charcoal-border px-4 py-1.5 text-sm text-white">
            Order <span className="font-semibold text-electric-300">{order.orderNumber}</span>
          </p>
        )}
      </div>

      {order ? (
        <div className="mt-10 space-y-6">
          <div className="card p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Status</h2>
            <OrderStatusTimeline status={order.status} />
          </div>

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
                    <p className="text-xs text-smoke">Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-white">{formatMAD(item.unitCents * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-charcoal-border pt-5 text-sm">
              <Row label="Subtotal" value={formatMAD(order.subtotalCents)} />
              {order.discountCents > 0 && <Row label="Discount" value={`−${formatMAD(order.discountCents)}`} accent />}
              <Row label="Delivery" value="Free" accent />
              <div className="flex items-center justify-between border-t border-charcoal-border pt-3">
                <span className="text-smoke">Total (COD)</span>
                <span className="font-display text-xl font-bold text-white">{formatMAD(order.totalCents)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke"><MapPin size={14} /> Delivery to</p>
              <p className="text-sm font-medium text-white">{order.customerName}</p>
              <p className="text-sm text-smoke-light">{order.shippingAddress}</p>
              <p className="text-sm text-smoke-light">{order.shippingCity}{order.shippingRegion ? `, ${order.shippingRegion}` : ''}</p>
              <p className="text-sm text-smoke-light">{order.customerPhone}</p>
            </div>
            <div className="card p-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke"><Banknote size={14} /> Payment</p>
              <p className="text-sm font-medium text-white">Cash on Delivery</p>
              <p className="text-sm text-smoke-light">Pay {formatMAD(order.totalCents)} when your order arrives.</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-electric-300"><Package size={13} /> {ORDER_STATUS_LABEL[order.status]}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 card p-8 text-center">
          <p className="text-sm text-smoke">Your order has been placed. A confirmation will follow shortly.</p>
        </div>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        <Link href="/account/orders" className="btn-secondary">Track My Orders</Link>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-smoke">{label}</span>
      <span className={accent ? 'font-medium text-electric-300' : 'text-white'}>{value}</span>
    </div>
  );
}

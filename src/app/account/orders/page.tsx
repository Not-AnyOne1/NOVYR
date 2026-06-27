import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight } from 'lucide-react';

import { auth } from '@/auth';
import { getUserOrders } from '@/lib/queries';
import { formatMAD, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/account/StatusBadge';

export default async function OrdersPage() {
  const session = await auth();
  const orders = await getUserOrders(session!.user.id);

  if (orders.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <Package size={30} className="text-smoke" />
        <h2 className="text-lg font-semibold text-white">No orders yet</h2>
        <p className="max-w-sm text-sm text-smoke">When you place an order, it will appear here with live tracking.</p>
        <Link href="/shop" className="btn-primary">Shop The Drop</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Order history</h2>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.orderNumber}`}
          className="card block p-5 transition-colors hover:border-electric/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
              <p className="text-xs text-smoke">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <ChevronRight size={18} className="text-smoke-dark" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-3">
              {order.items.slice(0, 4).map((item) => (
                <div key={item.id} className="relative h-12 w-10 overflow-hidden rounded-lg border-2 border-ink-900 bg-ink-800">
                  {item.image && <Image src={item.image} alt={item.productName} fill sizes="40px" className="object-cover" />}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="grid h-12 w-10 place-items-center rounded-lg border-2 border-ink-900 bg-ink-700 text-xs font-medium text-smoke">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-white">{formatMAD(order.totalCents)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

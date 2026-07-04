'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from '@/lib/constants';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

/** Search + filter bar for the admin orders table. State lives in the URL so the server component queries match. */
export function OrdersToolbar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  function apply(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(`/admin/orders?${next.toString()}`);
  }

  const hasFilters = ['q', 'status', 'pay', 'from', 'to'].some((k) => params.get(k));

  return (
    <div className="card flex flex-wrap items-end gap-3 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: q.trim() });
        }}
        className="min-w-[220px] flex-1"
      >
        <label className="mb-1 block text-[11px] uppercase tracking-wider text-smoke-dark">Search</label>
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke-dark" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order ID, customer name, or phone…"
            className="w-full rounded-lg border border-charcoal-border bg-ink-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-smoke-dark focus:border-electric focus:outline-none"
          />
        </div>
      </form>

      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wider text-smoke-dark">From</label>
        <input
          type="date"
          defaultValue={params.get('from') ?? ''}
          onChange={(e) => apply({ from: e.target.value })}
          className="rounded-lg border border-charcoal-border bg-ink-800 px-3 py-2 text-sm text-white focus:border-electric focus:outline-none [color-scheme:dark]"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wider text-smoke-dark">To</label>
        <input
          type="date"
          defaultValue={params.get('to') ?? ''}
          onChange={(e) => apply({ to: e.target.value })}
          className="rounded-lg border border-charcoal-border bg-ink-800 px-3 py-2 text-sm text-white focus:border-electric focus:outline-none [color-scheme:dark]"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wider text-smoke-dark">Order status</label>
        <select
          defaultValue={params.get('status') ?? ''}
          onChange={(e) => apply({ status: e.target.value })}
          className="rounded-lg border border-charcoal-border bg-ink-800 px-3 py-2 text-sm text-white focus:border-electric focus:outline-none"
        >
          <option value="">All</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wider text-smoke-dark">Payment</label>
        <select
          defaultValue={params.get('pay') ?? ''}
          onChange={(e) => apply({ pay: e.target.value })}
          className="rounded-lg border border-charcoal-border bg-ink-800 px-3 py-2 text-sm text-white focus:border-electric focus:outline-none"
        >
          <option value="">All</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{PAYMENT_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setQ('');
            router.push('/admin/orders');
          }}
          className="flex items-center gap-1.5 rounded-lg border border-charcoal-border px-3 py-2 text-xs text-smoke-light transition-colors hover:text-white"
        >
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}

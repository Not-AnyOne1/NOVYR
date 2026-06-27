'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ORDER_STATUS_LABEL } from '@/lib/constants';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Order marked ${ORDER_STATUS_LABEL[next]}`);
      router.refresh();
    } catch {
      setStatus(prev);
      toast.error('Could not update status');
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => change(e.target.value)}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      className="rounded-lg border border-charcoal-border bg-ink-800 px-3 py-1.5 text-xs font-medium text-white focus:border-electric focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-ink-800">{ORDER_STATUS_LABEL[s]}</option>
      ))}
    </select>
  );
}

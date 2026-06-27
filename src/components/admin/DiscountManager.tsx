'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Check, X } from 'lucide-react';
import { formatMAD, toCents } from '@/lib/utils';
import { DeleteButton } from '@/components/admin/DeleteButton';

type Discount = {
  id: string;
  code: string;
  description: string | null;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minSubtotalCents: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
};

const TYPE_LABEL = { PERCENTAGE: '% off', FIXED: 'Fixed (DH)', FREE_SHIPPING: 'Free shipping' } as const;

export function DiscountManager({ initial }: { initial: Discount[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE' as Discount['type'],
    value: '',
    minMad: '',
    maxUses: '',
  });

  async function save() {
    if (!form.code.trim()) return toast.error('Code is required');
    setSaving(true);
    try {
      const value =
        form.type === 'FIXED' ? toCents(form.value) : form.type === 'PERCENTAGE' ? parseInt(form.value || '0', 10) : 0;
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          description: form.description || null,
          type: form.type,
          value,
          minSubtotalCents: form.minMad ? toCents(form.minMad) : 0,
          maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
          active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success('Discount created');
      setOpen(false);
      setForm({ code: '', description: '', type: 'PERCENTAGE', value: '', minMad: '', maxUses: '' });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(d: Discount) {
    await fetch(`/api/admin/discounts/${d.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !d.active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Discount codes</h2>
        {!open && <button onClick={() => setOpen(true)} className="btn-secondary px-4 py-2 text-xs"><Plus size={14} /> New code</button>}
      </div>

      {open && (
        <div className="card grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <label className="label">Code</label>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="input uppercase" placeholder="WELCOME10" />
          </div>
          <div>
            <label className="label">Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Discount['type'] }))} className="input">
              <option value="PERCENTAGE" className="bg-ink-800">Percentage</option>
              <option value="FIXED" className="bg-ink-800">Fixed amount</option>
              <option value="FREE_SHIPPING" className="bg-ink-800">Free shipping</option>
            </select>
          </div>
          {form.type !== 'FREE_SHIPPING' && (
            <div>
              <label className="label">{form.type === 'PERCENTAGE' ? 'Percent (0–100)' : 'Amount (DH)'}</label>
              <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="input" inputMode="numeric" />
            </div>
          )}
          <div>
            <label className="label">Min. spend (DH)</label>
            <input value={form.minMad} onChange={(e) => setForm((f) => ({ ...f, minMad: e.target.value }))} className="input" inputMode="numeric" placeholder="0" />
          </div>
          <div>
            <label className="label">Max uses</label>
            <input value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} className="input" inputMode="numeric" placeholder="Unlimited" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" placeholder="10% off first order" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button onClick={save} disabled={saving} className="btn-primary px-5 py-2.5 text-xs"><Check size={14} /> Create</button>
            <button onClick={() => setOpen(false)} className="btn-ghost text-xs"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-charcoal-border">
        {initial.length === 0 ? (
          <p className="p-6 text-sm text-smoke">No discount codes yet.</p>
        ) : (
          initial.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-mono text-sm font-semibold text-white">{d.code}</p>
                <p className="text-xs text-smoke-dark">
                  {TYPE_LABEL[d.type]}
                  {d.type === 'PERCENTAGE' && ` · ${d.value}%`}
                  {d.type === 'FIXED' && ` · ${formatMAD(d.value)}`}
                  {d.minSubtotalCents > 0 && ` · min ${formatMAD(d.minSubtotalCents)}`}
                  {` · used ${d.usedCount}${d.maxUses ? `/${d.maxUses}` : ''}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(d)} className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${d.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-600 text-smoke'}`}>
                  {d.active ? 'Active' : 'Inactive'}
                </button>
                <DeleteButton endpoint={`/api/admin/discounts/${d.id}`} confirmText={`Delete code ${d.code}?`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Row = {
  id: string;
  size: string;
  stock: number;
  productName: string;
};

export function InventoryEditor({ rows }: { rows: Row[] }) {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(rows.map((r) => [r.id, r.stock]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function save(id: string) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/variants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: stocks[id] ?? 0 }),
      });
      if (!res.ok) throw new Error();
      setSavedId(id);
      setTimeout(() => setSavedId((c) => (c === id ? null : c)), 1500);
    } catch {
      toast.error('Could not update stock');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wider text-smoke">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-border">
            {rows.map((r) => {
              const value = stocks[r.id] ?? 0;
              const dirty = value !== r.stock;
              return (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-white">{r.productName}</td>
                  <td className="px-4 py-2.5 text-smoke-light">{r.size}</td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => setStocks((s) => ({ ...s, [r.id]: Math.max(0, parseInt(e.target.value || '0', 10) || 0) }))}
                      className={cn(
                        'input max-w-[110px] py-1.5',
                        value === 0 && 'border-rose-500/40',
                        value > 0 && value <= 5 && 'border-amber-500/40'
                      )}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => save(r.id)}
                      disabled={!dirty || savingId === r.id}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        savedId === r.id ? 'text-emerald-300' : dirty ? 'bg-electric text-white hover:bg-electric-600' : 'text-smoke-dark'
                      )}
                    >
                      {savedId === r.id ? <Check size={14} className="inline" /> : savingId === r.id ? '…' : 'Save'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

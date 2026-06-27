'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  active: boolean;
  productCount: number;
};

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', order: 0 });
  const [saving, setSaving] = useState(false);

  function startNew() {
    setForm({ name: '', slug: '', description: '', order: initial.length });
    setEditing('new');
  }
  function startEdit(c: Category) {
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', order: c.order });
    setEditing(c.id);
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const isNew = editing === 'new';
      const res = await fetch(isNew ? '/api/admin/categories' : `/api/admin/categories/${editing}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success('Saved');
      setEditing(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Categories</h2>
        {editing === null && <button onClick={startNew} className="btn-secondary px-4 py-2 text-xs"><Plus size={14} /> New category</button>}
      </div>

      {editing !== null && (
        <div className="card grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input" placeholder="auto from name" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button onClick={save} disabled={saving} className="btn-primary px-5 py-2.5 text-xs"><Check size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="btn-ghost text-xs"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-charcoal-border">
        {initial.length === 0 ? (
          <p className="p-6 text-sm text-smoke">No categories yet.</p>
        ) : (
          initial.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-xs text-smoke-dark">/{c.slug} · {c.productCount} products</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-electric-300 hover:bg-electric/10"><Pencil size={13} /> Edit</button>
                <DeleteButton endpoint={`/api/admin/categories/${c.id}`} confirmText={`Delete "${c.name}"?`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

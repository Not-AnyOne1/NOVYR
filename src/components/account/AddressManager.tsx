'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { MOROCCO_CITIES } from '@/lib/constants';

type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  region: string | null;
  postalCode: string | null;
  isDefault: boolean;
};

const empty = {
  label: 'Home',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  postalCode: '',
  isDefault: false,
};

export function AddressManager({ initial }: { initial: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initial);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setForm(empty);
    setEditing('new');
  }
  function startEdit(a: Address) {
    setForm({
      label: a.label ?? 'Home',
      fullName: a.fullName,
      phone: a.phone,
      address: a.address,
      city: a.city,
      region: a.region ?? '',
      postalCode: a.postalCode ?? '',
      isDefault: a.isDefault,
    });
    setEditing(a.id);
  }

  async function save() {
    setSaving(true);
    try {
      const isNew = editing === 'new';
      const res = await fetch(isNew ? '/api/account/addresses' : `/api/account/addresses/${editing}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');

      if (isNew) setAddresses((prev) => mergeDefault([...prev, data.address], data.address));
      else setAddresses((prev) => mergeDefault(prev.map((a) => (a.id === editing ? data.address : a)), data.address));

      setEditing(null);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address removed');
    } else {
      toast.error('Could not remove address');
    }
  }

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === 'isDefault' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Saved addresses</h2>
        {editing === null && (
          <button onClick={startNew} className="btn-secondary px-4 py-2 text-xs">
            <Plus size={15} /> Add address
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Label" value={form.label} onChange={set('label')} placeholder="Home, Work…" />
            <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Recipient name" />
            <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="0612345678" />
            <div>
              <label className="label">City</label>
              <select value={form.city} onChange={set('city')} className="input">
                <option value="">Select city</option>
                {MOROCCO_CITIES.map((c) => <option key={c} value={c} className="bg-ink-800">{c}</option>)}
              </select>
            </div>
            <Input label="Address" value={form.address} onChange={set('address')} placeholder="Street, building, apt" className="sm:col-span-2" />
            <Input label="Region" value={form.region} onChange={set('region')} placeholder="Optional" />
            <Input label="Postal code" value={form.postalCode} onChange={set('postalCode')} placeholder="Optional" />
          </div>
          <label className="flex items-center gap-2 text-sm text-smoke-light">
            <input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} className="rounded border-charcoal-border bg-ink-800 text-electric focus:ring-electric" />
            Set as default address
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary px-5 py-2.5 text-xs">
              <Check size={15} /> {saving ? 'Saving…' : 'Save address'}
            </button>
            <button onClick={() => setEditing(null)} className="btn-ghost text-xs"><X size={15} /> Cancel</button>
          </div>
        </div>
      )}

      {addresses.length === 0 && editing === null ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <MapPin size={26} className="text-smoke" />
          <p className="text-sm text-smoke">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{a.label}</span>
                  {a.isDefault && <span className="rounded-full bg-electric/15 px-2 py-0.5 text-[10px] font-bold uppercase text-electric-300">Default</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(a)} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => remove(a.id)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-rose-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-smoke-light">{a.fullName}</p>
              <p className="text-sm text-smoke-light">{a.address}</p>
              <p className="text-sm text-smoke-light">{a.city}{a.region ? `, ${a.region}` : ''}</p>
              <p className="text-sm text-smoke-light">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function mergeDefault(list: Address[], saved: Address): Address[] {
  if (!saved.isDefault) return list;
  return list.map((a) => (a.id === saved.id ? a : { ...a, isDefault: false }));
}

function Input({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

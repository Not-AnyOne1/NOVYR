'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, Save } from 'lucide-react';

import { SIZES } from '@/lib/constants';
import { slugify, toCents } from '@/lib/utils';

type Option = { id: string; name: string };

export type ProductFormInitial = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMad: string;
  compareMad: string;
  sku: string;
  gsm: string;
  material: string;
  fit: string;
  careInfo: string;
  categoryId: string;
  collectionIds: string[];
  active: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimited: boolean;
  metaTitle: string;
  metaDescription: string;
  images: string[];
  variants: Record<string, { include: boolean; stock: string }>;
};

const blank = (): ProductFormInitial => ({
  id: '',
  name: '',
  slug: '',
  description: '',
  priceMad: '',
  compareMad: '',
  sku: '',
  gsm: '240',
  material: '100% Heavyweight Combed Cotton',
  fit: 'Oversized',
  careInfo: 'Machine wash cold, inside out. Do not bleach. Tumble dry low.',
  categoryId: '',
  collectionIds: [],
  active: true,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: true,
  isLimited: false,
  metaTitle: '',
  metaDescription: '',
  images: [''],
  variants: Object.fromEntries(SIZES.map((s) => [s, { include: true, stock: '0' }])),
});

export function ProductForm({
  categories,
  collections,
  initial,
}: {
  categories: Option[];
  collections: Option[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<ProductFormInitial>(initial ?? blank());
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProductFormInitial>(k: K, v: ProductFormInitial[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function toggleCollection(id: string) {
    setForm((f) => ({
      ...f,
      collectionIds: f.collectionIds.includes(id)
        ? f.collectionIds.filter((c) => c !== id)
        : [...f.collectionIds, id],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const priceCents = toCents(form.priceMad);
    if (!form.name || priceCents <= 0) {
      toast.error('Name and a valid price are required');
      return;
    }
    const images = form.images.map((u) => u.trim()).filter(Boolean).map((url) => ({ url, alt: form.name }));
    const variants = SIZES.filter((s) => form.variants[s]?.include).map((s) => ({
      size: s,
      stock: Math.max(0, parseInt(form.variants[s]!.stock || '0', 10) || 0),
    }));

    const payload = {
      name: form.name,
      slug: slugify(form.slug || form.name),
      description: form.description,
      priceCents,
      compareAtCents: form.compareMad ? toCents(form.compareMad) : null,
      sku: form.sku || null,
      gsm: form.gsm ? parseInt(form.gsm, 10) : null,
      material: form.material || null,
      fit: form.fit || null,
      careInfo: form.careInfo || null,
      categoryId: form.categoryId || null,
      collectionIds: form.collectionIds,
      active: form.active,
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
      isLimited: form.isLimited,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      images,
      variants,
    };

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${form.id}` : '/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      toast.success(isEdit ? 'Product updated' : 'Product created');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Main */}
        <div className="space-y-5">
          <div className="card space-y-4 p-6">
            <Field label="Product name">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input" required placeholder="Eclipse Oversized Tee" />
            </Field>
            <Field label="Slug (URL)">
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="input" placeholder="auto-generated from name" />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="input min-h-[120px] resize-y" required placeholder="Product description…" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (DH)">
                <input value={form.priceMad} onChange={(e) => set('priceMad', e.target.value)} className="input" inputMode="decimal" placeholder="299" required />
              </Field>
              <Field label="Compare-at (DH)">
                <input value={form.compareMad} onChange={(e) => set('compareMad', e.target.value)} className="input" inputMode="decimal" placeholder="399" />
              </Field>
            </div>
          </div>

          {/* Images */}
          <div className="card space-y-3 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Images</h3>
              <button type="button" onClick={() => set('images', [...form.images, ''])} className="btn-secondary px-3 py-1.5 text-xs">
                <Plus size={14} /> Add
              </button>
            </div>
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                  {url && <Image src={url} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <input
                  value={url}
                  onChange={(e) => set('images', form.images.map((u, idx) => (idx === i ? e.target.value : u)))}
                  className="input flex-1"
                  placeholder="https://image-url.jpg"
                />
                <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))} className="text-smoke hover:text-rose-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <p className="text-xs text-smoke-dark">Paste image URLs (Unsplash, Cloudinary, etc.). First image is the main image.</p>
          </div>

          {/* Variants / stock */}
          <div className="card space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Sizes & stock</h3>
            <div className="grid gap-2">
              {SIZES.map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <label className="flex w-20 items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={form.variants[s]?.include ?? false}
                      onChange={(e) => set('variants', { ...form.variants, [s]: { ...form.variants[s]!, include: e.target.checked } })}
                      className="rounded border-charcoal-border bg-ink-800 text-electric focus:ring-electric"
                    />
                    {s}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.variants[s]?.stock ?? '0'}
                    onChange={(e) => set('variants', { ...form.variants, [s]: { ...form.variants[s]!, stock: e.target.value } })}
                    disabled={!form.variants[s]?.include}
                    className="input max-w-[120px] disabled:opacity-40"
                    placeholder="Stock"
                  />
                  <span className="text-xs text-smoke-dark">units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card space-y-4 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Status</h3>
            {([
              ['active', 'Active (visible in store)'],
              ['isFeatured', 'Featured'],
              ['isBestSeller', 'Best seller'],
              ['isNewArrival', 'New arrival'],
              ['isLimited', 'Limited edition'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-smoke-light">
                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="rounded border-charcoal-border bg-ink-800 text-electric focus:ring-electric" />
                {label}
              </label>
            ))}
          </div>

          <div className="card space-y-4 p-6">
            <Field label="Category">
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="input">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-ink-800">{c.name}</option>)}
              </select>
            </Field>
            <div>
              <label className="label">Collections</label>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCollection(c.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${form.collectionIds.includes(c.id) ? 'border-electric bg-electric/10 text-electric-300' : 'border-charcoal-border text-smoke-light hover:text-white'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card space-y-4 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Specs & SEO</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GSM"><input value={form.gsm} onChange={(e) => set('gsm', e.target.value)} className="input" inputMode="numeric" /></Field>
              <Field label="Fit"><input value={form.fit} onChange={(e) => set('fit', e.target.value)} className="input" /></Field>
            </div>
            <Field label="Material"><input value={form.material} onChange={(e) => set('material', e.target.value)} className="input" /></Field>
            <Field label="SKU"><input value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input" placeholder="NVR-1234" /></Field>
            <Field label="Care info"><textarea value={form.careInfo} onChange={(e) => set('careInfo', e.target.value)} className="input min-h-[64px] resize-y" /></Field>
            <Field label="Meta title"><input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} className="input" /></Field>
            <Field label="Meta description"><textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} className="input min-h-[64px] resize-y" /></Field>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-charcoal-border bg-ink/90 py-4 backdrop-blur">
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={18} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

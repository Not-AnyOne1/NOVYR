'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Bookmark, ArrowRight, Tag, ShoppingBag, Check } from 'lucide-react';

import { useCartStore, cartSubtotalCents } from '@/store/cart';
import { formatMAD } from '@/lib/utils';
import { trackBeginCheckout } from '@/lib/analytics';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CartUpsell } from '@/components/cart/CartUpsell';

export default function CartPage() {
  const router = useRouter();
  const { items, saved, updateQty, removeItem, saveForLater, moveToCart, removeSaved } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<{ cents: number; freeShipping: boolean; code: string } | null>(null);
  const [codeMsg, setCodeMsg] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-20" />;

  const subtotal = cartSubtotalCents(items);
  const discountCents = discount?.cents ?? 0;
  const total = Math.max(0, subtotal - discountCents);

  async function applyCode() {
    if (!code.trim()) return;
    setApplying(true);
    setCodeMsg('');
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotalCents: subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDiscount(null);
        setCodeMsg(data.message ?? 'Invalid code');
      } else {
        setDiscount({ cents: data.discountCents, freeShipping: data.freeShipping, code: data.code });
        setCodeMsg(data.message ?? 'Applied');
      }
    } catch {
      setCodeMsg('Could not validate code');
    } finally {
      setApplying(false);
    }
  }

  function checkout() {
    trackBeginCheckout(
      items.map((i) => ({ id: i.productId, name: i.name, price: i.unitCents / 100, quantity: i.quantity })),
      total
    );
    const params = discount?.code ? `?code=${encodeURIComponent(discount.code)}` : '';
    router.push(`/checkout${params}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-ink-700">
          <ShoppingBag size={32} className="text-smoke" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white">Your cart is empty</h1>
        <p className="text-sm text-smoke">Looks like you haven&apos;t added anything yet. The drop is waiting.</p>
        <Link href="/shop" className="btn-primary">Shop The Drop</Link>
        {saved.length > 0 && <SavedList saved={saved} onMove={moveToCart} onRemove={removeSaved} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-white">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div>
          <ul className="divide-y divide-charcoal-border border-y border-charcoal-border">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-5">
                <Link href={`/product/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-800">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium text-white hover:text-electric-300">{item.name}</Link>
                      <p className="mt-0.5 text-xs text-smoke">Size {item.size}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-semibold text-white">{formatMAD(item.unitCents * item.quantity)}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <QuantityStepper value={item.quantity} max={item.maxStock} onChange={(q) => updateQty(item.key, q)} />
                    <div className="flex items-center gap-1">
                      <button onClick={() => saveForLater(item.key)} className="flex items-center gap-1 px-2 text-xs text-smoke hover:text-white">
                        <Bookmark size={14} /> Save
                      </button>
                      <button onClick={() => removeItem(item.key)} className="flex items-center gap-1 px-2 text-xs text-smoke hover:text-rose-400">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-smoke-light hover:text-white">
            ← Continue shopping
          </Link>

          {saved.length > 0 && <SavedList saved={saved} onMove={moveToCart} onRemove={removeSaved} className="mt-10" />}

          <CartUpsell excludeIds={items.map((i) => i.productId)} />
        </div>

        {/* Summary */}
        <div className="h-fit lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Order Summary</h2>

            {/* Discount */}
            <div className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke-dark" />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Discount code"
                    className="input pl-9 uppercase"
                  />
                </div>
                <button onClick={applyCode} disabled={applying} className="btn-secondary px-5">
                  {applying ? '…' : 'Apply'}
                </button>
              </div>
              {codeMsg && (
                <p className={`mt-2 flex items-center gap-1 text-xs ${discount ? 'text-electric-300' : 'text-rose-400'}`}>
                  {discount && <Check size={13} />} {codeMsg}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-2.5 border-t border-charcoal-border pt-5 text-sm">
              <Row label="Subtotal" value={formatMAD(subtotal)} />
              {discountCents > 0 && <Row label={`Discount (${discount?.code})`} value={`−${formatMAD(discountCents)}`} accent />}
              <Row label="Delivery" value="Free" accent />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-charcoal-border pt-4">
              <span className="text-sm text-smoke">Total</span>
              <span className="font-display text-2xl font-bold text-white">{formatMAD(total)}</span>
            </div>

            <button onClick={checkout} className="btn-primary mt-5 w-full">
              Checkout <ArrowRight size={18} />
            </button>
            <p className="mt-3 text-center text-xs text-smoke-dark">🚚 Free delivery · Cash on delivery · 14-day returns</p>
          </div>
        </div>
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

function SavedList({
  saved,
  onMove,
  onRemove,
  className,
}: {
  saved: ReturnType<typeof useCartStore.getState>['saved'];
  onMove: (k: string) => void;
  onRemove: (k: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-smoke-dark">Saved for later ({saved.length})</h3>
      <ul className="divide-y divide-charcoal-border border-y border-charcoal-border">
        {saved.map((item) => (
          <li key={item.key} className="flex items-center gap-3 py-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-800">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-smoke">Size {item.size} · {formatMAD(item.unitCents)}</p>
            </div>
            <button onClick={() => onMove(item.key)} className="text-xs font-medium text-electric-300 hover:text-electric">Move to cart</button>
            <button onClick={() => onRemove(item.key)} className="text-smoke hover:text-rose-400" aria-label="Remove"><Trash2 size={15} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

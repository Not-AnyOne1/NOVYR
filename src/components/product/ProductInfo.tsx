'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ShoppingBag, Zap, Truck, ShieldCheck, RefreshCw, Check } from 'lucide-react';

import type { ProductDetail } from '@/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { trackAddToCart, trackViewItem } from '@/lib/analytics';
import { Price } from '@/components/ui/Price';
import { StarRating } from '@/components/ui/StarRating';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductBadge } from '@/components/ui/ProductBadge';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { SizeGuide } from '@/components/product/SizeGuide';
import { CountdownTimer } from '@/components/cro/CountdownTimer';

const LOW_STOCK = 8;

export function ProductInfo({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      category: product.category?.name,
    });
  }, [product]);

  const selected = product.variants.find((v) => v.id === variantId) ?? null;
  const soldOut = product.totalStock <= 0;
  const lowStock = selected ? selected.stock > 0 && selected.stock <= LOW_STOCK : false;

  function add(): boolean {
    if (soldOut) return false;
    if (!selected) {
      toast.error('Please select a size');
      return false;
    }
    if (selected.stock <= 0) {
      toast.error('That size is sold out');
      return false;
    }
    addItem(
      {
        productId: product.id,
        variantId: selected.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        size: selected.size,
        unitCents: product.priceCents,
        maxStock: selected.stock,
      },
      qty
    );
    trackAddToCart({ id: product.id, name: product.name, priceCents: product.priceCents, quantity: qty, size: selected.size });
    return true;
  }

  function onAddToCart() {
    if (add()) toast.success(`Added ${product.name} (${selected!.size})`);
  }

  function onBuyNow() {
    if (add()) router.push('/checkout');
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-xs text-smoke-dark">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <span className="text-smoke-light">{product.category.name}</span>
          </>
        )}
      </nav>

      {/* Badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        {product.isLimited && <ProductBadge variant="limited" />}
        {product.isBestSeller && <ProductBadge variant="bestseller" />}
        {product.isNewArrival && <ProductBadge variant="new" />}
      </div>

      <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3">
        {product.reviewCount > 0 ? (
          <a href="#reviews" className="flex items-center gap-2 hover:opacity-80">
            <StarRating rating={product.rating} size={15} />
            <span className="text-xs text-smoke">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </a>
        ) : (
          <span className="text-xs text-smoke">Be the first to review</span>
        )}
      </div>

      <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="lg" className="mt-4" />

      {/* Limited drop countdown */}
      {product.isLimited && product.dropEndsAt && (
        <div className="mt-5 rounded-xl border border-electric/20 bg-electric/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-electric-300">Drop closes in</p>
          <CountdownTimer endsAt={product.dropEndsAt} />
        </div>
      )}

      {/* Size selector */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="label mb-0">Size{selected ? `: ${selected.size}` : ''}</span>
          <SizeGuide />
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const out = v.stock <= 0;
            const isSel = v.id === variantId;
            return (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={out}
                className={cn(
                  'relative min-w-[3rem] rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                  out
                    ? 'cursor-not-allowed border-charcoal-border text-smoke-dark'
                    : isSel
                      ? 'border-electric bg-electric/10 text-white'
                      : 'border-charcoal-border text-white hover:border-white/40'
                )}
              >
                {v.size}
                {out && <span className="absolute inset-0 grid place-items-center"><span className="h-px w-7 rotate-[-20deg] bg-smoke-dark" /></span>}
              </button>
            );
          })}
        </div>
        {lowStock && (
          <p className="mt-2 text-xs font-medium text-amber-400">
            🔥 Only {selected!.stock} left in {selected!.size} — selling fast
          </p>
        )}
      </div>

      {/* Quantity + actions */}
      {!soldOut ? (
        <>
          <div className="mt-6 flex items-center gap-4">
            <span className="label mb-0">Qty</span>
            <QuantityStepper value={qty} max={selected?.stock ?? 10} onChange={setQty} />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-3">
              <button onClick={onAddToCart} className="btn-secondary flex-1">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <WishlistButton productId={product.id} size={20} className="h-[52px] w-[52px]" />
            </div>
            <button onClick={onBuyNow} className="btn-primary w-full">
              <Zap size={18} /> Buy It Now
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-charcoal-border bg-ink-800 p-4 text-center">
          <p className="text-sm font-semibold text-white">Sold Out</p>
          <p className="mt-1 text-xs text-smoke">Join the newsletter to be notified when it&apos;s back.</p>
        </div>
      )}

      {/* Trust row */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-charcoal-border py-4">
        {[
          { icon: Truck, label: 'Free delivery' },
          { icon: ShieldCheck, label: 'Pay on delivery' },
          { icon: RefreshCw, label: 'Easy returns' },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
            <t.icon size={18} className="text-electric" />
            <span className="text-[11px] text-smoke-light">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Details accordions */}
      <div className="mt-6 divide-y divide-charcoal-border border-t border-charcoal-border">
        <Accordion title="Description" defaultOpen>
          <p className="text-sm leading-relaxed text-smoke-light">{product.description}</p>
        </Accordion>
        <Accordion title="Product Details">
          <ul className="space-y-2 text-sm text-smoke-light">
            {product.gsm && <li className="flex items-center gap-2"><Check size={14} className="text-electric" /> {product.gsm} GSM heavyweight cotton</li>}
            {product.material && <li className="flex items-center gap-2"><Check size={14} className="text-electric" /> {product.material}</li>}
            {product.fit && <li className="flex items-center gap-2"><Check size={14} className="text-electric" /> {product.fit} fit</li>}
            {product.sku && <li className="flex items-center gap-2"><Check size={14} className="text-electric" /> SKU: {product.sku}</li>}
          </ul>
        </Accordion>
        {product.careInfo && (
          <Accordion title="Care Instructions">
            <p className="text-sm leading-relaxed text-smoke-light">{product.careInfo}</p>
          </Accordion>
        )}
        <Accordion title="Shipping & Returns">
          <p className="text-sm leading-relaxed text-smoke-light">
            Free delivery anywhere in Morocco, typically 2–4 business days. Pay cash on delivery. Not the right fit?
            Exchange or return within 14 days. <Link href="/shipping-policy" className="text-electric-300 underline">Read our shipping policy</Link>.
          </p>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group py-4">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white marker:content-none">
        {title}
        <span className="text-smoke transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

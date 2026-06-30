'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import type { ProductListItem } from '@/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { trackAddToCart } from '@/lib/analytics';
import { Price } from '@/components/ui/Price';
import { StarRating } from '@/components/ui/StarRating';
import { ProductBadge } from '@/components/ui/ProductBadge';
import { WishlistButton } from '@/components/ui/WishlistButton';

const LOW_STOCK = 8;

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductListItem;
  priority?: boolean;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [hovered, setHovered] = useState(false);

  const soldOut = product.totalStock <= 0;
  const lowStock = !soldOut && product.totalStock <= LOW_STOCK;
  const hasDeal = product.compareAtCents != null && product.compareAtCents > product.priceCents;

  function quickAdd(variant: { id: string; size: string; stock: number }) {
    if (variant.stock <= 0) return;
    addItem(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        size: variant.size,
        unitCents: product.priceCents,
        maxStock: variant.stock,
      },
      1
    );
    trackAddToCart({ id: product.id, name: product.name, priceCents: product.priceCents, quantity: 1, size: variant.size });
    toast.success(`Added ${product.name} (${variant.size})`);
  }

  return (
    <div
      className={cn('group relative flex flex-col', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink-800"
      >
        {product.image ? (
          <Image
            src={hovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={cn(
              // object-contain + padding: whole garment always visible, never
              // cropped, with consistent breathing room on every screen size.
              'object-contain p-2.5 transition-all duration-[900ms] ease-out-expo group-hover:scale-[1.04] sm:p-3',
              soldOut && 'opacity-60 grayscale'
            )}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-display text-smoke-dark">NOVYR</div>
        )}

        {/* subtle hover veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isLimited && <ProductBadge variant="limited" />}
          {product.isNewArrival && !product.isLimited && <ProductBadge variant="new" />}
          {product.isBestSeller && !product.isLimited && !product.isNewArrival && <ProductBadge variant="bestseller" />}
          {hasDeal && <ProductBadge variant="sale" />}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-ink/40">
            <span className="rounded-full border border-white/20 bg-ink-900/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick add — slides up on hover (desktop), static on mobile */}
        {!soldOut && (
          <div
            className={cn(
              'absolute inset-x-2.5 bottom-2.5 z-10 hidden translate-y-3 rounded-lg border border-white/10 bg-ink-900/85 p-2 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block'
            )}
          >
            <p className="mb-1.5 px-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-smoke max-md:hidden">
              Quick add
            </p>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    quickAdd(v);
                  }}
                  disabled={v.stock <= 0}
                  className={cn(
                    'min-w-[2.1rem] rounded-md border px-2 py-1.5 text-[11px] font-medium transition-colors',
                    v.stock <= 0
                      ? 'cursor-not-allowed border-charcoal-border text-smoke-dark line-through'
                      : 'border-charcoal-border text-white hover:border-white hover:bg-white hover:text-ink'
                  )}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </Link>

      <WishlistButton productId={product.id} className="absolute right-3 top-3 z-10" />

      {/* Meta */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-1 text-[13px] font-medium tracking-tight text-white transition-colors hover:text-bone"
          >
            {product.name}
          </Link>
          {product.reviewCount > 0 && <StarRating rating={product.rating} size={11} className="mt-0.5 shrink-0" />}
        </div>
        <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="sm" />
        {lowStock && (
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-bone-dark">
            <span className="h-1 w-1 rounded-full bg-bone-dark" /> Only {product.totalStock} left
          </span>
        )}
      </div>
    </div>
  );
}

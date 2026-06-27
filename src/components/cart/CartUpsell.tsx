'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { ProductListItem } from '@/types';
import { formatMAD } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { trackAddToCart } from '@/lib/analytics';

export function CartUpsell({ excludeIds = [] }: { excludeIds?: string[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<ProductListItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/products?filter=bestsellers&take=8')
      .then((r) => r.json())
      .then((d) => {
        if (active) setProducts((d.products ?? []).filter((p: ProductListItem) => !excludeIds.includes(p.id)).slice(0, 4));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (products.length === 0) return null;

  function quickAdd(p: ProductListItem) {
    const variant = p.variants.find((v) => v.stock > 0);
    if (!variant) {
      toast.error('Out of stock');
      return;
    }
    addItem(
      {
        productId: p.id,
        variantId: variant.id,
        slug: p.slug,
        name: p.name,
        image: p.image,
        size: variant.size,
        unitCents: p.priceCents,
        maxStock: variant.stock,
      },
      1
    );
    trackAddToCart({ id: p.id, name: p.name, priceCents: p.priceCents, quantity: 1, size: variant.size });
    toast.success(`Added ${p.name} (${variant.size})`);
  }

  return (
    <div className="mt-12">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Complete your order</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="card overflow-hidden">
            <Link href={`/product/${p.slug}`} className="relative block aspect-square bg-ink-800">
              {p.image && <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />}
            </Link>
            <div className="p-3">
              <Link href={`/product/${p.slug}`} className="line-clamp-1 text-xs font-medium text-white hover:text-electric-300">{p.name}</Link>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{formatMAD(p.priceCents)}</span>
                <button onClick={() => quickAdd(p)} aria-label="Add" className="grid h-7 w-7 place-items-center rounded-full bg-electric/15 text-electric transition-colors hover:bg-electric hover:text-white">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

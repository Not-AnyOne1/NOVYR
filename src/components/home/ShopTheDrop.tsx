import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Flame } from 'lucide-react';

import type { ProductListItem } from '@/types';
import { Price } from '@/components/ui/Price';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Best Sellers grid with the spotlight drop folded in as a banner instead of
 * its own full-bleed section — keeps the primary product grid one scroll
 * away from the Hero while still giving the top pick real visual weight.
 */
export function ShopTheDrop({
  spotlight,
  products,
}: {
  spotlight: ProductListItem | null;
  products: ProductListItem[];
}) {
  if (!products.length && !spotlight) return null;
  const lowStock = spotlight ? spotlight.totalStock > 0 && spotlight.totalStock <= 12 : false;

  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">
      <SectionHeading
        eyebrow="The Icons"
        title="Best Sellers"
        subtitle="The pieces the culture keeps coming back to."
        href="/shop?filter=bestsellers"
        variant="poster"
      />

      {spotlight && (
        <Reveal className="mt-10 lg:mt-12">
          <Link
            href={`/product/${spotlight.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-800 sm:flex-row"
          >
            <div className="relative aspect-[4/5] w-full sm:aspect-auto sm:w-[38%] sm:min-h-[280px]">
              <Image
                src={spotlight.image}
                alt={spotlight.name}
                fill
                sizes="(max-width: 640px) 100vw, 38vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                {spotlight.isLimited ? 'Limited Drop' : 'Featured'}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-4 p-8 sm:p-10 lg:p-12">
              <p className="eyebrow">The Featured Drop</p>
              <h3 className="font-poster text-poster-md uppercase leading-[0.9] text-white">{spotlight.name}</h3>
              <div className="flex items-center gap-4">
                <Price cents={spotlight.priceCents} compareAtCents={spotlight.compareAtCents} size="lg" />
                {lowStock && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-bone">
                    <Flame size={13} /> Only {spotlight.totalStock} left
                  </span>
                )}
              </div>
              <span className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full bg-bone px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-transform duration-300 group-hover:translate-x-1">
                Shop This Drop <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      <ProductGrid products={products.slice(0, 8)} className="mt-10 lg:mt-12" priorityCount={4} />
    </section>
  );
}

import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';

import type { ProductListItem } from '@/types';
import { CountdownTimer } from '@/components/cro/CountdownTimer';
import { ProductGrid } from '@/components/ui/ProductGrid';

export function LimitedDrop({ products }: { products: ProductListItem[] }) {
  if (!products.length) return null;

  // Soonest-ending drop for the headline countdown
  const soonest = products
    .map((p) => p.dropEndsAt)
    .filter((d): d is string => Boolean(d))
    .sort()[0];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink">
      <span className="pointer-events-none absolute -left-6 bottom-0 select-none font-poster text-[26vw] uppercase leading-none text-white/[0.025]">
        LTD
      </span>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-radial-fade" />

      <div className="relative mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:py-28">
        {/* Centerpiece countdown */}
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-dark">
            <Flame size={15} className="text-bone" /> Limited Drop · Numbered Release
          </p>
          <h2 className="mt-5 font-poster text-poster-lg uppercase text-white">Once It&apos;s Gone, It&apos;s Gone.</h2>
          <p className="mt-4 max-w-md text-sm text-smoke">
            Strictly limited. When the timer hits zero, the drop closes for good.
          </p>

          {soonest && (
            <div className="mt-9 flex flex-col items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">Drop closes in</span>
              <CountdownTimer endsAt={soonest} />
            </div>
          )}
        </div>

        <ProductGrid products={products.slice(0, 4)} className="mt-16" />

        <div className="mt-12 text-center">
          <Link href="/collections/limited" className="btn-primary group">
            Shop All Limited Pieces
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

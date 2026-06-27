import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getLookbook, getBestSellers } from '@/lib/queries';
import { ProductGrid } from '@/components/ui/ProductGrid';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'The NOVYR lookbook — a product-driven editorial campaign. Heavyweight cotton, limited drops, street culture. Wear Beyond Ordinary.',
  alternates: { canonical: '/lookbook' },
};

const spanClass = (span: string | null) => {
  if (span === 'wide') return 'sm:col-span-2 sm:row-span-1';
  if (span === 'tall') return 'row-span-2';
  return '';
};

export default async function LookbookPage() {
  const [images, bestSellers] = await Promise.all([
    getLookbook().catch(() => []),
    getBestSellers(4).catch(() => []),
  ]);

  const hero = images[0];
  const rest = images.slice(1);

  return (
    <div>
      {/* Editorial cover */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        {hero?.url && <Image src={hero.url} alt="NOVYR campaign" fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-20">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
            <span className="h-px w-8 bg-electric" /> The Lookbook · SS26
          </p>
          <h1 className="mt-5 max-w-4xl text-display-lg text-white text-balance">EDITORIAL IN MOTION.</h1>
          <p className="mt-5 max-w-md text-base text-smoke-light">
            Shot on location. Worn without compromise. The NOVYR universe — heavyweight cotton, bold graphics and
            strictly limited drops.
          </p>
        </div>
      </section>

      {/* Gallery */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid grid-flow-row-dense auto-rows-[280px] grid-cols-2 gap-3 sm:auto-rows-[360px] sm:grid-cols-3 lg:grid-flow-row lg:grid-cols-4">
            {rest.map((img, i) => (
              <div key={img.id} className={`group relative overflow-hidden rounded-2xl bg-ink-800 ${spanClass(img.span)}`}>
                <Image
                  src={img.url}
                  alt={img.caption ?? `NOVYR lookbook ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {img.caption && (
                  <span className="absolute bottom-4 left-4 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {img.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shop the campaign */}
      {bestSellers.length > 0 && (
        <section className="border-t border-white/[0.06] bg-ink-900/40">
          <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:py-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Shop The Campaign</p>
                <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.02em] text-white sm:text-5xl">The Pieces</h2>
              </div>
              <Link href="/shop" className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/40">
                Shop all <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ProductGrid products={bestSellers} className="mt-12" />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1500px] px-5 pb-24 text-center sm:px-8">
        <Link href="/shop" className="btn-primary">Shop The Collection</Link>
      </div>
    </div>
  );
}

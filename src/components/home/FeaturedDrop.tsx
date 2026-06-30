import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';

import type { ProductListItem } from '@/types';
import { formatMAD } from '@/lib/utils';
import { Price } from '@/components/ui/Price';
import { Reveal } from '@/components/ui/Reveal';

const LOW_STOCK = 12;

export function FeaturedDrop({ product }: { product: ProductListItem | null }) {
  if (!product) return null;

  const lowStock = product.totalStock > 0 && product.totalStock <= LOW_STOCK;
  const backImage = product.hoverImage ?? product.image;

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-ink-900">
      {/* Graffiti depth word */}
      <span className="pointer-events-none absolute -right-6 top-6 select-none font-poster text-[28vw] uppercase leading-none text-white/[0.025] sm:top-0">
        DROP
      </span>
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
        {/* Visual — front + back */}
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-800">
              <Image
                src={product.image}
                alt={`${product.name} — front`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 sm:p-6"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                {product.isLimited ? 'Limited Drop' : 'Featured'}
              </span>
              <span className="absolute right-4 top-4 font-mono text-[11px] text-white/50">FRONT</span>
            </div>

            {/* Back graphic chip */}
            <div className="absolute -bottom-8 -left-4 hidden w-40 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-lift sm:block lg:-left-10 lg:w-48">
              <div className="relative aspect-[4/5]">
                <Image src={backImage} alt={`${product.name} — back`} fill sizes="200px" className="object-contain p-2" />
                <span className="absolute right-3 top-3 font-mono text-[10px] text-white/60">BACK</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Info */}
        <Reveal delay={0.1}>
          <div>
            <p className="eyebrow">The Featured Drop</p>
            <h2 className="mt-5 font-poster text-poster-md uppercase leading-[0.9] text-white">{product.name}</h2>

            <div className="mt-5 flex items-center gap-4">
              <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="lg" />
              {lowStock && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-bone">
                  <Flame size={13} /> Only {product.totalStock} left
                </span>
              )}
            </div>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-smoke-light">
              Cut from 240 GSM heavyweight cotton with a high-density, no-crack print. Boxy oversized fit, numbered
              release. Once it&apos;s gone, it&apos;s gone — this is built for the few who move different.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {['240 GSM Cotton', 'Oversized Fit', 'Numbered Release'].map((s) => (
                <span key={s} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-smoke">
                  ◦ {s}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={`/product/${product.slug}`} className="btn-primary group">
                Shop This Drop · {formatMAD(product.priceCents)}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/collections/limited" className="btn-secondary">All Drops</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

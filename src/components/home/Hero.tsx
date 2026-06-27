'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { formatMAD } from '@/lib/utils';
import { viewLabel } from '@/lib/product-views';

export type HeroProduct = {
  name: string;
  slug: string;
  priceCents: number;
  images: { url: string; alt: string | null }[];
  isLimited: boolean;
};

export function Hero({ product }: { product: HeroProduct | null }) {
  const images = product?.images.length ? product.images.slice(0, 4) : [];
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <section className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden bg-ink lg:-mt-[5.5rem]">
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_10%,rgba(255,255,255,0.05),transparent_55%)]" />
      <span className="pointer-events-none absolute right-[-4%] top-1/2 hidden -translate-y-1/2 select-none font-poster text-[24vw] uppercase leading-none text-white/[0.018] lg:block">
        NOVYR
      </span>
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-0">
        {/* ── Editorial copy (≤ 40%) ── */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-bone-dark">
              <span className="h-px w-8 bg-white/30" /> Drop 001 — Heavyweight Series
            </p>

            <h1 className="mt-6 font-poster text-[clamp(2.75rem,6vw,5rem)] uppercase leading-[0.86] text-white">
              Art On
              <br />
              <span className="text-outline">Heavy</span> Cotton.
            </h1>

            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-smoke-light">
              240 GSM oversized graphic tees. Cut for the street, finished like luxury. Numbered drops only —
              once they&apos;re gone, they&apos;re gone.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={product ? `/product/${product.slug}` : '/shop'} className="btn-primary group">
                Shop The Drop
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/shop" className="btn-secondary">Explore Collection</Link>
            </div>

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-smoke-dark">
              Free delivery · Cash on delivery · Morocco
            </p>
          </motion.div>
        </div>

        {/* ── Product showcase (the star) ── */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          {main ? (
            <div className="mx-auto flex w-full max-w-[680px] items-start justify-center gap-3 sm:gap-4">
              {/* Main view */}
              <motion.div
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/5] min-w-0 flex-1 rounded-2xl border border-white/[0.08] bg-ink-800 p-3 sm:p-4"
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={main.url}
                        alt={main.alt ?? product!.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 88vw, 36vw"
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-ink-900/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {product!.isLimited ? 'Limited Drop' : 'Featured Drop'}
                </span>

                {/* Shoppable chip */}
                <Link
                  href={`/product/${product!.slug}`}
                  className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 backdrop-blur-md transition-colors hover:bg-ink-900/90"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-white">{product!.name}</p>
                    <p className="text-xs text-bone-dark">{formatMAD(product!.priceCents)}</p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-bone text-ink transition-transform group-hover:scale-105">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </motion.div>

              {/* Thumbnail views */}
              <div className="flex w-16 shrink-0 flex-col gap-3 sm:w-[88px]">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={viewLabel(img.url)}
                    className="group/thumb text-left"
                  >
                    <div
                      className={`relative aspect-[4/5] overflow-hidden rounded-lg border bg-ink-800 transition-colors ${
                        i === active ? 'border-white' : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      <Image src={img.url} alt="" fill sizes="88px" className="object-contain" />
                    </div>
                    <span className={`mt-1.5 block truncate text-[9px] font-semibold uppercase tracking-[0.16em] ${i === active ? 'text-white' : 'text-smoke-dark'}`}>
                      {viewLabel(img.url)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto aspect-[4/5] w-full max-w-[560px] rounded-2xl border border-white/[0.08] bg-ink-800" />
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-smoke-dark">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

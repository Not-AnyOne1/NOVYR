'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { viewLabel } from '@/lib/product-views';

type GalleryImage = { url: string; alt: string | null };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const list = images.length ? images : [{ url: '', alt: name }];

  const go = (dir: number) => setActive((i) => (i + dir + list.length) % list.length);

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-ink-800 transition-colors lg:h-24 lg:w-20',
                i === active ? 'border-white' : 'border-charcoal-border hover:border-white/30'
              )}
            >
              {img.url && <Image src={img.url} alt={img.alt ?? name} fill sizes="80px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-ink-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {list[active]?.url ? (
              <Image
                src={list[active]!.url}
                alt={list[active]!.alt ?? name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center font-display text-2xl text-smoke-dark">NOVYR</div>
            )}
          </motion.div>
        </AnimatePresence>

        {list[active]?.url && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            {viewLabel(list[active]?.url)}
          </span>
        )}

        <button
          onClick={() => setZoom(true)}
          aria-label="Zoom"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-white backdrop-blur hover:bg-ink-800"
        >
          <ZoomIn size={18} />
        </button>

        {list.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-white backdrop-blur hover:bg-ink-800">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-white backdrop-blur hover:bg-ink-800">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Zoom lightbox */}
      <AnimatePresence>
        {zoom && list[active]?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4 backdrop-blur"
            onClick={() => setZoom(false)}
          >
            <button onClick={() => setZoom(false)} aria-label="Close zoom" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X size={22} />
            </button>
            <div className="relative h-[85vh] w-full max-w-3xl">
              <Image src={list[active]!.url} alt={list[active]!.alt ?? name} fill sizes="100vw" className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

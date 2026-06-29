'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type GalleryImage = { url: string; alt: string | null };

// Crops produced by the image pipeline — never shown as standalone gallery views.
const CROP_SUFFIXES = ['-print.', '-detail.', '-fabric.', '-label.'];
const isFullView = (url?: string | null) => Boolean(url) && !CROP_SUFFIXES.some((s) => url!.includes(s));

/**
 * Select gallery images by available assets, in priority order:
 * full design / lifestyle views only (front, back, model/lifestyle, flat-lay …).
 * Crops are excluded, duplicates removed, capped at 4. Falls back gracefully.
 */
function selectViews(images: GalleryImage[]): GalleryImage[] {
  const pool = images.filter((i) => i.url);
  const full = pool.filter((i) => isFullView(i.url));
  const chosen = (full.length ? full : pool).filter(
    (img, idx, arr) => arr.findIndex((x) => x.url === img.url) === idx
  );
  return chosen.slice(0, 4);
}

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const views = selectViews(images);
  const list = views.length ? views : [{ url: '', alt: name }];
  const current = list[Math.min(active, list.length - 1)]!;
  const go = (dir: number) => setActive((i) => (i + dir + list.length) % list.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Focal image — clean white panel, full design (never cropped) */}
      <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.7)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url || 'placeholder'}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-5 sm:inset-8 lg:inset-10"
          >
            {current.url ? (
              <Image
                src={current.url}
                alt={current.alt ?? name}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-contain"
              />
            ) : (
              <div className="grid h-full place-items-center font-display text-2xl text-black/20">NOVYR</div>
            )}
          </motion.div>
        </AnimatePresence>

        {current.url && (
          <button
            onClick={() => setZoom(true)}
            aria-label="Zoom image"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/70 text-ink backdrop-blur transition-colors hover:bg-white"
          >
            <ZoomIn size={18} />
          </button>
        )}

        {list.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/70 text-ink backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/70 text-ink backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — centered row, only when there is more than one view */}
      {list.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3">
          {list.map((img, i) => (
            <button
              key={img.url || i}
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
              className={cn(
                'relative aspect-[4/5] w-16 overflow-hidden rounded-xl border bg-white transition-all duration-300 sm:w-[4.5rem]',
                i === active ? 'border-ink ring-1 ring-ink' : 'border-black/10 hover:border-black/30'
              )}
            >
              <Image src={img.url} alt={img.alt ?? name} fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom lightbox */}
      <AnimatePresence>
        {zoom && current.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4 backdrop-blur"
            onClick={() => setZoom(false)}
          >
            <button
              onClick={() => setZoom(false)}
              aria-label="Close zoom"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={22} />
            </button>
            <div className="relative h-[85vh] w-full max-w-3xl">
              <Image src={current.url} alt={current.alt ?? name} fill sizes="100vw" className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

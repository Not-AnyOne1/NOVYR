'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type GalleryImage = { url: string; alt: string | null };

// Crop variants emitted by the image pipeline — never shown as standalone views.
const CROP = new Set(['print', 'detail', 'fabric', 'label']);
// Display priority: front → back → model/lifestyle → flat-lay → (side/folded/other).
const ORDER = ['front', 'back', 'model', 'flatlay', 'side', 'folded', 'other'];

/** The filename suffix after the last hyphen, before the extension (keys have no hyphens). */
function suffixOf(url: string): string {
  const file = url.split(/[?#]/)[0]!.split('/').pop() ?? '';
  const base = file.replace(/\.[a-z0-9]+$/i, '');
  const i = base.lastIndexOf('-');
  return i === -1 ? '' : base.slice(i + 1).toLowerCase();
}

function kindOf(url: string): string {
  const s = suffixOf(url);
  if (s === '') return 'front';
  if (CROP.has(s)) return 'crop';
  if (s === 'lifestyle' || s === 'model') return 'model';
  if (s === 'back' || s === 'flatlay' || s === 'side' || s === 'folded') return s;
  return 'other';
}

/**
 * Choose gallery views by available assets, in explicit priority order
 * (front → back → model → flat-lay). Crops excluded, duplicates removed,
 * capped at 4, with a graceful fallback so a slot is never empty.
 */
function selectViews(images: GalleryImage[]): GalleryImage[] {
  const pool = images.filter((i) => i.url);
  const full = pool.filter((i) => kindOf(i.url) !== 'crop');
  const source = full.length ? full : pool;

  const seen = new Set<string>();
  const unique = source.filter((i) => (seen.has(i.url) ? false : (seen.add(i.url), true)));

  const rank = (u: string) => {
    const idx = ORDER.indexOf(kindOf(u));
    return idx === -1 ? ORDER.length : idx;
  };
  return [...unique].sort((a, b) => rank(a.url) - rank(b.url)).slice(0, 4);
}

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const views = selectViews(images);
  const list = views.length ? views : [{ url: '', alt: name }];
  const idx = Math.min(active, list.length - 1);
  const current = list[idx]!;
  const go = (dir: number) => setActive((i) => (i + dir + list.length) % list.length);

  // Lightbox accessibility: Escape to close, arrow nav, focus trap, restore focus.
  useEffect(() => {
    if (!zoom) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = lightboxRef.current;
    const focusable = () => Array.from(node?.querySelectorAll<HTMLElement>('button') ?? []);
    focusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setZoom(false);
      } else if (e.key === 'ArrowLeft') {
        setActive((i) => (i - 1 + list.length) % list.length);
      } else if (e.key === 'ArrowRight') {
        setActive((i) => (i + 1) % list.length);
      } else if (e.key === 'Tab') {
        const f = focusable();
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [zoom, list.length]);

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
              aria-current={i === idx}
              className={cn(
                'relative aspect-[4/5] w-16 overflow-hidden rounded-xl border bg-white transition-all duration-300 sm:w-[4.5rem]',
                i === idx ? 'border-ink ring-1 ring-ink' : 'border-black/10 hover:border-black/30'
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
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt ?? name} — enlarged`}
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

            {list.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="relative h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <Image src={current.url} alt={current.alt ?? name} fill sizes="100vw" className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

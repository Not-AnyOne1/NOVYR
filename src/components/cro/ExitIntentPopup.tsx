'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';

const STORAGE_KEY = 'novyr-exit-intent-seen';

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, '1');
    };

    // Desktop: cursor leaves toward the top (about to close tab)
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    // Mobile fallback: after dwell + scroll depth
    const mobileTimer = window.setTimeout(() => {
      if (window.scrollY > window.innerHeight * 0.5) trigger();
    }, 30000);

    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseout', onMouseOut);
      window.clearTimeout(mobileTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-charcoal-border bg-ink-800 p-8 text-center shadow-lift"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-radial-fade" />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="relative">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-electric/15 text-electric">
                <Gift size={26} />
              </div>
              <p className="eyebrow">Before you go</p>
              <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">
                UNLOCK 10% OFF
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm text-smoke">
                Join the NOVYR movement for early access to drops and an instant{' '}
                <span className="font-semibold text-white">10% off</span> your first order. Use code{' '}
                <span className="font-mono font-semibold text-electric-300">WELCOME10</span>.
              </p>

              <NewsletterForm source="exit-intent" className="mx-auto mt-6 max-w-sm" placeholder="Your best email" />

              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-xs font-medium uppercase tracking-widest text-smoke-dark hover:text-smoke"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

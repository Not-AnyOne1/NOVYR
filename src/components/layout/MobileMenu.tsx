'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { COLLECTION_LINKS, SITE } from '@/lib/constants';

const PRIMARY = [
  { label: 'Shop All', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=new' },
  { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
  { label: 'Limited Drops', href: '/collections/limited' },
  { label: 'Lookbook', href: '/lookbook' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function MobileMenu({
  open,
  onClose,
  authenticated,
}: {
  open: boolean;
  onClose: () => void;
  authenticated: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[92%] max-w-md flex-col bg-ink-900 lg:hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-display text-lg font-extrabold uppercase text-white" style={{ letterSpacing: '0.3em', paddingLeft: '0.3em' }}>
                NOVYR
              </span>
              <button onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Primary nav — oversized editorial */}
            <motion.nav variants={containerVariants} initial="hidden" animate="show" className="flex-1 overflow-y-auto px-6 py-8">
              <div className="flex flex-col">
                {PRIMARY.map((l, i) => (
                  <motion.div key={l.href} variants={itemVariants}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="group flex items-baseline gap-3 border-b border-white/[0.06] py-4"
                    >
                      <span className="font-mono text-[11px] text-smoke-dark">0{i + 1}</span>
                      <span className="font-display text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-bone">
                        {l.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.p variants={itemVariants} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke-dark">
                Collections
              </motion.p>
              <motion.div variants={itemVariants} className="mt-3 grid grid-cols-2 gap-2">
                {COLLECTION_LINKS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-smoke-light transition-colors hover:border-white/20 hover:text-white"
                  >
                    {c.label}
                    <ArrowUpRight size={14} className="text-smoke-dark" />
                  </Link>
                ))}
              </motion.div>
            </motion.nav>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-6 py-6">
              <Link href={authenticated ? '/account' : '/login'} onClick={onClose} className="btn-primary w-full">
                {authenticated ? 'My Account' : 'Sign In'}
              </Link>
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-smoke-dark">{SITE.slogan}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

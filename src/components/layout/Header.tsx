'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, Menu, X, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { COLLECTION_LINKS } from '@/lib/constants';
import { CartButton } from '@/components/cart/CartButton';
import { MobileMenu } from '@/components/layout/MobileMenu';

// Curated, premium top-level navigation (less is more)
const PRIMARY_NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'New', href: '/shop?sort=new' },
  { label: 'Limited', href: '/collections/limited' },
  { label: 'Lookbook', href: '/lookbook' },
];

export function Header() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  const isActive = (href: string) => pathname === href.split('?')[0] && href !== '/shop?sort=new';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-500',
        scrolled || searchOpen
          ? 'border-b border-white/[0.08] bg-ink/75 backdrop-blur-xl'
          : 'border-b border-white/[0.04] bg-ink/25 backdrop-blur-md'
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 transition-[height] duration-500 ease-out-expo sm:px-8',
          scrolled ? 'h-16' : 'h-16 lg:h-[5.5rem]'
        )}
      >
        {/* Left — nav (desktop) / menu (mobile) */}
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-2 grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <nav className="hidden items-center gap-9 lg:flex">
            {PRIMARY_NAV.slice(0, 2).map((l) => (
              <Link key={l.href} href={l.href} data-active={isActive(l.href)} className="nav-link">
                {l.label}
              </Link>
            ))}

            {/* Collections mega-dropdown */}
            <div className="group relative">
              <button className="nav-link flex items-center gap-1.5">
                Collections
                <Plus size={11} className="transition-transform duration-300 group-hover:rotate-45" />
              </button>
              <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/95 p-2.5 shadow-lift backdrop-blur-xl">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-smoke-dark">
                    Collections
                  </p>
                  {COLLECTION_LINKS.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-smoke-light transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {c.label}
                      <span className="text-smoke-dark transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {PRIMARY_NAV.slice(2).map((l) => (
              <Link key={l.href} href={l.href} data-active={isActive(l.href)} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center — wordmark (locked to its own column → never collides) */}
        <Link
          href="/"
          aria-label="NOVYR home"
          className={cn(
            'select-none justify-self-center font-display font-extrabold uppercase leading-none text-white transition-all duration-500',
            scrolled ? 'text-xl' : 'text-xl lg:text-2xl'
          )}
          style={{ letterSpacing: '0.34em', paddingLeft: '0.34em' }}
        >
          NOVYR
        </Link>

        {/* Right — actions */}
        <div className="flex items-center gap-0.5 justify-self-end">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5"
          >
            <Search size={19} strokeWidth={1.6} />
          </button>
          <Link
            href={status === 'authenticated' ? '/account/wishlist' : '/login'}
            aria-label="Wishlist"
            className="hidden h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5 sm:grid"
          >
            <Heart size={19} strokeWidth={1.6} />
          </Link>
          <Link
            href={status === 'authenticated' ? '/account' : '/login'}
            aria-label="Account"
            className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5"
          >
            <User size={19} strokeWidth={1.6} />
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl"
          >
            <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5 sm:px-8">
              <Search size={20} className="text-smoke" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the drop…"
                className="flex-1 bg-transparent text-base text-white placeholder:text-smoke-dark focus:outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-smoke hover:text-white">
                <X size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} authenticated={status === 'authenticated'} />
    </header>
  );
}

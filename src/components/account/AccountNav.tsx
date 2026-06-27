'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1.5">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
              active ? 'bg-electric/10 text-electric-300' : 'text-smoke-light hover:bg-white/5 hover:text-white'
            )}
          >
            <l.icon size={18} /> {l.label}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-smoke-light transition-colors hover:bg-white/5 hover:text-rose-400"
      >
        <LogOut size={18} /> Sign out
      </button>
    </nav>
  );
}

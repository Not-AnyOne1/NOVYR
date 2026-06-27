'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingCart,
  Shirt,
  Boxes,
  FolderTree,
  Users,
  Ticket,
  Image as ImageIcon,
  LogOut,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Shirt },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/discounts', label: 'Discounts', icon: Ticket },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/content', label: 'Content', icon: ImageIcon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2 px-2 py-1">
        <span className="font-display text-xl font-extrabold tracking-tightest text-white">NOVYR</span>
        <span className="rounded bg-electric/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-electric-300">Admin</span>
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-electric/10 text-electric-300' : 'text-smoke-light hover:bg-white/5 hover:text-white'
              )}
            >
              <l.icon size={18} /> {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-charcoal-border pt-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-smoke-light hover:bg-white/5 hover:text-white">
          <Store size={18} /> View store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-smoke-light hover:bg-white/5 hover:text-rose-400"
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  );
}

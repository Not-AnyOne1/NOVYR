'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore, cartCount } from '@/store/cart';

export function CartButton() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(items) : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} items`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/5"
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-electric px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

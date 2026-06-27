'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Bookmark } from 'lucide-react';

import { useCartStore, cartCount, cartSubtotalCents } from '@/store/cart';
import { formatMAD } from '@/lib/utils';
import { trackBeginCheckout } from '@/lib/analytics';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export function CartDrawer() {
  const router = useRouter();
  const { items, saved, isOpen, closeCart, updateQty, removeItem, saveForLater, moveToCart, removeSaved } =
    useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const count = cartCount(items);
  const subtotal = cartSubtotalCents(items);

  function goToCheckout() {
    trackBeginCheckout(
      items.map((i) => ({ id: i.productId, name: i.name, price: i.unitCents / 100, quantity: i.quantity })),
      subtotal
    );
    closeCart();
    router.push('/checkout');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-ink-900 shadow-lift"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white">
                <ShoppingBag size={18} /> Your Cart {count > 0 && `(${count})`}
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping banner */}
            <div className="border-b border-charcoal-border bg-electric/5 px-5 py-2.5 text-center text-xs font-medium text-electric-300">
              🚚 Free delivery anywhere in Morocco · Pay on delivery
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-700">
                    <ShoppingBag size={26} className="text-smoke" />
                  </div>
                  <p className="text-smoke">Your cart is empty.</p>
                  <Link href="/shop" onClick={closeCart} className="btn-primary">
                    Shop The Drop
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-3">
                      <Link href={`/product/${item.slug}`} onClick={closeCart} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                        {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/product/${item.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-medium text-white hover:text-electric-300">
                            {item.name}
                          </Link>
                          <span className="whitespace-nowrap text-sm font-semibold text-white">
                            {formatMAD(item.unitCents * item.quantity)}
                          </span>
                        </div>
                        <span className="mt-0.5 text-xs text-smoke">Size {item.size}</span>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QuantityStepper value={item.quantity} max={item.maxStock} onChange={(q) => updateQty(item.key, q)} />
                          <div className="flex items-center gap-1">
                            <button onClick={() => saveForLater(item.key)} aria-label="Save for later" title="Save for later" className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-white">
                              <Bookmark size={15} />
                            </button>
                            <button onClick={() => removeItem(item.key)} aria-label="Remove" title="Remove" className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-rose-400">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Saved for later */}
              {saved.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-smoke-dark">Saved for later</p>
                  <ul className="flex flex-col gap-3">
                    {saved.map((item) => (
                      <li key={item.key} className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-ink-800">
                          {item.image && <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1 text-xs font-medium text-smoke-light">{item.name}</p>
                          <p className="text-xs text-smoke-dark">Size {item.size}</p>
                        </div>
                        <button onClick={() => moveToCart(item.key)} className="text-xs font-medium text-electric-300 hover:text-electric">
                          Move to cart
                        </button>
                        <button onClick={() => removeSaved(item.key)} aria-label="Remove saved" className="text-smoke hover:text-rose-400">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-charcoal-border px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-smoke">Subtotal</span>
                  <span className="text-lg font-semibold text-white">{formatMAD(subtotal)}</span>
                </div>
                <p className="mb-3 text-xs text-smoke-dark">Shipping & taxes calculated free at checkout.</p>
                <button onClick={goToCheckout} className="btn-primary w-full">
                  Checkout · {formatMAD(subtotal)}
                </button>
                <Link href="/cart" onClick={closeCart} className="mt-2 block text-center text-xs font-medium text-smoke hover:text-white">
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

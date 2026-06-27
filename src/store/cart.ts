'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  key: string; // `${productId}:${variantId}`
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  unitCents: number;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  saved: CartItem[];
  isOpen: boolean;
  // actions
  addItem: (item: Omit<CartItem, 'key' | 'quantity'>, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clear: () => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
};

const keyOf = (productId: string, variantId: string) => `${productId}:${variantId}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      saved: [],
      isOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const key = keyOf(item.productId, item.variantId);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, item.maxStock);
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: nextQty, maxStock: item.maxStock } : i
              ),
            };
          }
          return {
            isOpen: true,
            items: [
              ...state.items,
              { ...item, key, quantity: Math.min(quantity, item.maxStock) },
            ],
          };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQty: (key, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.key === key
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      saveForLater: (key) =>
        set((state) => {
          const item = state.items.find((i) => i.key === key);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.key !== key),
            saved: state.saved.some((i) => i.key === key)
              ? state.saved
              : [...state.saved, item],
          };
        }),

      moveToCart: (key) =>
        set((state) => {
          const item = state.saved.find((i) => i.key === key);
          if (!item) return state;
          const existing = state.items.find((i) => i.key === key);
          return {
            saved: state.saved.filter((i) => i.key !== key),
            items: existing
              ? state.items.map((i) =>
                  i.key === key
                    ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                    : i
                )
              : [...state.items, item],
          };
        }),

      removeSaved: (key) =>
        set((state) => ({ saved: state.saved.filter((i) => i.key !== key) })),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'novyr-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, saved: state.saved }),
    }
  )
);

// ── Derived selectors (pure helpers) ──
export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.quantity, 0);

export const cartSubtotalCents = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.unitCents * i.quantity, 0);

'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

const NAMES = ['Yassine', 'Salma', 'Mehdi', 'Imane', 'Omar', 'Aya', 'Hamza', 'Lina', 'Anas', 'Sara', 'Ayoub', 'Nada'];
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra'];
const PRODUCTS = [
  'Eclipse Oversized Tee',
  'Static Graphic Tee',
  'Phantom Heavyweight Tee',
  'Void Oversized Hoodie',
  'Neon Pulse Tee',
  'Monolith Limited Tee',
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

/**
 * Subtle, periodic "recently purchased" social-proof toasts.
 * Pauses on the checkout flow to avoid distraction at the point of conversion.
 */
export function SocialProofToaster() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let count = 0;
    let timer: ReturnType<typeof setTimeout>;

    const show = () => {
      const path = window.location.pathname;
      const isCheckout = path.startsWith('/checkout') || path.startsWith('/admin');
      if (!isCheckout && document.visibilityState === 'visible') {
        const mins = 2 + Math.floor(Math.random() * 40);
        toast(`${pick(NAMES)} from ${pick(CITIES)} just ordered`, {
          description: `${pick(PRODUCTS)} · ${mins} min ago`,
          icon: <ShoppingBag size={16} className="text-electric" />,
          duration: 5000,
        });
        count += 1;
      }
      // Stop after a handful so it never feels spammy
      if (count < 5) timer = setTimeout(show, 16000 + Math.random() * 12000);
    };

    timer = setTimeout(show, 9000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-20" />}>
      <CheckoutClient />
    </Suspense>
  );
}

import type { Metadata } from 'next';
import { LegalLayout } from '@/components/marketing/LegalLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'NOVYR shipping policy — free delivery anywhere in Morocco, delivery times and cash on delivery.',
  alternates: { canonical: '/shipping-policy' },
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout title="Shipping Policy" updated="June 2026">
      <h2>Free delivery across Morocco</h2>
      <p>We offer <strong>free delivery to every city in Morocco</strong> on all orders, with no minimum purchase required.</p>

      <h2>Delivery time</h2>
      <p>Orders are processed within 1 business day and typically delivered within <strong>2–4 business days</strong>, depending on your location. Major cities (Casablanca, Rabat, Marrakech, Tanger) are usually faster.</p>

      <h2>Cash on Delivery</h2>
      <p>All orders are paid by <strong>cash on delivery (COD)</strong>. You pay the courier in cash when your package arrives — no card or prepayment is required. Our delivery partner will call you to confirm your order before dispatch, so please make sure the phone number you provide is correct and reachable.</p>

      <h2>Order tracking</h2>
      <p>You can check the status of your order at any time from your <a href="/account/orders">account</a>. We update the status as your order moves from confirmed to shipped to delivered.</p>

      <h2>Failed deliveries</h2>
      <p>If we cannot reach you to confirm or our courier cannot complete delivery after multiple attempts, the order may be cancelled. Repeated COD refusals may affect future orders.</p>

      <h2>Questions?</h2>
      <p>Contact us via our <a href="/contact">contact page</a> and we&apos;ll be happy to help.</p>
    </LegalLayout>
  );
}

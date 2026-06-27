import type { Metadata } from 'next';
import { LegalLayout } from '@/components/marketing/LegalLayout';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'NOVYR return and exchange policy — 14-day returns on unworn items.',
  alternates: { canonical: '/return-policy' },
};

export default function ReturnPolicyPage() {
  return (
    <LegalLayout title="Return & Exchange Policy" updated="June 2026">
      <h2>14-day returns</h2>
      <p>If you&apos;re not completely satisfied, you can return or exchange any item within <strong>14 days of delivery</strong>.</p>

      <h2>Conditions</h2>
      <ul>
        <li>Items must be unworn, unwashed and in their original condition.</li>
        <li>All original tags must still be attached.</li>
        <li>Items must be returned in their original packaging where possible.</li>
        <li>Limited / numbered drops are eligible for size exchange only, subject to availability.</li>
      </ul>

      <h2>How to start a return</h2>
      <p>Contact us through our <a href="/contact">contact page</a> with your order number and the reason for the return. Our team will guide you through the next steps and arrange pickup or drop-off.</p>

      <h2>Exchanges</h2>
      <p>Need a different size? We&apos;ll exchange it free of charge as long as the item is in stock. If your size is sold out, we&apos;ll offer a refund or store credit.</p>

      <h2>Refunds</h2>
      <p>Because orders are paid by cash on delivery, approved refunds are issued via bank transfer or store credit. Refunds are processed within 3–5 business days of us receiving and inspecting the returned item.</p>

      <h2>Non-returnable items</h2>
      <p>For hygiene reasons, items that have been worn, washed or damaged by the customer cannot be returned.</p>
    </LegalLayout>
  );
}

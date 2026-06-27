import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about NOVYR — delivery, cash on delivery, sizing, returns and drops.',
  alternates: { canonical: '/faq' },
};

const FAQS = [
  { q: 'How much is delivery?', a: 'Delivery is 100% free anywhere in Morocco. No minimum order required.' },
  { q: 'How does Cash on Delivery work?', a: 'Place your order online, and pay in cash when your package arrives. No card or prepayment needed. Our courier will call to confirm before delivery.' },
  { q: 'How long does delivery take?', a: 'Orders are typically delivered within 2–4 business days depending on your city. You can track your order status from your account at any time.' },
  { q: 'What sizes do you offer?', a: 'Our tees run from XS to XXL in an oversized fit. Check the size guide on each product page — if you prefer a less oversized look, we recommend sizing down.' },
  { q: 'What if it doesn\'t fit?', a: 'You can exchange or return any unworn item within 14 days of delivery. See our Return Policy for full details.' },
  { q: 'Are your drops really limited?', a: 'Yes. Limited pieces are produced in small, numbered runs. Once a drop sells out, it will not be restocked.' },
  { q: 'What is the fabric quality?', a: 'Our tees are made from 240 GSM heavyweight combed cotton; hoodies use 400 GSM brushed fleece. Graphics use premium water-based inks that won\'t crack or fade.' },
  { q: 'How do I get early access to drops?', a: 'Join the NOVYR newsletter. Members get early access, exclusive discounts and first dibs on every limited release.' },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <header className="mb-10 text-center">
        <p className="eyebrow">Need a hand?</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">FAQ</h1>
      </header>

      <div className="divide-y divide-charcoal-border border-y border-charcoal-border">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-white marker:content-none">
              {f.q}
              <span className="ml-4 text-2xl font-light text-smoke transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-smoke-light">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-charcoal-border bg-ink-900 p-6 text-center">
        <p className="text-sm text-smoke">Still have a question?</p>
        <Link href="/contact" className="btn-secondary mt-3">Contact us</Link>
        <p className="mt-3 text-xs text-smoke-dark">{SITE.email}</p>
      </div>
    </div>
  );
}

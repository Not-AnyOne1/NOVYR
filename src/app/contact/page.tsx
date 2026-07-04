import type { Metadata } from 'next';
import { Mail, Instagram, Clock, MapPin } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the NOVYR team. We typically reply within 24 hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="eyebrow">We&apos;re here to help</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Get In Touch</h1>
        <p className="mt-3 max-w-xl text-sm text-smoke">
          Questions about an order, sizing, or a drop? Send us a message and we&apos;ll get back to you within 24 hours.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          {[
            { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: Instagram, label: 'Instagram', value: '@novyr.shop', href: SITE.social.instagram },
            { icon: Clock, label: 'Hours', value: 'Mon–Sat · 9:00–19:00' },
            { icon: MapPin, label: 'Based in', value: 'Casablanca, Morocco' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/10 text-electric">
                <c.icon size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-smoke-dark">{c.label}</p>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-electric-300">{c.value}</a>
                ) : (
                  <p className="text-sm font-medium text-white">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

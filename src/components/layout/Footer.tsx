import Link from 'next/link';
import { Instagram, Truck } from 'lucide-react';
import { FOOTER_NAV, SITE } from '@/lib/constants';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';

// Inline TikTok glyph (lucide has no TikTok icon)
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.6 3.8 3.5 4.2v3c-1.3 0-2.6-.4-3.7-1.1v6.3c0 3.3-2.7 5.6-5.7 5.6S5 18.7 5 15.4c0-3 2.3-5.4 5.3-5.4.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.3 0-2.3 1-2.3 2.4 0 1.3 1 2.4 2.4 2.4 1.3 0 2.4-1 2.4-2.4V3h3.7z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-charcoal-border bg-ink-900">
      {/* Newsletter CTA strip */}
      <div className="border-b border-charcoal-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              JOIN THE NOVYR MOVEMENT
            </h3>
            <p className="mt-2 max-w-md text-sm text-smoke">
              Early access to drops, exclusive discounts and VIP releases. No spam — ever.
            </p>
          </div>
          <NewsletterForm source="footer" className="lg:w-auto" />
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-2xl font-extrabold tracking-tightest text-white">
              NOVYR
            </Link>
            <p className="mt-3 max-w-xs text-sm text-smoke">{SITE.slogan}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-charcoal-border px-3 py-1.5 text-xs text-smoke-light">
              <Truck size={14} className="text-electric" /> Free delivery across Morocco
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-charcoal-border text-smoke-light transition-colors hover:border-white/30 hover:text-white">
                <Instagram size={16} />
              </a>
              <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full border border-charcoal-border text-smoke-light transition-colors hover:border-white/30 hover:text-white">
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-smoke-dark">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-smoke-light transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal-border pt-6 sm:flex-row">
          <p className="text-xs text-smoke-dark">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-smoke-dark">Cash on Delivery · Free Shipping · Made for Morocco</p>
        </div>
      </div>
    </footer>
  );
}

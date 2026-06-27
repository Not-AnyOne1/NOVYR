import { Zap, Tag, Crown } from 'lucide-react';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';

const PERKS = [
  { icon: Zap, label: 'Early access to drops' },
  { icon: Tag, label: 'Exclusive discounts' },
  { icon: Crown, label: 'VIP releases' },
];

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="grain relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-800 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 -top-20 h-64 bg-radial-fade" />
        <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-poster text-[24vw] uppercase leading-none text-white/[0.03]">
          NOVYR
        </span>
        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow eyebrow-center justify-center">Don&apos;t miss the next drop</p>
          <h2 className="mt-4 font-poster text-poster-md uppercase text-white">
            Join The Movement
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-smoke">
            Get on the list for early access, members-only discounts and first dibs on every limited release.
          </p>

          <NewsletterForm source="homepage" className="mx-auto mt-8 max-w-md" />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-sm text-smoke-light">
                <p.icon size={16} className="text-bone" />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

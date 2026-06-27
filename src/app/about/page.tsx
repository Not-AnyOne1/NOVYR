import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WHY_NOVYR } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'About',
  description:
    'NOVYR is a premium streetwear brand born in Morocco — heavyweight oversized cotton, bold graphics and strictly limited drops. Wear Beyond Ordinary.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src="/products/real/samson.webp"
          alt="NOVYR streetwear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
          <p className="eyebrow">Our Story</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            WEAR BEYOND ORDINARY.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none prose-headings:font-display prose-h2:text-white prose-p:text-smoke-light prose-strong:text-white">
          <p className="text-lg">
            NOVYR was born from a simple frustration: streetwear in Morocco was either cheap and disposable, or
            premium and impossible to get. We set out to build something different — a homegrown brand with
            international quality, made for people who refuse to blend in.
          </p>
          <h2>Built on heavyweight cotton</h2>
          <p>
            Every NOVYR piece starts with 240 GSM combed cotton — structured, premium and built to outlast trends.
            Our graphics are printed with high-density, water-based inks that never crack, peel or fade. The result is
            an oversized silhouette that feels as good as it looks, wash after wash.
          </p>
          <h2>Drops, not stock</h2>
          <p>
            We release in small, numbered drops. No mass production, no endless restocks — just exclusive pieces for a
            community that values individuality over mass appeal. When a drop is gone, it&apos;s gone.
          </p>
          <h2>Made for Morocco, built for the world</h2>
          <p>
            We offer <strong>free delivery anywhere in Morocco</strong> and <strong>cash on delivery</strong>, because
            buying premium should be effortless and risk-free. This is only the beginning — NOVYR is built to scale
            internationally while staying true to where it started.
          </p>
        </div>

        {/* Values */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-charcoal-border bg-charcoal-border sm:grid-cols-2">
          {WHY_NOVYR.slice(0, 4).map((item) => (
            <div key={item.title} className="flex gap-3 bg-ink-900 p-6">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/10 text-electric">
                <Icon name={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-smoke">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-primary">Shop The Collection</Link>
        </div>
      </div>
    </div>
  );
}

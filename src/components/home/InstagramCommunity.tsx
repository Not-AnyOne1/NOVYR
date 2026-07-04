import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { Reveal } from '@/components/ui/Reveal';

// Community wall framed as UGC (handle · city), noir-graded → color on hover.
const POSTS = [
  { img: '/products/real/livelihood.webp', handle: 'yassine.wav', city: 'Casablanca', span: 'row-span-2' },
  { img: '/products/real/silence.webp', handle: 'salma_____', city: 'Rabat', span: '' },
  { img: '/products/real/extreme.webp', handle: 'mehdi.213', city: 'Marrakech', span: '' },
  { img: '/products/real/samson.webp', handle: 'imane.k', city: 'Tanger', span: 'col-span-2' },
  { img: '/products/real/dark.webp', handle: 'omar.raw', city: 'Agadir', span: '' },
  { img: '/products/real/breathe.webp', handle: 'ayoub.fits', city: 'Fès', span: '' },
];

/** Compact UGC strip — folded into Customer Reviews instead of its own full section. */
export function InstagramStrip() {
  return (
    <div className="mt-16 border-t border-white/[0.07] pt-10 lg:mt-20 lg:pt-12">
      <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
        <div>
          <p className="eyebrow">Instagram Community</p>
          <h3 className="mt-3 font-poster text-2xl uppercase text-white sm:text-3xl">Worn By The Culture.</h3>
        </div>
        <a
          href={SITE.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/40"
        >
          <Instagram size={16} /> @novyr.shop
        </a>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {POSTS.slice(0, 6).map((post, i) => (
          <Reveal key={post.handle} delay={(i % 6) * 0.05}>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl bg-ink-800"
            >
              <Image
                src={post.img}
                alt={`@${post.handle}`}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover grayscale contrast-[1.1] brightness-90 transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
              />
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function InstagramCommunity() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div>
            <p className="eyebrow">Instagram Community</p>
            <h2 className="mt-4 font-poster text-poster-md uppercase text-white">Worn By The Culture.</h2>
          </div>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/40"
          >
            <Instagram size={16} /> @novyr.shop
          </a>
        </div>

        <div className="mt-12 grid grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[230px] sm:grid-cols-3 lg:grid-cols-4">
          {POSTS.map((post, i) => (
            <Reveal key={post.handle} delay={(i % 4) * 0.06} className={post.span}>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block h-full overflow-hidden rounded-2xl bg-ink-800"
              >
                <Image
                  src={post.img}
                  alt={`@${post.handle}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover grayscale contrast-[1.1] brightness-90 transition-all duration-[900ms] ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <div>
                    <p className="text-[12px] font-semibold text-white">@{post.handle}</p>
                    <p className="text-[10px] uppercase tracking-wider text-smoke">{post.city}</p>
                  </div>
                  <Instagram size={15} className="text-white/0 transition-colors group-hover:text-white/90" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-smoke">
          Tag <span className="font-semibold text-white">#WearBeyondOrdinary</span> to be featured.
        </p>
      </div>
    </section>
  );
}

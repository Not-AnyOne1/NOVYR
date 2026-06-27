import { BadgeCheck, Star } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { Reveal, RevealStagger, RevealItem } from '@/components/ui/Reveal';

type ReviewCard = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  productName: string | null;
};

export function CustomerReviews({ reviews }: { reviews: ReviewCard[] }) {
  if (!reviews.length) return null;

  const avg = Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Aggregate */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Customer Reviews</p>
            <h2 className="mt-4 font-poster text-poster-md uppercase text-white">Worn &amp; Rated.</h2>
            <div className="mt-7 flex items-end gap-4">
              <span className="font-display text-6xl font-extrabold text-white">{avg.toFixed(1)}</span>
              <div className="pb-1.5">
                <StarRating rating={avg} size={18} />
                <p className="mt-1 text-xs text-smoke">Based on {reviews.length}+ verified reviews</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-smoke">
              The fit, the weight, the print — straight from the people wearing NOVYR across Morocco.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <RevealStagger className="grid gap-4 sm:grid-cols-2">
          {reviews.slice(0, 6).map((r) => (
            <RevealItem key={r.id}>
              <figure className="flex h-full flex-col gap-3 rounded-2xl border border-white/[0.07] bg-ink-800/50 p-6">
                <div className="flex items-center justify-between">
                  <StarRating rating={r.rating} size={15} />
                  <Star size={14} className="fill-bone text-bone opacity-30" />
                </div>
                {r.title && <figcaption className="text-sm font-semibold text-white">{r.title}</figcaption>}
                <blockquote className="flex-1 text-sm leading-relaxed text-smoke-light">&ldquo;{r.body}&rdquo;</blockquote>
                <div className="flex items-center gap-3 border-t border-white/[0.07] pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-bone">
                    {r.authorName.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{r.authorName}</p>
                    <p className="flex items-center gap-1 text-[11px] text-smoke-dark">
                      {r.verified && <BadgeCheck size={12} className="text-bone" />}
                      {r.verified ? 'Verified buyer' : 'Customer'}
                      {r.productName ? ` · ${r.productName}` : ''}
                    </p>
                  </div>
                </div>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

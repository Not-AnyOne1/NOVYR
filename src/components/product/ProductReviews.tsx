'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { BadgeCheck, Star, PenLine } from 'lucide-react';

import type { ReviewItem } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';

export function ProductReviews({
  productId,
  rating,
  reviewCount,
  reviews: initial,
}: {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews: ReviewItem[];
}) {
  const { status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });
  const [loading, setLoading] = useState(false);

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast('Sign in to write a review', { action: { label: 'Sign in', onClick: () => router.push('/login') } });
      return;
    }
    if (form.body.trim().length < 4) {
      toast.error('Please write a bit more');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setReviews((prev) => [data.review, ...prev]);
      setForm({ rating: 5, title: '', body: '' });
      setOpen(false);
      toast.success('Thanks for your review!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="reviews" className="scroll-mt-24 border-t border-charcoal-border py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* Summary */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Customer Reviews</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-5xl font-extrabold text-white">{rating ? rating.toFixed(1) : '—'}</span>
              <div>
                <StarRating rating={rating} size={18} />
                <p className="mt-1 text-xs text-smoke">{reviewCount} reviews</p>
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-xs text-smoke">
                  <span className="flex w-8 items-center gap-0.5">{d.star}<Star size={11} className="fill-electric text-electric" /></span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full bg-electric" style={{ width: `${reviewCount ? (d.count / reviewCount) * 100 : 0}%` }} />
                  </div>
                  <span className="w-6 text-right tabular-nums">{d.count}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setOpen((v) => !v)} className="btn-secondary mt-6 w-full">
              <PenLine size={16} /> Write a review
            </button>
          </div>

          {/* List + form */}
          <div>
            {open && (
              <form onSubmit={submit} className="mb-8 rounded-2xl border border-charcoal-border bg-ink-800 p-5">
                <p className="label">Your rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))} aria-label={`${n} stars`}>
                      <Star size={26} className={cn(n <= form.rating ? 'fill-electric text-electric' : 'text-ink-500')} />
                    </button>
                  ))}
                </div>
                <input
                  className="input mt-4"
                  placeholder="Review title (optional)"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  maxLength={120}
                />
                <textarea
                  className="input mt-3 min-h-[100px] resize-y"
                  placeholder="What did you think? How was the fit, quality and feel?"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  maxLength={2000}
                  required
                />
                <button type="submit" disabled={loading} className="btn-primary mt-4">
                  {loading ? 'Submitting…' : 'Submit review'}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-smoke">No reviews yet. Be the first to share your thoughts.</p>
            ) : (
              <ul className="space-y-6">
                {reviews.map((r) => (
                  <li key={r.id} className="border-b border-charcoal-border pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <StarRating rating={r.rating} size={14} />
                      <span className="text-xs text-smoke-dark">{formatDate(r.createdAt)}</span>
                    </div>
                    {r.title && <p className="mt-2 text-sm font-semibold text-white">{r.title}</p>}
                    <p className="mt-1.5 text-sm leading-relaxed text-smoke-light">{r.body}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-smoke">
                      <span className="font-medium text-smoke-light">{r.authorName}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-electric-300">
                          <BadgeCheck size={13} /> Verified buyer
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

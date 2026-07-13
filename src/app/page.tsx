import {
  getNewArrivals,
  getLimitedDrops,
  getTopReviews,
  getReviewStats,
  getProductBySlug,
} from '@/lib/queries';
import { WebsiteJsonLd } from '@/components/seo/JsonLd';
import { Hero, type HeroProduct } from '@/components/home/Hero';
import { ProductSection } from '@/components/home/ProductSection';
import { WhyNovyr } from '@/components/home/WhyNovyr';
import { LimitedDrop } from '@/components/home/LimitedDrop';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export const revalidate = 300;

// Resolve a promise, falling back to a default if the DB is unavailable.
async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [newArrivals, limited, reviews, reviewStats] = await Promise.all([
    safe(getNewArrivals(100), []), // 100 = effectively "all" (catalog is well under this)
    safe(getLimitedDrops(4), []),
    safe(getTopReviews(6), []),
    safe(getReviewStats(), { count: 0, average: 0 }),
  ]);

  // Hero = the headline drop, with its full set of images (front / back / detail)
  const heroBase = limited[0] ?? newArrivals[0] ?? null;
  const heroDetail = heroBase ? await safe(getProductBySlug(heroBase.slug), null) : null;
  const heroProduct: HeroProduct | null = heroDetail
    ? {
        name: heroDetail.name,
        slug: heroDetail.slug,
        priceCents: heroDetail.priceCents,
        images: heroDetail.images,
        isLimited: heroDetail.isLimited,
      }
    : null;

  return (
    <>
      <WebsiteJsonLd />
      <Hero product={heroProduct} />
      <ProductSection
        eyebrow="Just Landed"
        title="New Collection"
        subtitle="The latest cuts, fresh off the press."
        href="/shop?sort=new"
        products={newArrivals}
        variant="poster"
        limit={newArrivals.length}
        priorityCount={4}
      />
      <WhyNovyr />
      <LimitedDrop products={limited} />
      <CustomerReviews reviews={reviews} stats={reviewStats} />
      <NewsletterSection />
    </>
  );
}

import {
  getBestSellers,
  getNewArrivals,
  getLimitedDrops,
  getTopReviews,
  getReviewStats,
  getProductBySlug,
} from '@/lib/queries';
import { WebsiteJsonLd } from '@/components/seo/JsonLd';
import { Hero, type HeroProduct } from '@/components/home/Hero';
import { ShopTheDrop } from '@/components/home/ShopTheDrop';
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
  const [bestSellers, newArrivals, limited, reviews, reviewStats] = await Promise.all([
    safe(getBestSellers(8), []),
    safe(getNewArrivals(8), []),
    safe(getLimitedDrops(4), []),
    safe(getTopReviews(6), []),
    safe(getReviewStats(), { count: 0, average: 0 }),
  ]);

  // Hero = the headline drop, with its full set of images (front / back / detail)
  const heroBase = limited[0] ?? bestSellers[0] ?? newArrivals[0] ?? null;
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

  // Spotlight = a different piece from the hero, banner-highlighted atop the grid
  const spotlight = bestSellers.find((p) => p.id !== heroBase?.id) ?? bestSellers[0] ?? newArrivals[0] ?? null;
  const gridSellers = bestSellers.filter((p) => p.id !== spotlight?.id);

  return (
    <>
      <WebsiteJsonLd />
      <Hero product={heroProduct} />
      <ShopTheDrop spotlight={spotlight} products={gridSellers} />
      <ProductSection
        eyebrow="Just Landed"
        title="New Collection"
        subtitle="The latest cuts, fresh off the press."
        href="/shop?sort=new"
        products={newArrivals}
        variant="poster"
      />
      <WhyNovyr />
      <LimitedDrop products={limited} />
      <CustomerReviews reviews={reviews} stats={reviewStats} />
      <NewsletterSection />
    </>
  );
}

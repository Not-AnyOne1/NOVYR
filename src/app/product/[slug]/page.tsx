import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from '@/lib/queries';
import { SITE } from '@/lib/constants';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductSection } from '@/components/home/ProductSection';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: 'Product not found' };

  // Strip any brand suffix so the layout template adds "| NOVYR" exactly once.
  const title = (product.metaTitle ?? product.name).replace(/\s*\|\s*NOVYR\s*$/i, '');
  const description = product.metaDescription ?? product.description.slice(0, 160);

  // Link previews must show the full front design — never a crop/label.
  const isFront = (url: string) => !(url.split('/').pop()?.split('.')[0] ?? '').includes('-');
  const front = product.images.find((i) => isFront(i.url)) ?? product.images[0];
  const ogImage = front?.url;

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${SITE.name}`,
      description,
      images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.id,
    product.collections.map((c) => c.slug)
  ).catch(() => []);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE.url },
          { name: 'Shop', url: `${SITE.url}/shop` },
          { name: product.name, url: `${SITE.url}/product/${slug}` },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductReviews
        productId={product.id}
        rating={product.rating}
        reviewCount={product.reviewCount}
        reviews={product.reviews}
      />

      <ProductSection
        eyebrow="You May Also Like"
        title="Complete The Look"
        products={related}
      />
    </>
  );
}

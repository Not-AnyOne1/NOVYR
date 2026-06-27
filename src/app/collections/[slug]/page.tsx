import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { getCollectionBySlug, getProducts, getCollections } from '@/lib/queries';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { ShopToolbar } from '@/components/shop/ShopToolbar';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SITE } from '@/lib/constants';

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const collections = await getCollections();
    return collections.map((c) => ({ slug: c.slug }));
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
  const collection = await getCollectionBySlug(slug).catch(() => null);
  if (!collection) return { title: 'Collection' };
  return {
    title: collection.name,
    description: collection.description ?? `Shop the ${collection.name} from NOVYR.`,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: `${collection.name} | ${SITE.name}`,
      description: collection.description ?? undefined,
      images: collection.image ? [{ url: collection.image }] : undefined,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const collection = await getCollectionBySlug(slug).catch(() => null);
  if (!collection) notFound();

  const products = await getProducts({
    collection: slug,
    sort: (sp.sort as 'new') ?? 'new',
    filter: sp.filter as 'bestsellers' | undefined,
  }).catch(() => []);

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE.url },
          { name: 'Collections', url: `${SITE.url}/shop` },
          { name: collection.name, url: `${SITE.url}/collections/${slug}` },
        ]}
      />

      {/* Hero banner */}
      <section className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        {collection.image && (
          <Image src={collection.image} alt={collection.name} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          {collection.tagline && <p className="eyebrow">{collection.tagline}</p>}
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-3 max-w-xl text-sm text-smoke-light">{collection.description}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ShopToolbar total={products.length} />
        {products.length > 0 ? (
          <ProductGrid products={products} className="mt-10" priorityCount={4} />
        ) : (
          <p className="mt-16 text-center text-smoke">This collection is dropping soon. Stay tuned.</p>
        )}
      </div>
    </div>
  );
}

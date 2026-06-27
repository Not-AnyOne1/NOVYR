import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';

import { getProducts } from '@/lib/queries';
import type { ProductFilters } from '@/types';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { ShopToolbar } from '@/components/shop/ShopToolbar';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Shop All',
  description:
    'Shop the full NOVYR collection — premium oversized t-shirts, graphic tees, hoodies and limited drops. Free delivery across Morocco. Cash on delivery.',
  alternates: { canonical: '/shop' },
};

type SearchParams = {
  q?: string;
  sort?: string;
  filter?: string;
  collection?: string;
  category?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const filters: ProductFilters = {
    q: sp.q,
    sort: (sp.sort as ProductFilters['sort']) ?? 'new',
    filter: sp.filter as ProductFilters['filter'],
    collection: sp.collection,
    category: sp.category,
  };

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  try {
    products = await getProducts(filters);
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="eyebrow">{sp.q ? `Results for "${sp.q}"` : 'The Full Collection'}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {sp.q ? 'Search' : 'Shop All'}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-smoke">
          Heavyweight cotton. Premium prints. Free delivery anywhere in Morocco.
        </p>
      </header>

      <ShopToolbar total={products.length} />

      {products.length > 0 ? (
        <ProductGrid products={products} className="mt-10" priorityCount={4} />
      ) : (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-700 text-smoke">
            <SearchX size={28} />
          </div>
          <h2 className="text-lg font-semibold text-white">No products found</h2>
          <p className="max-w-sm text-sm text-smoke">
            We couldn&apos;t find anything matching that. Try clearing your filters.
          </p>
          <Link href="/shop" className="btn-primary">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}

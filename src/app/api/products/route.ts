import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/queries';
import type { ProductFilters } from '@/types';

export const revalidate = 120;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters: ProductFilters = {
    filter: (searchParams.get('filter') as ProductFilters['filter']) ?? undefined,
    collection: searchParams.get('collection') ?? undefined,
    sort: (searchParams.get('sort') as ProductFilters['sort']) ?? undefined,
    q: searchParams.get('q') ?? undefined,
    take: Math.min(24, Number(searchParams.get('take')) || 8),
  };

  try {
    const products = await getProducts(filters);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}

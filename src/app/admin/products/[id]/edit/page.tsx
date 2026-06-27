import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { SIZES } from '@/lib/constants';
import { ProductForm, type ProductFormInitial } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: { orderBy: { order: 'asc' } },
        collections: { select: { id: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true } }),
    prisma.collection.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  const variants = Object.fromEntries(
    SIZES.map((s) => {
      const v = product.variants.find((x) => x.size === s);
      return [s, { include: Boolean(v), stock: String(v?.stock ?? 0) }];
    })
  );

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceMad: String(product.priceCents / 100),
    compareMad: product.compareAtCents ? String(product.compareAtCents / 100) : '',
    sku: product.sku ?? '',
    gsm: product.gsm ? String(product.gsm) : '',
    material: product.material ?? '',
    fit: product.fit ?? 'Oversized',
    careInfo: product.careInfo ?? '',
    categoryId: product.categoryId ?? '',
    collectionIds: product.collections.map((c) => c.id),
    active: product.active,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    isLimited: product.isLimited,
    metaTitle: product.metaTitle ?? '',
    metaDescription: product.metaDescription ?? '',
    images: product.images.length ? product.images.map((i) => i.url) : [''],
    variants,
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-smoke-light hover:text-white">
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Edit · {product.name}</h1>
      <ProductForm categories={categories} collections={collections} initial={initial} />
    </div>
  );
}

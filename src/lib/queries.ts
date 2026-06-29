import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { average } from '@/lib/utils';
import type {
  ProductListItem,
  ProductDetail,
  CollectionSummary,
  ProductFilters,
} from '@/types';

const listInclude = {
  images: { orderBy: { order: 'asc' as const }, take: 2 },
  variants: {
    orderBy: { order: 'asc' as const },
    select: { id: true, size: true, stock: true },
  },
  reviews: { where: { approved: true }, select: { rating: true } },
} satisfies Prisma.ProductInclude;

type ProductWithList = Prisma.ProductGetPayload<{ include: typeof listInclude }>;

function toListItem(p: ProductWithList): ProductListItem {
  const ratings = p.reviews.map((r) => r.rating);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    image: p.images[0]?.url ?? '',
    hoverImage: p.images[1]?.url ?? null,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isLimited: p.isLimited,
    isFeatured: p.isFeatured,
    totalStock: p.variants.reduce((n, v) => n + v.stock, 0),
    rating: Math.round(average(ratings) * 10) / 10,
    reviewCount: ratings.length,
    dropEndsAt: p.dropEndsAt ? p.dropEndsAt.toISOString() : null,
    variants: p.variants.map((v) => ({ id: v.id, size: v.size, stock: v.stock })),
  };
}

export async function getFeaturedProducts(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { active: true, isFeatured: true },
    include: listInclude,
    orderBy: { updatedAt: 'desc' },
    take,
  });
  return products.map(toListItem);
}

export async function getBestSellers(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { active: true, isBestSeller: true },
    include: listInclude,
    orderBy: { updatedAt: 'desc' },
    take,
  });
  return products.map(toListItem);
}

export async function getNewArrivals(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { active: true, isNewArrival: true },
    include: listInclude,
    orderBy: { createdAt: 'desc' },
    take,
  });
  return products.map(toListItem);
}

export async function getLimitedDrops(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { active: true, isLimited: true },
    include: listInclude,
    orderBy: { dropEndsAt: 'asc' },
    take,
  });
  return products.map(toListItem);
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListItem[]> {
  const { collection, category, sort, filter, q, take = 48, skip = 0 } = filters;

  const where: Prisma.ProductWhereInput = { active: true };
  if (collection) where.collections = { some: { slug: collection } };
  if (category) where.category = { slug: category };
  if (filter === 'bestsellers') where.isBestSeller = true;
  if (filter === 'new') where.isNewArrival = true;
  if (filter === 'limited') where.isLimited = true;
  if (filter === 'featured') where.isFeatured = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { priceCents: 'asc' };
  else if (sort === 'price-desc') orderBy = { priceCents: 'desc' };
  else if (sort === 'new') orderBy = { createdAt: 'desc' };
  else if (sort === 'bestsellers') orderBy = { isBestSeller: 'desc' };

  const products = await prisma.product.findMany({
    where,
    include: listInclude,
    orderBy,
    take,
    skip,
  });
  return products.map(toListItem);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const p = await prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: { orderBy: { order: 'asc' } },
      category: true,
      collections: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 24,
      },
    },
  });
  if (!p) return null;

  const ratings = p.reviews.map((r) => r.rating);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    image: p.images[0]?.url ?? '',
    hoverImage: p.images[1]?.url ?? null,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isLimited: p.isLimited,
    isFeatured: p.isFeatured,
    totalStock: p.variants.reduce((n, v) => n + v.stock, 0),
    rating: Math.round(average(ratings) * 10) / 10,
    reviewCount: ratings.length,
    dropEndsAt: p.dropEndsAt ? p.dropEndsAt.toISOString() : null,
    description: p.description,
    gsm: p.gsm,
    material: p.material,
    fit: p.fit,
    careInfo: p.careInfo,
    sku: p.sku,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
    variants: p.variants.map((v) => ({ id: v.id, size: v.size, stock: v.stock })),
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    collections: p.collections.map((c) => ({ name: c.name, slug: c.slug })),
    reviews: p.reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      body: r.body,
      imageUrl: r.imageUrl,
      verified: r.verified,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function getRelatedProducts(
  productId: string,
  collectionSlugs: string[],
  take = 4
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      id: { not: productId },
      collections: collectionSlugs.length
        ? { some: { slug: { in: collectionSlugs } } }
        : undefined,
    },
    include: listInclude,
    take,
    orderBy: { isBestSeller: 'desc' },
  });
  if (products.length >= take) return products.map(toListItem);

  // Backfill with other active products
  const extra = await prisma.product.findMany({
    where: { active: true, id: { not: productId } },
    include: listInclude,
    take: take - products.length,
    orderBy: { createdAt: 'desc' },
  });
  const seen = new Set(products.map((p) => p.id));
  return [...products, ...extra.filter((p) => !seen.has(p.id))].slice(0, take).map(toListItem);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export async function getCollections(featuredOnly = false): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: { active: true, ...(featuredOnly ? { featured: true } : {}) },
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    productCount: c._count.products,
  }));
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findFirst({ where: { slug, active: true } });
}

export async function getCategories() {
  return prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
}

export async function getAnnouncement(): Promise<{ enabled: boolean; messages: string[] }> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'announcement' } });
  const fallback = {
    enabled: true,
    messages: ['🚚 FREE DELIVERY ANYWHERE IN MOROCCO', '🔥 LIMITED STOCK AVAILABLE'],
  };
  if (!setting) return fallback;
  return setting.value as unknown as { enabled: boolean; messages: string[] };
}

export async function getHeroSlides() {
  return prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
}

export async function getLookbook() {
  return prisma.lookbookImage.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
}

// ───────────────── Orders & account ─────────────────

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
}

export async function getUserOrderByNumber(userId: string, orderNumber: string) {
  return prisma.order.findFirst({
    where: { orderNumber, userId },
    include: { items: true },
  });
}

export async function getUserWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { product: { include: listInclude } },
  });
  return items
    .filter((i) => i.product && i.product.active)
    .map((i) => toListItem(i.product as ProductWithList));
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
  });
}

export async function getTopReviews(take = 6) {
  const reviews = await prisma.review.findMany({
    where: { approved: true, rating: { gte: 4 } },
    orderBy: { createdAt: 'desc' },
    take,
    include: { product: { select: { name: true, slug: true } } },
  });
  return reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    productName: r.product?.name ?? null,
    productSlug: r.product?.slug ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Real aggregate review stats across the whole catalogue (for the homepage). */
export async function getReviewStats(): Promise<{ count: number; average: number }> {
  const r = await prisma.review.aggregate({
    where: { approved: true },
    _count: true,
    _avg: { rating: true },
  });
  return { count: r._count, average: Math.round((r._avg.rating ?? 0) * 10) / 10 };
}

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  compareAtCents: number | null;
  image: string;
  hoverImage: string | null;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimited: boolean;
  isFeatured: boolean;
  totalStock: number;
  rating: number;
  reviewCount: number;
  dropEndsAt: string | null;
  variants: VariantItem[];
};

export type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  imageUrl: string | null;
  verified: boolean;
  createdAt: string;
};

export type VariantItem = {
  id: string;
  size: string;
  stock: number;
};

export type ProductDetail = ProductListItem & {
  description: string;
  gsm: number | null;
  material: string | null;
  fit: string | null;
  careInfo: string | null;
  sku: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images: { url: string; alt: string | null }[];
  variants: VariantItem[];
  category: { name: string; slug: string } | null;
  collections: { name: string; slug: string }[];
  reviews: ReviewItem[];
};

export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image: string | null;
  productCount: number;
};

export type ProductFilters = {
  collection?: string;
  category?: string;
  sort?: 'new' | 'price-asc' | 'price-desc' | 'bestsellers' | 'featured';
  filter?: 'bestsellers' | 'new' | 'limited' | 'featured';
  q?: string;
  take?: number;
  skip?: number;
};

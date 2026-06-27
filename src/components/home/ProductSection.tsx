import type { ProductListItem } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/ui/ProductGrid';

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  href,
  products,
  priorityCount = 0,
  variant = 'default',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  products: ProductListItem[];
  priorityCount?: number;
  variant?: 'default' | 'poster';
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} href={href} variant={variant} />
      <ProductGrid products={products.slice(0, 8)} className="mt-12 lg:mt-16" priorityCount={priorityCount} />
    </section>
  );
}

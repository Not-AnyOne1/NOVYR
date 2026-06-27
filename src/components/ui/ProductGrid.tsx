import type { ProductListItem } from '@/types';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: ProductListItem[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4', className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

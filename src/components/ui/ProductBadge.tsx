import { cn } from '@/lib/utils';

type Variant = 'new' | 'bestseller' | 'limited' | 'sale';

const styles: Record<Variant, string> = {
  new: 'border-white/15 bg-ink-900/70 text-white',
  bestseller: 'border-white/15 bg-ink-900/70 text-white',
  limited: 'border-bone/30 bg-ink-900/70 text-bone',
  sale: 'border-white/15 bg-ink-900/70 text-white',
};

const labels: Record<Variant, string> = {
  new: 'New',
  bestseller: 'Best Seller',
  limited: 'Limited',
  sale: 'Sale',
};

export function ProductBadge({ variant, className }: { variant: Variant; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur',
        styles[variant],
        className
      )}
    >
      {labels[variant]}
    </span>
  );
}

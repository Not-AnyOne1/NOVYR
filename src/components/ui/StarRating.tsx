import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  rating,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled ? 'fill-bone text-bone' : 'fill-transparent text-ink-500'
            )}
            strokeWidth={1.5}
          />
        );
      })}
      {showValue && rating > 0 && (
        <span className="ml-1 text-xs font-medium text-smoke">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

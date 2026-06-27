import { formatMAD, cn } from '@/lib/utils';

export function Price({
  cents,
  compareAtCents,
  className,
  size = 'md',
}: {
  cents: number;
  compareAtCents?: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const hasDeal = compareAtCents != null && compareAtCents > cents;
  const pct = hasDeal ? Math.round(((compareAtCents! - cents) / compareAtCents!) * 100) : 0;

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  } as const;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-semibold text-white', sizes[size])}>{formatMAD(cents)}</span>
      {hasDeal && (
        <>
          <span className={cn('text-smoke-dark line-through', size === 'lg' ? 'text-base' : 'text-xs')}>
            {formatMAD(compareAtCents!)}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bone">
            -{pct}%
          </span>
        </>
      )}
    </div>
  );
}

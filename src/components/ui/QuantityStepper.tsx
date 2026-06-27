'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center rounded-full border border-charcoal-border', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/5 disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums text-white">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/5 disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

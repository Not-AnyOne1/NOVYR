'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

const SORTS = [
  { value: 'new', label: 'Newest' },
  { value: 'bestsellers', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'new', label: 'New' },
  { value: 'limited', label: 'Limited' },
];

export function ShopToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get('filter') ?? '';
  const activeSort = searchParams.get('sort') ?? 'new';

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 border-b border-charcoal-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => update('filter', f.value)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors',
              activeFilter === f.value
                ? 'border-electric bg-electric/10 text-electric-300'
                : 'border-charcoal-border text-smoke-light hover:border-white/30 hover:text-white'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-smoke-dark sm:inline">{total} products</span>
        <label className="sr-only" htmlFor="sort">
          Sort
        </label>
        <select
          id="sort"
          value={activeSort}
          onChange={(e) => update('sort', e.target.value)}
          className="rounded-full border border-charcoal-border bg-ink-800 px-4 py-2 text-xs font-medium text-white focus:border-electric focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-ink-800">
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

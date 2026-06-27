'use client';

import { useState } from 'react';
import { formatMAD } from '@/lib/utils';

type Point = { label: string; value: number };

export function SalesChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div>
      <div className="flex h-48 items-end gap-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            className="group relative flex flex-1 flex-col items-center justify-end"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <div className="absolute -top-9 z-10 whitespace-nowrap rounded-lg border border-charcoal-border bg-ink-900 px-2 py-1 text-xs text-white shadow-card">
                {formatMAD(d.value)}
              </div>
            )}
            <div
              className="w-full rounded-t-md bg-electric/30 transition-all duration-300 group-hover:bg-electric"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? '4px' : '0' }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-smoke-dark">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

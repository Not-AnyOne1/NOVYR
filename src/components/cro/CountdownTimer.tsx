'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function diff(target: number) {
  const total = Math.max(0, target - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function CountdownTimer({
  endsAt,
  className,
  compact = false,
}: {
  endsAt: string | Date;
  className?: string;
  compact?: boolean;
}) {
  const target = new Date(endsAt).getTime();
  const [time, setTime] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) return null;
  if (time.total <= 0) return <span className={cn('text-xs font-semibold text-rose-400', className)}>Drop ended</span>;

  const units = [
    { label: compact ? 'D' : 'Days', value: time.days },
    { label: compact ? 'H' : 'Hrs', value: time.hours },
    { label: compact ? 'M' : 'Min', value: time.minutes },
    { label: compact ? 'S' : 'Sec', value: time.seconds },
  ];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5">
          <div className="flex min-w-[2.75rem] flex-col items-center rounded-lg border border-charcoal-border bg-ink-800 px-2 py-1.5">
            <span className="font-display text-lg font-bold tabular-nums text-white">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-smoke-dark">{u.label}</span>
          </div>
          {i < units.length - 1 && <span className="text-smoke-dark">:</span>}
        </div>
      ))}
    </div>
  );
}

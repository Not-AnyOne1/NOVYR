import { Check, Clock, X } from 'lucide-react';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function OrderStatusTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500/15 text-rose-300">
          <X size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{ORDER_STATUS_LABEL[status]}</p>
          <p className="text-xs text-smoke">This order is no longer being processed.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);

  return (
    <ol className="relative flex justify-between">
      <div className="absolute left-0 right-0 top-4 -z-0 mx-5 h-0.5 bg-charcoal-border" />
      <div
        className="absolute left-0 top-4 -z-0 ml-5 h-0.5 bg-electric transition-all"
        style={{ width: `calc(${Math.max(0, currentIndex) / (ORDER_STATUS_FLOW.length - 1)} * (100% - 2.5rem))` }}
      />
      {ORDER_STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="relative z-10 flex flex-1 flex-col items-center gap-2">
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full border-2 transition-colors',
                done ? 'border-electric bg-electric text-white' : 'border-charcoal-border bg-ink-800 text-smoke-dark',
                active && 'animate-pulse-glow'
              )}
            >
              {done ? <Check size={16} /> : <Clock size={14} />}
            </span>
            <span className={cn('text-center text-[10px] font-medium uppercase tracking-wide sm:text-xs', done ? 'text-white' : 'text-smoke-dark')}>
              {ORDER_STATUS_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

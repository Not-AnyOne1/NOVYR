import { ORDER_STATUS_LABEL } from '@/lib/constants';
import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-300',
  CONFIRMED: 'bg-electric/15 text-electric-300',
  PROCESSING: 'bg-electric/15 text-electric-300',
  SHIPPED: 'bg-violet-500/15 text-violet-300',
  DELIVERED: 'bg-emerald-500/15 text-emerald-300',
  CANCELLED: 'bg-rose-500/15 text-rose-300',
  REFUNDED: 'bg-rose-500/15 text-rose-300',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        COLORS[status] ?? 'bg-white/10 text-white',
        className
      )}
    >
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}

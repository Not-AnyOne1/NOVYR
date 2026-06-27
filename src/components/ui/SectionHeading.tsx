import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = 'View all',
  align = 'left',
  variant = 'default',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  variant?: 'default' | 'poster';
  className?: string;
}) {
  const centered = align === 'center';
  const poster = variant === 'poster';

  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        className
      )}
    >
      <div className={cn('flex flex-col', centered ? 'max-w-2xl items-center' : 'max-w-2xl')}>
        {eyebrow && <p className={cn('eyebrow', centered && 'eyebrow-center')}>{eyebrow}</p>}
        {poster ? (
          <h2 className="mt-4 font-poster text-poster-md uppercase text-white">{title}</h2>
        ) : (
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={cn('mt-4 text-[15px] leading-relaxed text-smoke', centered ? 'max-w-lg' : 'max-w-md')}>
            {subtitle}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]"
        >
          {linkLabel}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

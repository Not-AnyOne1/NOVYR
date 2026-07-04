import { WHY_NOVYR } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function WhyNovyr() {
  return (
    <section className="relative overflow-hidden border-y border-charcoal-border bg-ink-900">
      <div className="pointer-events-none absolute inset-0 bg-grid [background-size:48px_48px] opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          align="center"
          variant="poster"
          eyebrow="Why NOVYR"
          title="Built Different."
          subtitle="Every NOVYR piece is engineered to outperform fast fashion — in weight, in print, in fit, and in feel."
          className="mx-auto"
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-charcoal-border bg-charcoal-border sm:grid-cols-2 lg:grid-cols-3">
          {WHY_NOVYR.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.05}>
              <div className="flex h-full flex-col gap-3 bg-ink-900 p-8 transition-colors hover:bg-ink-800">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-bone">
                  <Icon name={item.icon} size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-smoke">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

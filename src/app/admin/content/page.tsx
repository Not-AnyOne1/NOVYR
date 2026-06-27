import { prisma } from '@/lib/prisma';
import { getAnnouncement } from '@/lib/queries';
import { ContentManager } from '@/components/admin/ContentManager';

export default async function AdminContentPage() {
  const [announcement, hero, lookbook] = await Promise.all([
    getAnnouncement().catch(() => ({ enabled: true, messages: [] as string[] })),
    prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
    prisma.lookbookImage.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Homepage content</h1>
        <p className="mt-1 text-sm text-smoke">Control the announcement bar, hero and lookbook.</p>
      </header>
      <ContentManager
        announcement={announcement}
        hero={hero.map((s) => ({
          id: s.id,
          eyebrow: s.eyebrow,
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel,
          ctaHref: s.ctaHref,
          image: s.image,
        }))}
        lookbook={lookbook.map((l) => ({ id: l.id, url: l.url, caption: l.caption, span: l.span }))}
      />
    </div>
  );
}

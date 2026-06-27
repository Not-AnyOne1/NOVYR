import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  eyebrow: z.string().max(80).optional().nullable(),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(240).optional().nullable(),
  ctaLabel: z.string().max(40).optional().nullable(),
  ctaHref: z.string().max(200).optional().nullable(),
  image: z.string().url(),
  order: z.number().int().optional(),
});

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid' }, { status: 400 });

  const slide = await prisma.heroSlide.create({ data: { ...parsed.data, order: parsed.data.order ?? 0 } });
  return NextResponse.json({ ok: true, slide }, { status: 201 });
}

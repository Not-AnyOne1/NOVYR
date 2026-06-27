import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  url: z.string().url(),
  caption: z.string().max(80).optional().nullable(),
  href: z.string().max(200).optional().nullable(),
  span: z.enum(['normal', 'wide', 'tall']).optional(),
  order: z.number().int().optional(),
});

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid' }, { status: 400 });

  const image = await prisma.lookbookImage.create({
    data: { ...parsed.data, span: parsed.data.span ?? 'normal', order: parsed.data.order ?? 0 },
  });
  return NextResponse.json({ ok: true, image }, { status: 201 });
}

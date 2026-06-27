import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminCategorySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const parsed = adminCategorySchema.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const data = { ...parsed.data };
  if (data.slug) data.slug = slugify(data.slug);

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json({ ok: true, category });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await prisma.category.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

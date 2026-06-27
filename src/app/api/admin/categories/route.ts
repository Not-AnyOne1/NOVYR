import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminCategorySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = adminCategorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid' }, { status: 400 });

  const d = parsed.data;
  try {
    const category = await prisma.category.create({
      data: {
        name: d.name,
        slug: slugify(d.slug || d.name),
        description: d.description || null,
        image: d.image || null,
        order: d.order ?? 0,
        active: d.active ?? true,
      },
    });
    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not create category' }, { status: 500 });
  }
}

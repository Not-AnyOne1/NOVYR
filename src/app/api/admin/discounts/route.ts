import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminDiscountSchema } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = adminDiscountSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid' }, { status: 400 });

  const d = parsed.data;
  try {
    const discount = await prisma.discount.create({
      data: {
        code: d.code,
        description: d.description || null,
        type: d.type,
        value: d.value,
        minSubtotalCents: d.minSubtotalCents ?? 0,
        maxUses: d.maxUses ?? null,
        active: d.active ?? true,
        startsAt: d.startsAt ? new Date(d.startsAt) : null,
        endsAt: d.endsAt ? new Date(d.endsAt) : null,
      },
    });
    return NextResponse.json({ ok: true, discount }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'This code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not create discount' }, { status: 500 });
  }
}

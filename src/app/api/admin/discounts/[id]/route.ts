import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

const patchSchema = z.object({
  active: z.boolean().optional(),
  description: z.string().max(160).nullable().optional(),
  value: z.number().int().min(0).optional(),
  minSubtotalCents: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const discount = await prisma.discount.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, discount });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await prisma.discount.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

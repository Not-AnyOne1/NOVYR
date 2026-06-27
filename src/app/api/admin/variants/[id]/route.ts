import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

const schema = z.object({ stock: z.number().int().min(0) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 });

  await prisma.productVariant.update({ where: { id }, data: { stock: parsed.data.stock } });
  return NextResponse.json({ ok: true });
}

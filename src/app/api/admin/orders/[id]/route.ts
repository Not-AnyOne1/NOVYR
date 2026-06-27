import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminOrderStatusSchema } from '@/lib/validations';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const parsed = adminOrderStatusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

  const existing = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  // Restock items when cancelling a previously active order
  const wasActive = !['CANCELLED', 'REFUNDED'].includes(existing.status);
  const willCancel = ['CANCELLED', 'REFUNDED'].includes(parsed.data.status);

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status: parsed.data.status } });
    if (wasActive && willCancel) {
      for (const item of existing.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          }).catch(() => null);
        }
      }
    }
  });

  return NextResponse.json({ ok: true });
}

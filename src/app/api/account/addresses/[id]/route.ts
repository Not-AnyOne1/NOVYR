import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validations';

async function ownsAddress(userId: string, id: string) {
  const found = await prisma.address.findFirst({ where: { id, userId }, select: { id: true } });
  return Boolean(found);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  if (!(await ownsAddress(session.user.id, id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const parsed = addressSchema.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid address' }, { status: 400 });

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, address });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  if (!(await ownsAddress(session.user.id, id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

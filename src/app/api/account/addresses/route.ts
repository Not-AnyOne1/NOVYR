import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validations';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
  });
  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = addressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid address' }, { status: 400 });
  }

  const data = parsed.data;

  // If marked default, unset other defaults
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      label: data.label || 'Home',
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      region: data.region || null,
      postalCode: data.postalCode || null,
      isDefault: data.isDefault ?? false,
    },
  });

  return NextResponse.json({ ok: true, address }, { status: 201 });
}

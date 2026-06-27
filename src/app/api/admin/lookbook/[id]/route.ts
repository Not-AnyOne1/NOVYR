import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await prisma.lookbookImage.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

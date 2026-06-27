import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to write a review' }, { status: 401 });
  }

  if (!rateLimit(`review:${getClientIp(req)}`, 6, 60_000).success) {
    return NextResponse.json({ error: 'Too many reviews. Slow down.' }, { status: 429 });
  }

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid review' }, { status: 400 });
  }

  const { productId, rating, title, body } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Verified buyer if they have ordered this product
  const hasOrdered = await prisma.order.findFirst({
    where: { userId: session.user.id, items: { some: { productId } } },
    select: { id: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  const created = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      authorName: user?.name ?? 'NOVYR Customer',
      rating,
      title: title || null,
      body,
      verified: Boolean(hasOrdered),
      approved: true,
    },
  });

  return NextResponse.json({
    ok: true,
    review: {
      id: created.id,
      authorName: created.authorName,
      rating: created.rating,
      title: created.title,
      body: created.body,
      imageUrl: created.imageUrl,
      verified: created.verified,
      createdAt: created.createdAt.toISOString(),
    },
  });
}

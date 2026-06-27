import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { checkoutSchema } from '@/lib/validations';
import { createOrder, OrderError } from '@/lib/orders';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${getClientIp(req)}`, 10, 60_000).success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Please check your details' },
      { status: 400 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    const order = await createOrder(parsed.data, userId);
    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      totalCents: order.totalCents,
      items: order.items,
    });
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 409 });
    }
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { evaluateDiscount } from '@/lib/discounts';
import { discountApplySchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`discount:${ip}`, 20, 60_000).success) {
    return NextResponse.json({ ok: false, message: 'Too many attempts' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 });
  }

  const parsed = discountApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Enter a valid code' }, { status: 400 });
  }

  const result = await evaluateDiscount(parsed.data.code, parsed.data.subtotalCents);
  return NextResponse.json(result, { status: result.ok ? 200 : 200 });
}

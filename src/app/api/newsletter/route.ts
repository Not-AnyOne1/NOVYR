import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`newsletter:${ip}`, 8, 60_000).success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: parsed.data.source ?? 'footer' },
    });
  } catch {
    return NextResponse.json({ error: 'Could not subscribe right now' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

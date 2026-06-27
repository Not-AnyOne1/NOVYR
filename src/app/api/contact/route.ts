import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(req: Request) {
  if (!rateLimit(`contact:${getClientIp(req)}`, 5, 60_000).success) {
    return NextResponse.json({ error: 'Too many messages. Please try again shortly.' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please complete all fields correctly' }, { status: 400 });
  }

  // In production, forward to your inbox via Resend/SMTP. We log here so the
  // message is captured in server logs without requiring an email provider.
  console.log('[contact]', JSON.stringify(parsed.data));

  return NextResponse.json({ ok: true });
}

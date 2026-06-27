import { prisma } from '@/lib/prisma';
import { formatMAD } from '@/lib/utils';

export type DiscountResult = {
  ok: boolean;
  code?: string;
  description?: string | null;
  discountCents: number;
  freeShipping: boolean;
  message: string;
};

/**
 * Validate a discount code against a subtotal. Pure read — does not consume usage.
 */
export async function evaluateDiscount(
  rawCode: string,
  subtotalCents: number
): Promise<DiscountResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, discountCents: 0, freeShipping: false, message: 'Enter a code' };
  }

  const d = await prisma.discount.findUnique({ where: { code } });
  const invalid = (message: string): DiscountResult => ({
    ok: false,
    discountCents: 0,
    freeShipping: false,
    message,
  });

  if (!d || !d.active) return invalid('This code is not valid');

  const now = new Date();
  if (d.startsAt && d.startsAt > now) return invalid('This code is not active yet');
  if (d.endsAt && d.endsAt < now) return invalid('This code has expired');
  if (d.maxUses != null && d.usedCount >= d.maxUses) return invalid('This code has reached its limit');
  if (subtotalCents < d.minSubtotalCents)
    return invalid(`Spend ${formatMAD(d.minSubtotalCents)} to use this code`);

  let discountCents = 0;
  let freeShipping = false;
  if (d.type === 'PERCENTAGE') discountCents = Math.round((subtotalCents * d.value) / 100);
  else if (d.type === 'FIXED') discountCents = Math.min(d.value, subtotalCents);
  else if (d.type === 'FREE_SHIPPING') freeShipping = true;

  discountCents = Math.min(discountCents, subtotalCents);

  return {
    ok: true,
    code: d.code,
    description: d.description,
    discountCents,
    freeShipping,
    message: 'Discount applied',
  };
}

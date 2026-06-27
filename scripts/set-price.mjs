/**
 * One-off: set every product to a flat price + "was" compare-at price on the live DB.
 * Preserves all other data (orders, customers, images, stock).
 *
 * Run: node scripts/set-price.mjs                → 199 DH, was 279 DH
 *      node scripts/set-price.mjs 199 279        → custom price / compare-at
 *      node scripts/set-price.mjs 199 0          → 199 DH, no compare-at
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dh = Number(process.argv[2]) || 199;
const compareDh = process.argv[3] !== undefined ? Number(process.argv[3]) : 279;

const priceCents = Math.round(dh * 100);
const compareAtCents = compareDh > 0 ? Math.round(compareDh * 100) : null;

const res = await prisma.product.updateMany({
  data: { priceCents, compareAtCents },
});

console.log(
  `✅ Set ${res.count} products to ${dh} DH` +
    (compareAtCents ? ` (was ${compareDh} DH)` : ' (no compare-at).')
);
await prisma.$disconnect();

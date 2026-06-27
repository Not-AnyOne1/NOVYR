import { prisma } from '@/lib/prisma';
import { DiscountManager } from '@/components/admin/DiscountManager';

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: 'desc' } });

  const initial = discounts.map((d) => ({
    id: d.id,
    code: d.code,
    description: d.description,
    type: d.type,
    value: d.value,
    minSubtotalCents: d.minSubtotalCents,
    maxUses: d.maxUses,
    usedCount: d.usedCount,
    active: d.active,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Discounts</h1>
        <p className="mt-1 text-sm text-smoke">Create and manage promo codes.</p>
      </header>
      <DiscountManager initial={initial} />
    </div>
  );
}

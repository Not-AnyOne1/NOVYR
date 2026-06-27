import { prisma } from '@/lib/prisma';
import { InventoryEditor } from '@/components/admin/InventoryEditor';

export default async function InventoryPage() {
  const variants = await prisma.productVariant.findMany({
    orderBy: [{ product: { name: 'asc' } }, { order: 'asc' }],
    include: { product: { select: { name: true } } },
  });

  const rows = variants.map((v) => ({
    id: v.id,
    size: v.size,
    stock: v.stock,
    productName: v.product.name,
  }));

  const totalUnits = rows.reduce((n, r) => n + r.stock, 0);
  const outOfStock = rows.filter((r) => r.stock === 0).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Inventory</h1>
        <p className="mt-1 text-sm text-smoke">
          {totalUnits} units in stock · {outOfStock} variants out of stock
        </p>
      </header>
      <InventoryEditor rows={rows} />
    </div>
  );
}

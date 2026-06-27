import { prisma } from '@/lib/prisma';
import { CategoryManager } from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  const initial = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    order: c.order,
    active: c.active,
    productCount: c._count.products,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Categories</h1>
        <p className="mt-1 text-sm text-smoke">Organize your catalog.</p>
      </header>
      <CategoryManager initial={initial} />
    </div>
  );
}

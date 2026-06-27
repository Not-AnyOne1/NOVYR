import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { formatMAD } from '@/lib/utils';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      variants: { select: { stock: true } },
      category: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Products</h1>
          <p className="mt-1 text-sm text-smoke">{products.length} products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={18} /> New product
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-smoke">No products yet.</p>
          <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex">Create your first product</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wider text-smoke">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {products.map((p) => {
                  const stock = p.variants.reduce((n, v) => n + v.stock, 0);
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                            {p.images[0]?.url && <Image src={p.images[0].url} alt={p.name} fill sizes="40px" className="object-cover" />}
                          </div>
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-smoke-light">{p.category?.name ?? '—'}</td>
                      <td className="px-4 py-3 font-semibold text-white">{formatMAD(p.priceCents)}</td>
                      <td className="px-4 py-3">
                        <span className={stock === 0 ? 'text-rose-400' : stock <= 8 ? 'text-amber-400' : 'text-smoke-light'}>{stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${p.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-600 text-smoke'}`}>
                          {p.active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-electric-300 hover:bg-electric/10">Edit</Link>
                          <DeleteButton endpoint={`/api/admin/products/${p.id}`} confirmText={`Delete "${p.name}"?`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

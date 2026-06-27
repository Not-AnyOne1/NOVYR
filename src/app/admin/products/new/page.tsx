import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true } }),
    prisma.collection.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-smoke-light hover:text-white">
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">New product</h1>
      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminProductSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const parsed = adminProductSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid product' }, { status: 400 });
  }
  const d = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: d.name,
          slug: slugify(d.slug || d.name),
          description: d.description,
          priceCents: d.priceCents,
          compareAtCents: d.compareAtCents ?? null,
          sku: d.sku || null,
          gsm: d.gsm ?? null,
          material: d.material || null,
          fit: d.fit || 'Oversized',
          careInfo: d.careInfo || null,
          categoryId: d.categoryId || null,
          active: d.active ?? true,
          isFeatured: d.isFeatured ?? false,
          isBestSeller: d.isBestSeller ?? false,
          isNewArrival: d.isNewArrival ?? false,
          isLimited: d.isLimited ?? false,
          metaTitle: d.metaTitle || null,
          metaDescription: d.metaDescription || null,
          collections: { set: (d.collectionIds ?? []).map((cid) => ({ id: cid })) },
        },
      });

      // Replace images
      if (d.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (d.images.length) {
          await tx.productImage.createMany({
            data: d.images.map((img, i) => ({ productId: id, url: img.url, alt: img.alt || d.name, order: i })),
          });
        }
      }

      // Upsert variants (preserve stock decrements / FK from orders where possible)
      if (d.variants) {
        const incoming = new Set(d.variants.map((v) => v.size));
        await tx.productVariant.deleteMany({ where: { productId: id, size: { notIn: Array.from(incoming) } } });
        for (let i = 0; i < d.variants.length; i++) {
          const v = d.variants[i]!;
          await tx.productVariant.upsert({
            where: { productId_size: { productId: id, size: v.size } },
            update: { stock: v.stock, sku: v.sku || null, order: i },
            create: { productId: id, size: v.size, stock: v.stock, sku: v.sku || null, order: i },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists' }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Could not update product' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

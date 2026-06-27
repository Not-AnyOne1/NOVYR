import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { adminProductSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = adminProductSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid product' }, { status: 400 });
  }

  const d = parsed.data;
  const slug = slugify(d.slug || d.name);

  try {
    const product = await prisma.product.create({
      data: {
        name: d.name,
        slug,
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
        collections: d.collectionIds?.length ? { connect: d.collectionIds.map((id) => ({ id })) } : undefined,
        images: d.images?.length
          ? { create: d.images.map((img, i) => ({ url: img.url, alt: img.alt || d.name, order: i })) }
          : undefined,
        variants: d.variants?.length
          ? { create: d.variants.map((v, i) => ({ size: v.size, stock: v.stock, sku: v.sku || null, order: i })) }
          : undefined,
      },
    });
    return NextResponse.json({ ok: true, id: product.id }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists' }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Could not create product' }, { status: 500 });
  }
}

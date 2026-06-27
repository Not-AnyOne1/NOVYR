import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { evaluateDiscount } from '@/lib/discounts';
import { generateOrderNumber } from '@/lib/utils';
import { SHIPPING_CENTS } from '@/lib/constants';
import type { CheckoutInput } from '@/lib/validations';

export class OrderError extends Error {
  code: 'OUT_OF_STOCK' | 'INVALID_ITEM' | 'EMPTY';
  constructor(code: OrderError['code'], message: string) {
    super(message);
    this.code = code;
  }
}

export type CreatedOrder = {
  id: string;
  orderNumber: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  items: { id: string; name: string; price: number; quantity: number }[];
};

/**
 * Create a Cash-on-Delivery order. Prices are always taken from the database,
 * never from the client. Stock is validated and decremented atomically.
 */
export async function createOrder(
  input: CheckoutInput,
  userId: string | null
): Promise<CreatedOrder> {
  if (!input.items.length) throw new OrderError('EMPTY', 'Your cart is empty');

  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          priceCents: true,
          active: true,
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // Build validated line items using server-side prices
  const lines = input.items.map((item) => {
    const variant = variantMap.get(item.variantId);
    if (!variant || !variant.product.active || variant.productId !== item.productId) {
      throw new OrderError('INVALID_ITEM', 'One of your items is no longer available');
    }
    if (variant.stock < item.quantity) {
      throw new OrderError(
        'OUT_OF_STOCK',
        `${variant.product.name} (${variant.size}) — only ${variant.stock} left`
      );
    }
    return {
      variantId: variant.id,
      productId: variant.product.id,
      productName: variant.product.name,
      productSlug: variant.product.slug,
      image: variant.product.images[0]?.url ?? null,
      size: variant.size,
      unitCents: variant.product.priceCents,
      quantity: item.quantity,
    };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.unitCents * l.quantity, 0);

  // Evaluate discount (server side)
  let discountCents = 0;
  let freeShipping = false;
  let appliedCode: string | null = null;
  if (input.discountCode) {
    const result = await evaluateDiscount(input.discountCode, subtotalCents);
    if (result.ok) {
      discountCents = result.discountCents;
      freeShipping = result.freeShipping;
      appliedCode = result.code ?? null;
    }
  }

  const shippingCents = freeShipping ? 0 : SHIPPING_CENTS;
  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    // Re-check & decrement stock inside the transaction to avoid oversell
    for (const line of lines) {
      const fresh = await tx.productVariant.findUnique({
        where: { id: line.variantId },
        select: { stock: true },
      });
      if (!fresh || fresh.stock < line.quantity) {
        throw new OrderError('OUT_OF_STOCK', `${line.productName} (${line.size}) is out of stock`);
      }
      await tx.productVariant.update({
        where: { id: line.variantId },
        data: { stock: { decrement: line.quantity } },
      });
    }

    if (appliedCode) {
      await tx.discount.update({
        where: { code: appliedCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return tx.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentMethod: 'COD',
        customerName: input.fullName,
        customerEmail: input.email || null,
        customerPhone: input.phone,
        shippingAddress: input.address,
        shippingCity: input.city,
        shippingRegion: input.region || null,
        shippingNote: input.note || null,
        subtotalCents,
        discountCents,
        shippingCents,
        totalCents,
        discountCode: appliedCode,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            productName: l.productName,
            productSlug: l.productSlug,
            image: l.image,
            size: l.size,
            unitCents: l.unitCents,
            quantity: l.quantity,
          })),
        },
      },
    });
  });

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents,
    items: lines.map((l) => ({
      id: l.productId,
      name: l.productName,
      price: l.unitCents / 100,
      quantity: l.quantity,
    })),
  };
}

export type { Prisma };

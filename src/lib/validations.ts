import { z } from 'zod';

/** Moroccan phone: +212 6/7XXXXXXXX or 06/07XXXXXXXX */
const moroccanPhone = z
  .string()
  .trim()
  .regex(
    /^(?:\+212|0)([5-7])\d{8}$/,
    'Enter a valid Moroccan phone number (e.g. 0612345678)'
  );

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is too short').max(80),
    email: z.string().trim().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  source: z.string().optional(),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

// Form-only fields (cart items are attached separately from the store)
export const checkoutFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(80),
  phone: moroccanPhone,
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().trim().min(5, 'Enter your full address').max(240),
  city: z.string().trim().min(2, 'Select your city'),
  region: z.string().trim().optional(),
  note: z.string().trim().max(500).optional(),
});
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(80),
  phone: moroccanPhone,
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().trim().min(5, 'Enter your full address').max(240),
  city: z.string().trim().min(2, 'Select your city'),
  region: z.string().trim().optional(),
  note: z.string().trim().max(500).optional(),
  discountCode: z.string().trim().max(40).optional(),
  items: z.array(checkoutItemSchema).min(1, 'Your cart is empty'),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const addressSchema = z.object({
  label: z.string().trim().max(40).optional(),
  fullName: z.string().trim().min(2).max(80),
  phone: moroccanPhone,
  address: z.string().trim().min(5).max(240),
  city: z.string().trim().min(2),
  region: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(4, 'Tell us a little more').max(2000),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().optional().or(z.literal('')),
});

export const discountApplySchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotalCents: z.number().int().min(0),
});

// ── Admin schemas ──

export const adminProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10),
  priceCents: z.number().int().min(0),
  compareAtCents: z.number().int().min(0).nullable().optional(),
  sku: z.string().trim().max(60).optional().nullable(),
  gsm: z.number().int().min(0).nullable().optional(),
  material: z.string().trim().max(120).optional().nullable(),
  fit: z.string().trim().max(60).optional().nullable(),
  careInfo: z.string().trim().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  collectionIds: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  metaTitle: z.string().trim().max(160).optional().nullable(),
  metaDescription: z.string().trim().max(320).optional().nullable(),
  images: z
    .array(z.object({ url: z.string().url(), alt: z.string().optional() }))
    .optional(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1),
        stock: z.number().int().min(0),
        sku: z.string().optional().nullable(),
      })
    )
    .optional(),
});
export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminDiscountSchema = z.object({
  code: z.string().trim().min(2).max(40).toUpperCase(),
  description: z.string().trim().max(160).optional().nullable(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'FREE_SHIPPING']),
  value: z.number().int().min(0),
  minSubtotalCents: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  active: z.boolean().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
});

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100),
  description: z.string().trim().optional().nullable(),
  image: z.string().url().optional().nullable(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

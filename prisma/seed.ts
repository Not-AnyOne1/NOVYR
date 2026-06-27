/* eslint-disable no-console */
import { PrismaClient, Role, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

// Real product imagery processed by scripts/process-products.mjs
const real = (key: string, variant: 'main' | 'print' | 'detail' = 'main') =>
  variant === 'main' ? `/products/real/${key}.webp` : `/products/real/${key}-${variant}.webp`;

// Multi-view gallery order. Any view present in /public/products/real is auto-included,
// so dropping <key>-back.webp etc. (then reseeding) extends the gallery automatically.
const VIEWS: { sfx: string; label: string }[] = [
  { sfx: '', label: 'Front view' },
  { sfx: 'back', label: 'Back view' },
  { sfx: 'print', label: 'Print detail' },
  { sfx: 'folded', label: 'Folded' },
  { sfx: 'flatlay', label: 'Flat lay' },
  { sfx: 'lifestyle', label: 'Lifestyle' },
  { sfx: 'side', label: 'Side view' },
  { sfx: 'fabric', label: 'Fabric close-up' },
  { sfx: 'detail', label: 'Detail' },
  { sfx: 'label', label: 'Label close-up' },
];
const REAL_DIR = path.join(process.cwd(), 'public', 'products', 'real');

function buildImages(key: string, name: string) {
  const out: { url: string; alt: string; order: number }[] = [];
  let order = 0;
  for (const v of VIEWS) {
    const file = v.sfx ? `${key}-${v.sfx}.webp` : `${key}.webp`;
    if (fs.existsSync(path.join(REAL_DIR, file))) {
      out.push({ url: `/products/real/${file}`, alt: `${name} — ${v.label}`, order: order++ });
    }
  }
  if (out.length === 0) out.push({ url: real(key, 'main'), alt: `${name} — front`, order: 0 });
  return out;
}

const TEE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  imageKey: string;
  priceCents: number;
  compareAtCents?: number;
  collections: string[];
  sizes: string[];
  stock: number[];
  flags?: Partial<{
    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isLimited: boolean;
  }>;
  dropInDays?: number;
};

const PRODUCTS: SeedProduct[] = [
  // ── Hero piece (soonest-ending limited drop → headlines the homepage) ──
  {
    name: 'Peace Oversized Tee',
    slug: 'peace-oversized-tee',
    description:
      'Boxy oversized tee with a high-contrast portrait graphic and arched red "peace" script. 240 GSM heavyweight cotton, garment-washed for a vintage hand-feel. A numbered drop — strictly limited.',
    imageKey: 'peace',
    priceCents: 34900,
    compareAtCents: 44900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [5, 7, 8, 6, 4, 2],
    flags: { isFeatured: true, isBestSeller: true, isLimited: true },
    dropInDays: 2,
  },
  {
    name: 'Silence Oversized Tee',
    slug: 'silence-oversized-tee',
    description:
      'A washed-black heavyweight tee carrying a chrome-skull graphic and hand-script "Silence" front print. High-density water-based ink on 240 GSM combed cotton. A numbered drop for those who let the work speak.',
    imageKey: 'silence',
    priceCents: 34900,
    compareAtCents: 44900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [4, 6, 7, 5, 3, 2],
    flags: { isFeatured: true, isBestSeller: true, isLimited: true },
    dropInDays: 6,
  },
  {
    name: 'Spider Washed Tee',
    slug: 'spider-washed-tee',
    description:
      'Acid-washed black tee with a haunting motion-blur portrait and spider detail. Vintage hand-feel, boxy oversized fit, 240 GSM heavyweight cotton. Unsettling, unforgettable, unrepeatable.',
    imageKey: 'spider',
    priceCents: 35900,
    compareAtCents: 45900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [3, 5, 6, 5, 3, 1],
    flags: { isBestSeller: true, isNewArrival: true, isLimited: true },
    dropInDays: 14,
  },
  {
    name: 'Extreme Oversized Tee',
    slug: 'extreme-oversized-tee',
    description:
      'Oversized drop-shoulder tee with a red halftone portrait and gothic script. 240 GSM heavyweight cotton, garment-washed. Bold, unapologetic, built for the street.',
    imageKey: 'extreme',
    priceCents: 31900,
    compareAtCents: 41900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [10, 18, 24, 22, 14, 6],
    flags: { isFeatured: true, isBestSeller: true },
  },
  {
    name: 'Livelihood Oversized Tee',
    slug: 'livelihood-oversized-tee',
    description:
      'Statue-and-drip back graphic with a "rec-frame" motif, printed edge-to-edge on a boxy 240 GSM body. The kind of piece people stop you to ask about. Premium inks that never crack or fade.',
    imageKey: 'livelihood',
    priceCents: 32900,
    compareAtCents: 42900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [8, 14, 18, 16, 10, 4],
    flags: { isFeatured: true, isBestSeller: true },
  },
  {
    name: 'Desire Oversized Tee',
    slug: 'desire-oversized-tee',
    description:
      'Blurred-figures graphic with reversed lyric type and a pink "Desire" wordmark. Oversized 240 GSM heavyweight cotton. Dreamlike, cinematic, made to be noticed.',
    imageKey: 'desire',
    priceCents: 32900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 15, 19, 17, 11, 5],
    flags: { isFeatured: true, isNewArrival: true },
  },
  {
    name: 'Lonely Oversized Tee',
    slug: 'lonely-oversized-tee',
    description:
      'Purple-toned portrait with a white cross and "the eyes of darkness" detailing. Oversized 240 GSM heavyweight cotton, premium soft-hand print. Emotion, printed.',
    imageKey: 'lonely',
    priceCents: 31900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 14, 18, 16, 10, 5],
    flags: { isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Dark Oversized Tee',
    slug: 'dark-oversized-tee',
    description:
      'A haunting portrait graphic with red star accents and gothic "Dark" type. Oversized 240 GSM heavyweight cotton with a clean drop-shoulder drape. Statement-first, everyday-wearable.',
    imageKey: 'dark',
    priceCents: 30900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 15, 20, 18, 12, 5],
    flags: { isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Samson Heavyweight Tee',
    slug: 'samson-heavyweight-tee',
    description:
      'A monochrome "Samson and the Lion" back print rendered in fine halftone with gothic lettering. Heavyweight 240 GSM cotton, oversized fit. Timeless, tonal, and built to last seasons.',
    imageKey: 'samson',
    priceCents: 33900,
    collections: ['graphic', 'oversized', 'essentials'],
    sizes: TEE_SIZES,
    stock: [7, 13, 17, 15, 9, 4],
    flags: { isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Breathe Oversized Tee',
    slug: 'breathe-oversized-tee',
    description:
      'Reaching-hands halftone graphic with a minimal "Breathe" wordmark. Printed on our 240 GSM oversized body with reinforced collar and side-seam construction. Quiet power.',
    imageKey: 'breathe',
    priceCents: 29900,
    collections: ['graphic', 'oversized', 'essentials'],
    sizes: TEE_SIZES,
    stock: [11, 17, 21, 19, 12, 6],
    flags: { isFeatured: true, isNewArrival: true },
  },
  {
    name: 'Chasing Oversized Tee',
    slug: 'chasing-oversized-tee',
    description:
      'White grain-print silhouette and fingerprint motif — "the dream started chasing me." Clean monochrome graphic on a 240 GSM oversized body. Understated, conceptual, premium.',
    imageKey: 'dream',
    priceCents: 29900,
    collections: ['graphic', 'essentials'],
    sizes: TEE_SIZES,
    stock: [12, 18, 22, 20, 13, 6],
    flags: { isNewArrival: true },
  },
  {
    name: 'Syndicate Oversized Tee',
    slug: 'syndicate-oversized-tee',
    description:
      'Underground mask graphic with arched collar type. A numbered limited release on 240 GSM heavyweight cotton, garment-washed. Strictly limited — when it is gone, it is gone.',
    imageKey: 'syndicate',
    priceCents: 31900,
    collections: ['graphic', 'limited'],
    sizes: TEE_SIZES,
    stock: [3, 5, 6, 4, 2, 1],
    flags: { isLimited: true, isNewArrival: true },
    dropInDays: 9,
  },
  // ── drop 003 ──
  {
    name: 'Money & Love Oversized Tee',
    slug: 'money-love-oversized-tee',
    description:
      '"In God We Trust" — an ornate Persian-rug graphic with hand-script "Money / Love". Printed edge-to-edge on a 240 GSM oversized body. Opulent, ironic, unmistakable.',
    imageKey: 'moneylove',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [10, 16, 20, 18, 12, 5],
    flags: { isFeatured: true, isNewArrival: true },
  },
  {
    name: 'Don’t Get Lost Tee',
    slug: 'dont-get-lost-tee',
    description:
      '"Do not get lost in the darkness" — a blue-toned cinematic graphic of a lone figure chasing the light. 240 GSM heavyweight cotton, oversized fit. A reminder, printed.',
    imageKey: 'getlost',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 15, 19, 17, 11, 5],
    flags: { isNewArrival: true },
  },
  {
    name: 'G.O.A.T Oversized Tee',
    slug: 'goat-oversized-tee',
    description:
      'A winged-goat icon framed in ornament with Arabic lettering — a statement of greatness. High-density print on a 240 GSM oversized body. Bold, surreal, premium.',
    imageKey: 'goat',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [8, 14, 18, 16, 10, 4],
    flags: { isFeatured: true, isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Suffer Oversized Tee',
    slug: 'suffer-oversized-tee',
    description:
      '"To be a star you must suffer" — a high-contrast split portrait with a red star. 240 GSM heavyweight cotton, oversized fit. Raw, cinematic, unforgettable.',
    imageKey: 'suffer',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 14, 18, 16, 10, 5],
    flags: { isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Disorders Oversized Tee',
    slug: 'disorders-oversized-tee',
    description:
      'A raw, grunge-collage portrait graphic with scratched typography. A numbered limited release on 240 GSM heavyweight cotton, garment-washed. Unfiltered and strictly limited.',
    imageKey: 'disorders',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [4, 6, 7, 5, 3, 2],
    flags: { isLimited: true, isNewArrival: true },
    dropInDays: 11,
  },
  {
    name: 'So Wrong Oversized Tee',
    slug: 'so-wrong-oversized-tee',
    description:
      '"I was so sure and I was so wrong" — a haloed figure in red sun-rays. 240 GSM heavyweight cotton, oversized fit. Emotional, graphic, made to be noticed.',
    imageKey: 'wrong',
    priceCents: 19900,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 15, 19, 17, 11, 5],
    flags: { isBestSeller: true, isNewArrival: true },
  },
];

const CATEGORIES = [
  { name: 'T-Shirts', slug: 'tshirts', description: 'Premium oversized heavyweight graphic tees.', order: 1 },
];

const COLLECTIONS = [
  { name: 'Oversized Collection', slug: 'oversized', tagline: 'Built for the drop-shoulder silhouette.', description: 'Our signature boxy, drop-shoulder cuts in heavyweight cotton.', image: real('samson'), featured: true, order: 1 },
  { name: 'Graphic Collection', slug: 'graphic', tagline: 'Wearable statements.', description: 'Bold, high-density prints that never crack or fade.', image: real('peace'), featured: true, order: 2 },
  { name: 'Essentials Collection', slug: 'essentials', tagline: 'The foundation.', description: 'Endlessly wearable staples engineered to last.', image: real('breathe'), featured: true, order: 3 },
  { name: 'Limited Edition', slug: 'limited', tagline: 'Once it is gone, it is gone.', description: 'Numbered, strictly limited releases for the few.', image: real('silence'), featured: true, order: 4 },
];

const REVIEWS_POOL = [
  { authorName: 'Yassine B.', rating: 5, title: 'Best tee I own', body: 'The weight of this cotton is unreal. Feels premium, fits perfect oversized. Delivery was fast and free.' },
  { authorName: 'Salma E.', rating: 5, title: 'Obsessed', body: 'Exactly like the photos. The print quality is so clean. Already ordered a second one.' },
  { authorName: 'Mehdi A.', rating: 5, title: 'Premium quality', body: 'You can feel the difference vs cheap streetwear. 240 GSM is no joke. COD made it easy.' },
  { authorName: 'Imane K.', rating: 4, title: 'Love it', body: 'Great fit and material. Wanted it slightly longer but still amazing for the price.' },
  { authorName: 'Omar T.', rating: 5, title: 'Worth every dirham', body: 'Heavyweight, structured, and the oversized fit is exactly what I wanted. NOVYR is the real deal.' },
];

async function main() {
  console.log('🌱 Seeding NOVYR...');

  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.lookbookImage.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.siteSetting.deleteMany();

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@novyr.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe!2026';
  const adminHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash: adminHash, name: 'NOVYR Admin' },
    create: { email: adminEmail, role: Role.ADMIN, passwordHash: adminHash, name: 'NOVYR Admin' },
  });
  console.log(`👤 Admin: ${adminEmail}`);

  const demoHash = await bcrypt.hash('Customer!2026', 12);
  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@novyr.com' },
    update: {},
    create: { email: 'customer@novyr.com', name: 'Demo Customer', passwordHash: demoHash, phone: '+212600000000', role: Role.CUSTOMER },
  });

  const categoryMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.slug, created.id);
  }

  const collectionMap = new Map<string, string>();
  for (const c of COLLECTIONS) {
    const created = await prisma.collection.create({ data: c });
    collectionMap.set(c.slug, created.id);
  }

  let skuCounter = 1000;
  for (const p of PRODUCTS) {
    const baseSku = `NVR-${skuCounter++}`;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        // Flat catalogue price — was 279 DH, now 199 DH
        priceCents: 19900,
        compareAtCents: 27900,
        sku: baseSku,
        gsm: 240,
        material: '100% Heavyweight Combed Cotton',
        fit: 'Oversized',
        careInfo: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Iron on reverse.',
        isFeatured: p.flags?.isFeatured ?? false,
        isBestSeller: p.flags?.isBestSeller ?? false,
        isNewArrival: p.flags?.isNewArrival ?? false,
        isLimited: p.flags?.isLimited ?? false,
        metaTitle: `${p.name} | NOVYR`,
        metaDescription: p.description.slice(0, 155),
        dropEndsAt: p.dropInDays ? new Date(Date.now() + p.dropInDays * 24 * 60 * 60 * 1000) : null,
        categoryId: categoryMap.get('tshirts') ?? null,
        collections: {
          connect: p.collections
            .map((slug) => collectionMap.get(slug))
            .filter((id): id is string => Boolean(id))
            .map((id) => ({ id })),
        },
        // Multi-view gallery, auto-built from whatever views exist on disk
        images: { create: buildImages(p.imageKey, p.name) },
        variants: {
          create: p.sizes.map((size, i) => ({ size, sku: `${baseSku}-${size}`, stock: p.stock[i] ?? 0, order: i })),
        },
      },
    });

    if (p.flags?.isFeatured || p.flags?.isBestSeller) {
      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const r = REVIEWS_POOL[(skuCounter + i) % REVIEWS_POOL.length];
        await prisma.review.create({
          data: { productId: product.id, authorName: r.authorName, rating: r.rating, title: r.title, body: r.body, verified: true, approved: true },
        });
      }
    }
    console.log(`👕 ${p.name}`);
  }

  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.wishlistItem.create({ data: { userId: demoCustomer.id, productId: firstProduct.id } });
  }
  await prisma.address.create({
    data: {
      userId: demoCustomer.id,
      label: 'Home',
      fullName: 'Demo Customer',
      phone: '+212600000000',
      address: '12 Boulevard Mohammed V, Apt 4',
      city: 'Casablanca',
      region: 'Casablanca-Settat',
      isDefault: true,
    },
  });

  await prisma.heroSlide.createMany({
    data: [
      { eyebrow: 'NEW DROP — LIVE NOW', title: 'WEAR THE CULTURE.', subtitle: 'Premium oversized graphic tees, printed for the few.', ctaLabel: 'Shop The Drop', ctaHref: '/collections/limited', image: real('livelihood'), order: 0 },
      { eyebrow: '240 GSM HEAVYWEIGHT', title: 'BUILT TO OUTLAST.', subtitle: 'Heavyweight cotton, high-density prints, a fit that owns the street.', ctaLabel: 'Explore Collection', ctaHref: '/shop', image: real('samson'), order: 1 },
    ],
  });

  await prisma.lookbookImage.createMany({
    data: [
      { url: real('livelihood'), caption: 'SS26 Campaign', span: 'tall', order: 0 },
      { url: real('peace'), caption: 'Peace Edition', span: 'normal', order: 1 },
      { url: real('samson'), caption: 'Statement Backs', span: 'wide', order: 2 },
      { url: real('desire'), caption: 'Desire', span: 'normal', order: 3 },
      { url: real('spider'), caption: 'Washed Series', span: 'normal', order: 4 },
      { url: real('lonely'), caption: 'Eyes of Darkness', span: 'tall', order: 5 },
    ],
  });

  await prisma.discount.createMany({
    data: [
      { code: 'WELCOME10', description: '10% off your first order', type: DiscountType.PERCENTAGE, value: 10, minSubtotalCents: 0, active: true },
      { code: 'DROP15', description: '15% off the latest drop', type: DiscountType.PERCENTAGE, value: 15, minSubtotalCents: 50000, active: true },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: 'announcement', value: { enabled: true, messages: ['🚚 FREE DELIVERY ANYWHERE IN MOROCCO', '🔥 LIMITED STOCK AVAILABLE'] } },
      { key: 'newsletter', value: { headline: 'JOIN THE NOVYR MOVEMENT', subtext: 'Early access to drops, exclusive discounts, and VIP releases.' } },
    ],
  });

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

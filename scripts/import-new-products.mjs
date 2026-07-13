/**
 * NOVYR — import drop-005 products directly into the database.
 * Idempotent: skips any product whose slug already exists. Mirrors the seed's
 * conventions (flat 199 DH, 240 GSM specs, unique NVR-#### SKUs, multi-view
 * gallery from whatever webp views exist on disk).
 *
 * Run: node scripts/import-new-products.mjs
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_DIR = join(__dirname, '..', 'public', 'products', 'real');

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_STOCK = [8, 14, 18, 16, 10, 4];
const DEFAULT_DESCRIPTION = (name) =>
  `${name} — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.`;

// name derived from the printed design (raw filenames are timestamps)
const NEW_PRODUCTS = [
  { key: 'talktoomuch', name: 'Talk Too Much Tee' },
  { key: 'streetways', name: 'Street Ways Tee' },
  { key: 'toldchatgpt', name: 'I Told ChatGPT Tee' },
  { key: 'bornthisway', name: 'Born This Way Tee' },
  { key: 'change555', name: 'Change 555 Tee' },
  { key: 'theynotlikeus', name: 'They Not Like Us Tee' },
  { key: 'euphoria', name: 'Euphoria Tee' },
  { key: 'writhers', name: 'The Writhers Tee' },
  { key: 'darkvision2', name: 'Dark Vision Tee' },
  { key: 'lavish', name: 'Lavish Tee' },
  { key: 'fein', name: 'Fein Oversized Tee' },
  { key: 'savages', name: 'Savages Tee' },
  { key: 'prettygirls', name: 'Pretty Girls Love Brands Tee' },
  { key: 'hellstar', name: 'Hellstar Records Tee' },
  { key: 'thug', name: 'Thug Tee' },
  { key: 'toocold', name: 'Too Cold For You Tee' },
  { key: 'sideprofile', name: 'Side Profile Tee' },
  { key: 'iwasblind', name: 'I Was Blind Tee' },
  { key: 'makelove', name: 'Make Love Make Art Tee' },
  { key: 'hardway', name: 'The Hard Way Tee' },
  { key: 'toogucci', name: 'Too Gucci Tee' },
  { key: 'inspiredfear', name: 'Inspired By Fear Tee' },
  { key: 'redlips', name: 'Red Lips Tee' },
];

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Multi-view gallery from whatever views exist on disk (same as seed). */
function buildImages(key, name) {
  const real = (k, v) => `/products/real/${k}${v ? `-${v}` : ''}.webp`;
  const VIEWS = [
    { suffix: '', alt: `${name} — Front view` },
    { suffix: 'back', alt: `${name} — Back view` },
    { suffix: 'print', alt: `${name} — Print detail` },
    { suffix: 'fabric', alt: `${name} — Fabric close-up` },
    { suffix: 'detail', alt: `${name} — Detail` },
    { suffix: 'label', alt: `${name} — Label` },
  ];
  return VIEWS.filter((v) => existsSync(join(REAL_DIR, `${key}${v.suffix ? `-${v.suffix}` : ''}.webp`)))
    .map((v, i) => ({ url: real(key, v.suffix), alt: v.alt, order: i }));
}

async function main() {
  const collections = await prisma.collection.findMany({ select: { id: true, slug: true } });
  const collectionIds = collections.filter((c) => ['graphic', 'oversized'].includes(c.slug)).map((c) => ({ id: c.id }));
  const category = await prisma.category.findFirst({ where: { slug: 'tshirts' }, select: { id: true } });

  // Unique SKU numbering — continue above the highest existing NVR-#### base
  const existing = await prisma.product.findMany({ select: { sku: true, slug: true } });
  const usedSlugs = new Set(existing.map((p) => p.slug));
  let skuCounter = Math.max(1999, ...existing.map((p) => Number(p.sku?.match(/^NVR-(\d+)$/)?.[1] ?? 0))) + 1;

  // Products already imported by image key (front image URL is /products/real/<key>.webp
  // or /products/real/<key>.webp with no suffix) — used to make reruns a true no-op.
  const existingByImage = new Set(
    (await prisma.product.findMany({ select: { images: { take: 1, orderBy: { order: 'asc' }, select: { url: true } } } }))
      .map((p) => p.images[0]?.url)
      .filter(Boolean)
  );

  let created = 0;
  for (const item of NEW_PRODUCTS) {
    const images = buildImages(item.key, item.name);
    if (!images.length) {
      console.warn(`⚠️  ${item.key}: no processed images on disk — skipped`);
      continue;
    }

    // Idempotent: this exact image key is already a product → skip (don't duplicate).
    if (existingByImage.has(images[0].url)) {
      console.log(`↷ ${item.name} (${item.key}) already imported — skipped`);
      continue;
    }

    // Auto slug with dedupe (e.g. dark-vision-tee is owned by the archived v1)
    let slug = slugify(item.name);
    for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(item.name)}-${n}`;
    usedSlugs.add(slug);

    const baseSku = `NVR-${skuCounter++}`;
    await prisma.product.create({
      data: {
        name: item.name,
        slug,
        description: DEFAULT_DESCRIPTION(item.name),
        priceCents: 19900,
        compareAtCents: null,
        sku: baseSku,
        gsm: 240,
        material: '100% Heavyweight Combed Cotton',
        fit: 'Oversized',
        careInfo: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Iron on reverse.',
        active: true,
        isNewArrival: true,
        metaTitle: item.name,
        metaDescription: DEFAULT_DESCRIPTION(item.name).slice(0, 155),
        categoryId: category?.id ?? null,
        collections: { connect: collectionIds },
        images: { create: images },
        variants: {
          create: SIZES.map((size, i) => ({ size, sku: `${baseSku}-${size}`, stock: DEFAULT_STOCK[i], order: i })),
        },
      },
    });
    console.log(`✅ ${item.name} → /product/${slug} (${baseSku}, ${images.length} views)`);
    created++;
  }

  const active = await prisma.product.count({ where: { active: true } });
  console.log(`\nCreated ${created} products. Active catalog: ${active}.`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

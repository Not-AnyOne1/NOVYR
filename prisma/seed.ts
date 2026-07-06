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
    priceCents: 21500,
    compareAtCents: 44900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [5, 7, 8, 6, 4, 2],
    flags: { isFeatured: true, isBestSeller: true, isLimited: true },
    dropInDays: 2,
  },
  {
    name: 'Spider Washed Tee',
    slug: 'spider-washed-tee',
    description:
      'Acid-washed black tee with a haunting motion-blur portrait and spider detail. Vintage hand-feel, boxy oversized fit, 240 GSM heavyweight cotton. Unsettling, unforgettable, unrepeatable.',
    imageKey: 'spider',
    priceCents: 21500,
    compareAtCents: 45900,
    collections: ['graphic', 'oversized', 'limited'],
    sizes: TEE_SIZES,
    stock: [3, 5, 6, 5, 3, 1],
    flags: { isBestSeller: true, isNewArrival: true, isLimited: true },
    dropInDays: 14,
  },
  {
    name: 'Desire Oversized Tee',
    slug: 'desire-oversized-tee',
    description:
      'Blurred-figures graphic with reversed lyric type and a pink "Desire" wordmark. Oversized 240 GSM heavyweight cotton. Dreamlike, cinematic, made to be noticed.',
    imageKey: 'desire',
    priceCents: 22500,
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
    priceCents: 21500,
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
    priceCents: 22500,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 15, 20, 18, 12, 5],
    flags: { isBestSeller: true, isNewArrival: true },
  },
  {
    name: 'Breathe Oversized Tee',
    slug: 'breathe-oversized-tee',
    description:
      'Reaching-hands halftone graphic with a minimal "Breathe" wordmark. Printed on our 240 GSM oversized body with reinforced collar and side-seam construction. Quiet power.',
    imageKey: 'breathe',
    priceCents: 19900,
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
    priceCents: 19900,
    collections: ['graphic', 'essentials'],
    sizes: TEE_SIZES,
    stock: [12, 18, 22, 20, 13, 6],
    flags: { isNewArrival: true },
  },
  // ── drop 003 ──
  {
    name: 'Suffer Oversized Tee',
    slug: 'suffer-oversized-tee',
    description:
      '"To be a star you must suffer" — a high-contrast split portrait with a red star. 240 GSM heavyweight cotton, oversized fit. Raw, cinematic, unforgettable.',
    imageKey: 'suffer',
    priceCents: 21500,
    compareAtCents: 27900,
    collections: ['graphic', 'oversized'],
    sizes: TEE_SIZES,
    stock: [9, 14, 18, 16, 10, 5],
    flags: { isBestSeller: true, isNewArrival: true },
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
  // ── drop 005 (July 2026) — auto-imported, design-derived names ──
  { name: 'Talk Too Much Tee', slug: 'talk-too-much-tee', description: 'Talk Too Much Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'talktoomuch', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Street Ways Tee', slug: 'street-ways-tee', description: 'Street Ways Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'streetways', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'I Told ChatGPT Tee', slug: 'i-told-chatgpt-tee', description: 'I Told ChatGPT Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'toldchatgpt', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Born This Way Tee', slug: 'born-this-way-tee', description: 'Born This Way Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'bornthisway', priceCents: 22500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Change 555 Tee', slug: 'change-555-tee', description: 'Change 555 Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'change555', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'They Not Like Us Tee', slug: 'they-not-like-us-tee', description: 'They Not Like Us Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'theynotlikeus', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Euphoria Tee', slug: 'euphoria-tee', description: 'Euphoria Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'euphoria', priceCents: 23900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'The Writhers Tee', slug: 'the-writhers-tee', description: 'The Writhers Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'writhers', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Dark Vision Tee', slug: 'dark-vision-tee-2', description: 'Dark Vision Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'darkvision2', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Lavish Tee', slug: 'lavish-tee', description: 'Lavish Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'lavish', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Fein Oversized Tee', slug: 'fein-oversized-tee', description: 'Fein Oversized Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'fein', priceCents: 22500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Savages Tee', slug: 'savages-tee', description: 'Savages Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'savages', priceCents: 22500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Pretty Girls Love Brands Tee', slug: 'pretty-girls-love-brands-tee', description: 'Pretty Girls Love Brands Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'prettygirls', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Hellstar Records Tee', slug: 'hellstar-records-tee', description: 'Hellstar Records Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'hellstar', priceCents: 23900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Thug Tee', slug: 'thug-tee', description: 'Thug Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'thug', priceCents: 21500, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  // ── drop 006 (July 2026) ──
  { name: 'Too Cold For You Tee', slug: 'too-cold-for-you-tee', description: 'Too Cold For You Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'toocold', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
  { name: 'Side Profile Tee', slug: 'side-profile-tee', description: 'Side Profile Tee — oversized graphic tee in 240 GSM heavyweight combed cotton with a high-density, no-crack print. Boxy street silhouette, garment-washed for a broken-in feel. Free delivery anywhere in Morocco, cash on delivery.', imageKey: 'sideprofile', priceCents: 19900, collections: ['graphic', 'oversized'], sizes: TEE_SIZES, stock: [8, 14, 18, 16, 10, 4], flags: { isNewArrival: true } },
];

const CATEGORIES = [
  { name: 'T-Shirts', slug: 'tshirts', description: 'Premium oversized heavyweight graphic tees.', order: 1 },
];

const COLLECTIONS = [
  { name: 'Oversized Collection', slug: 'oversized', tagline: 'Built for the drop-shoulder silhouette.', description: 'Our signature boxy, drop-shoulder cuts in heavyweight cotton.', image: real('dark'), featured: true, order: 1 },
  { name: 'Graphic Collection', slug: 'graphic', tagline: 'Wearable statements.', description: 'Bold, high-density prints that never crack or fade.', image: real('peace'), featured: true, order: 2 },
  { name: 'Essentials Collection', slug: 'essentials', tagline: 'The foundation.', description: 'Endlessly wearable staples engineered to last.', image: real('breathe'), featured: true, order: 3 },
  { name: 'Limited Edition', slug: 'limited', tagline: 'Once it is gone, it is gone.', description: 'Numbered, strictly limited releases for the few.', image: real('wrong'), featured: true, order: 4 },
];

// Unique reviews — assigned without repetition across the catalogue (see loop below).
const REVIEWS_POOL = [
  { authorName: 'Yassine B.', rating: 5, title: 'Best tee I own', body: 'The weight of this cotton is unreal — heavy, structured, fits perfect oversized.' },
  { authorName: 'Salma E.', rating: 5, title: 'Obsessed', body: 'Exactly like the photos, the print quality is so clean. Already ordered a second.' },
  { authorName: 'Mehdi A.', rating: 5, title: 'Premium quality', body: 'You feel the difference vs cheap streetwear. COD made it effortless.' },
  { authorName: 'Imane K.', rating: 4, title: 'Love the fit', body: 'Great material and drape — wanted it a touch longer but still amazing.' },
  { authorName: 'Omar T.', rating: 5, title: 'Worth every dirham', body: 'Heavyweight and clean. NOVYR is the real deal.' },
  { authorName: 'Aya R.', rating: 5, title: 'Print is insane', body: 'The graphic looks even better in person. So many compliments.' },
  { authorName: 'Hamza L.', rating: 5, title: 'Fits like a dream', body: 'Boxy oversized exactly how I like it. Fast free delivery too.' },
  { authorName: 'Nada B.', rating: 4, title: 'Really good', body: 'Lovely heavy cotton. Sizing runs generous — size down if unsure.' },
  { authorName: 'Anas M.', rating: 5, title: 'Quality streetwear', body: 'Thick fabric and no cracking on the print after a few washes.' },
  { authorName: 'Sara H.', rating: 5, title: 'My new favorite', body: 'Wear it every week and it holds its shape perfectly.' },
  { authorName: 'Ayoub Z.', rating: 5, title: 'Clean and premium', body: 'Looks luxury, feels luxury. Delivered in 3 days to Casa.' },
  { authorName: 'Lina F.', rating: 4, title: 'Great piece', body: 'Beautiful print and weight. The packaging felt premium too.' },
  { authorName: 'Reda K.', rating: 5, title: 'Top tier', body: 'Heavier than other brands I own. Completely worth it.' },
  { authorName: 'Ghita S.', rating: 5, title: 'Stunning', body: 'The detail on the graphic is unreal. Will definitely buy more.' },
  { authorName: 'Karim B.', rating: 5, title: 'Solid drop', body: 'Fit, weight, print — all on point. COD is a big plus.' },
  { authorName: 'Meryem T.', rating: 4, title: 'Very nice', body: 'Soft but heavy. Delivery to Oujda took a little longer but worth it.' },
  { authorName: 'Bilal A.', rating: 5, title: 'Exceeded expectations', body: "Photos don't do it justice. Premium all the way." },
  { authorName: 'Hiba L.', rating: 5, title: 'In love', body: 'Oversized fit is perfect and the cotton is genuinely thick.' },
  { authorName: 'Soufiane R.', rating: 5, title: 'Best in Morocco', body: 'Finally a local brand with real quality.' },
  { authorName: 'Douaa M.', rating: 4, title: 'Happy with it', body: 'Great tee, true to the pictures. Would recommend.' },
  { authorName: 'Zakaria H.', rating: 5, title: 'Premium feel', body: 'Structured heavyweight cotton with a crisp print. 10/10.' },
  { authorName: 'Nizar E.', rating: 5, title: 'Amazing quality', body: 'Wore it out and got asked where it was from all night.' },
  { authorName: 'Kenza B.', rating: 5, title: 'Perfect', body: 'Exactly what I wanted — clean, heavy, oversized.' },
  { authorName: 'Othmane S.', rating: 4, title: 'Really solid', body: 'Good weight and print. The quality justifies the price.' },
  { authorName: 'Rania K.', rating: 5, title: 'Obsessed again', body: 'Second order, same great quality and fast shipping.' },
  { authorName: 'Adam T.', rating: 5, title: 'Worth it', body: 'Heavy cotton, not see-through, and the print stays sharp.' },
  { authorName: 'Salma B.', rating: 5, title: 'Beautiful', body: 'The graphic is art. Fits oversized and feels premium.' },
  { authorName: 'Yahya M.', rating: 5, title: 'Top quality', body: 'Better than brands costing double. COD made it easy.' },
  { authorName: 'Hajar L.', rating: 4, title: 'Lovely', body: 'Great material and a generous fit. Happy customer.' },
  { authorName: 'Ziad R.', rating: 5, title: 'Elite', body: 'NOVYR nailed it — weight, fit, and print all premium.' },
  { authorName: 'Marwa T.', rating: 5, title: 'Incredible', body: 'The fabric weight is no joke. Premium from the first wear.' },
  { authorName: 'Ilyas B.', rating: 5, title: 'So clean', body: 'Print is sharp and the fit is perfectly boxy.' },
  { authorName: 'Chaimae R.', rating: 4, title: 'Great buy', body: 'Heavy cotton with a lovely drape. Delivery was quick.' },
  { authorName: 'Walid M.', rating: 5, title: 'Premium', body: 'Feels like a brand triple the price. Love it.' },
  { authorName: 'Asma K.', rating: 5, title: 'Perfect oversized', body: 'Exactly the fit I wanted, and the graphic is stunning.' },
  { authorName: 'Hamza R.', rating: 5, title: 'Top notch', body: 'No cracking, no fading — just quality.' },
  { authorName: 'Ines B.', rating: 4, title: 'Very happy', body: 'Beautiful tee, generous sizing. Recommend.' },
  { authorName: 'Tarik L.', rating: 5, title: 'Best purchase', body: 'Heavyweight and structured. NOVYR delivers.' },
  { authorName: 'Yasmine E.', rating: 5, title: 'Obsessed', body: 'The print quality is unreal. Ordering more.' },
  { authorName: 'Mohammed A.', rating: 5, title: 'Quality is there', body: 'Thick, premium, and the fit is on point.' },
  { authorName: 'Khadija S.', rating: 4, title: 'Lovely', body: 'Soft yet heavy. Slightly long delivery but worth it.' },
  { authorName: 'Anir B.', rating: 5, title: 'Elite tee', body: 'Compliments every time I wear it.' },
  { authorName: 'Sofia M.', rating: 5, title: 'Amazing', body: 'Looks even better in person. Premium feel.' },
  { authorName: 'Reda T.', rating: 5, title: 'Worth every dirham', body: 'Heavy cotton, crisp print, fast COD.' },
  { authorName: 'Lamia K.', rating: 4, title: 'Really good', body: 'Great quality and fit. Happy with my order.' },
  { authorName: 'Ayman R.', rating: 5, title: 'Premium streetwear', body: 'Finally, quality streetwear made for Morocco.' },
  { authorName: 'Nour H.', rating: 5, title: 'Stunning piece', body: 'The graphic is art and the cotton is thick.' },
  { authorName: 'Said B.', rating: 5, title: 'Top quality', body: 'Better than imports. Will buy again.' },
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
  let reviewCursor = 0; // assigns each pool review exactly once → no duplicate reviews
  for (const p of PRODUCTS) {
    const baseSku = `NVR-${skuCounter++}`;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        // Tiered by perceived design value (199/215/225/239 DH) — no fabricated
        // compare-at discount anchor.
        priceCents: p.priceCents,
        compareAtCents: null,
        sku: baseSku,
        gsm: 240,
        material: '100% Heavyweight Combed Cotton',
        fit: 'Oversized',
        careInfo: 'Machine wash cold, inside out. Do not bleach. Tumble dry low. Iron on reverse.',
        isFeatured: p.flags?.isFeatured ?? false,
        isBestSeller: p.flags?.isBestSeller ?? false,
        isNewArrival: p.flags?.isNewArrival ?? false,
        isLimited: p.flags?.isLimited ?? false,
        metaTitle: p.name,
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
      for (let i = 0; i < 2 && reviewCursor < REVIEWS_POOL.length; i++) {
        const r = REVIEWS_POOL[reviewCursor++]!;
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
      { eyebrow: 'NEW DROP — LIVE NOW', title: 'WEAR THE CULTURE.', subtitle: 'Premium oversized graphic tees, printed for the few.', ctaLabel: 'Shop The Drop', ctaHref: '/collections/limited', image: real('peace'), order: 0 },
      { eyebrow: '240 GSM HEAVYWEIGHT', title: 'BUILT TO OUTLAST.', subtitle: 'Heavyweight cotton, high-density prints, a fit that owns the street.', ctaLabel: 'Explore Collection', ctaHref: '/shop', image: real('dark'), order: 1 },
    ],
  });

  await prisma.lookbookImage.createMany({
    data: [
      { url: real('breathe'), caption: 'SS26 Campaign', span: 'tall', order: 0 },
      { url: real('peace'), caption: 'Peace Edition', span: 'normal', order: 1 },
      { url: real('suffer'), caption: 'Statement Prints', span: 'wide', order: 2 },
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

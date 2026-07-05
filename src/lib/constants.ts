/**
 * Resolve the canonical site URL for absolute links (SEO / OG / sitemap).
 * Priority: explicit env → Vercel's auto-provided deployment URL → local dev.
 * In production on Vercel, VERCEL_URL is always set, so localhost is never used.
 * All in-app navigation uses relative paths, so this never affects redirects.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:3000'; // local development only — unreachable in production
}

export const SITE = {
  name: 'NOVYR',
  slogan: 'Wear Beyond Ordinary.',
  description:
    'NOVYR is a premium streetwear brand — heavyweight oversized t-shirts, graphic collections and limited drops. Free delivery anywhere in Morocco. Cash on delivery.',
  url: resolveSiteUrl(),
  email: 'novyr.shop@gmail.com',
  phone: '+212 6 00 00 00 00',
  currency: 'MAD',
  locale: 'en_MA',
  social: {
    instagram: 'https://www.instagram.com/novyr_shopp',
    tiktok: 'https://www.tiktok.com/@novyr_shop',
    twitter: 'https://twitter.com/novyr',
  },
} as const;

/** Free delivery across Morocco — shipping is always 0 centimes. */
export const SHIPPING_CENTS = 0;
export const FREE_SHIPPING_THRESHOLD_CENTS = 0;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const MOROCCO_CITIES = [
  'Agadir',
  'Ahfir',
  'Aïn Harrouda',
  'Aït Melloul',
  'Al Hoceïma',
  'Asilah',
  'Azilal',
  'Azrou',
  'Béni Mellal',
  'Ben Guerir',
  'Benslimane',
  'Berkane',
  'Berrechid',
  'Bouarfa',
  'Boujdour',
  'Bouskoura',
  'Bouznika',
  'Casablanca',
  'Chefchaouen',
  'Chichaoua',
  'Dakhla',
  'Dcheira El Jihadia',
  'Demnate',
  'El Jadida',
  'El Kelaâ des Sraghna',
  'Errachidia',
  'Es-Semara',
  'Essaouira',
  'Fès',
  'Figuig',
  'Fnideq',
  'Fquih Ben Salah',
  'Guelmim',
  'Guercif',
  'Had Soualem',
  'Imzouren',
  'Inezgane',
  'Jerada',
  'Kénitra',
  'Khémisset',
  'Khénifra',
  'Khouribga',
  'Ksar El Kébir',
  'Laâyoune',
  'Lahraouyine',
  'Larache',
  "M'diq",
  'Marrakech',
  'Martil',
  'Meknès',
  'Midelt',
  'Mohammedia',
  'Moulay Bousselham',
  'Nador',
  'Ouarzazate',
  'Ouazzane',
  'Oued Zem',
  'Oujda',
  'Oulad Teima',
  'Rabat',
  'Safi',
  'Saïdia',
  'Salé',
  'Sefrou',
  'Settat',
  'Sidi Bennour',
  'Sidi Ifni',
  'Sidi Kacem',
  'Sidi Slimane',
  'Skhirat',
  'Souk Sebt Oulad Nemma',
  'Tan-Tan',
  'Tanger',
  'Taourirt',
  'Taroudant',
  'Tata',
  'Taza',
  'Témara',
  'Tétouan',
  'Tiflet',
  'Tinghir',
  'Tiznit',
  'Youssoufia',
  'Zagora',
  'Zaio',
  'Other',
];

export const NAV_LINKS = [
  { label: 'Shop All', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=new' },
  { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
  { label: 'Limited', href: '/collections/limited' },
  { label: 'Lookbook', href: '/lookbook' },
];

export const COLLECTION_LINKS = [
  { label: 'Oversized', href: '/collections/oversized' },
  { label: 'Graphic', href: '/collections/graphic' },
  { label: 'Essentials', href: '/collections/essentials' },
  { label: 'Limited Edition', href: '/collections/limited' },
];

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/shop?sort=new' },
      { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
      { label: 'Limited Drops', href: '/collections/limited' },
    ],
  },
  {
    title: 'Collections',
    links: COLLECTION_LINKS,
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Lookbook', href: '/lookbook' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export const TRUST_BADGES = [
  { icon: 'Truck', title: 'Free Delivery', subtitle: 'Anywhere in Morocco' },
  { icon: 'Shirt', title: 'Premium Cotton', subtitle: '240 GSM Heavyweight' },
  { icon: 'ShieldCheck', title: 'Secure Checkout', subtitle: 'Cash on Delivery' },
  { icon: 'Sparkles', title: 'Limited Edition', subtitle: 'Exclusive Drops' },
] as const;

export const WHY_NOVYR = [
  {
    icon: 'Layers',
    title: '240 GSM Heavyweight Cotton',
    body: 'Structured, premium-weight fabric that holds its shape wash after wash.',
  },
  {
    icon: 'Brush',
    title: 'Premium Print Quality',
    body: 'High-density, water-based inks that never crack, peel or fade.',
  },
  {
    icon: 'Leaf',
    title: 'Sustainable Manufacturing',
    body: 'Responsibly sourced cotton and low-impact, ethical production.',
  },
  {
    icon: 'Maximize',
    title: 'Modern Oversized Fit',
    body: 'A drop-shoulder silhouette engineered to own the street.',
  },
  {
    icon: 'Heart',
    title: 'Long-Lasting Comfort',
    body: 'Garment-washed for a soft hand-feel from the very first wear.',
  },
  {
    icon: 'Truck',
    title: 'Free Delivery',
    body: 'Fast, free shipping to every city in Morocco. Pay on delivery.',
  },
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const ORDER_STATUS_FLOW = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

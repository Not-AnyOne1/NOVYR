import type { Metadata, Viewport } from 'next';
import { Inter, Archivo, Anton } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { SITE } from '@/lib/constants';
import { getAnnouncement } from '@/lib/queries';
import { Providers } from '@/components/providers/Providers';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ExitIntentPopup } from '@/components/cro/ExitIntentPopup';
import { SocialProofToaster } from '@/components/cro/SocialProofToaster';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});
// Tall condensed poster face — the voice of NOVYR billboards & flyers.
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poster',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'NOVYR',
    'streetwear Morocco',
    'oversized t-shirts',
    'premium streetwear',
    'graphic tees',
    'limited edition streetwear',
    'heavyweight cotton',
    'Maroc streetwear',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let announcement = { enabled: true, messages: ['🚚 FREE DELIVERY ANYWHERE IN MOROCCO', '🔥 LIMITED STOCK AVAILABLE'] };
  try {
    announcement = await getAnnouncement();
  } catch {
    // DB unavailable at build/runtime — fall back to defaults so chrome still renders.
  }

  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${anton.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-ink font-sans">
        <AnalyticsScripts />
        <OrganizationJsonLd />
        <Providers>
          <AnnouncementBar messages={announcement.enabled ? announcement.messages : []} />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <ExitIntentPopup />
          <SocialProofToaster />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

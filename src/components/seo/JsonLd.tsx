import { SITE } from '@/lib/constants';
import { formatMAD } from '@/lib/utils';
import type { ProductDetail } from '@/types';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/icon.png`,
        slogan: SITE.slogan,
        sameAs: [SITE.social.instagram, SITE.social.tiktok, SITE.social.twitter],
        contactPoint: {
          '@type': 'ContactPoint',
          email: SITE.email,
          contactType: 'customer support',
          areaServed: 'MA',
          availableLanguage: ['en', 'fr', 'ar'],
        },
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE.url}/shop?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: ProductDetail }) {
  const inStock = product.totalStock > 0;
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images.map((i) => i.url),
        sku: product.sku ?? undefined,
        brand: { '@type': 'Brand', name: SITE.name },
        offers: {
          '@type': 'Offer',
          url: `${SITE.url}/product/${product.slug}`,
          priceCurrency: SITE.currency,
          price: (product.priceCents / 100).toFixed(2),
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        ...(product.reviewCount > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              },
            }
          : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// `formatMAD` re-exported for any inline price needs in structured snippets
export { formatMAD };

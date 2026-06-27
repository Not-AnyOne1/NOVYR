'use client';

/**
 * Unified analytics layer for NOVYR.
 * Dispatches e-commerce events to Google Analytics 4 (gtag) and Meta Pixel (fbq)
 * when configured. All calls are safe no-ops when the providers are absent.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Item = {
  id: string;
  name: string;
  price: number; // in MAD (major units)
  quantity?: number;
  category?: string;
  variant?: string;
};

const toMajor = (cents: number) => Math.round(cents) / 100;

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
}
function fbq(event: string, name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq(event, name, params);
}

export function pageview(url: string) {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (id) gtag('config', id, { page_path: url });
  fbq('track', 'PageView');
}

/** Generic custom event. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  gtag('event', name, params);
}

export function trackViewItem(item: { id: string; name: string; priceCents: number; category?: string }) {
  gtag('event', 'view_item', {
    currency: 'MAD',
    value: toMajor(item.priceCents),
    items: [{ item_id: item.id, item_name: item.name, price: toMajor(item.priceCents), item_category: item.category }],
  });
  fbq('track', 'ViewContent', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: toMajor(item.priceCents),
    currency: 'MAD',
  });
}

export function trackAddToCart(item: { id: string; name: string; priceCents: number; quantity: number; size?: string }) {
  gtag('event', 'add_to_cart', {
    currency: 'MAD',
    value: toMajor(item.priceCents * item.quantity),
    items: [{ item_id: item.id, item_name: item.name, price: toMajor(item.priceCents), quantity: item.quantity, item_variant: item.size }],
  });
  fbq('track', 'AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: toMajor(item.priceCents * item.quantity),
    currency: 'MAD',
  });
}

export function trackBeginCheckout(items: Item[], totalCents: number) {
  gtag('event', 'begin_checkout', {
    currency: 'MAD',
    value: toMajor(totalCents),
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  fbq('track', 'InitiateCheckout', {
    content_ids: items.map((i) => i.id),
    value: toMajor(totalCents),
    currency: 'MAD',
    num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
  });
}

export function trackPurchase(order: {
  orderNumber: string;
  totalCents: number;
  items: Item[];
}) {
  gtag('event', 'purchase', {
    transaction_id: order.orderNumber,
    currency: 'MAD',
    value: toMajor(order.totalCents),
    items: order.items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  fbq('track', 'Purchase', {
    content_ids: order.items.map((i) => i.id),
    value: toMajor(order.totalCents),
    currency: 'MAD',
    num_items: order.items.reduce((n, i) => n + (i.quantity ?? 1), 0),
  });
}

export function trackLead(source: string) {
  gtag('event', 'generate_lead', { source });
  fbq('track', 'Lead', { source });
}

export function trackSearch(term: string) {
  gtag('event', 'search', { search_term: term });
  fbq('track', 'Search', { search_string: term });
}

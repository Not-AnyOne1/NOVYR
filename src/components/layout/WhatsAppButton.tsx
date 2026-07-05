import { SITE } from '@/lib/constants';

const PREFILLED_MESSAGE = "Hi! I'm interested in your products and need some assistance.";

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17L1 22l5.1-1.1A11 11 0 1 0 20.5 3.5Zm-8.5 18h-.1a9.1 9.1 0 0 1-4.7-1.3l-.3-.2-3.4.9.9-3.3-.2-.3A9.1 9.1 0 1 1 20.1 12 9.1 9.1 0 0 1 12 21.5Z" />
    </svg>
  );
}

/**
 * Floating "Chat with Us" button, fixed on every storefront page. Opens
 * WhatsApp in a new tab with a pre-filled message — pure link, no client JS.
 * z-40: below drawer/modal overlays (z-50+) so it's never clickable through
 * them, above ordinary page content everywhere else.
 */
export function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-40 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-6"
    >
      {/* Slow attention ring — decorative only */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-bone/40 animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" />

      {/* Desktop hover tooltip */}
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-charcoal-border bg-ink-900 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lift transition-all duration-300 ease-out-expo group-hover:opacity-100 sm:block">
        Chat with us
      </span>

      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-bone text-ink shadow-lift transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:scale-105 hover:bg-white active:translate-y-0 active:scale-100 sm:h-16 sm:w-16">
        <WhatsAppIcon />
      </span>
    </a>
  );
}

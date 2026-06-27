# NOVYR — Production Launch Checklist

Work through this before pointing your domain at the store. Items are ordered by priority.

## 🔴 Critical (must do before launch)

- [ ] **Change admin credentials** — set a strong `ADMIN_EMAIL` / `ADMIN_PASSWORD`, re-seed or update the admin user, and delete the demo customer if not needed.
- [ ] **Generate a real `AUTH_SECRET`** — `openssl rand -base64 32`. Never reuse the example value.
- [ ] **Set production URLs** — `NEXT_PUBLIC_SITE_URL`, `AUTH_URL`, `NEXTAUTH_URL` all point to your real domain (no trailing slash).
- [ ] **Database is provisioned & seeded** — `DATABASE_URL` + `DIRECT_URL` set; `npm run db:push` and `npm run db:seed` have run against the production DB.
- [ ] **Replace demo content** — real products, real photos, real prices, real collections. Remove placeholder Unsplash imagery.
- [ ] **Verify a full test order** — add to cart → checkout → COD order created → appears in `/admin/orders` → status updates work.
- [ ] **Confirm stock decrements** on order and **restocks** on cancellation.

## 🟠 Important

- [ ] **Google OAuth** configured with the production redirect URI (or remove the Google button if unused).
- [ ] **Google Analytics 4** id set (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) and `purchase` event firing on the success page.
- [ ] **Meta Pixel** id set (`NEXT_PUBLIC_META_PIXEL_ID`); verify with Meta Pixel Helper.
- [ ] **Custom domain** added in Vercel with HTTPS active.
- [ ] **Update brand contact details** in `src/lib/constants.ts` (email, phone, social handles).
- [ ] **Discount codes** reviewed (`WELCOME10`, `DROP15`) — keep, edit or disable in `/admin/discounts`.
- [ ] **Newsletter / email provider** — set `RESEND_API_KEY` if you want real emails (currently subscribers are stored in DB).

## 🟡 SEO & Performance

- [ ] Submit `https://YOUR-DOMAIN/sitemap.xml` to **Google Search Console** & **Bing Webmaster**.
- [ ] Verify `robots.txt` and structured data with the [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Run **Lighthouse** (mobile) — target 95+ on Performance/SEO/Best Practices/Accessibility.
- [ ] Confirm Open Graph preview renders (share a product link in WhatsApp/Messenger).
- [ ] Set `metadataBase` / canonical URLs are correct (driven by `NEXT_PUBLIC_SITE_URL`).

## 🟢 Trust & Legal

- [ ] Review **Shipping**, **Return**, **Privacy** and **Terms** pages for your real policies & legal entity.
- [ ] Confirm phone number format/validation matches your courier's requirements.
- [ ] Test the **contact form** and ensure messages reach you (wire `/api/contact` to email in production).

## 🔵 Operations

- [ ] Add a teammate/admin account if more than one person manages orders.
- [ ] Set up **database backups** (Neon has automatic branching/backups).
- [ ] Add an error monitor (e.g. Sentry) — hook into `src/app/error.tsx`.
- [ ] Decide on a **migration workflow** (`prisma migrate`) before making schema changes in production.
- [ ] Bookmark `/admin` and confirm only ADMIN-role users can reach it.

---

### Quick smoke test (5 minutes)
1. Homepage loads, announcement rotates, hero displays.
2. Browse `/shop`, filter & sort work.
3. Open a product → select size → add to cart → cart drawer opens.
4. Checkout with COD → order confirmation page shows order number.
5. `/admin` → order is listed → change status → customer `/account/orders` reflects it.
6. Register a new account, add to wishlist, place a review.

If all six pass, you're ready to sell. 🖤

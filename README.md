# NOVYR — Premium Streetwear E-Commerce

> **Wear Beyond Ordinary.**
> A production-ready, conversion-optimized e-commerce platform for the NOVYR streetwear brand. Built for the Moroccan market (Cash on Delivery, free nationwide shipping) and engineered to scale internationally.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![TS](https://img.shields.io/badge/TypeScript-strict-blue) ![DB](https://img.shields.io/badge/PostgreSQL-Prisma-3982CE)

---

## ✨ Features

**Storefront**
- Cinematic dark-luxury homepage (hero slider, featured collections, best sellers, limited drops, why-NOVYR, lookbook, reviews, social, newsletter)
- Product catalog with collections, categories, filtering, sorting & search
- Product pages: zoom gallery, size/qty selection, size guide, stock status, reviews, related products
- Cart drawer + full cart page, **save for later**, discount codes, cross-sell
- Cash-on-Delivery checkout, mobile-optimized, server-validated pricing & stock

**Accounts & Admin**
- Auth.js v5 — email/password **and** Google login, secure JWT sessions
- Customer dashboard — orders, live order tracking, wishlist, addresses, settings
- Full admin — KPI dashboard, orders, products, inventory, categories, discounts, customers, homepage CMS

**Growth (CRO + SEO + Analytics)**
- Exit-intent popup, email capture, countdown timers, low-stock & scarcity, recently-purchased social proof
- Dynamic metadata, Open Graph + Twitter cards, generated OG image, JSON-LD (Organization, Product, Breadcrumb, FAQ), `sitemap.xml`, `robots.txt`
- Google Analytics 4 + Meta Pixel with full e-commerce events (view_item, add_to_cart, begin_checkout, purchase, lead)

**Security & Performance**
- Zod validation everywhere, rate limiting, security headers, hashed passwords, role-based route protection
- Image optimization (AVIF/WebP), code splitting, ISR caching, server components

---

## 🧱 Tech Stack

| Layer       | Tech |
|-------------|------|
| Framework   | Next.js 15 (App Router) + React 19 |
| Language    | TypeScript (strict) |
| Styling     | Tailwind CSS v3 + custom design system |
| Animation   | Framer Motion |
| Database    | PostgreSQL + Prisma ORM |
| Auth        | Auth.js v5 (NextAuth) — Credentials + Google |
| State       | Zustand (cart, persisted) |
| Validation  | Zod + React Hook Form |
| Deployment  | Vercel + Neon (serverless Postgres) |

---

## 📁 Project Structure

```
novyr/
├─ prisma/
│  ├─ schema.prisma          # Full data model (products, orders, users, CMS…)
│  └─ seed.ts                # Premium catalog + admin + demo data
├─ src/
│  ├─ app/                   # App Router (routes, layouts, API, SEO files)
│  │  ├─ (auth)/             # login / register
│  │  ├─ account/            # customer dashboard
│  │  ├─ admin/              # admin dashboard
│  │  ├─ api/                # REST endpoints (checkout, auth, admin, …)
│  │  ├─ product/ shop/ collections/ cart/ checkout/ lookbook/ …
│  │  ├─ sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.tsx
│  │  └─ layout.tsx page.tsx globals.css
│  ├─ components/            # ui, layout, home, product, cart, account, admin, cro, seo, marketing
│  ├─ lib/                   # prisma, auth-guards, queries, orders, discounts, utils, analytics, validations
│  ├─ store/                 # Zustand cart
│  ├─ auth.ts auth.config.ts middleware.ts
│  └─ types/
├─ .env.example
├─ PRODUCTION_CHECKLIST.md
└─ README.md
```

---

## 🚀 Local Development

### 1. Prerequisites
- Node.js ≥ 20
- A PostgreSQL database (local, or a free [Neon](https://neon.tech) project)

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in at minimum `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (generate with `openssl rand -base64 32`), and `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 4. Set up the database
```bash
npm run db:push     # create tables from the Prisma schema
npm run db:seed     # load catalog, collections, admin + demo data
```

### 5. Run
```bash
npm run dev
```
Open **http://localhost:3000**.

### Default accounts (from seed)
| Role     | Email                  | Password         |
|----------|------------------------|------------------|
| Admin    | `admin@novyr.com`*     | `ChangeMe!2026`* |
| Customer | `customer@novyr.com`   | `Customer!2026`  |

\* Or whatever you set as `ADMIN_EMAIL` / `ADMIN_PASSWORD`. **Change these before going live.** Admin dashboard lives at `/admin`.

---

## 🌍 Deploy to Vercel + Neon (step by step)

### A. Create the database (Neon)
1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string → this is your `DATABASE_URL`.
3. Copy the **direct** connection string → this is your `DIRECT_URL`.

### B. Push the schema & seed
From your machine, with `.env` pointing at the Neon DB:
```bash
npm run db:push
npm run db:seed
```

### C. Push to GitHub & import to Vercel
1. Create a GitHub repo and push this project.
2. In [Vercel](https://vercel.com) → **New Project** → import the repo. Framework auto-detects as Next.js.
3. Add the **Environment Variables** (see table below) in Project → Settings → Environment Variables.
4. Click **Deploy**. The build runs `prisma generate && next build`.

### D. Google OAuth (optional but recommended)
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth client (Web).
2. Authorized redirect URI: `https://YOUR-DOMAIN/api/auth/callback/google`
3. Put the client id/secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

### E. Point your domain
Add your custom domain in Vercel → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL`, `AUTH_URL`, `NEXTAUTH_URL`.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|:---:|-------------|
| `DATABASE_URL` | ✅ | Postgres pooled connection string |
| `DIRECT_URL` | ✅ | Postgres direct connection (migrations) |
| `AUTH_SECRET` | ✅ | 32-byte random session secret |
| `AUTH_URL` / `NEXTAUTH_URL` | ✅ | Public site URL (for OAuth callbacks) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL (used in SEO/canonicals) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ✅ | Bootstrapped admin account (seed) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | ⬜ | Google login |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⬜ | Google Analytics 4 (`G-XXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⬜ | Meta Pixel id |
| `RESEND_API_KEY` / `EMAIL_FROM` | ⬜ | Transactional/newsletter email |
| `NEXT_PUBLIC_CLOUDINARY_*` | ⬜ | Image hosting/upload |

> Analytics and email are **optional** — the app runs fully without them and enables them automatically when the keys are present.

---

## 🛠 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start production server |
| `npm run db:push` | Sync schema to DB (no migration files) |
| `npm run db:migrate` | Create & apply a dev migration |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed catalog + demo data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🧭 Running the store (admin guide)

- **`/admin`** — dashboard with revenue, AOV, top products, low-stock alerts.
- **Products** → create/edit products, images (paste URLs), sizes & stock, flags (featured/best seller/new/limited), SEO.
- **Inventory** → fast per-variant stock editing.
- **Orders** → filter by status, update status (auto-restocks on cancel), view full order detail.
- **Discounts** → percentage / fixed / free-shipping codes with limits.
- **Content** → edit the announcement bar, hero slides and lookbook live.

---

## 📌 Notes
- Prices are stored as integer **centimes** (MAD × 100) to avoid floating-point errors.
- Seed images use Unsplash for demonstration — replace with your real product photography (Cloudinary recommended).
- See **`PRODUCTION_CHECKLIST.md`** before launch.

Built to sell from day one. 🖤

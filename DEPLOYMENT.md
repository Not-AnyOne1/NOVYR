# NOVYR — Production Deployment (Neon + Vercel)

This is the exact, copy-paste runbook to take NOVYR from local Postgres to production.
The code is already production-ready (Prisma engine pinned for Vercel, no hardcoded localhost,
build runs `prisma generate`). The steps below need **your** Neon / Vercel / GitHub accounts.

---

## 1 · Create the Neon database
1. Go to **https://neon.tech** → sign in → **New Project** (region closest to Morocco, e.g. `aws-eu-central-1` / Frankfurt).
2. After it's created, open **Dashboard → Connection Details** and copy **two** strings:
   - **Pooled** connection (host contains `-pooler`) → this is `DATABASE_URL`
   - **Direct** connection (host **without** `-pooler`) → this is `DIRECT_URL`
   - Make sure both end with `?sslmode=require` (Neon requires SSL).

Example shape:
```
DATABASE_URL="postgresql://USER:PASS@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASS@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

> Prisma uses `DATABASE_URL` (pooled) for app queries and `DIRECT_URL` (direct) for `db push`/migrations. The schema is already wired for both.

---

## 2 · Push the schema + seed Neon (run locally, once)
Put the two Neon strings in your local `.env` (replace the localhost values), then:
```bash
npm run db:setup     # = prisma db push + seed (creates tables, loads 18 products)
```
Or step by step:
```bash
npm run db:push
npm run db:seed
```
Verify with `npm run db:studio` (you should see the products/orders tables populated).

---

## 3 · Push to GitHub
The repo is already connected to `origin`. Commit & push:
```bash
git add -A
git commit -m "Production config"
git push origin main
```

---

## 4 · Deploy on Vercel
1. **https://vercel.com → New Project →** import `Not-AnyOne1/NOVYR`. Framework auto-detects **Next.js**.
2. **Settings → Environment Variables** (Production) — add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** string |
| `DIRECT_URL` | Neon **direct** string |
| `AUTH_SECRET` | run `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXTAUTH_URL` | same as `AUTH_URL` |
| `NEXT_PUBLIC_SITE_URL` | same as `AUTH_URL` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | your admin login |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | (optional) Google login |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | (optional) GA4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | (optional) Meta Pixel |

3. Click **Deploy**. The build runs `prisma generate && next build`.
4. After the first deploy, set your custom domain (if any) and update `AUTH_URL` / `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` to the final URL, then redeploy.

### Google OAuth (if used)
Google Cloud Console → Credentials → Authorized redirect URI:
`https://your-domain/api/auth/callback/google`

---

## 5 · Verify production
- Homepage loads with products & images, prices show ~~279~~ 199 DH.
- `/admin` reachable only by the admin account.
- Place a test COD order → appears in `/admin/orders`.
- `https://your-domain/sitemap.xml` and `/robots.txt` resolve.

---

## Notes / why this works in production
- **Prisma engine** is pinned to `rhel-openssl-3.0.x` (Vercel/Lambda) in `schema.prisma`, and `prisma generate` runs in both `postinstall` and the build — no stale-client issues.
- **No localhost dependencies** in code; every URL/DB value comes from env vars (the `http://localhost:3000` strings are dev-only fallbacks, always overridden in prod).
- **Schema changes later:** edit `schema.prisma` → `npm run db:push` against Neon → commit → Vercel redeploys. (Adopt `prisma migrate` if you want versioned migrations.)
- **`.env` is gitignored** — secrets live only in Vercel's env settings, never in the repo.

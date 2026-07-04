/**
 * NOVYR — catalog ↔ products-folder reconciliation.
 *
 * Matching convention: DB product → first image URL `/products/real/<key>.webp`
 * → `key` → ITEMS entry (scripts/product-sources.mjs) → raw source file in
 * C:/Users/hp/Downloads/products.
 *
 *  • Product whose source file no longer exists → REMOVED from the catalog
 *    (hard delete when no order references it; deactivated otherwise, so order
 *    history stays intact). Generated webp assets are kept — historical order
 *    line items still point at them.
 *  • Folder file not matched to any product → flagged as a new-product
 *    candidate in PRODUCT_SYNC_REPORT.md with the metadata that must be filled
 *    in (name, price, description, SKU) — nothing is guessed or auto-created.
 *
 * Run: node scripts/sync-products.mjs           (dry-run, no writes)
 *      node scripts/sync-products.mjs --apply   (perform removals + write report)
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { SRC, ITEMS } from './product-sources.mjs';

const APPLY = process.argv.includes('--apply');
const prisma = new PrismaClient();

const ANGLES = new Set(['back', 'side', 'folded', 'flatlay', 'lifestyle']);
const IMG_EXT = /\.(webp|png|jpe?g|jfif)$/i;

const keyFromImageUrl = (url) => {
  const base = url?.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  return base.includes('-') ? base.split('-')[0] : base;
};

const md5 = (path) => createHash('md5').update(readFileSync(path)).digest('hex');

async function main() {
  const itemByKey = new Map(ITEMS.map((it) => [it.key, it]));
  const folderFiles = readdirSync(SRC).filter((f) => IMG_EXT.test(f));
  const folderSet = new Set(folderFiles);

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  // ── 1. Products whose source is gone ──
  const keep = [];
  const toRemove = [];
  for (const p of products) {
    const key = keyFromImageUrl(p.images[0]?.url ?? '');
    const item = itemByKey.get(key);
    const sourcePresent = item ? folderSet.has(item.file) : false;
    if (sourcePresent) {
      keep.push({ ...p, key });
    } else {
      toRemove.push({
        ...p,
        key,
        reason: item ? `source "${item.file}" missing from folder` : `no source mapping for key "${key}"`,
        action: p._count.orderItems > 0 ? 'deactivate (referenced by orders)' : 'delete',
      });
    }
  }

  // ── 2. Folder files not matched to any catalog entry ──
  const accounted = new Set();
  for (const it of ITEMS) if (folderSet.has(it.file)) accounted.add(it.file);
  for (const f of folderFiles) {
    const base = f.replace(IMG_EXT, '');
    const dash = base.lastIndexOf('-');
    if (dash > 0) {
      const stem = base.slice(0, dash);
      const suffix = base.slice(dash + 1).toLowerCase();
      if (ANGLES.has(suffix) && itemByKey.has(stem)) accounted.add(f); // supplemental angle shot
    }
  }

  const hashOf = new Map();
  for (const f of accounted) hashOf.set(md5(join(SRC, f)), f);

  const replacements = [];
  const candidates = [];
  for (const f of folderFiles) {
    if (accounted.has(f)) continue;
    const base = f.replace(IMG_EXT, '');
    const prefixed = base.match(/^(?:pro|nv)-(.+)$/);
    if (prefixed && itemByKey.has(prefixed[1])) {
      replacements.push({ file: f, key: prefixed[1] });
      continue;
    }
    const dup = hashOf.get(md5(join(SRC, f)));
    if (dup) {
      replacements.push({ file: f, key: `duplicate of "${dup}"` });
      continue;
    }
    candidates.push(f);
  }

  // ── Report ──
  console.log(`\nNOVYR product sync — ${APPLY ? 'APPLY' : 'DRY RUN'}`);
  console.log(`Folder: ${SRC} (${folderFiles.length} images)`);
  console.log(`Catalog: ${products.length} products — ${keep.length} matched, ${toRemove.length} to remove\n`);

  if (toRemove.length) {
    console.log('REMOVALS:');
    for (const p of toRemove) console.log(`  - [${p.action}] ${p.name} (${p.slug}) — ${p.reason}`);
  }
  if (replacements.length) {
    console.log('\nIGNORED (alternate/duplicate art for existing products — not new products):');
    for (const r of replacements) console.log(`  - ${r.file} → ${r.key}`);
  }
  if (candidates.length) {
    console.log('\nNEW-PRODUCT CANDIDATES (need metadata — NOT auto-added):');
    for (const f of candidates) console.log(`  - ${f}`);
  }

  if (APPLY) {
    for (const p of toRemove) {
      if (p._count.orderItems > 0) {
        await prisma.product.update({ where: { id: p.id }, data: { active: false } });
      } else {
        await prisma.product.delete({ where: { id: p.id } }); // images/variants/reviews cascade
      }
    }
    console.log(`\nApplied: ${toRemove.length} products removed/deactivated.`);

    const lines = [
      '# Product Sync Report',
      '',
      `Generated: ${new Date().toISOString()} — folder \`${SRC}\``,
      '',
      '## Removed from catalog (source image deleted from folder)',
      '',
      ...(toRemove.length
        ? toRemove.map((p) => `- **${p.name}** (\`${p.slug}\`) — ${p.reason} → ${p.action}`)
        : ['_None_']),
      '',
      '## New images awaiting metadata',
      '',
      'These files are in the products folder but not in the catalog. To add each one:',
      'fill in the fields below, add an entry to `scripts/product-sources.mjs` (pick a short',
      'hyphen-free `key` and rename/point `file` at it), run `node scripts/process-products.mjs`,',
      'then add the product to `prisma/seed.ts` (or the admin dashboard) with these fields.',
      '',
      ...(candidates.length
        ? candidates.flatMap((f) => [
            `### \`${f}\``,
            '- Name: _(required)_',
            '- Price (DH): _(required)_',
            '- Description: _(required)_',
            '- SKU: _(required)_',
            '- Collections / sizes / stock: _(optional — defaults exist)_',
            '',
          ])
        : ['_None_']),
    ];
    writeFileSync(join(process.cwd(), 'PRODUCT_SYNC_REPORT.md'), lines.join('\n'));
    console.log('Report written → PRODUCT_SYNC_REPORT.md');
  } else {
    console.log('\nDry run — nothing written. Re-run with --apply to execute.');
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

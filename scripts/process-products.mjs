/**
 * NOVYR — real product image pipeline.
 * Crops every source photo to a consistent 4:5 frame, optimizes to WebP, and
 * derives a multi-view gallery from real pixels: main + print close-up + detail.
 * Output → public/products/real
 *
 * Run: node scripts/process-products.mjs
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/Users/hp/Downloads/products';
const OUT = join(__dirname, '..', 'public', 'products', 'real');
mkdirSync(OUT, { recursive: true });

const TW = 1200;
const TH = 1500; // 4:5

// key → source file + framing params
const ITEMS = [
  // ── original drop ──
  { key: 'extreme', file: '617204323975102198.jfif', gravity: 'centre', zoom: 0.92, printTop: 0.46, detailTop: 0.34 },
  { key: 'dark', file: "Men's Portrait Printed Short Sleeve T-Shirt, Suitable For Daily Casual Wear In Spring And Summer.jfif", gravity: 'centre', zoom: 0.9, printTop: 0.4, detailTop: 0.3 },
  { key: 'silence', file: 'SILENCE DESIGN by Pandora Studio.webp', gravity: 'centre', zoom: 0.96, printTop: 0.5, detailTop: 0.28 },
  { key: 'breathe', file: '617204323966264204.webp', gravity: 'north', zoom: 1, printTop: 0.6, detailTop: 0.42 },
  { key: 'livelihood', file: 'Camiseta Con Estampado De Personajes Y Letras Para Hombre.jfif', gravity: 'north', zoom: 1, printTop: 0.4, detailTop: 0.22 },
  { key: 'samson', file: "Men's Printed Casual Short Sleeve T-Shirt For Daily Wear In Spring_Summer.jfif", gravity: 'north', zoom: 1, printTop: 0.42, detailTop: 0.24 },
  { key: 'syndicate', file: 'téléchargement (6).jfif', gravity: 'centre', zoom: 0.96, printTop: 0.5, detailTop: 0.4 },
  // ── new drop ──
  { key: 'peace', file: 'PEACE STREET WEAR DESIGN MOCK UP.jfif', gravity: 'centre', zoom: 1, printTop: 0.55, detailTop: 0.12 },
  { key: 'dream', file: 'EHEPIC _ T-shirt.jfif', gravity: 'centre', zoom: 1, printTop: 0.45, detailTop: 0.12 },
  { key: 'lonely', file: 'Schwarzes, übergroßes T-Shirt für Herren und Damen mit Gothic-Kreuz-Print, Streetwear-Outfit,.jfif', gravity: 'centre', zoom: 0.95, printTop: 0.42, detailTop: 0.14 },
  { key: 'desire', file: '1053631275319067387.jfif', gravity: 'centre', zoom: 0.96, printTop: 0.48, detailTop: 0.16 },
  { key: 'spider', file: '🐇.webp', gravity: 'centre', zoom: 1, printTop: 0.52, detailTop: 0.12 },
  // ── drop 003 ──
  { key: 'moneylove', file: 'ChatGPT Image 28 juin 2026, 02_41_25.png', gravity: 'north', zoom: 1, printTop: 0.42, detailTop: 0.22 },
  { key: 'getlost', file: 'ChatGPT Image 28 juin 2026, 02_47_11.png', gravity: 'north', zoom: 1, printTop: 0.42, detailTop: 0.22 },
  { key: 'goat', file: 'ChatGPT Image 28 juin 2026, 02_38_44.png', gravity: 'north', zoom: 1, printTop: 0.45, detailTop: 0.22 },
  { key: 'suffer', file: 'ChatGPT Image 27 juin 2026, 00_45_13.png', gravity: 'centre', zoom: 1, printTop: 0.45, detailTop: 0.1 },
  { key: 'disorders', file: 'ChatGPT Image 27 juin 2026, 00_27_15.png', gravity: 'centre', zoom: 0.98, printTop: 0.5, detailTop: 0.12 },
  { key: 'wrong', file: 'ChatGPT Image 27 juin 2026, 00_25_49.png', gravity: 'centre', zoom: 1, printTop: 0.48, detailTop: 0.1 },
  // ── drop 004 ──
  { key: 'ftw', file: 'nv-ftw.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'street', file: 'nv-street.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'outlaw', file: 'nv-outlaw.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'bornthisway', file: 'nv-bornthisway.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'change', file: 'nv-change.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'dontlikeus', file: 'nv-dontlikeus.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'yourstruly', file: 'nv-yourstruly.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'muse', file: 'nv-muse.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'wanted', file: 'nv-wanted.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'exodus', file: 'nv-exodus.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'resilience', file: 'nv-resilience.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'mercy', file: 'nv-mercy.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'redemption', file: 'nv-redemption.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'angel', file: 'nv-angel.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'darkvision', file: 'nv-darkvision.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'smoke', file: 'nv-smoke.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'mirage', file: 'nv-mirage.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'phoenix', file: 'nv-phoenix.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'lostinspace', file: 'nv-lostinspace.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

async function crop(src, region) {
  return sharp(src).rotate().extract(region).resize(TW, TH, { fit: 'cover', position: 'centre' }).webp({ quality: 84 });
}

async function run() {
  for (const it of ITEMS) {
    const srcPath = join(SRC, it.file);
    if (!existsSync(srcPath)) {
      console.warn(`⚠️  missing: ${it.file}`);
      continue;
    }
    const meta = await sharp(srcPath).rotate().metadata();
    const W = meta.width ?? 1000;
    const H = meta.height ?? 1250;

    // ── main 4:5 (optional pre-zoom to reduce visible background) ──
    let main = sharp(srcPath).rotate();
    if (it.zoom < 1) {
      const cw = Math.round(W * it.zoom);
      const ch = Math.round(H * it.zoom);
      main = main.extract({ left: Math.round((W - cw) / 2), top: Math.round((H - ch) / 2), width: cw, height: ch });
    }
    await main.resize(TW, TH, { fit: 'cover', position: it.gravity }).webp({ quality: 84 }).toFile(join(OUT, `${it.key}.webp`));

    // ── print close-up (centered on the graphic) ──
    {
      const cw = Math.round(W * 0.56);
      const ch = clamp(Math.round(cw * 1.12), 1, H);
      const left = clamp(Math.round((W - cw) / 2), 0, W - cw);
      const top = clamp(Math.round(H * it.printTop - ch / 2), 0, H - ch);
      await (await crop(srcPath, { left, top, width: cw, height: ch })).toFile(join(OUT, `${it.key}-print.webp`));
    }

    // ── detail close-up (neckline + top of print) ──
    {
      const cw = Math.round(W * 0.5);
      const ch = clamp(Math.round(cw * 1.25), 1, H);
      const left = clamp(Math.round((W - cw) / 2), 0, W - cw);
      const top = clamp(Math.round(H * it.detailTop), 0, H - ch);
      await (await crop(srcPath, { left, top, width: cw, height: ch })).toFile(join(OUT, `${it.key}-detail.webp`));
    }

    // ── fabric close-up (plain drape near the shoulder/edge) ──
    {
      const cw = Math.round(W * 0.3);
      const ch = clamp(Math.round(cw * 1.25), 1, H);
      const left = clamp(Math.round(W * 0.1), 0, W - cw);
      const top = clamp(Math.round(H * 0.5), 0, H - ch);
      await (await crop(srcPath, { left, top, width: cw, height: ch })).toFile(join(OUT, `${it.key}-fabric.webp`));
    }

    // ── label / collar close-up (top-center) ──
    {
      const cw = Math.round(W * 0.42);
      const ch = clamp(Math.round(cw * 0.85), 1, H);
      const left = clamp(Math.round((W - cw) / 2), 0, W - cw);
      const top = clamp(Math.round(H * 0.15), 0, H - ch);
      await (await crop(srcPath, { left, top, width: cw, height: ch })).toFile(join(OUT, `${it.key}-label.webp`));
    }

    // ── optional provided angles (drop e.g. silence-lifestyle.png into the source folder) ──
    const ANGLES = ['back', 'side', 'folded', 'flatlay', 'lifestyle'];
    const EXTS = ['webp', 'png', 'jpg', 'jpeg', 'jfif'];
    for (const angle of ANGLES) {
      for (const ext of EXTS) {
        const ap = join(SRC, `${it.key}-${angle}.${ext}`);
        if (existsSync(ap)) {
          await sharp(ap).rotate().resize(TW, TH, { fit: 'cover', position: 'centre' }).webp({ quality: 84 }).toFile(join(OUT, `${it.key}-${angle}.webp`));
          console.log(`   + ${it.key}-${angle}`);
          break;
        }
      }
    }

    console.log(`✅ ${it.key}`);
  }
  console.log('Done → public/products/real');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

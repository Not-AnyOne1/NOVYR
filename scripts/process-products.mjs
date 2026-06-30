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
  // front/back 2-up layouts → isolate the front garment (+ real back view)
  { key: 'ftw', file: 'nv-ftw.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12, region: { l: 0.04, t: 0.08, w: 0.92, h: 0.38 }, back: { l: 0.18, t: 0.48, w: 0.70, h: 0.40 } },
  { key: 'street', file: 'nv-street.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12, region: { l: 0.02, t: 0.03, w: 0.96, h: 0.43 }, back: { l: 0.02, t: 0.49, w: 0.96, h: 0.40 } },
  { key: 'outlaw', file: 'nv-outlaw.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12, region: { l: 0.04, t: 0.07, w: 0.50, h: 0.41 }, back: { l: 0.38, t: 0.22, w: 0.56, h: 0.57 } },
  { key: 'bornthisway', file: 'nv-bornthisway.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'change', file: 'nv-change.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'dontlikeus', file: 'nv-dontlikeus.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'yourstruly', file: 'nv-yourstruly.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'muse', file: 'nv-muse.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'wanted', file: 'nv-wanted.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'exodus', file: 'nv-exodus.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12, region: { l: 0.02, t: 0.05, w: 0.60, h: 0.42 }, back: { l: 0.30, t: 0.40, w: 0.68, h: 0.52 } },
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

// Uniform safety margin: the garment is fitted inside this fraction of the
// canvas so nothing ever touches the frame edge (identical breathing room).
const INNER = 0.9;

async function crop(src, region) {
  return sharp(src).rotate().extract(region).resize(TW, TH, { fit: 'cover', position: 'centre' }).webp({ quality: 84 });
}

/**
 * Sample a seamless background colour from the source's outer border.
 * Median per channel is robust to a graphic that touches one edge, so the
 * padding we add blends invisibly into the photo's own backdrop.
 */
async function sampleBg(src) {
  const { data, info } = await sharp(src)
    .rotate()
    .resize(48, 60, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const at = (x, y) => {
    const i = (y * w + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const pts = [];
  for (let x = 0; x < w; x += 3) {
    pts.push(at(x, 0));
    pts.push(at(x, h - 1));
  }
  for (let y = 0; y < h; y += 3) {
    pts.push(at(0, y));
    pts.push(at(w - 1, y));
  }
  const median = (c) => {
    const s = pts.map((p) => p[c]).sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  return { r: median(0), g: median(1), b: median(2) };
}

/**
 * Extract a fractional region {l,t,w,h} (0..1) from a source as a PNG buffer.
 * Used to isolate a single garment from front/back 2-up product layouts.
 */
async function regionBuffer(src, region) {
  const m = await sharp(src).rotate().metadata();
  const W = m.width ?? 1000;
  const H = m.height ?? 1250;
  const left = clamp(Math.round(W * region.l), 0, W - 1);
  const top = clamp(Math.round(H * region.t), 0, H - 1);
  const width = clamp(Math.round(W * region.w), 1, W - left);
  const height = clamp(Math.round(H * region.h), 1, H - top);
  return sharp(src).rotate().extract({ left, top, width, height }).png().toBuffer();
}

/**
 * Trim the uniform background border to the garment's bounding box, so a tee
 * shot with lots of empty backdrop ends up the same scale as a tightly-framed
 * one. Returns null (keep original) when the source has no trimmable border or
 * when the trim is pathological (garment ≈ background → would collapse).
 */
async function safeTrim(input) {
  try {
    const meta = await sharp(input).rotate().metadata();
    const out = await sharp(input).rotate().trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
    const origArea = (meta.width ?? 1) * (meta.height ?? 1);
    const newArea = out.info.width * out.info.height;
    if (newArea < origArea * 0.2) return null; // over-trim guard
    return out.data;
  } catch {
    return null; // image is a single flat colour, or trim unsupported
  }
}

/**
 * Normalise any input (path or buffer) into the canonical 4:5 catalogue frame:
 * trim to the garment, scale to fit within INNER of the canvas, centre it, and
 * pad with a background sampled from the source's own edges. Never crops
 * sleeves, collar, or hem, and produces an identical canvas / scale / margin
 * for every product so the catalogue reads as one professional template.
 */
async function normalizeMain(input, outPath) {
  const bg = await sampleBg(input); // sample BEFORE trimming (true backdrop)
  const trimmed = await safeTrim(input);
  const fitSrc = trimmed ?? input;
  const innerW = Math.round(TW * INNER);
  const innerH = Math.round(TH * INNER);
  const fitted = await sharp(fitSrc)
    .rotate()
    .resize(innerW, innerH, { fit: 'inside', withoutEnlargement: false, kernel: 'lanczos3' })
    .png()
    .toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: bg } })
    .composite([{ input: fitted, gravity: 'centre' }])
    .webp({ quality: 86 })
    .toFile(outPath);
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

    // ── main 4:5 — whole garment, centred, never cropped (uniform template) ──
    // Some sources are front/back 2-up layouts; `region` isolates the front
    // garment, and `back` (optional) yields a real back view for the gallery.
    if (it.region) {
      await normalizeMain(await regionBuffer(srcPath, it.region), join(OUT, `${it.key}.webp`));
      if (it.back) {
        await normalizeMain(await regionBuffer(srcPath, it.back), join(OUT, `${it.key}-back.webp`));
      }
    } else {
      await normalizeMain(srcPath, join(OUT, `${it.key}.webp`));
    }

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

/**
 * NOVYR — original graphic-print generator.
 * Produces washed-black oversized-tee mockups (front / back / print detail)
 * with original distressed screen-print artwork. 100% original, copyright-safe.
 *
 * Run: node scripts/generate-graphics.mjs   → writes SVGs to /public/products
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'products');
mkdirSync(OUT, { recursive: true });

const INK = { bone: '#E7E4DD', white: '#F5F4F1', red: '#B23A2E', smoke: '#9A9A95' };
const WASH = {
  black: ['#1d1d20', '#0c0c0e'],
  charcoal: ['#34343a', '#161619'],
  acid: ['#3c3a34', '#1a1916'],
};

const DESIGNS = [
  { slug: 'eclipse-oversized-tee', word: ['ECLIPSE'], sub: 'BEYOND THE LIGHT', motif: 'eclipse', ink: 'bone', wash: 'black' },
  { slug: 'static-graphic-tee', word: ['STATIC'], sub: 'SIGNAL // LOST', motif: 'glitch', ink: 'bone', wash: 'charcoal' },
  { slug: 'phantom-heavyweight-tee', word: ['PHANTOM'], sub: 'UNSEEN UNHEARD', motif: 'smoke', ink: 'bone', wash: 'black' },
  { slug: 'neon-pulse-tee', word: ['PULSE'], sub: 'FREQUENCY 001', motif: 'wave', ink: 'white', wash: 'black' },
  { slug: 'void-oversized-hoodie', word: ['VOID'], sub: 'EMBRACE THE DARK', motif: 'hole', ink: 'bone', wash: 'black' },
  { slug: 'monolith-limited-tee', word: ['MONO', 'LITH'], sub: 'NUMBERED EDITION', motif: 'slab', ink: 'red', wash: 'acid' },
  { slug: 'cipher-graphic-tee', word: ['CIPHER'], sub: '01001110 01010110', motif: 'code', ink: 'bone', wash: 'charcoal' },
  { slug: 'atlas-essentials-tee', word: ['NOVYR'], sub: 'ESSENTIALS SERIES', motif: 'minimal', ink: 'bone', wash: 'black' },
  { slug: 'rebel-oversized-tee', word: ['REBEL'], sub: 'NO RULES NO LIMITS', motif: 'graffiti', ink: 'red', wash: 'charcoal' },
  { slug: 'aurora-limited-hoodie', word: ['AURORA'], sub: 'LIMITED RELEASE', motif: 'rays', ink: 'white', wash: 'black' },
];

const W = 1000;
const H = 1250;

/* ── shared defs (unique ids per file via prefix) ── */
function defs(p, wash) {
  const [c1, c2] = WASH[wash] ?? WASH.black;
  return `
  <defs>
    <linearGradient id="${p}bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#141416"/><stop offset="1" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="${p}fab" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="0.55" stop-color="${c2}"/><stop offset="1" stop-color="#08080a"/>
    </linearGradient>
    <radialGradient id="${p}vig" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    <pattern id="${p}ht" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
      <rect width="13" height="13" fill="none"/><circle cx="6.5" cy="6.5" r="3.1" fill="${INK[DESIGNS_INK] ?? '#fff'}"/>
    </pattern>
    <filter id="${p}noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <filter id="${p}rough"><feTurbulence type="fractalNoise" baseFrequency="0.014 0.028" numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter>
    <filter id="${p}soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>`;
}

let DESIGNS_INK = 'bone'; // set per render so halftone uses ink color

/* ── distressed halftone backing motif ── */
function motifArt(p, d, cx, cy, r, ink) {
  const m = d.motif;
  if (m === 'eclipse') {
    return `<circle cx="${cx}" cy="${cy - 40}" r="${r}" fill="url(#${p}ht)" opacity="0.5"/>
      <circle cx="${cx}" cy="${cy - 40}" r="${r}" fill="#0c0c0e"/>
      <circle cx="${cx}" cy="${cy - 40}" r="${r}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.9"/>
      <circle cx="${cx - r * 0.28}" cy="${cy - 40 - r * 0.28}" r="${r * 0.9}" fill="none" stroke="${ink}" stroke-width="2" opacity="0.5"/>`;
  }
  if (m === 'hole' || m === 'smoke') {
    return `<circle cx="${cx}" cy="${cy - 30}" r="${r * 1.1}" fill="url(#${p}ht)" opacity="0.42"/>`;
  }
  if (m === 'rays') {
    let rays = '';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      rays += `<line x1="${cx}" y1="${cy - 30}" x2="${cx + Math.cos(a) * r * 1.4}" y2="${cy - 30 + Math.sin(a) * r * 1.4}" stroke="${ink}" stroke-width="2" opacity="0.18"/>`;
    }
    return rays + `<circle cx="${cx}" cy="${cy - 30}" r="${r * 0.65}" fill="url(#${p}ht)" opacity="0.4"/>`;
  }
  if (m === 'slab') {
    return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="url(#${p}ht)" opacity="0.4"/>
      <rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  }
  if (m === 'glitch') {
    let bars = '';
    for (let i = 0; i < 6; i++) {
      const yy = cy - r + i * (r / 3) + (Math.random() * 10);
      bars += `<rect x="${cx - r}" y="${yy.toFixed(0)}" width="${r * 2}" height="${(6 + Math.random() * 10).toFixed(0)}" fill="${ink}" opacity="${(0.1 + Math.random() * 0.2).toFixed(2)}"/>`;
    }
    return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="url(#${p}ht)" opacity="0.3"/>${bars}`;
  }
  if (m === 'code') {
    let dots = '';
    for (let i = 0; i < 40; i++) {
      dots += `<text x="${cx - r + (i % 8) * (r / 4)}" y="${cy - r + Math.floor(i / 8) * 22}" font-family="monospace" font-size="16" fill="${ink}" opacity="0.25">${Math.random() > 0.5 ? '1' : '0'}</text>`;
    }
    return dots;
  }
  if (m === 'wave') {
    let d2 = `M ${cx - r} ${cy - 20}`;
    for (let x = -r; x <= r; x += 8) {
      d2 += ` L ${cx + x} ${cy - 20 + Math.sin(x / 18) * 38 * (1 - Math.abs(x) / (r * 1.4))}`;
    }
    return `<path d="${d2}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.6"/>`;
  }
  if (m === 'graffiti') {
    return `<path d="M ${cx - r} ${cy} q ${r * 0.5} -${r} ${r} 0 t ${r} 0" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
      <path d="M ${cx - r * 0.8} ${cy + 50} q ${r} -${r * 0.6} ${r * 1.6} 10" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" opacity="0.4"/>`;
  }
  return ''; // minimal
}

/* ── circular stamp ── */
function stamp(p, cx, cy, r, ink) {
  const id = `${p}stamp${Math.round(cx)}`;
  return `<g opacity="0.85">
    <defs><path id="${id}" d="M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0"/></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="${ink}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${ink}" stroke-width="1"/>
    <text font-family="'Arial Narrow', sans-serif" font-size="15" letter-spacing="3" fill="${ink}">
      <textPath href="#${id}" startOffset="0">NOVYR · WEAR BEYOND ORDINARY · SS26 · LIMITED · </textPath>
    </text>
  </g>`;
}

/* ── the print artwork, drawn in a 600 × 780 box ── */
function printArt(p, d, scaleHint = 1) {
  const ink = INK[d.ink] ?? INK.bone;
  const bw = 600, bh = 780;
  const cx = bw / 2, cy = bh / 2;
  const lines = d.word;
  const fs = Math.min(230, (bw / Math.max(...lines.map((l) => l.length))) * 1.55);
  const totalH = lines.length * fs * 0.82;
  let texts = '';
  lines.forEach((line, i) => {
    const y = cy - totalH / 2 + fs * 0.7 + i * fs * 0.82;
    // offset misregistration ghost
    texts += `<text x="${cx + 5}" y="${y + 4}" text-anchor="middle" font-family="Impact, Haettenschweiler, 'Arial Narrow', sans-serif" font-size="${fs}" fill="none" stroke="${ink}" stroke-width="1.4" opacity="0.45" letter-spacing="-2">${line}</text>`;
    texts += `<text x="${cx}" y="${y}" text-anchor="middle" font-family="Impact, Haettenschweiler, 'Arial Narrow', sans-serif" font-size="${fs}" fill="${ink}" letter-spacing="-2">${line}</text>`;
  });

  return `<g filter="url(#${p}rough)">
    ${motifArt(p, d, cx, cy, 175, ink)}
    ${texts}
    <text x="${cx}" y="${cy + totalH / 2 + 46}" text-anchor="middle" font-family="'Arial Narrow', sans-serif" font-weight="bold" font-size="22" letter-spacing="8" fill="${ink}">${d.sub}</text>
    <line x1="${cx - 150}" y1="${cy + totalH / 2 + 64}" x2="${cx + 150}" y2="${cy + totalH / 2 + 64}" stroke="${ink}" stroke-width="1" opacity="0.5"/>
    <text x="40" y="60" font-family="monospace" font-size="20" fill="${ink}" opacity="0.7">№ 001/100</text>
    <text x="${bw - 40}" y="60" text-anchor="end" font-family="monospace" font-size="20" fill="${ink}" opacity="0.7">240 GSM</text>
    ${stamp(p, bw - 92, bh - 92, 52, ink)}
  </g>`;
}

/* ── oversized tee silhouette ── */
function teePath() {
  return `M 430 258 Q 405 250 360 262 L 232 318 L 150 488 L 196 514 L 300 474
    L 292 1066 Q 500 1092 708 1066 L 700 474 L 804 514 L 850 488 L 768 318
    Q 595 250 570 258 Q 500 302 430 258 Z`;
}

function tee(p, d, view) {
  const ink = INK[d.ink] ?? INK.bone;
  const path = teePath();
  // print placement differs front/back
  const box = view === 'back'
    ? { x: 300, y: 420, w: 400, h: 560 }
    : { x: 332, y: 474, w: 336, h: 437 };
  const sx = (box.w / 600).toFixed(4);
  const sy = (box.h / 780).toFixed(4);

  const collar = view === 'back'
    ? `<path d="M 442 262 Q 500 286 558 262" fill="none" stroke="#000" stroke-width="10" opacity="0.5"/>
       <text x="500" y="372" text-anchor="middle" font-family="'Arial Narrow', sans-serif" font-size="18" letter-spacing="6" fill="${ink}" opacity="0.8">NOVYR</text>`
    : `<path d="M 432 260 Q 500 312 568 260" fill="none" stroke="#000" stroke-width="12" opacity="0.55"/>
       <path d="M 438 268 Q 500 308 562 268" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.25"/>`;

  return `
    <ellipse cx="500" cy="1120" rx="300" ry="40" fill="#000" opacity="0.45" filter="url(#${p}soft)"/>
    <path d="${path}" fill="url(#${p}fab)" stroke="#000" stroke-width="2"/>
    <!-- soft folds -->
    <path d="M 360 540 Q 420 760 360 1040" fill="none" stroke="#000" stroke-width="34" opacity="0.10" filter="url(#${p}soft)"/>
    <path d="M 660 560 Q 600 780 650 1040" fill="none" stroke="#000" stroke-width="34" opacity="0.12" filter="url(#${p}soft)"/>
    <path d="M 300 478 L 292 1060" stroke="#000" stroke-width="1.5" opacity="0.4"/>
    <path d="M 700 478 L 708 1060" stroke="#000" stroke-width="1.5" opacity="0.4"/>
    ${collar}
    <!-- print -->
    <g transform="translate(${box.x} ${box.y}) scale(${sx} ${sy})" opacity="0.94" style="mix-blend-mode:screen">
      ${printArt(p, d)}
    </g>`;
}

function composeTee(d, view) {
  const p = `${d.slug.replace(/[^a-z]/g, '')}${view}_`;
  DESIGNS_INK = d.ink;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(p, d.wash)}
  <rect width="${W}" height="${H}" fill="url(#${p}bg)"/>
  <rect width="${W}" height="${H}" fill="url(#${p}ht)" opacity="0.03"/>
  ${tee(p, d, view)}
  <rect width="${W}" height="${H}" fill="url(#${p}vig)"/>
  <rect width="${W}" height="${H}" filter="url(#${p}noise)" opacity="0.06" style="mix-blend-mode:overlay"/>
</svg>`;
}

/* ── print-detail close-up (artwork on fabric) ── */
function composeDetail(d) {
  const p = `${d.slug.replace(/[^a-z]/g, '')}det_`;
  DESIGNS_INK = d.ink;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(p, d.wash)}
  <rect width="${W}" height="${H}" fill="url(#${p}fab)"/>
  <rect width="${W}" height="${H}" fill="url(#${p}ht)" opacity="0.05"/>
  <g transform="translate(500 625) rotate(-3) scale(1.45) translate(-300 -390)" opacity="0.96" style="mix-blend-mode:screen">
    ${printArt(d.slug ? p : p, d)}
  </g>
  <rect width="${W}" height="${H}" fill="url(#${p}vig)"/>
  <rect width="${W}" height="${H}" filter="url(#${p}noise)" opacity="0.09" style="mix-blend-mode:overlay"/>
</svg>`;
}

let count = 0;
for (const d of DESIGNS) {
  writeFileSync(join(OUT, `${d.slug}-front.svg`), composeTee(d, 'front'), 'utf8');
  writeFileSync(join(OUT, `${d.slug}-back.svg`), composeTee(d, 'back'), 'utf8');
  writeFileSync(join(OUT, `${d.slug}-print.svg`), composeDetail(d), 'utf8');
  count += 3;
}
console.log(`✅ Generated ${count} graphic-print SVGs in public/products`);

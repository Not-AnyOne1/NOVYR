/**
 * NOVYR — single source of truth for the product-image mapping.
 * `key` is the catalog image key (no hyphens): the site serves
 * public/products/real/<key>.webp and the DB references /products/real/<key>.webp.
 * `file` is the raw source photo inside SRC (C:/Users/hp/Downloads/products).
 *
 * Imported by process-products.mjs (image pipeline) and sync-products.mjs
 * (catalog ↔ folder reconciliation).
 */
export const SRC = 'C:/Users/hp/Downloads/products';

export const ITEMS = [
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
  // ── drop 005 (July 2026) ──
  { key: 'talktoomuch', file: 'ChatGPT Image 2 juil. 2026, 15_15_55.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'streetways', file: 'ChatGPT Image 2 juil. 2026, 15_20_36.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'toldchatgpt', file: 'ChatGPT Image 2 juil. 2026, 15_26_46.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'bornthisway', file: 'ChatGPT Image 2 juil. 2026, 15_51_08.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'change555', file: 'ChatGPT Image 2 juil. 2026, 16_00_03.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'theynotlikeus', file: 'ChatGPT Image 2 juil. 2026, 16_03_14.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'euphoria', file: 'ChatGPT Image 4 juil. 2026, 02_25_14.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'writhers', file: 'ChatGPT Image 4 juil. 2026, 02_54_53.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  // key darkvision2: legacy darkvision.webp belongs to the archived first
  // Dark Vision Tee and is referenced by a real order — never overwrite it.
  { key: 'darkvision2', file: 'ChatGPT Image 4 juil. 2026, 02_56_34.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'lavish', file: 'ChatGPT Image 4 juil. 2026, 02_59_45.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'fein', file: 'ChatGPT Image 4 juil. 2026, 03_01_40.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'savages', file: 'ChatGPT Image 4 juil. 2026, 03_05_27.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'prettygirls', file: 'ChatGPT Image 4 juil. 2026, 03_07_07.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'hellstar', file: 'photo_2026-07-04_03-03-30.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'thug', file: 'photo_2026-07-04_03-03-31.jpg', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  // ── drop 006 (July 2026) ──
  { key: 'toocold', file: 'ChatGPT Image 6 juil. 2026, 15_22_27.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
  { key: 'sideprofile', file: 'ChatGPT Image 6 juil. 2026, 15_21_01.png', gravity: 'centre', zoom: 1, printTop: 0.5, detailTop: 0.12 },
];

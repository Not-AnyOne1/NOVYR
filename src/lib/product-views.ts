/**
 * Maps a product image URL to a human view label, based on its filename suffix.
 * The image pipeline (scripts/process-products.mjs) emits:
 *   <key>.webp (front) · -back · -print · -folded · -flatlay · -lifestyle · -fabric · -detail · -label
 */
const VIEW_MAP: [string, string][] = [
  ['-back.', 'Back view'],
  ['-print.', 'Print detail'],
  ['-folded.', 'Folded'],
  ['-flatlay.', 'Flat lay'],
  ['-lifestyle.', 'Lifestyle'],
  ['-fabric.', 'Fabric close-up'],
  ['-detail.', 'Detail'],
  ['-label.', 'Label close-up'],
];

export function viewLabel(url: string | null | undefined): string {
  if (!url) return 'Front view';
  for (const [suffix, label] of VIEW_MAP) {
    if (url.includes(suffix)) return label;
  }
  return 'Front view';
}

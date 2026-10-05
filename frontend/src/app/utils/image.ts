/**
 * Maps catalogue image paths (e.g. "images/tours/day-tour-yala.jpg") to the optimised
 * WebP copies in /img. External URLs (e.g. images added through the admin) pass through.
 */
export function imageUrl(src: string | undefined | null, size: 900 | 2000 = 900): string {
  if (!src) return `img/sigiriya-${size}.webp`;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const match = src.match(/([\w-]+)\.(jpe?g|png|webp)$/i);
  if (match && /(^|\/)(images|assets\/images)\//.test(src)) return `img/${match[1]}-${size}.webp`;
  return src;
}

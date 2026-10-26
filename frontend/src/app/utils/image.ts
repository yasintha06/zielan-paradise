/**
 * Maps catalogue image paths (e.g. "images/tours/day-tour-yala.jpg") to the optimised
 * WebP copies in /img. External URLs (e.g. images added through the admin) pass through.
 */
/** Library photos used for tours that don't have their own photo yet. */
const FALLBACKS = ['sigiriya', 'ella', 'kandy', 'galle', 'mirissa', 'nuwara-eliya', 'yala', 'anuradhapura', 'dambulla', 'tour-southern-coast'];

/**
 * `key` (e.g. a tour id) picks a stable fallback photo when `src` is empty, so tours added
 * before their photos are ready don't all show the same picture.
 */
export function imageUrl(src: string | undefined | null, size: 900 | 2000 = 900, key = ''): string {
  if (!src) {
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return `img/${FALLBACKS[key ? h % FALLBACKS.length : 0]}-${size}.webp`;
  }
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const match = src.match(/([\w-]+)\.(jpe?g|png|webp)$/i);
  if (match && /(^|\/)(images|assets\/images)\//.test(src)) return `img/${match[1]}-${size}.webp`;
  return src;
}

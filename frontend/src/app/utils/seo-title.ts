/** Search-friendly tour title, e.g. "Sri Lanka Highlights: 8-Day Private Tour". Keep in step with data/build_catalog.py. */
export function tourSeoTitle(title: string, duration?: string): string {
  const days = /^(\d+)\s*Days?/i.exec(duration ?? '')?.[1];
  return days ? `${title}: ${days}-Day Private Tour` : `${title}: Private Day Tour`;
}

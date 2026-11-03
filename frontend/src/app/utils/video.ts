/**
 * Which copy of a clip in /video suits this screen: phones held upright get the tall cut
 * ({name}-phone.mp4, sharp because it isn't a slice of a wide video), other small screens 720p, the rest 1080p.
 */
export function isUprightPhone(): boolean {
  return window.innerWidth < 900 && window.innerHeight > window.innerWidth;
}

export function clipUrl(name: string): string {
  return `video/${name}-${isUprightPhone() ? 'phone' : window.innerWidth < 900 ? '720' : '1080'}.mp4`;
}

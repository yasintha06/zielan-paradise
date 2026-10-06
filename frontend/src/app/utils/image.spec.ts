import { imageUrl } from './image';

describe('imageUrl', () => {
  it('maps catalogue photos to the optimised WebP copies', () => {
    expect(imageUrl('images/tours/day-tour-yala.jpg')).toBe('img/day-tour-yala-900.webp');
    expect(imageUrl('assets/images/destinations/sigiriya.jpg', 2000)).toBe('img/sigiriya-2000.webp');
  });

  it('leaves external and already-optimised images alone', () => {
    expect(imageUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
    expect(imageUrl('img/ella-900.webp')).toBe('img/ella-900.webp');
  });

  it('falls back to a default photo', () => {
    expect(imageUrl(undefined)).toBe('img/sigiriya-900.webp');
  });
});

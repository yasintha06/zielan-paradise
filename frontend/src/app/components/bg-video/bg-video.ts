import { AfterViewInit, Component, ElementRef, Input, OnDestroy, inject, signal } from '@angular/core';
import { MotionService } from '../../services/motion.service';

/**
 * Quiet, muted background loop from /video ({name}-720|1080.mp4, {name}.webp poster).
 * The poster shows first; the clip only loads when the section is near the screen, pauses when it
 * scrolls away, and never plays for reduced motion or data-saver (the poster stays instead).
 */
@Component({
  selector: 'app-bg-video',
  standalone: true,
  template: `
    <img [src]="'video/' + name + '.webp'" alt="" loading="lazy" />
    @if (allowed() && near()) {
      <video [src]="src" muted [muted]="true" loop playsinline autoplay preload="none" aria-hidden="true"
             [class.is-playing]="playing()" (playing)="playing.set(true)" (error)="allowed.set(false)"></video>
    }
  `,
  styles: `
    :host { position: absolute; inset: 0; overflow: hidden; display: block; pointer-events: none; }
    img, video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    video { opacity: 0; transition: opacity 1.2s ease; }
    video.is-playing { opacity: 1; }
    @media print { video { display: none; } }
  `,
})
export class BgVideoComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) name!: string;

  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);
  private observer: IntersectionObserver | null = null;

  allowed = signal(!this.motion.reducedMotion && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  near = signal(false);
  playing = signal(false);

  get src(): string {
    return `video/${this.name}-${window.innerWidth < 900 ? 720 : 1080}.mp4`;
  }

  ngAfterViewInit(): void {
    if (!this.allowed() || typeof IntersectionObserver === 'undefined') return;
    const host = this.el.nativeElement as HTMLElement;
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.near.set(true);
      const video = host.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { rootMargin: '200px 0px' });
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { MotionService } from '../../services/motion.service';

export interface Crumb { label: string; link?: string; }

/** Cinematic hero used at the top of every inner page. */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.css',
})
export class PageHeroComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) image!: string;
  @Input() alt = '';
  @Input() eyebrow = '';
  @Input({ required: true }) title!: string;
  @Input() titleEm = '';
  @Input() subtitle = '';
  @Input() crumbs: Crumb[] = [];
  @Input() size: 'tall' | 'medium' = 'medium';
  /** Optional looping clip from /video ({name}-720|1080.mp4); the image stays as poster and fallback. */
  @Input() video = '';

  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private motion = inject(MotionService);
  private ctx: gsap.Context | null = null;

  /** Photos only for reduced motion or data-saver, like the homepage film. */
  canPlayVideo = signal(!this.motion.reducedMotion && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  playing = signal(false);

  get videoSrc(): string {
    return `video/${this.video}-${window.innerWidth < 900 ? 720 : 1080}.mp4`;
  }

  ngAfterViewInit(): void {
    if (this.motion.reducedMotion) return;
    const root = this.el.nativeElement as HTMLElement;
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const split = SplitText.create(root.querySelector('.ph-title'), { type: 'lines', mask: 'lines' });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set('.ph-fade', { opacity: 0, y: 24 });
        gsap.set('.ph-media img, .ph-media video', { scale: 1.18 });
        this.motion.introDone.then(() => {
          gsap.timeline({ defaults: { ease: 'expo.out' } })
            .to('.ph-media img, .ph-media video', { scale: 1.06, duration: 2.2 }, 0)
            .to(split.lines, { yPercent: 0, duration: 1.4, stagger: 0.1 }, 0.1)
            .to('.ph-fade', { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.4);
        });
        gsap.to('.ph-media', {
          yPercent: 18, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.ph-content', {
          yPercent: -30, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      }, root);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

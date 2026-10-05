import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Drifts an image vertically as its container scrolls through the viewport.
 * Usage: <div class="frame"><img appParallax="10" ...></div> — the parent should clip overflow.
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input('appParallax') amount: number | string = 10;

  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private tween: gsap.core.Tween | null = null;

  ngAfterViewInit(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = this.el.nativeElement as HTMLElement;
    const amt = Number(this.amount) || 10;
    this.zone.runOutsideAngular(() => {
      this.tween = gsap.fromTo(node, { yPercent: -amt / 2, scale: 1.12 }, {
        yPercent: amt / 2, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: node.parentElement ?? node, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}

export { ScrollTrigger };

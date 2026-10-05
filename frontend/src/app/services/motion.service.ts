import { Injectable, NgZone, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Owns smooth scrolling (Lenis) and keeps GSAP ScrollTrigger in sync with it.
 * Everything runs outside Angular's zone so animation frames never trigger change detection.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private zone = inject(NgZone);
  private router = inject(Router);
  private lenis: Lenis | null = null;

  readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Resolves when the intro preloader has finished, so pages can start their entrance animations. */
  private introResolve!: () => void;
  readonly introDone = new Promise<void>((resolve) => (this.introResolve = resolve));

  init(): void {
    this.zone.runOutsideAngular(() => {
      if (!this.reducedMotion) {
        this.lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const fragment = this.router.parseUrl((e as NavigationEnd).urlAfterRedirects).fragment;
      this.lenis?.scrollTo(0, { immediate: true, force: true });
      // Let the new page render its images/layout before measuring trigger positions.
      setTimeout(() => {
        ScrollTrigger.refresh();
        const target = fragment ? document.getElementById(fragment) : null;
        if (target) this.scrollTo(target);
      }, fragment ? 400 : 120);
    });
  }

  finishIntro(): void {
    this.introResolve();
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  scrollTo(target: number | string | HTMLElement): void {
    if (this.lenis) this.lenis.scrollTo(target, { duration: 1.6, offset: typeof target === 'number' ? 0 : -90 });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
  }

  onScroll(cb: (y: number, direction: number) => void): () => void {
    if (this.lenis) {
      const handler = (l: Lenis) => cb(l.scroll, l.direction);
      this.lenis.on('scroll', handler);
      return () => this.lenis?.off('scroll', handler);
    }
    let last = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      cb(y, y > last ? 1 : -1);
      last = y;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }
}

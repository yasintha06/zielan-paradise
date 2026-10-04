import { AfterViewInit, Component, ElementRef, NgZone, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../services/motion.service';

const SEEN_KEY = 'zp-intro-seen';

/** Branded intro curtain, shown once per browser session. */
@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="preloader" aria-hidden="true">
        <div class="preloader-inner">
          <img class="preloader-mark" src="logo-mark.png" alt="" width="200" height="117" />
          <p class="preloader-word">Zeilan <em>Paradise</em></p>
          <div class="preloader-bar"><span></span></div>
          <p class="preloader-count">0</p>
        </div>
      </div>
    }
  `,
  styleUrl: './preloader.css',
})
export class PreloaderComponent implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>);
  private motion = inject(MotionService);
  private zone = inject(NgZone);

  visible = signal(!this.alreadySeen());

  ngAfterViewInit(): void {
    if (!this.visible() || this.motion.reducedMotion) {
      this.visible.set(false);
      this.motion.finishIntro();
      return;
    }
    this.motion.stop();
    this.zone.runOutsideAngular(() => this.play());
  }

  private play(): void {
    const root = this.el.nativeElement.querySelector('.preloader') as HTMLElement;
    const count = root.querySelector('.preloader-count') as HTMLElement;
    const counter = { v: 0 };

    gsap
      .timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () =>
          this.zone.run(() => {
            this.remember();
            this.visible.set(false);
            this.motion.start();
          }),
      })
      .from('.preloader-mark', { y: 30, opacity: 0, scale: 0.92, duration: 1.4 }, 0)
      .from('.preloader-word', { y: 20, opacity: 0, duration: 1.2 }, 0.25)
      .to('.preloader-bar span', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0.2)
      .to(counter, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => (count.textContent = String(Math.round(counter.v))),
      }, 0.2)
      .to('.preloader-inner', { opacity: 0, y: -24, duration: 0.6, ease: 'power2.in' }, 2)
      .add(() => this.motion.finishIntro(), 2.35)
      .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 2.3);
  }

  private alreadySeen(): boolean {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  private remember(): void {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
  }
}

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import gsap from 'gsap';
import { MotionService } from '../../services/motion.service';

/**
 * Gold cursor follower for fine pointers. Elements with [data-cursor="Label"]
 * expand the ring and show the label (e.g. "View", "Drag").
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `<div class="cursor-dot"></div><div class="cursor-ring"><span class="cursor-label"></span></div>`,
  styleUrl: './cursor.css',
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  ngAfterViewInit(): void {
    if (this.motion.reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    this.zone.runOutsideAngular(() => {
      const host = this.el.nativeElement as HTMLElement;
      const dot = host.querySelector('.cursor-dot') as HTMLElement;
      const ring = host.querySelector('.cursor-ring') as HTMLElement;
      const label = host.querySelector('.cursor-label') as HTMLElement;
      document.documentElement.classList.add('has-cursor');

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

      const move = (e: PointerEvent) => {
        host.classList.add('is-visible');
        dotX(e.clientX); dotY(e.clientY);
        ringX(e.clientX); ringY(e.clientY);
      };
      const over = (e: Event) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, textarea, select');
        const text = target?.dataset['cursor'] ?? '';
        host.classList.toggle('is-hover', !!target && !text);
        host.classList.toggle('is-label', !!text);
        label.textContent = text;
      };
      const leave = () => host.classList.remove('is-visible');

      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerover', over, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      this.cleanup = () => {
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', over);
        document.documentElement.removeEventListener('pointerleave', leave);
        document.documentElement.classList.remove('has-cursor');
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

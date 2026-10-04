import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import gsap from 'gsap';

/** Pulls the element gently towards the pointer on hover (fine pointers only). */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private cleanup: (() => void) | null = null;

  ngAfterViewInit(): void {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.zone.runOutsideAngular(() => {
      const node = this.el.nativeElement as HTMLElement;
      const x = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const y = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.3);
        y((e.clientY - (r.top + r.height / 2)) * 0.4);
      };
      const leave = () => { x(0); y(0); };
      node.addEventListener('pointermove', move);
      node.addEventListener('pointerleave', leave);
      this.cleanup = () => {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', leave);
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

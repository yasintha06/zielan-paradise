import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';

/** Floating WhatsApp button that appears once the visitor scrolls past the hero. */
@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  template: `
    <a class="wa-fab" [class.is-shown]="shown()" [href]="site.whatsappHref" target="_blank" rel="noopener noreferrer"
       aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" fill="currentColor">
        <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8C29 8.7 23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.2 9.9 10 5.2 16 5.2s10.8 4.7 10.8 10.6S22 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/>
      </svg>
      <span class="wa-fab-label">Plan with us</span>
    </a>
  `,
  styles: `
    .wa-fab {
      position: fixed; right: clamp(16px, 2.5vw, 32px); bottom: clamp(16px, 2.5vw, 32px); z-index: 900;
      display: inline-flex; align-items: center; gap: 0.6rem;
      padding: 0.85rem; border-radius: 999px;
      background: #1faa59; color: #fff;
      box-shadow: 0 12px 30px rgba(10, 31, 28, 0.35);
      transform: translateY(140%); opacity: 0;
      transition: transform 0.6s var(--ease-out), opacity 0.4s, padding 0.4s var(--ease-out), background 0.3s;
    }
    .wa-fab.is-shown { transform: none; opacity: 1; }
    .wa-fab:hover { background: #179149; padding-right: 1.3rem; }
    .wa-fab-label {
      max-width: 0; overflow: hidden; white-space: nowrap;
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
      transition: max-width 0.5s var(--ease-out);
    }
    .wa-fab:hover .wa-fab-label { max-width: 140px; }
  `,
})
export class WhatsappFabComponent implements OnInit, OnDestroy {
  private motion = inject(MotionService);
  readonly site = SITE;
  shown = signal(false);
  private off: (() => void) | null = null;

  ngOnInit(): void {
    this.off = this.motion.onScroll((y) => {
      const next = y > window.innerHeight * 0.6;
      if (next !== this.shown()) this.shown.set(next);
    });
  }

  ngOnDestroy(): void {
    this.off?.();
  }
}

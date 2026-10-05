import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="nf">
      <img src="img/anuradhapura-2000.webp" alt="" class="nf-bg" />
      <div class="nf-shade"></div>
      <div class="container nf-inner">
        <p class="eyebrow">Page not found</p>
        <h1>Even the best explorers<br /><em>take a wrong turn</em></h1>
        <p>The page you were looking for has moved or never existed. Let us guide you back.</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn btn-gold">Back to home</a>
          <a routerLink="/round-tours" class="btn btn-ghost-light">Browse journeys</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .nf { position: relative; min-height: 100svh; display: flex; align-items: center; color: var(--ivory); background: var(--ink); overflow: hidden; }
    .nf-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .nf-shade { position: absolute; inset: 0; background: linear-gradient(100deg, rgba(6,20,18,.92) 30%, rgba(6,20,18,.4)); }
    .nf-inner { position: relative; padding-top: var(--nav-h); }
    .eyebrow { color: var(--gold); }
    h1 { font-weight: 400; font-size: clamp(2.6rem, 6vw, 5.5rem); line-height: 1; margin-bottom: 1.5rem; }
    h1 em { color: var(--gold-soft); }
    p:not(.eyebrow) { max-width: 460px; color: rgba(246,240,226,.8); margin-bottom: 2rem; }
    .nf-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
  `,
})
export class NotFound {}

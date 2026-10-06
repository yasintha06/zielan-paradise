import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLES } from '../../data/journal';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ParallaxDirective } from '../../directives/parallax';
import { PageHeroComponent } from '../../components/page-hero/page-hero';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, ParallaxDirective, PageHeroComponent],
  template: `
    <app-page-hero image="img/galle-2000.webp" alt="Galle lighthouse" eyebrow="Journal"
      title="Notes from" titleEm="the island"
      subtitle="Practical advice and inspiration to help you plan: when to go, where to stay and what not to miss."
      [crumbs]="[{ label: 'Journal' }]" />

    <section class="pg-section">
      <div class="container jr-grid">
        @for (a of articles; track a.slug; let i = $index) {
          <a class="jr-card" [class.jr-card--lead]="i === 0" [routerLink]="['/journal', a.slug]" appScrollReveal data-cursor="Read">
            <div class="jr-img"><img [src]="'img/' + a.image + '-900.webp'" [alt]="a.title" loading="lazy" appParallax="8" /></div>
            <div class="jr-body">
              <p class="jr-meta">{{ a.category }} · {{ a.readMinutes }} min read</p>
              <h2>{{ a.title }}</h2>
              <p class="jr-excerpt">{{ a.excerpt }}</p>
              <span class="pg-link">Read the guide <span aria-hidden="true">&rarr;</span></span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    .jr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem); }
    .jr-card { display: flex; flex-direction: column; color: var(--ink); }
    .jr-card--lead { grid-column: 1 / -1; display: grid; grid-template-columns: 1.3fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
    .jr-img { aspect-ratio: 16 / 10; overflow: hidden; border-radius: 2px; margin-bottom: 1.4rem; }
    .jr-card--lead .jr-img { margin: 0; aspect-ratio: 4 / 3; }
    .jr-img img { width: 100%; height: 100%; object-fit: cover; }
    .jr-meta { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-dark); }
    h2 { font-size: clamp(1.8rem, 2.8vw, 2.6rem); font-weight: 500; line-height: 1.1; margin: 0.5rem 0 0.8rem; transition: color 0.4s; }
    .jr-card:hover h2 { color: var(--teal); }
    .jr-excerpt { color: var(--text-soft); margin-bottom: 1.25rem; }
    @media (max-width: 800px) { .jr-grid, .jr-card--lead { grid-template-columns: 1fr; } .jr-card--lead .jr-img { margin-bottom: 1.4rem; } }
  `,
})
export class Journal {
  readonly articles = ARTICLES;
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ARTICLES, Article, Block } from '../../data/journal';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, DatePipe, ScrollRevealDirective, PageHeroComponent],
  template: `
    @if (article(); as a) {
      <app-page-hero [image]="'img/' + a.image + '-2000.webp'" [alt]="a.title" [eyebrow]="a.category + ' · ' + a.readMinutes + ' min read'"
        [title]="a.title" [crumbs]="[{ label: 'Journal', link: '/journal' }, { label: a.category }]" />

      <article class="pg-section">
        <div class="container ar-wrap">
          <p class="ar-lead" appScrollReveal>{{ a.excerpt }}</p>
          @for (b of a.body; track $index) {
            @if (isH(b)) { <h2>{{ b.h }}</h2> }
            @if (isP(b)) { <p>{{ b.p }}</p> }
            @if (isList(b)) { <ul class="ar-list">@for (li of b.list; track $index) { <li>{{ li }}</li> }</ul> }
            @if (isTable(b)) {
              <div class="ar-table"><table>
                <thead><tr>@for (c of b.table.head; track $index) { <th>{{ c }}</th> }</tr></thead>
                <tbody>@for (r of b.table.rows; track $index) { <tr>@for (c of r; track $index) { <td>{{ c }}</td> }</tr> }</tbody>
              </table></div>
            }
            @if (isTip(b)) { <aside class="ar-tip"><strong>Our tip</strong><p>{{ b.tip }}</p></aside> }
          }
          <p class="ar-updated">Last updated {{ a.updated | date: 'd MMMM y' }}</p>

          <div class="ar-end">
            @if (a.related?.length) {
              <div>
                <p class="eyebrow">Related journeys</p>
                <ul>@for (r of a.related; track r.link) { <li><a class="pg-link" [routerLink]="r.link">{{ r.label }} <span aria-hidden="true">&rarr;</span></a></li> }</ul>
              </div>
            }
            <div class="ar-cta">
              <h3>Ready to plan your trip?</h3>
              <p>Tell us your dates and interests and we’ll design a private journey around them.</p>
              <a routerLink="/tailor-made" class="btn btn-gold">Start planning</a>
            </div>
          </div>
        </div>
      </article>
    } @else {
      <section class="pg-section ar-missing"><div class="container">
        <h1 class="section-title">Article not found</h1>
        <a routerLink="/journal" class="btn btn-teal">Back to the journal</a>
      </div></section>
    }
  `,
  styles: `
    .ar-wrap { max-width: 760px; }
    .ar-lead { font-family: var(--ff-head); font-size: clamp(1.5rem, 2.4vw, 2rem); line-height: 1.35; color: var(--ink); margin-bottom: 2rem; }
    h2 { font-size: clamp(1.9rem, 3vw, 2.5rem); font-weight: 500; margin: 2.75rem 0 1rem; }
    p { color: var(--text-soft); font-size: 1.04rem; line-height: 1.85; margin-bottom: 1.1rem; }
    .ar-list { list-style: none; display: grid; gap: 0.75rem; margin-bottom: 1.5rem; }
    .ar-list li { position: relative; padding-left: 1.5rem; color: var(--text-soft); line-height: 1.75; }
    .ar-list li::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 7px; height: 7px; background: var(--gold); transform: rotate(45deg); }
    .ar-table { overflow-x: auto; margin: 0.5rem 0 1.75rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.92rem; min-width: 520px; }
    th { text-align: left; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-dark); padding: 0.75rem 1rem 0.75rem 0; border-bottom: 1px solid var(--gold); }
    td { padding: 0.9rem 1rem 0.9rem 0; border-bottom: 1px solid var(--pearl-dark); vertical-align: top; color: var(--ink); }
    td:first-child { font-weight: 600; white-space: nowrap; }
    .ar-tip { margin: 2rem 0; padding: 1.5rem 1.75rem; background: var(--sand); border-left: 3px solid var(--gold); border-radius: 2px; }
    .ar-tip strong { display: block; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--teal); margin-bottom: 0.4rem; }
    .ar-tip p { margin: 0; color: var(--ink); }
    .ar-updated { font-size: 0.8rem; margin-top: 2rem; }
    .ar-end { display: grid; gap: 2.5rem; margin-top: 3rem; padding-top: 2.5rem; border-top: 1px solid var(--pearl-dark); }
    .ar-end ul { display: grid; gap: 0.75rem; }
    .ar-cta { padding: 2rem; background: var(--teal-dark); color: var(--ivory); border-radius: 4px; }
    .ar-cta h3 { font-size: 2rem; font-weight: 500; margin-bottom: 0.5rem; }
    .ar-cta p { color: rgba(246, 240, 226, 0.78); }
    .ar-missing { padding-top: calc(var(--nav-h) + 4rem); }
  `,
})
export class ArticlePage implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  article = signal<Article | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      const a = ARTICLES.find((x) => x.slug === p.get('slug')) ?? null;
      this.article.set(a);
      // Defer until navigation has finished so the canonical URL is the new page's.
      if (a) setTimeout(() => this.seo.set({ title: `${a.title} | Zeilan Paradise`, description: a.excerpt, image: `/img/${a.image}-900.webp` }));
    });
  }

  isH(b: Block): b is { h: string } { return 'h' in b; }
  isP(b: Block): b is { p: string } { return 'p' in b; }
  isList(b: Block): b is { list: string[] } { return 'list' in b; }
  isTable(b: Block): b is { table: { head: string[]; rows: string[][] } } { return 'table' in b; }
  isTip(b: Block): b is { tip: string } { return 'tip' in b; }
}

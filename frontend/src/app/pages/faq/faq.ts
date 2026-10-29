import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { SeoService } from '../../services/seo.service';
import { SITE } from '../../config/site';

interface FaqItem { q: string; a: string; hidden?: boolean; }

/** Set to true only once customer-money protection is really in place (ask the UK travel-law adviser first). */
const MONEY_PROTECTION_CONFIRMED = false;

/** Answers must stay consistent with the Terms & Conditions page. */
const GROUPS: { title: string; items: FaqItem[] }[] = [
  {
    title: 'Planning & booking',
    items: [
      { q: 'How does planning a tailor-made journey work?',
        a: 'Tell us when you’d like to travel, who’s coming and what you love, using our journey planner, WhatsApp or email. We reply with questions and ideas, then send a private, day-by-day proposal with hand-picked hotels. We refine it with you until it feels exactly right, and only then do you book.' },
      { q: 'Can I change one of your itineraries?',
        a: 'Yes. Every journey is private, so our itineraries are starting points. Add beach days, swap a hotel, slow the pace or combine two tours. The proposal is built around you.' },
      { q: 'How much does a Sri Lanka holiday cost?',
        a: 'It depends on the length of your trip, the season and the style of hotels. Because every journey is tailor-made we price each one individually. Your proposal and quote are free, with no obligation.' },
      { q: 'What deposit do you need, and when is the balance due?',
        a: 'A non-refundable deposit of 20% of the total cost confirms your booking (some luxury hotels ask for more). The balance is due 60 days before departure. Full details are in our Terms & Conditions.' },
      { hidden: !MONEY_PROTECTION_CONFIRMED, q: 'Is my money protected?',
        a: 'Where your arrangements form a package under the Package Travel Regulations 2018, you have all the rights those Regulations give. Details of the financial protection that applies to your booking are confirmed to you in writing before you pay anything.' },
      { q: 'Do you book international flights?',
        a: 'We arrange everything in Sri Lanka: hotels, your private vehicle and chauffeur-guide, transfers and experiences. You book your own international flights, and we’re happy to suggest the best routes and arrival times.' },
    ],
  },
  {
    title: 'Travelling in Sri Lanka',
    items: [
      { q: 'When is the best time to visit?',
        a: 'Sri Lanka has two monsoons, so somewhere is always good. From December to April the west and south coasts, the hill country and the Cultural Triangle are at their best. From May to September the east coast is calm and sunny. We plan your route around the season you travel.' },
      { q: 'Who will be travelling with us?',
        a: 'Your own private, English-speaking chauffeur-guide drives you throughout, shares the history and wildlife along the way, and is there to help every day. There are no group coaches or shared tours.' },
      { q: 'Do I need a visa?',
        a: 'Most visitors need an Electronic Travel Authorisation (ETA) or visa before arrival, and the rules can change. Please check the official Sri Lanka immigration website (eta.gov.lk) and the GOV.UK travel advice for Sri Lanka before you travel. Your passport should be valid for at least six months.' },
      { q: 'Is travel insurance required?',
        a: 'Yes. Comprehensive travel insurance covering medical expenses, repatriation and cancellation is a condition of booking, and we ask for your policy details before departure.' },
      { q: 'Is Sri Lanka good for families?',
        a: 'Very. Distances are short, the food is wonderful and children love the safaris, the trains and the beaches. We plan family journeys with gentler days, family rooms and plenty of time to swim.' },
      { q: 'What about health and vaccinations?',
        a: 'Speak to your GP or a travel clinic about six to eight weeks before you travel, and see the NHS fitfortravel website for Sri Lanka. Drink bottled or filtered water.' },
      { q: 'What money should I take?',
        a: 'The currency is the Sri Lankan rupee. Cards are accepted in hotels and larger restaurants, and ATMs are easy to find in towns. Carry some cash for small purchases, entrance fees and tips.' },
    ],
  },
];

/** Questions hidden until their facts are confirmed are left out of the page and of Google's FAQ data. */
const VISIBLE_GROUPS = GROUPS.map((g) => ({ ...g, items: g.items.filter((f) => !f.hidden) }));

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, ScrollRevealDirective],
  template: `
    <app-page-hero image="img/ella-2000.webp" alt="Tea hills around Ella" eyebrow="Questions"
      title="Good to" titleEm="know"
      subtitle="Answers to the questions UK travellers ask us most, from booking and payments to visas and the best time to go."
      [crumbs]="[{ label: 'FAQ' }]" />

    <section class="pg-section">
      <div class="container faq-layout">
        @for (g of groups; track g.title; let gi = $index) {
          <div class="faq-group" appScrollReveal>
            <h2 class="faq-group-title">{{ g.title }}</h2>
            <ul class="faq-list">
              @for (f of g.items; track f.q; let i = $index) {
                <li class="faq-item" [class.is-open]="open() === gi + '-' + i">
                  <button type="button" (click)="toggle(gi + '-' + i)" [attr.aria-expanded]="open() === gi + '-' + i"
                          [attr.aria-controls]="'faq-' + gi + '-' + i">
                    <span>{{ f.q }}</span><i aria-hidden="true"></i>
                  </button>
                  <div class="faq-answer" [id]="'faq-' + gi + '-' + i"><div><p>{{ f.a }}</p></div></div>
                </li>
              }
            </ul>
          </div>
        }

        <aside class="faq-cta" appScrollReveal>
          <p class="eyebrow">Still wondering?</p>
          <h3>Ask us anything</h3>
          <p>We’re happy to help, whether you’re ready to book or just starting to dream.</p>
          <a [href]="site.whatsappHref" target="_blank" rel="noopener noreferrer" class="btn btn-gold">WhatsApp us</a>
          <a routerLink="/contact" class="pg-link">Send a message <span aria-hidden="true">&rarr;</span></a>
          <p class="faq-cta-terms">See also our <a routerLink="/terms-and-conditions">Terms &amp; Conditions</a>.</p>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .faq-layout { display: grid; grid-template-columns: 1fr 320px; gap: clamp(2rem, 5vw, 4.5rem); align-items: start; }
    .faq-group { grid-column: 1; }
    .faq-group + .faq-group { margin-top: clamp(2.5rem, 5vw, 3.5rem); }
    .faq-group-title { font-size: clamp(1.6rem, 2.6vw, 2.2rem); font-weight: 500; margin-bottom: 1rem; }
    .faq-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--pearl-dark); }
    .faq-item { border-bottom: 1px solid var(--pearl-dark); }
    .faq-item button {
      width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 1.5rem;
      padding: 1.25rem 0; background: none; border: 0; text-align: left; cursor: pointer;
      font: inherit; font-size: 1.05rem; font-weight: 600; color: var(--ink);
    }
    .faq-item button:hover span { color: var(--teal); }
    .faq-item i { position: relative; flex: 0 0 14px; height: 14px; }
    .faq-item i::before, .faq-item i::after {
      content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1.5px; background: var(--gold-dark);
      transition: transform 0.35s var(--ease-out);
    }
    .faq-item i::after { transform: rotate(90deg); }
    .faq-item.is-open i::after { transform: rotate(0); }
    .faq-answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease-out); }
    .faq-answer > div { overflow: hidden; }
    .faq-item.is-open .faq-answer { grid-template-rows: 1fr; }
    .faq-answer p { color: var(--text-soft); padding-bottom: 1.25rem; max-width: 680px; }
    .faq-cta {
      grid-column: 2; grid-row: 1 / span 2; position: sticky; top: 7rem;
      padding: 2rem; background: var(--sand); border-radius: 4px; display: grid; gap: 0.9rem; justify-items: start;
    }
    .faq-cta h3 { font-size: 1.7rem; font-weight: 500; }
    .faq-cta p { color: var(--text-soft); }
    .faq-cta-terms { font-size: 0.85rem; }
    .faq-cta-terms a { color: var(--teal); text-decoration: underline; }
    @media (max-width: 900px) {
      .faq-layout { grid-template-columns: 1fr; }
      .faq-cta { grid-column: 1; grid-row: auto; position: static; }
    }
  `,
})
export class Faq implements OnInit, OnDestroy {
  private seo = inject(SeoService);
  readonly site = SITE;
  readonly groups = VISIBLE_GROUPS;
  open = signal('0-0');

  ngOnInit(): void {
    this.seo.setJsonLd({
      '@type': 'FAQPage',
      mainEntity: VISIBLE_GROUPS.flatMap((g) => g.items).map((f) => ({
        '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  ngOnDestroy(): void {
    this.seo.setJsonLd(null);
  }

  toggle(id: string): void {
    this.open.set(this.open() === id ? '' : id);
  }
}

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, LEAD_STATUSES, Lead, Overview } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <header class="a-head">
      <div>
        <h1>{{ greeting() }}</h1>
        <p>Here’s what’s happening with Zeilan Paradise.</p>
      </div>
      <div class="a-head-actions">
        <a routerLink="/admin/quotes/new" class="a-btn a-btn--gold">New quote</a>
        <a routerLink="/admin/tours/new" class="a-btn">Add tour</a>
      </div>
    </header>

    @if (error()) { <p class="a-error">{{ error() }}</p> }

    <ul class="ov-stats">
      <li class="a-panel"><a routerLink="/admin/enquiries"><strong>{{ newLeads() }}</strong><span>New enquiries</span></a></li>
      <li class="a-panel"><a routerLink="/admin/enquiries"><strong>{{ overview()?.enquiries ?? '–' }}</strong><span>All enquiries</span></a></li>
      <li class="a-panel"><a routerLink="/admin/tours"><strong>{{ overview()?.activeTours ?? '–' }}</strong><span>Live tours</span></a></li>
      <li class="a-panel"><a routerLink="/admin/quotes"><strong>{{ overview()?.quotes ?? '–' }}</strong><span>Saved quotes</span></a></li>
    </ul>

    <div class="ov-cols">
      <section class="a-panel a-panel-pad">
        <div class="ov-section-head">
          <h2>Latest enquiries</h2>
          <a routerLink="/admin/enquiries" class="a-btn a-btn--sm">View all</a>
        </div>
        @if (leads().length) {
          <ul class="ov-leads">
            @for (l of leads().slice(0, 6); track l.id) {
              <li>
                <a [routerLink]="['/admin/enquiries']" [queryParams]="{ open: l.id }">
                  <span class="a-pill" [class.a-pill--gold]="l.kind === 'planner'" [class.a-pill--teal]="l.kind === 'contact'">{{ l.kind === 'planner' ? 'Planner' : 'Contact' }}</span>
                  <strong>{{ l.firstName }} {{ l.lastName }}</strong>
                  <span class="a-muted">{{ l.createdAt | date: 'd MMM, HH:mm' }}</span>
                  <span class="a-pill" [class.a-pill--red]="l.status === 'New'">{{ l.status }}</span>
                </a>
              </li>
            }
          </ul>
        } @else if (loaded()) {
          <p class="a-empty">No enquiries yet. They’ll appear here as soon as someone gets in touch.</p>
        }
      </section>

      <div class="ov-side">
        <section class="a-panel a-panel-pad">
          <h2>Pipeline</h2>
          <ul class="ov-pipe">
            @for (s of statuses; track s) {
              <li><span>{{ s }}</span><strong>{{ overview()?.enquiriesByStatus?.[s] ?? 0 }}</strong></li>
            }
          </ul>
        </section>

        <section class="a-panel a-panel-pad">
          <h2>Catalogue</h2>
          <p class="a-muted ov-small">Add any of the standard tours and destinations that aren’t in your database yet. Your edits are never overwritten.</p>
          <button type="button" class="a-btn" (click)="importCatalog()" [disabled]="importing()">{{ importing() ? 'Importing…' : 'Import missing catalogue items' }}</button>
          @if (importResult()) { <p class="a-success ov-result">{{ importResult() }}</p> }
        </section>
      </div>
    </div>
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `
    .ov-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .ov-stats a { display: grid; gap: 0.3rem; padding: 1.4rem 1.5rem; }
    .ov-stats strong { font-family: var(--ff-head); font-size: 2.6rem; font-weight: 500; line-height: 1; color: var(--teal); }
    .ov-stats span { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-soft); }
    .ov-stats li:first-child strong { color: var(--gold-dark); }
    .ov-cols { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem; align-items: start; }
    .ov-side { display: grid; gap: 1.5rem; }
    .ov-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .ov-section-head h2 { margin: 0; }
    .ov-leads li + li { border-top: 1px solid #f0ece2; }
    .ov-leads a { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 0.85rem; padding: 0.85rem 0.25rem; font-size: 0.9rem; }
    .ov-leads a:hover strong { color: var(--teal); }
    .ov-pipe li { display: flex; justify-content: space-between; padding: 0.55rem 0; border-bottom: 1px solid #f0ece2; font-size: 0.9rem; }
    .ov-pipe li:last-child { border-bottom: 0; }
    .ov-small { font-size: 0.85rem; margin-bottom: 1rem; }
    .ov-result { margin-top: 1rem; }
    @media (max-width: 1000px) { .ov-cols { grid-template-columns: 1fr; } .ov-stats { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .ov-leads a { grid-template-columns: auto 1fr; } .ov-leads a > :nth-child(3) { display: none; } }
  `,
})
export class AdminOverview implements OnInit {
  private admin = inject(AdminService);

  readonly statuses = LEAD_STATUSES;
  overview = signal<Overview | null>(null);
  leads = signal<Lead[]>([]);
  loaded = signal(false);
  error = signal('');
  importing = signal(false);
  importResult = signal('');

  newLeads = computed(() => this.overview()?.enquiriesByStatus?.['New'] ?? (this.loaded() ? 0 : '–'));
  greeting = computed(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  });

  ngOnInit(): void {
    this.admin.overview().subscribe({ next: (o) => this.overview.set(o), error: () => this.error.set('Could not load the dashboard. Check the server is running.') });
    this.admin.leads().subscribe({ next: (l) => { this.leads.set(l); this.loaded.set(true); }, error: () => this.loaded.set(true) });
  }

  importCatalog(): void {
    this.importing.set(true);
    this.importResult.set('');
    this.admin.importCatalog().subscribe({
      next: (r) => {
        this.importing.set(false);
        const added = [...r.addedTours, ...r.addedDestinations];
        this.importResult.set(added.length ? `Added ${added.length}: ${added.join(', ')}.` : 'Everything is already up to date.');
        this.admin.overview().subscribe((o) => this.overview.set(o));
      },
      error: () => { this.importing.set(false); this.error.set('Import failed. Please try again.'); },
    });
  }
}

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Tour } from '../../../services/tour.service';
import { imageUrl } from '../../../utils/image';

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <header class="a-head">
      <div>
        <h1>Tours</h1>
        <p>Round tours and day tours shown on the website. Hidden tours stay here but disappear from the site.</p>
      </div>
      <div class="a-head-actions">
        <a routerLink="/admin/tours/new" [queryParams]="{ type: 'round' }" class="a-btn a-btn--primary">New round tour</a>
        <a routerLink="/admin/tours/new" [queryParams]="{ type: 'day' }" class="a-btn">New day tour</a>
      </div>
    </header>

    <div class="a-toolbar">
      <div class="tt-tabs">
        @for (t of tabs; track t.key) {
          <button type="button" class="a-btn a-btn--sm" [class.a-btn--primary]="tab() === t.key" (click)="tab.set(t.key)">{{ t.label }} ({{ countFor(t.key) }})</button>
        }
      </div>
      <input class="a-input a-search" type="search" placeholder="Search tours…" aria-label="Search tours" [ngModel]="search()" (ngModelChange)="search.set($event)" />
    </div>

    @if (error()) { <p class="a-error">{{ error() }}</p> }

    <div class="a-panel">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead><tr><th></th><th>Tour</th><th>Type</th><th>Length</th><th>Theme</th><th>Status</th><th></th></tr></thead>
          <tbody>
            @for (t of visible(); track t.id) {
              <tr>
                <td><img class="a-thumb" [src]="img(t)" alt="" loading="lazy" /></td>
                <td>
                  <a [routerLink]="['/admin/tours', t.id]" class="tt-title">{{ t.title }}</a>
                  @if (t.featured) { <span class="a-pill a-pill--gold tt-feat">Homepage</span> }
                  <br /><span class="a-muted">{{ t.id }}</span>
                </td>
                <td>{{ t.type === 'day' ? 'Day' : 'Round' }}</td>
                <td class="a-muted">{{ t.duration }}</td>
                <td class="a-muted">{{ t.badge?.text }}</td>
                <td>
                  <button type="button" class="a-pill tt-toggle" [class.a-pill--green]="t.isActive !== false" (click)="toggleActive(t)"
                          [attr.aria-label]="(t.isActive !== false ? 'Hide ' : 'Show ') + t.title">
                    {{ t.isActive !== false ? 'Live' : 'Hidden' }}
                  </button>
                </td>
                <td class="tt-actions">
                  <a [routerLink]="['/admin/tours', t.id]" class="a-btn a-btn--sm">Edit</a>
                  <a [href]="'/tours/' + t.id" target="_blank" rel="noopener" class="a-btn a-btn--sm">View ↗</a>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="a-empty">{{ loading() ? 'Loading…' : 'No tours found.' }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `
    .tt-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .tt-title { font-weight: 600; color: var(--ink); }
    .tt-title:hover { color: var(--teal); }
    .tt-feat { margin-left: 0.4rem; }
    .tt-toggle { border: 0; cursor: pointer; }
    .tt-actions { white-space: nowrap; text-align: right; }
    .tt-actions .a-btn + .a-btn { margin-left: 0.35rem; }
  `,
})
export class AdminTours implements OnInit {
  private admin = inject(AdminService);

  readonly tabs = [
    { key: 'all', label: 'All' },
    { key: 'round', label: 'Round tours' },
    { key: 'day', label: 'Day tours' },
    { key: 'hidden', label: 'Hidden' },
  ];
  tours = signal<Tour[]>([]);
  loading = signal(true);
  error = signal('');
  tab = signal('all');
  search = signal('');

  visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.tours().filter((t) => this.matches(t, this.tab()) && (!q || `${t.title} ${t.route} ${t.badge?.text}`.toLowerCase().includes(q)));
  });

  ngOnInit(): void {
    this.admin.tours().subscribe({
      next: (t) => { this.tours.set(t); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Could not load tours.'); },
    });
  }

  private matches(t: Tour, tab: string): boolean {
    if (tab === 'hidden') return t.isActive === false;
    return tab === 'all' || t.type === tab;
  }

  countFor(tab: string): number {
    return this.tours().filter((t) => this.matches(t, tab)).length;
  }

  img(t: Tour): string {
    return imageUrl(t.image);
  }

  toggleActive(t: Tour): void {
    const isActive = t.isActive === false;
    this.admin.updateTour(t.id, { isActive }).subscribe({
      next: (u) => this.tours.update((list) => list.map((x) => (x.id === u.id ? u : x))),
      error: () => this.error.set('Could not update the tour.'),
    });
  }
}

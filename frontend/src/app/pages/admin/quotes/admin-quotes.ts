import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, QuoteSummary } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <header class="a-head">
      <div>
        <h1>Costing &amp; quotes</h1>
        <p>Cost a journey with the course method (transport, hotels, meals, entrance fees, extras and markup), then save it.</p>
      </div>
      <div class="a-head-actions"><a routerLink="/admin/quotes/new" class="a-btn a-btn--gold">New quote</a></div>
    </header>
    @if (error()) { <p class="a-error">{{ error() }}</p> }

    <div class="a-panel">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead><tr><th>Quote</th><th>Client</th><th>Status</th><th>Last updated</th><th></th></tr></thead>
          <tbody>
            @for (q of quotes(); track q.id) {
              <tr>
                <td><a [routerLink]="['/admin/quotes', q.id]" class="qt-title">{{ q.title }}</a></td>
                <td class="a-muted">{{ q.clientName || '–' }}</td>
                <td><span class="a-pill" [class.a-pill--green]="q.status === 'Accepted'" [class.a-pill--gold]="q.status === 'Sent'" [class.a-pill--red]="q.status === 'Declined'">{{ q.status || 'Draft' }}</span></td>
                <td class="a-muted">{{ q.updatedAt | date: 'd MMM y, HH:mm' }}</td>
                <td class="qt-actions">
                  <a [routerLink]="['/admin/quotes', q.id]" class="a-btn a-btn--sm">Open</a>
                  <button type="button" class="a-btn a-btn--sm a-btn--danger" (click)="remove(q)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="a-empty">{{ loading() ? 'Loading…' : 'No quotes yet. Start one from scratch or from any of your tours.' }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `
    .qt-title { font-weight: 600; color: var(--ink); }
    .qt-title:hover { color: var(--teal); }
    .qt-actions { text-align: right; white-space: nowrap; }
    .qt-actions > * + * { margin-left: 0.35rem; }
  `,
})
export class AdminQuotes implements OnInit {
  private admin = inject(AdminService);
  quotes = signal<QuoteSummary[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.admin.quotes().subscribe({
      next: (q) => { this.quotes.set(q); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Could not load quotes.'); },
    });
  }

  remove(q: QuoteSummary): void {
    if (!confirm(`Delete the quote “${q.title}”?`)) return;
    this.admin.deleteQuote(q.id).subscribe({
      next: () => this.quotes.update((list) => list.filter((x) => x.id !== q.id)),
      error: () => this.error.set('Could not delete the quote.'),
    });
  }
}

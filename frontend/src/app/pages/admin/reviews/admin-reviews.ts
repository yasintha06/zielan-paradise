import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Review } from '../../../services/api';

interface ReviewForm {
  authorName: string; authorLocation: string; tripName: string; travelDate: string;
  rating: number; text: string; source: string; published: boolean;
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="a-head">
      <div>
        <h1>Reviews</h1>
        <p>Genuine guest reviews. Published reviews appear on the homepage once you have at least one.</p>
      </div>
      <div class="a-head-actions"><button type="button" class="a-btn a-btn--primary" (click)="create()">Add review</button></div>
    </header>
    @if (error()) { <p class="a-error">{{ error() }}</p> }

    <div class="rv-list">
      @for (r of items(); track r.id) {
        <article class="a-panel a-panel-pad rv-card">
          <div class="rv-top">
            <span class="rv-stars">{{ '★★★★★'.slice(0, r.rating || 5) }}</span>
            <span class="a-pill" [class.a-pill--green]="r.published" [class.a-pill--muted]="!r.published">{{ r.published ? 'Published' : 'Draft' }}</span>
          </div>
          <blockquote>{{ r.text }}</blockquote>
          <p class="rv-author"><strong>{{ r.authorName }}</strong> @if (r.authorLocation) { · {{ r.authorLocation }} } @if (r.tripName) { · {{ r.tripName }} }</p>
          <div class="rv-actions"><button type="button" class="a-btn a-btn--sm" (click)="edit(r)">Edit</button></div>
        </article>
      } @empty {
        <div class="a-panel a-empty">{{ loading() ? 'Loading…' : 'No reviews yet. After each trip, ask your guests for a few words and add them here.' }}</div>
      }
    </div>

    @if (editing()) {
      <div class="a-drawer-backdrop" (click)="editing.set(false)"></div>
      <aside class="a-drawer" role="dialog" aria-label="Edit review" data-lenis-prevent>
        <div class="a-drawer-head">
          <h2>{{ currentId ? 'Edit review' : 'New review' }}</h2>
          <button type="button" class="a-btn a-btn--sm" (click)="editing.set(false)" aria-label="Close">✕</button>
        </div>
        <div class="a-drawer-body">
          @if (formError()) { <p class="a-error">{{ formError() }}</p> }
          <div class="a-grid-2">
            <label class="a-field"><span>Guest name *</span><input [(ngModel)]="form.authorName" placeholder="Emma & James" /></label>
            <label class="a-field"><span>From</span><input [(ngModel)]="form.authorLocation" placeholder="Bristol, UK" /></label>
          </div>
          <div class="a-grid-2">
            <label class="a-field"><span>Trip</span><input [(ngModel)]="form.tripName" placeholder="Romance in Ceylon" /></label>
            <label class="a-field"><span>When</span><input [(ngModel)]="form.travelDate" placeholder="March 2027" /></label>
          </div>
          <label class="a-field"><span>Review *</span><textarea [(ngModel)]="form.text" rows="6"></textarea></label>
          <div class="a-grid-2">
            <label class="a-field"><span>Rating</span>
              <select [(ngModel)]="form.rating">@for (n of [5, 4, 3, 2, 1]; track n) { <option [ngValue]="n">{{ n }} stars</option> }</select>
            </label>
            <label class="a-field"><span>Source</span><input [(ngModel)]="form.source" placeholder="Email, Tripadvisor, Google…" /></label>
          </div>
          <label class="a-check"><input type="checkbox" [(ngModel)]="form.published" /> Published on the website</label>
          <p class="a-muted rv-note">Only publish reviews you have permission to use, in the guest’s own words.</p>
        </div>
        <div class="a-drawer-foot">
          @if (currentId) { <button type="button" class="a-btn a-btn--danger" (click)="remove()">Delete</button> } @else { <span></span> }
          <button type="button" class="a-btn a-btn--primary" (click)="save()" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save' }}</button>
        </div>
      </aside>
    }
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `
    .rv-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .rv-card { display: grid; gap: 0.75rem; }
    .rv-top { display: flex; justify-content: space-between; align-items: center; }
    .rv-stars { color: var(--gold); letter-spacing: 0.15em; }
    .rv-card blockquote { font-family: var(--ff-head); font-size: 1.2rem; line-height: 1.45; }
    .rv-author { font-size: 0.85rem; color: var(--text-soft); }
    .rv-actions { display: flex; justify-content: flex-end; }
    .rv-note { font-size: 0.8rem; }
  `,
})
export class AdminReviews implements OnInit {
  private admin = inject(AdminService);

  items = signal<Review[]>([]);
  loading = signal(true);
  error = signal('');
  editing = signal(false);
  saving = signal(false);
  formError = signal('');
  currentId: string | null = null;
  form: ReviewForm = this.blank();

  private blank(): ReviewForm {
    return { authorName: '', authorLocation: '', tripName: '', travelDate: '', rating: 5, text: '', source: '', published: true };
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.admin.reviews().subscribe({
      next: (r) => { this.items.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Could not load reviews.'); },
    });
  }

  create(): void {
    this.currentId = null;
    this.form = this.blank();
    this.formError.set('');
    this.editing.set(true);
  }

  edit(r: Review): void {
    this.currentId = r.id;
    this.form = {
      authorName: r.authorName, authorLocation: r.authorLocation ?? '', tripName: r.tripName ?? '', travelDate: r.travelDate ?? '',
      rating: r.rating ?? 5, text: r.text, source: r.source ?? '', published: r.published !== false,
    };
    this.formError.set('');
    this.editing.set(true);
  }

  save(): void {
    if (!this.form.authorName.trim() || !this.form.text.trim()) { this.formError.set('Please add the guest’s name and their review.'); return; }
    this.saving.set(true);
    const req = this.currentId ? this.admin.updateReview(this.currentId, this.form) : this.admin.createReview(this.form);
    req.subscribe({
      next: () => { this.saving.set(false); this.editing.set(false); this.load(); },
      error: (e) => { this.saving.set(false); this.formError.set(e?.error?.error || 'Could not save.'); },
    });
  }

  remove(): void {
    if (!this.currentId || !confirm('Delete this review?')) return;
    this.admin.deleteReview(this.currentId).subscribe({
      next: () => { this.editing.set(false); this.load(); },
      error: () => this.formError.set('Could not delete.'),
    });
  }
}

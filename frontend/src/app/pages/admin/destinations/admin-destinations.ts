import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Destination } from '../../../services/destination.service';
import { imageUrl } from '../../../utils/image';
import { ImagePicker } from '../shared/image-picker';

interface DestForm {
  name: string; tagline: string; region: string; description: string; tags: string;
  imageUrl: string; isActive: boolean; sortOrder: number | null;
}

@Component({
  selector: 'app-admin-destinations',
  standalone: true,
  imports: [FormsModule, ImagePicker],
  template: `
    <header class="a-head">
      <div><h1>Destinations</h1><p>The places shown on the Destinations page.</p></div>
      <div class="a-head-actions"><button type="button" class="a-btn a-btn--primary" (click)="create()">Add destination</button></div>
    </header>
    @if (error()) { <p class="a-error">{{ error() }}</p> }

    <div class="a-panel">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead><tr><th></th><th>Name</th><th>Region</th><th>Tags</th><th>Status</th><th></th></tr></thead>
          <tbody>
            @for (d of items(); track d.id) {
              <tr>
                <td><img class="a-thumb" [src]="img(d)" alt="" loading="lazy" /></td>
                <td><strong>{{ d.name }}</strong><br /><span class="a-muted">{{ d.tagline }}</span></td>
                <td>{{ d.region }}</td>
                <td class="a-muted">{{ (d.tags || []).join(', ') }}</td>
                <td><span class="a-pill" [class.a-pill--green]="d.isActive !== false">{{ d.isActive !== false ? 'Live' : 'Hidden' }}</span></td>
                <td class="ds-actions"><button type="button" class="a-btn a-btn--sm" (click)="edit(d)">Edit</button></td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="a-empty">{{ loading() ? 'Loading…' : 'No destinations yet.' }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (editing()) {
      <div class="a-drawer-backdrop" (click)="editing.set(false)"></div>
      <aside class="a-drawer" role="dialog" aria-label="Edit destination" data-lenis-prevent>
        <div class="a-drawer-head">
          <h2>{{ currentId ? 'Edit destination' : 'New destination' }}</h2>
          <button type="button" class="a-btn a-btn--sm" (click)="editing.set(false)" aria-label="Close">✕</button>
        </div>
        <div class="a-drawer-body">
          @if (formError()) { <p class="a-error">{{ formError() }}</p> }
          <label class="a-field"><span>Name *</span><input [(ngModel)]="form.name" [disabled]="!!currentId" /></label>
          <label class="a-field"><span>Tagline</span><input [(ngModel)]="form.tagline" placeholder="The Ancient Citadel" /></label>
          <label class="a-field"><span>Region</span><input [(ngModel)]="form.region" placeholder="Cultural Triangle" /></label>
          <label class="a-field"><span>Description</span><textarea [(ngModel)]="form.description" rows="4"></textarea></label>
          <label class="a-field"><span>Tags</span><input [(ngModel)]="form.tags" placeholder="History, Hiking" /><small>Separate with commas</small></label>
          <div class="a-field"><span>Photo</span><app-image-picker [(value)]="form.imageUrl" /></div>
          <label class="a-field"><span>Display order</span><input type="number" [(ngModel)]="form.sortOrder" /></label>
          <label class="a-check"><input type="checkbox" [(ngModel)]="form.isActive" /> Show on website</label>
        </div>
        <div class="a-drawer-foot">
          @if (currentId) { <button type="button" class="a-btn a-btn--danger" (click)="remove()">Delete</button> } @else { <span></span> }
          <button type="button" class="a-btn a-btn--primary" (click)="save()" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save' }}</button>
        </div>
      </aside>
    }
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `.ds-actions { text-align: right; }`,
})
export class AdminDestinations implements OnInit {
  private admin = inject(AdminService);

  items = signal<Destination[]>([]);
  loading = signal(true);
  error = signal('');
  editing = signal(false);
  saving = signal(false);
  formError = signal('');
  currentId: string | null = null;
  form: DestForm = this.blank();

  private blank(): DestForm {
    return { name: '', tagline: '', region: '', description: '', tags: '', imageUrl: '', isActive: true, sortOrder: null };
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.admin.destinations().subscribe({
      next: (d) => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Could not load destinations.'); },
    });
  }

  img(d: Destination): string {
    return imageUrl(d.imageUrl || d.image);
  }

  create(): void {
    this.currentId = null;
    this.form = this.blank();
    this.formError.set('');
    this.editing.set(true);
  }

  edit(d: Destination): void {
    this.currentId = d.id ?? null;
    this.form = {
      name: d.name, tagline: d.tagline ?? '', region: d.region ?? '', description: d.description ?? '',
      tags: (d.tags ?? []).join(', '), imageUrl: d.imageUrl || d.image || '', isActive: d.isActive !== false,
      sortOrder: (d as Destination & { sortOrder?: number }).sortOrder ?? null,
    };
    this.formError.set('');
    this.editing.set(true);
  }

  save(): void {
    if (!this.form.name.trim()) { this.formError.set('A name is required.'); return; }
    const body = {
      name: this.form.name.trim(), tagline: this.form.tagline, region: this.form.region, description: this.form.description,
      tags: this.form.tags.split(',').map((t) => t.trim()).filter(Boolean), imageUrl: this.form.imageUrl, isActive: this.form.isActive,
      ...(this.form.sortOrder !== null && `${this.form.sortOrder}` !== '' ? { sortOrder: Number(this.form.sortOrder) } : {}),
    };
    this.saving.set(true);
    const req = this.currentId ? this.admin.updateDestination(this.currentId, body) : this.admin.createDestination(body);
    req.subscribe({
      next: () => { this.saving.set(false); this.editing.set(false); this.load(); },
      error: (e) => { this.saving.set(false); this.formError.set(e?.error?.error || 'Could not save.'); },
    });
  }

  remove(): void {
    if (!this.currentId || !confirm(`Delete ${this.form.name}? To keep it but hide it, untick “Show on website”.`)) return;
    this.admin.deleteDestination(this.currentId).subscribe({
      next: () => { this.editing.set(false); this.load(); },
      error: () => this.formError.set('Could not delete.'),
    });
  }
}

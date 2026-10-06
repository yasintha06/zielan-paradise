import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { imageUrl } from '../../../utils/image';

/** Choose a photo from the site's optimised image library, or paste an external image URL. */
@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ip">
      <div class="ip-current">
        @if (value) { <img [src]="preview(value)" alt="Selected photo" /> } @else { <span>No photo</span> }
      </div>
      <div class="ip-side">
        <button type="button" class="a-btn a-btn--sm" (click)="open.set(!open())">{{ open() ? 'Close library' : 'Choose from library' }}</button>
        <label class="a-field">
          <span>…or image URL</span>
          <input type="url" [ngModel]="isExternal(value) ? value : ''" (ngModelChange)="pick($event)" placeholder="https://…" />
        </label>
      </div>
    </div>
    @if (open()) {
      <div class="ip-grid" data-lenis-prevent>
        @for (name of images(); track name) {
          <button type="button" [class.is-on]="value === libraryPath(name)" (click)="pick(libraryPath(name)); open.set(false)" [attr.aria-label]="name">
            <img [src]="'img/' + name + '-900.webp'" [alt]="name" loading="lazy" />
            <span>{{ name }}</span>
          </button>
        }
      </div>
    }
  `,
  styleUrls: ['../admin-ui.css'],
  styles: `
    .ip { display: grid; grid-template-columns: 160px 1fr; gap: 1rem; align-items: center; }
    .ip-current { aspect-ratio: 4 / 3; border-radius: 6px; overflow: hidden; background: var(--sand); display: grid; place-items: center; color: var(--text-soft); font-size: 0.8rem; }
    .ip-current img { width: 100%; height: 100%; object-fit: cover; }
    .ip-side { display: grid; gap: 0.75rem; justify-items: start; }
    .ip-side .a-field { width: 100%; }
    .ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; max-height: 340px; overflow-y: auto; margin-top: 0.75rem; padding: 0.6rem; background: var(--white); border-radius: 6px; }
    .ip-grid button { display: grid; gap: 0.25rem; padding: 0.25rem; border: 2px solid transparent; border-radius: 6px; background: none; text-align: left; }
    .ip-grid button.is-on { border-color: var(--teal); }
    .ip-grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 4px; }
    .ip-grid span { font-size: 0.68rem; color: var(--text-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `,
})
export class ImagePicker implements OnInit {
  private admin = inject(AdminService);
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  open = signal(false);
  images = signal<string[]>([]);

  ngOnInit(): void {
    this.admin.images().subscribe({ next: (i) => this.images.set(i.filter((n) => !n.startsWith('og-'))), error: () => {} });
  }

  /** Library photos are stored as images/<name>.jpg, which the site maps to the optimised WebP files. */
  libraryPath(name: string): string {
    return `images/tours/${name}.jpg`;
  }

  isExternal(v: string): boolean {
    return /^https?:\/\//.test(v || '');
  }

  preview(v: string): string {
    return imageUrl(v);
  }

  pick(v: string): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}

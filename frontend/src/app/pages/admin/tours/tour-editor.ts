import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Tour, TourItineraryDay } from '../../../services/tour.service';
import { ImagePicker } from '../shared/image-picker';

interface TourForm {
  title: string;
  type: 'round' | 'day';
  duration: string;
  bestTime: string;
  badgeText: string;
  description: string;
  targetAudience: string;
  route: string;
  image: string;
  guests: string;
  startTime: string;
  priceDisplay: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  itinerary: TourItineraryDay[];
  featured: boolean;
  isActive: boolean;
  sortOrder: number | null;
}

const lines = (v?: string[]) => (v ?? []).join('\n');
const toList = (v: string) => v.split('\n').map((s) => s.trim()).filter(Boolean);

@Component({
  selector: 'app-tour-editor',
  standalone: true,
  imports: [FormsModule, RouterLink, ImagePicker],
  templateUrl: './tour-editor.html',
  styleUrls: ['../admin-ui.css', './tour-editor.css'],
})
export class TourEditor implements OnInit {
  private admin = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  message = signal('');
  form: TourForm = this.blank('round');

  private blank(type: 'round' | 'day'): TourForm {
    return {
      title: '', type, duration: type === 'day' ? 'Full Day' : '', bestTime: '', badgeText: '', description: '',
      targetAudience: '', route: '', image: '', guests: type === 'day' ? 'Private (1 – 6 Guests)' : '', startTime: '',
      priceDisplay: 'Price on Request', highlights: '', inclusions: '', exclusions: '', itinerary: [],
      featured: false, isActive: true, sortOrder: null,
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      const type = this.route.snapshot.queryParamMap.get('type') === 'day' ? 'day' : 'round';
      this.form = this.blank(type);
      return;
    }
    this.id.set(id);
    this.loading.set(true);
    this.admin.tours().subscribe({
      next: (tours) => {
        const t = tours.find((x) => x.id === id);
        this.loading.set(false);
        if (!t) { this.error.set('Tour not found.'); return; }
        this.form = {
          title: t.title, type: t.type, duration: t.duration ?? '', bestTime: t.bestTime ?? '', badgeText: t.badge?.text ?? '',
          description: t.description ?? '', targetAudience: t.targetAudience ?? '', route: t.route ?? '', image: t.image ?? '',
          guests: t.guests ?? '', startTime: t.startTime ?? '', priceDisplay: t.priceDisplay ?? '',
          highlights: lines(t.highlights), inclusions: lines(t.inclusions), exclusions: lines(t.exclusions),
          itinerary: (t.itinerary ?? []).map((d) => ({ ...d })), featured: !!t.featured, isActive: t.isActive !== false,
          sortOrder: t.sortOrder ?? null,
        };
      },
      error: () => { this.loading.set(false); this.error.set('Could not load the tour.'); },
    });
  }

  addDay(): void {
    const n = this.form.itinerary.length + 1;
    this.form.itinerary.push({ day: `Day ${n}`, title: '', location: '', description: '', drive: '' });
  }

  removeDay(i: number): void {
    this.form.itinerary.splice(i, 1);
    this.renumber();
  }

  moveDay(i: number, delta: number): void {
    const j = i + delta;
    if (j < 0 || j >= this.form.itinerary.length) return;
    const days = this.form.itinerary;
    [days[i], days[j]] = [days[j], days[i]];
    this.renumber();
  }

  private renumber(): void {
    this.form.itinerary.forEach((d, i) => (d.day = `Day ${i + 1}`));
  }

  private payload(): Partial<Tour> {
    const f = this.form;
    return {
      title: f.title.trim(), type: f.type, duration: f.duration, bestTime: f.bestTime, description: f.description,
      targetAudience: f.targetAudience, route: f.route, image: f.image, guests: f.guests, startTime: f.startTime,
      priceDisplay: f.priceDisplay, badge: { text: f.badgeText, class: '' },
      highlights: toList(f.highlights), inclusions: toList(f.inclusions), exclusions: toList(f.exclusions),
      itinerary: f.type === 'round' ? f.itinerary : [], featured: f.featured, isActive: f.isActive,
      ...(f.sortOrder !== null && f.sortOrder !== undefined && `${f.sortOrder}` !== '' ? { sortOrder: Number(f.sortOrder) } : {}),
    };
  }

  save(): void {
    this.error.set('');
    this.message.set('');
    if (!this.form.title.trim()) { this.error.set('Please give the tour a title.'); return; }
    this.saving.set(true);
    const id = this.id();
    const request = id ? this.admin.updateTour(id, this.payload()) : this.admin.createTour(this.payload());
    request.subscribe({
      next: (t) => {
        this.saving.set(false);
        this.message.set('Saved. Changes are live on the website.');
        if (!id) {
          this.id.set(t.id);
          this.router.navigate(['/admin/tours', t.id], { replaceUrl: true });
        }
      },
      error: (err) => { this.saving.set(false); this.error.set(err?.error?.error || 'Could not save the tour.'); },
    });
  }

  remove(): void {
    const id = this.id();
    if (!id || !confirm(`Delete “${this.form.title}” permanently? To keep it but take it off the website, untick “Show on website” instead.`)) return;
    this.admin.deleteTour(id).subscribe({
      next: () => this.router.navigate(['/admin/tours']),
      error: () => this.error.set('Could not delete the tour.'),
    });
  }
}

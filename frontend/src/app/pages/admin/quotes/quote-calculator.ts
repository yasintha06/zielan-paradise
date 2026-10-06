import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Tour } from '../../../services/tour.service';
import {
  Currency, QuoteData, Totals, VEHICLES, MIN_KM_PER_DAY, blankQuote, calculate, kmFromDrive,
} from './quote-model';

@Component({
  selector: 'app-quote-calculator',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './quote-calculator.html',
  styleUrls: ['../admin-ui.css', './quote-calculator.css'],
})
export class QuoteCalculator implements OnInit {
  private admin = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly vehicles = VEHICLES;
  readonly currencies: Currency[] = ['USD', 'LKR', 'GBP'];
  readonly mealBases = ['BB', 'HB', 'FB', 'AI', 'RO'];
  readonly statuses = ['Draft', 'Sent', 'Accepted', 'Declined'];
  readonly minKm = MIN_KM_PER_DAY;

  id = signal<string | null>(null);
  title = '';
  clientName = '';
  status = 'Draft';
  q: QuoteData = blankQuote();

  tours = signal<Tour[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  message = signal('');

  ngOnInit(): void {
    this.admin.tours().subscribe({ next: (t) => this.tours.set(t.filter((x) => x.type === 'round')), error: () => {} });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.id.set(id);
    this.loading.set(true);
    this.admin.quote<QuoteData>(id).subscribe({
      next: (quote) => {
        this.title = quote.title;
        this.clientName = quote.clientName ?? '';
        this.status = quote.status || 'Draft';
        this.q = { ...blankQuote(), ...(quote.data as QuoteData) };
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.error.set('Could not load this quote.'); },
    });
  }

  get totals(): Totals {
    return calculate(this.q);
  }

  // ── Transport ──
  pickVehicle(name: string): void {
    const v = this.vehicles.find((x) => x.name === name);
    this.q.transport.vehicle = name;
    if (v) this.q.transport.ratePerKm = v.ratePerKm;
  }

  suggestedVehicle(): string {
    const pax = this.totals.pax;
    return this.vehicles.find((v) => pax <= v.maxPax)?.name ?? this.vehicles[this.vehicles.length - 1].name;
  }

  addLeg(): void {
    this.q.transport.legs.push({ label: `Day ${this.q.transport.legs.length + 1}`, km: 0 });
  }

  removeLeg(i: number): void {
    this.q.transport.legs.splice(i, 1);
  }

  /** Start from one of your round tours: one leg per day, distances read from the itinerary. */
  fromTour(id: string): void {
    const t = this.tours().find((x) => x.id === id);
    if (!t) return;
    const days = t.itinerary ?? [];
    this.q.transport.legs = days.map((d, i) => ({ label: `${d.day || 'Day ' + (i + 1)}: ${d.location || d.title}`, km: kmFromDrive(d.drive) }));
    this.q.transport.guideNights = Math.max(0, days.length - 1);
    if (!this.title) this.title = t.title;
    this.message.set(`Loaded ${days.length} days from “${t.title}”. Check the distances, then add hotels.`);
  }

  // ── Lines ──
  addHotel(): void { this.q.hotels.push({ name: '', nights: 1, rooms: 1, rate: 0, currency: 'USD', meal: 'BB', supplements: 0 }); }
  addActivity(): void { this.q.activities.push({ name: '', perPerson: 0, currency: 'USD', included: false }); }
  addMeal(): void { this.q.meals.push({ name: 'Lunch', count: 1, perPerson: 0, currency: 'USD' }); }
  addExtra(): void { this.q.extras.push({ name: '', amount: 0, currency: 'GBP' }); }
  remove<T>(list: T[], i: number): void { list.splice(i, 1); }

  hotelNights(): number {
    return this.q.hotels.reduce((s, h) => s + (Number(h.nights) || 0), 0);
  }

  // ── Save ──
  save(): void {
    this.error.set('');
    this.message.set('');
    if (!this.title.trim()) { this.error.set('Give the quote a name, e.g. “Smith family, March 2027”.'); return; }
    this.saving.set(true);
    const body = { title: this.title.trim(), clientName: this.clientName, status: this.status, data: this.q };
    const id = this.id();
    const req = id ? this.admin.updateQuote(id, body) : this.admin.createQuote(body);
    req.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.message.set('Quote saved.');
        if (!id) {
          this.id.set(saved.id);
          this.router.navigate(['/admin/quotes', saved.id], { replaceUrl: true });
        }
      },
      error: (e) => { this.saving.set(false); this.error.set(e?.error?.error || 'Could not save the quote.'); },
    });
  }

  print(): void {
    window.print();
  }
}

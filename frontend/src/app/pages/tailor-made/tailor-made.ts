import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { ApiService } from '../../services/api';
import { MotionService } from '../../services/motion.service';
import { SITE } from '../../config/site';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function upcomingMonths(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) =>
    new Date(now.getFullYear(), now.getMonth() + 1 + i, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  );
}

function blankInquiry() {
  return {
    clientName: { firstName: '', lastName: '' },
    contact: { email: '', phone: '' },
    tripDetails: {
      estimatedMonth: 'Flexible / still deciding',
      durationDays: 12,
      travelers: { adults: 2, children: 0 },
      accommodationStyle: 'Luxury',
    },
    preferences: { interests: [] as string[], regions: [] as string[], pace: 'Balanced' },
    planningStage: 'Decided on Sri Lanka, need an itinerary',
    additionalNotes: '',
  };
}

@Component({
  selector: 'app-tailor-made',
  standalone: true,
  imports: [FormsModule, RouterLink, ScrollRevealDirective, MagneticDirective, PageHeroComponent],
  templateUrl: './tailor-made.html',
  styleUrl: './tailor-made.css',
})
export class TailorMade implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private motion = inject(MotionService);

  readonly site = SITE;
  readonly steps = ['Your interests', 'Dates & party', 'Your details'];

  step = signal(1);
  submitting = signal(false);
  submitted = signal(false);
  error = signal('');
  sendFailed = signal(false);

  inquiry = blankInquiry();
  website = ''; // honeypot: hidden from people, bots fill it in

  readonly interests = [
    { name: 'Wildlife & Safaris', desc: 'Leopards, elephant gatherings, game drives' },
    { name: 'Culture & Heritage', desc: 'Ancient citadels and sacred temples' },
    { name: 'Beaches & Coast', desc: 'Golden shores, whales and catamarans' },
    { name: 'Tea Country & Nature', desc: 'Misty estates, waterfalls, scenic rail' },
    { name: 'Wellness & Ayurveda', desc: 'Holistic retreats and spa days' },
    { name: 'Food & Spice', desc: 'Cookery, spice gardens and tea tastings' },
  ];

  readonly regions = [
    { name: 'Cultural Triangle', desc: 'Sigiriya, Dambulla, Anuradhapura, Polonnaruwa' },
    { name: 'Hill Country', desc: 'Kandy, Ella, Hatton, Nuwara Eliya' },
    { name: 'South Coast', desc: 'Galle, Mirissa, Weligama, Tangalle' },
    { name: 'East Coast', desc: 'Trincomalee, Passikudah, Arugam Bay' },
    { name: 'National Parks', desc: 'Yala, Wilpattu, Minneriya, Udawalawe' },
  ];

  readonly paces = [
    { value: 'Slow & Relaxed', desc: 'Fewer transfers, three or more nights per stay.' },
    { value: 'Balanced', desc: 'A natural rhythm of sightseeing, journeys and rest.' },
    { value: 'Full & Active', desc: 'See as much as possible, with active days.' },
  ];

  readonly stays = [
    { value: 'Comfort', desc: 'Characterful boutique hotels and heritage stays.' },
    { value: 'Luxury', desc: 'Five-star resorts, planters’ bungalows, ocean villas.' },
    { value: 'Ultra-luxury', desc: 'Private estates, exclusive-use villas, the very best.' },
  ];

  readonly stages = [
    { value: 'Ready to book', label: 'Ready to book', desc: 'Dates are set and we’re ready to go.' },
    { value: 'Decided on Sri Lanka, need an itinerary', label: 'Need an itinerary', desc: 'We’re going; help us plan the route.' },
    { value: 'Still researching', label: 'Still researching', desc: 'Exploring ideas and budgets for now.' },
  ];

  readonly months = ['Flexible / still deciding', ...upcomingMonths(18)];

  ngOnInit(): void {
    const destination = this.route.snapshot.queryParamMap.get('destination');
    if (destination) this.inquiry.additionalNotes = `We would love to include ${destination}.`;
  }

  toggle(list: string[], value: string): void {
    const i = list.indexOf(value);
    if (i > -1) list.splice(i, 1);
    else list.push(value);
  }

  next(): void {
    this.error.set('');
    if (this.step() === 1 && !this.inquiry.preferences.interests.length) {
      this.error.set('Choose at least one interest so we know where to start.');
      return;
    }
    this.goTo(this.step() + 1);
  }

  goTo(step: number): void {
    if (step > this.step() + 1 || step < 1 || step > this.steps.length) return;
    if (step > this.step() && this.step() === 1 && !this.inquiry.preferences.interests.length) {
      this.error.set('Choose at least one interest so we know where to start.');
      return;
    }
    this.error.set('');
    this.step.set(step);
    this.motion.scrollTo('#planner');
  }

  bump(field: 'adults' | 'children', delta: number): void {
    const t = this.inquiry.tripDetails.travelers;
    const min = field === 'adults' ? 1 : 0;
    t[field] = Math.min(20, Math.max(min, t[field] + delta));
  }

  submit(): void {
    this.error.set('');
    const first = this.inquiry.clientName.firstName.trim();
    const last = this.inquiry.clientName.lastName.trim();
    const email = this.inquiry.contact.email.trim();
    if (!first || !last || !email) {
      this.error.set('Please add your name and email so we can send your proposal.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      this.error.set('That email address doesn’t look quite right.');
      return;
    }

    this.submitting.set(true);
    this.sendFailed.set(false);
    const payload = {
      ...this.inquiry,
      clientName: { firstName: first, lastName: last },
      contact: { email, phone: this.inquiry.contact.phone.trim() },
      additionalNotes: this.inquiry.additionalNotes.trim(),
      website: this.website,
      status: 'New Lead',
      submittedAt: new Date().toISOString(),
    };

    this.api.submitInquiry(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.motion.scrollTo('#planner');
      },
      error: (err) => {
        this.submitting.set(false);
        this.sendFailed.set(true);
        this.error.set(err?.error?.error || 'We couldn’t send your request just now.');
      },
    });
  }

  /** Plain-text summary used for the WhatsApp / email fallback if sending fails. */
  summaryText(): string {
    const q = this.inquiry;
    return [
      'Hello Zeilan Paradise, I would like a tailor-made journey.',
      `Name: ${q.clientName.firstName} ${q.clientName.lastName}`,
      `When: ${q.tripDetails.estimatedMonth}, about ${q.tripDetails.durationDays} days`,
      `Travellers: ${q.tripDetails.travelers.adults} adults, ${q.tripDetails.travelers.children} children`,
      `Interests: ${q.preferences.interests.join(', ') || '-'}`,
      `Regions: ${q.preferences.regions.join(', ') || '-'}`,
      `Pace: ${q.preferences.pace}. Stays: ${q.tripDetails.accommodationStyle}`,
      q.additionalNotes ? `Notes: ${q.additionalNotes}` : '',
    ].filter(Boolean).join('\n');
  }

  whatsappLink(): string {
    return `${this.site.whatsappHref}?text=${encodeURIComponent(this.summaryText())}`;
  }

  mailLink(): string {
    return `mailto:${this.site.email}?subject=${encodeURIComponent('Tailor-made journey request')}&body=${encodeURIComponent(this.summaryText())}`;
  }

  reset(): void {
    this.inquiry = blankInquiry();
    this.submitted.set(false);
    this.step.set(1);
  }
}

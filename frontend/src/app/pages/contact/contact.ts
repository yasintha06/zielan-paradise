import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { ApiService } from '../../services/api';
import { SITE } from '../../config/site';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function blankForm() {
  return { firstName: '', lastName: '', email: '', phone: '', travelDates: '', guests: '', interest: '', message: '' };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterLink, ScrollRevealDirective, MagneticDirective, PageHeroComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  readonly site = SITE;
  readonly interestOptions = [
    'Round tour', 'Day tour', 'Tailor-made journey', 'Honeymoon or anniversary',
    'Family holiday', 'Wellness retreat', 'Wildlife safari', 'Something else',
  ];

  form = blankForm();
  website = ''; // honeypot
  submitting = signal(false);
  submitted = signal(false);
  error = signal('');
  sendFailed = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const tourName = params.get('tourName');
      const tourId = params.get('tour') ?? '';
      if (tourName) {
        this.form.interest = tourId.startsWith('day-') ? 'Day tour' : 'Round tour';
        this.form.message = `I'm interested in "${tourName}". Could you send me a proposal and let me know how it could be tailored?`;
      }
    });
  }

  submit(): void {
    this.error.set('');
    const f = this.form;
    if (!f.firstName.trim() || !f.email.trim() || !f.message.trim()) {
      this.error.set('Please fill in your first name, email and a short message.');
      return;
    }
    if (!EMAIL_RE.test(f.email.trim())) {
      this.error.set('That email address doesn’t look quite right.');
      return;
    }

    this.submitting.set(true);
    this.sendFailed.set(false);
    const payload = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()]));
    this.api.submitEnquiry({ type: 'contact', ...payload, website: this.website }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.sendFailed.set(true);
        this.error.set(err?.error?.error || 'We couldn’t send your message just now.');
      },
    });
  }

  private summary(): string {
    const f = this.form;
    const details = [
      `Name: ${f.firstName} ${f.lastName}`.trim(),
      f.interest ? `Interested in: ${f.interest}` : '',
      f.travelDates ? `Dates: ${f.travelDates}` : '',
      f.guests ? `Travellers: ${f.guests}` : '',
    ].filter(Boolean);
    return `${details.join('\n')}\n\n${f.message}`;
  }

  whatsappLink(): string {
    return `${this.site.whatsappHref}?text=${encodeURIComponent(this.summary())}`;
  }

  mailLink(): string {
    return `mailto:${this.site.email}?subject=${encodeURIComponent('Enquiry from the website')}&body=${encodeURIComponent(this.summary())}`;
  }

  reset(): void {
    this.form = blankForm();
    this.submitted.set(false);
  }
}

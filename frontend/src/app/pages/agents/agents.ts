import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { ApiService } from '../../services/api';
import { TourService } from '../../services/tour.service';
import { MotionService } from '../../services/motion.service';
import { DAY_TOURS, ROUND_TOURS } from '../../data/catalog';
import { AGENTS, BUSINESS, SITE } from '../../config/site';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface AgentFaq { q: string; a: string; }

function blankForm() {
  return { name: '', company: '', email: '', phone: '', message: '' };
}

/**
 * "For travel agents" page. Only facts the owner has confirmed are shown; anything still missing
 * (reply time, rates, commission, sample PDF) lives in config/site.ts and stays hidden until filled in.
 */
@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [FormsModule, RouterLink, ScrollRevealDirective, MagneticDirective, PageHeroComponent],
  templateUrl: './agents.html',
  styleUrls: ['../contact/contact.css', './agents.css'],
})
export class Agents implements OnInit {
  private api = inject(ApiService);
  private tours = inject(TourService);
  private motion = inject(MotionService);

  readonly site = SITE;
  readonly business = BUSINESS;
  readonly agents = AGENTS;

  roundCount = signal(ROUND_TOURS.length);
  dayCount = signal(DAY_TOURS.length);
  /** The sample itinerary button only appears once the PDF really exists on the site. */
  hasSamplePdf = signal(false);

  readonly steps = [
    { title: 'Enquiry', text: 'Tell us which tours or dates your clients are interested in, using the form below, email or phone.' },
    { title: 'Quote', text: 'We send you a written quote for the journey, built around your clients’ dates and group.' },
    { title: 'Confirmation', text: 'When your clients are happy, we confirm the arrangements in Sri Lanka.' },
  ];

  readonly quoteContents = [
    'A day-by-day itinerary',
    'Where your clients stay each night, with hotels as listed or similar',
    'What is included and what is not',
    'The price for your clients’ dates and group size',
  ];

  faqs: AgentFaq[] = [
    { q: 'Which journeys can I offer my clients?',
      a: `Any of our ${ROUND_TOURS.length} private round tours and ${DAY_TOURS.length} day tours, or a tailor-made journey. Every itinerary is a starting point: we tailor the route, hotels and pace to each client.` },
    { q: 'Who will my clients travel with?',
      a: 'Their own private, English-speaking chauffeur-guide drives them throughout. There are no group coaches or shared tours.' },
    { q: 'Do you book international flights?',
      a: 'No. We arrange everything in Sri Lanka: hotels, the private vehicle and chauffeur-guide, transfers and experiences. Your clients book their own international flights.' },
    ...(AGENTS.ratesPolicy ? [{ q: 'How are rates quoted?', a: AGENTS.ratesPolicy }] : []),
    ...(AGENTS.commission ? [{ q: 'Do you pay commission?', a: AGENTS.commission }] : []),
    ...(AGENTS.responseTime ? [{ q: 'How quickly will you reply?', a: AGENTS.responseTime }] : []),
    { q: 'Who will I be dealing with?',
      a: `${BUSINESS.founder.name}, ${BUSINESS.founder.role}. Email ${SITE.email} or call ${SITE.phoneDisplay}.` },
  ];
  open = signal(0);

  form = blankForm();
  website = ''; // honeypot, the same spam protection as the other forms
  submitting = signal(false);
  submitted = signal(false);
  error = signal('');
  sendFailed = signal(false);

  ngOnInit(): void {
    this.tours.getRoundTours().subscribe((list) => list.length && this.roundCount.set(list.length));
    this.tours.getDayTours().subscribe((list) => list.length && this.dayCount.set(list.length));
    fetch(AGENTS.samplePdf, { method: 'HEAD' })
      .then((r) => this.hasSamplePdf.set(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => {});
  }

  toForm(): void {
    this.motion.scrollTo('#agent-form');
  }

  toggle(i: number): void {
    this.open.set(this.open() === i ? -1 : i);
  }

  submit(): void {
    this.error.set('');
    const f = this.form;
    if (!f.name.trim() || !f.company.trim() || !f.email.trim()) {
      this.error.set('Please fill in your name, company and email.');
      return;
    }
    if (!EMAIL_RE.test(f.email.trim())) {
      this.error.set('That email address doesn’t look quite right.');
      return;
    }
    this.submitting.set(true);
    this.sendFailed.set(false);
    this.api.submitEnquiry({
      type: 'agent', firstName: f.name.trim(), company: f.company.trim(), email: f.email.trim(),
      phone: f.phone.trim(), message: f.message.trim(), website: this.website,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.sendFailed.set(true);
        this.error.set(err?.error?.error || 'We couldn’t send your enquiry just now.');
      },
    });
  }

  mailLink(): string {
    const f = this.form;
    const body = `Name: ${f.name}\nCompany: ${f.company}\nPhone: ${f.phone}\n\nTours or dates:\n${f.message}`;
    return `mailto:${this.site.email}?subject=${encodeURIComponent('Travel agent enquiry')}&body=${encodeURIComponent(body)}`;
  }

  reset(): void {
    this.form = blankForm();
    this.submitted.set(false);
  }
}

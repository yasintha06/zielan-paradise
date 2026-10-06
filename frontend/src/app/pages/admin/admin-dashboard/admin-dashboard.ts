import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth.service';

/** One enquiry in a single shape, whichever form (contact or tailor-made planner) it came from. */
export interface Lead {
  kind: 'planner' | 'contact';
  date: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  details: { label: string; value: string }[];
  message: string;
}

function toLead(raw: any): Lead {
  const name = raw.clientName ?? {};
  const contact = raw.contact ?? {};
  const trip = raw.tripDetails ?? {};
  const prefs = raw.preferences ?? {};
  const people = trip.travelers;
  const isPlanner = !!raw.tripDetails || !!raw.clientName;
  const details = [
    { label: 'Interested in', value: raw.interest },
    { label: 'When', value: trip.estimatedMonth ?? raw.travelDates },
    { label: 'Length', value: trip.durationDays ? `${trip.durationDays} days` : '' },
    { label: 'Travellers', value: people ? `${people.adults ?? 0} adults, ${people.children ?? 0} children` : raw.guests },
    { label: 'Stays', value: trip.accommodationStyle },
    { label: 'Interests', value: (prefs.interests ?? []).join(', ') },
    { label: 'Regions', value: (prefs.regions ?? []).join(', ') },
    { label: 'Pace', value: prefs.pace },
    { label: 'Planning stage', value: raw.planningStage },
  ].filter((d) => d.value);

  return {
    kind: isPlanner ? 'planner' : 'contact',
    date: raw.submittedAt ?? raw.createdAt ?? '',
    name: `${name.firstName ?? raw.firstName ?? ''} ${name.lastName ?? raw.lastName ?? ''}`.trim() || 'No name',
    email: contact.email ?? raw.email ?? '',
    phone: contact.phone ?? raw.phone ?? '',
    status: raw.status ?? 'New Lead',
    details,
    message: raw.additionalNotes ?? raw.message ?? '',
  };
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  leads = signal<Lead[]>([]);
  isLoading = signal(true);
  error = signal('');
  filter = signal<'all' | 'planner' | 'contact'>('all');
  search = signal('');
  open = signal<number | null>(null);

  visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.leads().filter((l) =>
      (this.filter() === 'all' || l.kind === this.filter()) &&
      (!q || `${l.name} ${l.email} ${l.phone} ${l.message}`.toLowerCase().includes(q))
    );
  });

  stats = computed(() => {
    const leads = this.leads();
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    return {
      total: leads.length,
      week: leads.filter((l) => l.date && new Date(l.date).getTime() > weekAgo).length,
      planner: leads.filter((l) => l.kind === 'planner').length,
      contact: leads.filter((l) => l.kind === 'contact').length,
    };
  });

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.apiService.getAdminEnquiries().subscribe({
      next: (data) => {
        const leads = (data || []).map(toLead).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        this.leads.set(leads);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 403 || err.status === 422) {
          this.logout(); // token expired or invalid
        } else {
          this.error.set('Could not load enquiries. Please try again in a moment.');
        }
      }
    });
  }

  toggle(i: number): void {
    this.open.set(this.open() === i ? null : i);
  }

  replyLink(l: Lead): string {
    const subject = encodeURIComponent('Your Sri Lanka journey with Zeilan Paradise');
    return `mailto:${l.email}?subject=${subject}`;
  }

  whatsappLink(l: Lead): string {
    return `https://wa.me/${l.phone.replace(/[^\d]/g, '')}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}

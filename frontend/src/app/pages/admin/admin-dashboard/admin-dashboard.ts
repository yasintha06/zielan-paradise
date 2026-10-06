import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService, LEAD_STATUSES, Lead, LeadStatus } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['../admin-ui.css', './admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  private admin = inject(AdminService);
  private route = inject(ActivatedRoute);

  readonly statuses = LEAD_STATUSES;
  leads = signal<Lead[]>([]);
  isLoading = signal(true);
  error = signal('');
  status = signal<'all' | LeadStatus>('all');
  kind = signal<'all' | 'planner' | 'contact'>('all');
  search = signal('');

  selected = signal<Lead | null>(null);
  draftNotes = '';
  saving = signal(false);
  saved = signal(false);

  visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.leads().filter((l) =>
      (this.status() === 'all' || l.status === this.status()) &&
      (this.kind() === 'all' || l.kind === this.kind()) &&
      (!q || `${l.firstName} ${l.lastName} ${l.email} ${l.phone} ${l.message} ${l.notes}`.toLowerCase().includes(q))
    );
  });

  countFor(s: 'all' | LeadStatus): number {
    return s === 'all' ? this.leads().length : this.leads().filter((l) => l.status === s).length;
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.admin.leads().subscribe({
      next: (data) => {
        this.leads.set(data);
        this.isLoading.set(false);
        const open = this.route.snapshot.queryParamMap.get('open');
        const match = open && data.find((l) => l.id === open);
        if (match) this.open(match);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Could not load enquiries. Please try again in a moment.');
      },
    });
  }

  open(l: Lead): void {
    this.selected.set(l);
    this.draftNotes = l.notes || '';
    this.saved.set(false);
  }

  close(): void {
    this.selected.set(null);
  }

  private apply(updated: Lead): void {
    this.leads.update((list) => list.map((l) => (l.id === updated.id ? updated : l)));
    this.selected.set(updated);
  }

  setStatus(l: Lead, status: LeadStatus): void {
    this.admin.updateLead(l.id, { status }).subscribe({
      next: (u) => this.apply(u),
      error: () => this.error.set('Could not update the status.'),
    });
  }

  saveNotes(l: Lead): void {
    this.saving.set(true);
    this.admin.updateLead(l.id, { notes: this.draftNotes }).subscribe({
      next: (u) => { this.apply(u); this.saving.set(false); this.saved.set(true); },
      error: () => { this.saving.set(false); this.error.set('Could not save notes.'); },
    });
  }

  remove(l: Lead): void {
    if (!confirm(`Delete the enquiry from ${l.firstName} ${l.lastName}? This can't be undone.`)) return;
    this.admin.deleteLead(l.id).subscribe({
      next: () => { this.leads.update((list) => list.filter((x) => x.id !== l.id)); this.close(); },
      error: () => this.error.set('Could not delete the enquiry.'),
    });
  }

  details(l: Lead): { label: string; value: string }[] {
    const t = l.trip;
    return [
      { label: 'Interested in', value: l.interest },
      { label: 'When', value: t?.month || l.travelDates },
      { label: 'Length', value: t?.days ? `${t.days} days` : '' },
      { label: 'Travellers', value: t ? `${t.adults} adults, ${t.children} children` : l.guests },
      { label: 'Stays', value: t?.stay ?? '' },
      { label: 'Interests', value: t?.interests?.join(', ') ?? '' },
      { label: 'Regions', value: t?.regions?.join(', ') ?? '' },
      { label: 'Pace', value: t?.pace ?? '' },
      { label: 'Planning stage', value: t?.stage ?? '' },
    ].filter((d) => d.value);
  }

  replyLink(l: Lead): string {
    const subject = encodeURIComponent('Your Sri Lanka journey with Zeilan Paradise');
    const body = encodeURIComponent(`Dear ${l.firstName},\n\nThank you for getting in touch with Zeilan Paradise.\n\n`);
    return `mailto:${l.email}?subject=${subject}&body=${body}`;
  }

  whatsappLink(l: Lead): string {
    return `https://wa.me/${l.phone.replace(/[^\d]/g, '')}`;
  }

  statusClass(s: string): string {
    return { New: 'a-pill--red', Contacted: 'a-pill--teal', 'Proposal sent': 'a-pill--gold', Booked: 'a-pill--green', Closed: 'a-pill--muted' }[s] ?? '';
  }
}

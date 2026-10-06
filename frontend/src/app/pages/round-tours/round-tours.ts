import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { TourCardComponent } from '../../components/tour-card/tour-card';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-round-tours',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, MagneticDirective, PageHeroComponent, TourCardComponent],
  templateUrl: './round-tours.html',
  styleUrl: './round-tours.css',
})
export class RoundTours implements OnInit {
  private tourService = inject(TourService);

  tours = signal<Tour[]>([]);
  activeFilter = signal('all');

  /** Themes come from each tour's badge, so new tours added in the admin appear automatically. */
  filters = computed(() => {
    const themes = Array.from(new Set(this.tours().map((t) => t.badge?.text).filter((x): x is string => !!x)));
    return [{ key: 'all', label: 'All journeys' }, ...themes.map((t) => ({ key: t, label: t }))];
  });

  readonly included = [
    { title: 'Your own chauffeur-guide', text: 'A private, air-conditioned vehicle with an English-speaking guide for the whole journey.' },
    { title: 'Hand-picked stays', text: 'Boutique hotels, planters’ bungalows and beach villas chosen for character and comfort.' },
    { title: 'Entrance fees & safaris', text: 'Heritage site permits, national park fees and private jeeps with naturalists.' },
    { title: 'Support around the clock', text: 'A local team on call 24/7 from the moment you land.' },
  ];

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? this.tours() : this.tours().filter((t) => t.badge?.text === f);
  });

  countFor(key: string): number {
    return key === 'all' ? this.tours().length : this.tours().filter((t) => t.badge?.text === key).length;
  }

  ngOnInit(): void {
    this.tourService.getRoundTours().subscribe((data) => {
      this.tours.set(data);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
}

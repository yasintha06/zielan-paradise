import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { TourCardComponent } from '../../components/tour-card/tour-card';

@Component({
  selector: 'app-day-tours',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, PageHeroComponent, TourCardComponent],
  templateUrl: './day-tours.html',
  styleUrl: './day-tours.css',
})
export class DayTours implements OnInit {
  private tourService = inject(TourService);

  tours = signal<Tour[]>([]);
  activeFilter = signal('all');

  readonly filters = [
    { key: 'all', label: 'All experiences' },
    { key: 'wildlife', label: 'Wildlife' },
    { key: 'cultural', label: 'Culture & heritage' },
    { key: 'coast', label: 'Coast & ocean' },
    { key: 'highlands', label: 'Highlands & tea' },
  ];

  readonly notes = [
    { title: 'Private to your party', text: 'No shared coaches. Just you, your guide and the island.' },
    { title: 'Timed for the best light', text: 'Early starts beat the heat and the crowds; we plan around them.' },
    { title: 'Add to any journey', text: 'Slot a day tour into a round tour, or build a stay around a few of them.' },
  ];

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? this.tours() : this.tours().filter((t) => t.category === f);
  });

  countFor(key: string): number {
    return key === 'all' ? this.tours().length : this.tours().filter((t) => t.category === key).length;
  }

  ngOnInit(): void {
    this.tourService.getDayTours().subscribe((data) => {
      this.tours.set(data);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
}

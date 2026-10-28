import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DestinationService, Destination } from '../../services/destination.service';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ParallaxDirective } from '../../directives/parallax';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { imageUrl } from '../../utils/image';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, ParallaxDirective, PageHeroComponent],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
})
export class Destinations implements OnInit {
  private destinationService = inject(DestinationService);
  private tourService = inject(TourService);

  destinations = signal<Destination[]>([]);
  tours = signal<Map<string, Tour>>(new Map());
  region = signal('all');

  regions = computed(() => Array.from(new Set(this.destinations().map((d) => d.region).filter(Boolean))));
  filtered = computed(() => {
    const r = this.region();
    return r === 'all' ? this.destinations() : this.destinations().filter((d) => d.region === r);
  });

  readonly imageUrl = imageUrl;

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe((data) => {
      this.destinations.set(data.filter((d) => d.isActive !== false));
      setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    this.tourService.getTours().subscribe((list) => this.tours.set(new Map(list.map((t) => [t.id, t]))));
  }

  /** Live tours that visit a destination, round tours first. */
  toursFor(d: Destination): Tour[] {
    const map = this.tours();
    return (d.tours ?? []).map((id) => map.get(id)).filter((t): t is Tour => !!t)
      .sort((a, b) => (a.type === b.type ? 0 : a.type === 'round' ? -1 : 1));
  }

  setRegion(r: string): void {
    this.region.set(r);
    setTimeout(() => ScrollTrigger.refresh(), 150);
  }

  anchor(d: Destination): string {
    return d.id || 'dest-' + d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  countFor(r: string): number {
    return r === 'all' ? this.destinations().length : this.destinations().filter((d) => d.region === r).length;
  }
}

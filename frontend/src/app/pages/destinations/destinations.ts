import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DestinationService, Destination } from '../../services/destination.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
  encapsulation: ViewEncapsulation.None
})
export class Destinations implements OnInit {
  destinations: Destination[] = [];
  isLoading = true;
  errorMessage = '';

  selectedTag = 'all';
  selectedRegion = 'all';

  availableTags: string[] = [];
  availableRegions: string[] = [];

  constructor(private destinationService: DestinationService) {}

  ngOnInit(): void {
    this.fetchDestinations();
  }

  fetchDestinations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.destinationService.getDestinations().subscribe({
      next: (data) => {
        this.destinations = data || [];
        this.extractFilterMetadata();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching destinations from database:', err);
        this.errorMessage = 'Unable to load destinations from the database. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private extractFilterMetadata(): void {
    const tagSet = new Set<string>();
    const regionSet = new Set<string>();

    this.destinations.forEach(d => {
      if (d.region) regionSet.add(d.region);
      if (Array.isArray(d.tags)) {
        d.tags.forEach(t => tagSet.add(t));
      }
    });

    this.availableTags = ['all', ...Array.from(tagSet)];
    this.availableRegions = ['all', ...Array.from(regionSet)];
  }

  setTagFilter(tag: string): void {
    this.selectedTag = tag;
  }

  setRegionFilter(region: string): void {
    this.selectedRegion = region;
  }

  resetFilters(): void {
    this.selectedTag = 'all';
    this.selectedRegion = 'all';
  }

  get filteredDestinations(): Destination[] {
    return this.destinations.filter(d => {
      const matchRegion = this.selectedRegion === 'all' || d.region === this.selectedRegion;
      const matchTag = this.selectedTag === 'all' || (Array.isArray(d.tags) && d.tags.includes(this.selectedTag));
      return matchRegion && matchTag;
    });
  }
}

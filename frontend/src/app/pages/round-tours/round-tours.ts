import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';

@Component({
  selector: 'app-round-tours',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './round-tours.html',
  styleUrl: './round-tours.css',
  encapsulation: ViewEncapsulation.None
})
export class RoundTours implements OnInit {
  activeFilter = 'all';
  selectedTour: Tour | null = null;
  tours: Tour[] = [];
  isLoading = true;

  filters = [
    { key: 'all', label: 'All Journeys' },
    { key: '14', label: '14 Days' },
    { key: '10', label: '10 Days' },
    { key: '8', label: '8 Days' },
    { key: '7', label: '7 Days' }
  ];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.fetchRoundTours();
  }

  fetchRoundTours(): void {
    this.isLoading = true;
    this.tourService.getRoundTours().subscribe({
      next: (data) => {
        this.tours = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching round tours from database:', err);
        this.isLoading = false;
      }
    });
  }

  setFilter(key: string): void {
    this.activeFilter = key;
  }

  get filteredTours(): Tour[] {
    if (this.activeFilter === 'all') return this.tours;
    return this.tours.filter(t => t.category === this.activeFilter || t.duration.startsWith(this.activeFilter));
  }

  openItineraryModal(tour: Tour): void {
    this.selectedTour = tour;
  }

  closeItineraryModal(): void {
    this.selectedTour = null;
  }
}

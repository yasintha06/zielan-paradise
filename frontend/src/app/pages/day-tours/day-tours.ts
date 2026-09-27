import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';

@Component({
  selector: 'app-day-tours',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './day-tours.html',
  styleUrl: './day-tours.css',
  encapsulation: ViewEncapsulation.None
})
export class DayTours implements OnInit {
  activeFilter = 'all';
  tours: Tour[] = [];
  isLoading = true;

  filters = [
    { key: 'all', label: 'All Excursions' },
    { key: 'wildlife', label: 'Wildlife & Safari' },
    { key: 'cultural', label: 'Cultural & Heritage' },
    { key: 'coast', label: 'Coast & Ocean' },
    { key: 'highlands', label: 'Highlands & Tea' }
  ];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.fetchDayTours();
  }

  fetchDayTours(): void {
    this.isLoading = true;
    this.tourService.getDayTours().subscribe({
      next: (data) => {
        this.tours = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching day tours from database:', err);
        this.isLoading = false;
      }
    });
  }

  setFilter(key: string): void {
    this.activeFilter = key;
  }

  get filteredTours(): Tour[] {
    if (this.activeFilter === 'all') return this.tours;
    return this.tours.filter(t => t.category === this.activeFilter);
  }
}

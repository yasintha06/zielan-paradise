import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService, Destination } from '../../services/destination.service';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  destinations: Destination[] = [];
  tours: Tour[] = [];
  isLoading = true;

  constructor(
    private destinationService: DestinationService,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.destinations = data.filter(d => d.featured).slice(0, 5);
        }
      },
      error: (err) => console.error('Error fetching home destinations:', err)
    });

    this.tourService.getTours('round', undefined, true).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.tours = data.slice(0, 3);
        }
      },
      error: (err) => console.error('Error fetching featured tours:', err)
    });
  }
}

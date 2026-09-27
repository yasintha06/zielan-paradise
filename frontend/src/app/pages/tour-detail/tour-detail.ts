import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TourService, Tour } from '../../services/tour.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
  encapsulation: ViewEncapsulation.None
})
export class TourDetail implements OnInit {
  tour: Tour | null = null;
  isLoading = true;
  expandedDayIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchTour(id);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  fetchTour(id: string): void {
    this.isLoading = true;
    this.tourService.getTourById(id).subscribe({
      next: (data) => {
        if (data) {
          this.tour = data;
        } else {
          this.router.navigate(['/round-tours']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load tour details', err);
        this.isLoading = false;
        this.router.navigate(['/round-tours']);
      }
    });
  }

  toggleDay(index: number): void {
    if (this.expandedDayIndex === index) {
      this.expandedDayIndex = -1; // Close if already open
    } else {
      this.expandedDayIndex = index;
    }
  }
}

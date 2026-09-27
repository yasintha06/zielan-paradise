import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
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

  filters = [
    { key: 'all', label: 'All' },
    { key: 'safari', label: 'Safari' },
    { key: 'cultural', label: 'Cultural' },
    { key: 'coastal', label: 'Coastal' },
    { key: 'nature', label: 'Nature' }
  ];

  tours: any[] = [
    {
      id: 'dt-yala',
      title: 'Yala National Park Safari',
      description: 'An exclusive private jeep safari through Sri Lanka\'s most iconic wildlife park — home to the highest leopard density on Earth.',
      image: 'images/tours/day-tour-yala.jpg',
      duration: 'Full Day',
      startTime: '5:30 AM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£85 pp',
      category: 'safari',
      highlights: ['Leopard tracking', 'Birdwatching', 'Luxury picnic lunch']
    },
    {
      id: 'dt-sigiriya',
      title: 'Sigiriya & Dambulla Heritage',
      description: 'Ascend the legendary Lion Rock fortress and explore the cave temples of Dambulla — two UNESCO World Heritage Sites in a single day.',
      image: 'images/tours/day-tour-sigiriya.jpg',
      duration: 'Full Day',
      startTime: '7:00 AM',
      guests: '2 – 10',
      priceType: 'From',
      priceDisplay: '£65 pp',
      category: 'cultural',
      highlights: ['Sigiriya Rock', 'Dambulla Cave Temple', 'Expert historian guide']
    },
    {
      id: 'dt-whale',
      title: 'Mirissa Whale Watching',
      description: 'Set sail at dawn for one of the best whale watching locations on the planet. Spot blue whales, sperm whales, and playful dolphins.',
      image: 'images/tours/day-tour-whale.jpg',
      duration: 'Half Day',
      startTime: '6:00 AM',
      guests: '2 – 8',
      priceType: 'From',
      priceDisplay: '£55 pp',
      category: 'coastal',
      highlights: ['Blue whales', 'Dolphins', 'Sunrise at sea']
    },
    {
      id: 'dt-kandy',
      title: 'Kandy Temple & Tea Tour',
      description: 'Visit the sacred Temple of the Tooth Relic, stroll through the Royal Botanical Gardens, and tour a working tea factory in the highlands.',
      image: 'images/tours/day-tour-kandy.jpg',
      duration: 'Full Day',
      startTime: '8:00 AM',
      guests: '2 – 8',
      priceType: 'From',
      priceDisplay: '£60 pp',
      category: 'cultural',
      highlights: ['Temple of the Tooth', 'Tea plantation visit', 'Kandyan dance show']
    },
    {
      id: 'dt-galle',
      title: 'Galle Fort & Southern Coast',
      description: 'Wander the cobblestone streets of this Dutch colonial fortress, lunch at a boutique café, and visit stilt fishermen along the coast.',
      image: 'images/tours/day-tour-galle.jpg',
      duration: 'Full Day',
      startTime: '8:30 AM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£70 pp',
      category: 'coastal',
      highlights: ['UNESCO fort', 'Stilt fishermen', 'Boutique shopping']
    },
    {
      id: 'dt-tea',
      title: 'Nuwara Eliya Tea Trails',
      description: 'Walk through rolling emerald tea estates, visit a working colonial tea factory, and enjoy Ceylon high tea.',
      image: 'images/tours/day-tour-tea.jpg',
      duration: 'Full Day',
      startTime: '7:30 AM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£75 pp',
      category: 'nature',
      highlights: ['Tea Factory Tour', 'High Tea', 'Scenic Hill Country']
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDayTours().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.tours = data;
      },
      error: () => console.log('API not ready, using luxury placeholders.')
    });
  }

  setFilter(key: string) {
    this.activeFilter = key;
  }

  get filteredTours() {
    if (this.activeFilter === 'all') return this.tours;
    return this.tours.filter(t => t.category === this.activeFilter);
  }
}

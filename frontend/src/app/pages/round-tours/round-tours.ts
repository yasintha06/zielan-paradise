import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
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

  filters = [
    { key: 'all', label: 'All Tours' },
    { key: 'cultural', label: 'Cultural' },
    { key: 'wildlife', label: 'Wildlife' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'adventure', label: 'Adventure' }
  ];

  tours: any[] = [
    {
      id: 'rt-essence',
      title: 'The Essence of Zeilan',
      description: 'A meticulously balanced 10-day journey combining ancient culture, lush highlands, and pristine southern beaches.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      duration: '10 Days',
      guests: '2 – 6',
      route: 'Negombo → Sigiriya → Kandy → Ella → Yala → Galle',
      priceType: 'From',
      priceDisplay: '£1,450',
      link: '/round-tours/essence',
      category: 'cultural',
      badge: { text: 'Most Popular', class: 'bg-gold' }
    },
    {
      id: 'rt-wild',
      title: 'Untamed Sri Lanka',
      description: 'Venture deep into the wilderness. Safari drives, luxury tented camps, and exclusive leopard tracking experiences.',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
      duration: '12 Days',
      guests: '2 – 4',
      route: 'Wilpattu → Minneriya → Gal Oya → Yala',
      priceType: 'From',
      priceDisplay: '£2,100',
      link: '/round-tours/wild',
      category: 'wildlife',
      badge: { text: 'Luxury Explorer', class: 'bg-teal' }
    },
    {
      id: 'rt-wellness',
      title: 'Ayurveda & Wellness Retreat',
      description: 'Rejuvenate your soul with holistic Ayurvedic treatments, daily yoga, and serene beachfront luxury.',
      image: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&auto=format&fit=crop&q=80',
      duration: '14 Days',
      guests: 'Solo or Couples',
      route: 'Weligama → Tangalle → Bentota',
      priceType: 'From',
      priceDisplay: '£1,890',
      link: '/round-tours/wellness',
      category: 'wellness',
      badge: { text: 'Wellness', class: 'bg-charcoal' }
    },
    {
      id: 'rt-heritage',
      title: 'Heritage & Kingdoms Trail',
      description: 'Walk in the footsteps of ancient kings. Explore UNESCO World Heritage Sites, royal gardens, and sacred temples across 8 unforgettable days.',
      image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&auto=format&fit=crop&q=80',
      duration: '8 Days',
      guests: '2 – 8',
      route: 'Colombo → Anuradhapura → Sigiriya → Kandy',
      priceType: 'From',
      priceDisplay: '£1,280',
      link: '/round-tours/heritage',
      category: 'cultural',
      badge: { text: 'Heritage', class: 'bg-teal' }
    },
    {
      id: 'rt-adventure',
      title: 'Adrenaline & Summits',
      description: 'White-water rafting in Kitulgala, sunrise at Adam\'s Peak, and surfing lessons on the south coast — for the thrill-seeker.',
      image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
      duration: '10 Days',
      guests: '2 – 6',
      route: 'Kitulgala → Nuwara Eliya → Ella → Mirissa',
      priceType: 'From',
      priceDisplay: '£1,650',
      link: '/round-tours/adventure',
      category: 'adventure',
      badge: { text: 'Adventure', class: 'bg-gold' }
    },
    {
      id: 'rt-family',
      title: 'Family Discovery',
      description: 'An age-appropriate itinerary designed to delight kids and parents alike — turtle hatcheries, train rides, elephant encounters, and beach days.',
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
      duration: '11 Days',
      guests: '2 – 8',
      route: 'Negombo → Sigiriya → Kandy → Ella → Mirissa → Galle',
      priceType: 'From',
      priceDisplay: '£1,380',
      link: '/round-tours/family',
      category: 'cultural',
      badge: { text: 'Family', class: 'bg-teal' }
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getRoundTours().subscribe({
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

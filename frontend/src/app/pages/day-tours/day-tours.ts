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
    { key: 'all', label: 'All Excursions' },
    { key: 'wildlife', label: 'Wildlife & Safari' },
    { key: 'cultural', label: 'Cultural & Heritage' },
    { key: 'coast', label: 'Coast & Ocean' },
    { key: 'highlands', label: 'Highlands & Tea' }
  ];

  tours: any[] = [
    {
      id: 'day-tour-yala',
      title: 'Yala National Park Safari',
      description: "An exclusive private 4x4 safari through Sri Lanka's premier wildlife sanctuary, accompanied by an experienced tracker.",
      image: 'images/tours/day-tour-yala.jpg',
      duration: 'Full Day',
      startTime: '5:30 AM (Morning) or 2:00 PM (Afternoon)',
      guests: 'Private (1 – 6 Guests)',
      category: 'wildlife',
      badge: { text: 'Full Day', class: 'teal' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ['Private open-top jeep', 'Leopard & elephant tracking', 'Picnic refreshment setup']
    },
    {
      id: 'day-tour-sigiriya',
      title: 'Sigiriya Citadel & Dambulla Cave Temples',
      description: 'Ascend the ancient 5th-century Lion Rock fortress and explore the painted cave sanctuaries of Dambulla in a single cultural loop.',
      image: 'images/tours/day-tour-sigiriya.jpg',
      duration: 'Full Day',
      startTime: '7:00 AM',
      guests: 'Private (1 – 8 Guests)',
      category: 'cultural',
      badge: { text: 'Full Day', class: '' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ['UNESCO Sigiriya Fortress', 'Dambulla Cave Murals', 'Traditional village lunch']
    },
    {
      id: 'day-tour-whale',
      title: 'Mirissa Ocean Whale Expedition',
      description: 'Set sail at dawn into the deep southern waters to observe migrating blue whales, sperm whales, and spinner dolphins.',
      image: 'images/tours/day-tour-whale.jpg',
      duration: 'Half Day',
      startTime: '6:00 AM (Seasonal: Nov – Apr)',
      guests: '2 – 8 Guests',
      category: 'coast',
      badge: { text: 'Half Day', class: 'teal' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ['Blue whale & dolphin sightings', 'Marine safety equipment', 'Refreshments at sea']
    },
    {
      id: 'day-tour-kandy',
      title: 'Kandy Royal Heritage & Tea Trails',
      description: 'Experience the sacred rituals of the Temple of the Tooth, wander the Royal Botanic Gardens, and explore a working mountain tea estate.',
      image: 'images/tours/day-tour-kandy.jpg',
      duration: 'Full Day',
      startTime: '8:00 AM',
      guests: 'Private (1 – 8 Guests)',
      category: 'cultural',
      badge: { text: 'Full Day', class: '' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ['Temple of the Sacred Tooth Relic', 'Peradeniya Botanic Gardens', 'Orthodox tea factory tour & tasting']
    },
    {
      id: 'day-tour-galle',
      title: 'Galle Fort & Southern Maritime Heritage',
      description: 'Stroll the 17th-century ramparts of this living Dutch citadel, cruise the coastal mangrove lagoons, and visit a sea turtle sanctuary.',
      image: 'images/tours/day-tour-galle.jpg',
      duration: 'Full Day',
      startTime: '8:30 AM',
      guests: 'Private (1 – 6 Guests)',
      category: 'coast',
      badge: { text: 'Full Day', class: '' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ['UNESCO Galle Fort walking tour', 'Madu Ganga river safari', 'Marine turtle conservation project']
    },
    {
      id: 'day-tour-tea',
      title: 'Nuwara Eliya Highlands & High Tea',
      description: 'Journey into the misty tea country, walk through heritage rolling estates, and experience classic Ceylon high tea.',
      image: 'images/tours/day-tour-tea.jpg',
      duration: 'Full Day',
      startTime: '7:30 AM',
      guests: 'Private (1 – 6 Guests)',
      category: 'highlands',
      badge: { text: 'Full Day', class: 'teal' },
      priceType: 'Bespoke Quote',
      priceDisplay: 'Tailor-made',
      highlights: ["Colonial architecture of 'Little England'", 'Factory processing masterclass', 'Fine highland tea tasting']
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDayTours().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.tours = data;
      },
      error: () => console.log('API not ready, using bespoke data.')
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

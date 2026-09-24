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
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80',
      duration: 'Full Day',
      startTime: '8:30 AM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£70 pp',
      category: 'coastal',
      highlights: ['UNESCO fort', 'Stilt fishermen', 'Boutique shopping']
    },
    {
      id: 'dt-ella',
      title: 'Ella Highlands Adventure',
      description: 'Ride the iconic blue train through tea country, hike to Little Adam\'s Peak, and cross the famous Nine Arches Bridge.',
      image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
      duration: 'Full Day',
      startTime: '6:30 AM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£75 pp',
      category: 'nature',
      highlights: ['Nine Arches Bridge', 'Blue train ride', 'Tea country hike']
    },
    {
      id: 'dt-minneriya',
      title: 'Minneriya Elephant Gathering',
      description: 'Witness one of Asia\'s greatest wildlife spectacles — hundreds of wild elephants gathering at the ancient reservoir during the dry season.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
      duration: 'Half Day',
      startTime: '3:00 PM',
      guests: '2 – 6',
      priceType: 'From',
      priceDisplay: '£50 pp',
      category: 'safari',
      highlights: ['Wild elephant herds', 'Private jeep', 'Sunset experience']
    },
    {
      id: 'dt-bentota',
      title: 'Bentota River & Beach',
      description: 'Cruise through mangrove forests, visit a turtle hatchery, and spend the afternoon at one of Sri Lanka\'s most beautiful beaches.',
      image: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&auto=format&fit=crop&q=80',
      duration: 'Full Day',
      startTime: '9:00 AM',
      guests: '2 – 8',
      priceType: 'From',
      priceDisplay: '£55 pp',
      category: 'nature',
      highlights: ['Mangrove cruise', 'Turtle hatchery', 'Beach relaxation']
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

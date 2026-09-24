import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
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
  destinations: any[] = [
    {
      id: 'dest-sigiriya',
      name: 'Sigiriya & Cultural Triangle',
      tagline: 'The Ancient Kingdoms',
      description: 'Ascend the legendary Lion Rock, explore the cave temples of Dambulla, and discover the ancient capitals of Anuradhapura and Polonnaruwa.',
      image: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/sigiriya',
      region: 'Cultural Triangle',
      bestFor: ['History', 'Photography', 'Hiking']
    },
    {
      id: 'dest-ella',
      name: 'Ella & The Tea Highlands',
      tagline: 'Emerald Peaks & Valleys',
      description: 'Journey through misty tea plantations, cross the iconic Nine Arches Bridge, and hike to breathtaking viewpoints above the clouds.',
      image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/ella',
      region: 'Hill Country',
      bestFor: ['Nature', 'Hiking', 'Train Rides']
    },
    {
      id: 'dest-mirissa',
      name: 'Mirissa & The South Coast',
      tagline: 'Golden Sands & Whales',
      description: 'Watch blue whales breach at sunrise, surf pristine waves, and dine on the freshest seafood at sunset on golden beaches.',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/mirissa',
      region: 'South Coast',
      bestFor: ['Beach', 'Whale Watching', 'Surfing']
    },
    {
      id: 'dest-galle',
      name: 'Galle Fort',
      tagline: 'Colonial Charm',
      description: 'Wander the cobblestone streets of this UNESCO fortress, where Dutch colonial architecture meets Indian Ocean sunsets and boutique galleries.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/galle',
      region: 'South Coast',
      bestFor: ['History', 'Shopping', 'Architecture']
    },
    {
      id: 'dest-yala',
      name: 'Yala National Park',
      tagline: 'Untamed Wilderness',
      description: 'Home to the highest density of leopards in the world, alongside elephants, sloth bears, and over 200 bird species in stunning landscapes.',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/yala',
      region: 'South East',
      bestFor: ['Wildlife', 'Photography', 'Safari']
    },
    {
      id: 'dest-kandy',
      name: 'Kandy',
      tagline: 'Sacred Hill Capital',
      description: 'Home to the Temple of the Tooth Relic and surrounded by lush hills, Kandy is the cultural heart of Sri Lanka — steeped in royal heritage.',
      image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/kandy',
      region: 'Hill Country',
      bestFor: ['Culture', 'Temples', 'Gardens']
    },
    {
      id: 'dest-trinco',
      name: 'Trincomalee & East Coast',
      tagline: 'Turquoise Waters & Temples',
      description: 'Discover pristine Nilaveli and Uppuveli beaches, ancient Koneswaram Temple perched on cliffs, and world-class diving and snorkelling.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/trincomalee',
      region: 'East Coast',
      bestFor: ['Beach', 'Diving', 'Temples']
    },
    {
      id: 'dest-bentota',
      name: 'Bentota & West Coast',
      tagline: 'River, Beach & Romance',
      description: 'Cruise through mangrove forests, relax on golden sands, and explore Geoffrey Bawa\'s architectural masterpieces along the western seaboard.',
      image: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&auto=format&fit=crop&q=80',
      link: '/destinations/bentota',
      region: 'West Coast',
      bestFor: ['Romance', 'Water Sports', 'Architecture']
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDestinations().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.destinations = data;
      },
      error: () => console.log('API not ready, using luxury placeholders.')
    });
  }
}

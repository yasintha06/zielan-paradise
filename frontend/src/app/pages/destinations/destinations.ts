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
      image: 'images/destinations/sigiriya.jpg',
      link: '/destinations/sigiriya',
      region: 'Cultural Triangle',
      bestFor: ['History', 'Photography', 'Hiking']
    },
    {
      id: 'dest-ella',
      name: 'Ella & The Tea Highlands',
      tagline: 'Emerald Peaks & Valleys',
      description: 'Journey through misty tea plantations, cross the iconic Nine Arches Bridge, and hike to breathtaking viewpoints above the clouds.',
      image: 'images/destinations/ella.jpg',
      link: '/destinations/ella',
      region: 'Hill Country',
      bestFor: ['Nature', 'Hiking', 'Train Rides']
    },
    {
      id: 'dest-mirissa',
      name: 'Mirissa & The South Coast',
      tagline: 'Golden Sands & Whales',
      description: 'Watch blue whales breach at sunrise, surf pristine waves, and dine on the freshest seafood at sunset on golden beaches.',
      image: 'images/destinations/mirissa.jpg',
      link: '/destinations/mirissa',
      region: 'South Coast',
      bestFor: ['Beach', 'Whale Watching', 'Surfing']
    },
    {
      id: 'dest-galle',
      name: 'Galle Fort',
      tagline: 'Colonial Charm',
      description: 'Wander the cobblestone streets of this UNESCO fortress, where Dutch colonial architecture meets Indian Ocean sunsets and boutique galleries.',
      image: 'images/destinations/galle.jpg',
      link: '/destinations/galle',
      region: 'South Coast',
      bestFor: ['History', 'Shopping', 'Architecture']
    },
    {
      id: 'dest-yala',
      name: 'Yala National Park',
      tagline: 'Untamed Wilderness',
      description: 'Home to the highest density of leopards in the world, alongside elephants, sloth bears, and over 200 bird species in stunning landscapes.',
      image: 'images/destinations/yala.jpg',
      link: '/destinations/yala',
      region: 'South East',
      bestFor: ['Wildlife', 'Photography', 'Safari']
    },
    {
      id: 'dest-kandy',
      name: 'Kandy',
      tagline: 'Sacred Hill Capital',
      description: 'Home to the Temple of the Tooth Relic and surrounded by lush hills, Kandy is the cultural heart of Sri Lanka — steeped in royal heritage.',
      image: 'images/destinations/kandy.jpg',
      link: '/destinations/kandy',
      region: 'Hill Country',
      bestFor: ['Culture', 'Temples', 'Gardens']
    },
    {
      id: 'dest-nuwara',
      name: 'Nuwara Eliya & Tea Trails',
      tagline: 'Little England in the Hills',
      description: 'Stroll through emerald tea estates, visit historic colonial factories, and savor Ceylon high tea amidst mist-kissed hills.',
      image: 'images/destinations/nuwara-eliya.jpg',
      link: '/destinations/nuwara-eliya',
      region: 'Hill Country',
      bestFor: ['Tea Tasting', 'Cool Climate', 'Colonial Heritage']
    },
    {
      id: 'dest-anuradhapura',
      name: 'Anuradhapura & Dambulla',
      tagline: 'Sacred Ancient Wonders',
      description: 'Marvel at towering white stupas, sacred Bodhi trees, and centuries-old golden cave temple murals.',
      image: 'images/destinations/anuradhapura.jpg',
      link: '/destinations/anuradhapura',
      region: 'Cultural Triangle',
      bestFor: ['Ancient Wonders', 'Spirituality', 'UNESCO Heritage']
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

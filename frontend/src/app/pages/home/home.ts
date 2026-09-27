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
  destinations: Destination[] = [
    {
      id: "dest-sigiriya",
      name: "Sigiriya Citadel",
      tagline: "The Ancient Kingdoms",
      description: "Ascend the legendary Lion Rock fortress and explore royal water gardens.",
      tags: ["History", "UNESCO"],
      region: "Cultural Triangle",
      imageUrl: "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
      isActive: true,
      featured: true
    },
    {
      id: "dest-ella",
      name: "Ella & Tea Highlands",
      tagline: "Emerald Peaks & Valleys",
      description: "Misty tea plantations and the iconic Nine Arches Bridge.",
      tags: ["Nature", "Highlands"],
      region: "Hill Country",
      imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
      isActive: true,
      featured: true
    },
    {
      id: "dest-mirissa",
      name: "Mirissa Coast",
      tagline: "Golden Sands & Whales",
      description: "Ocean whale safaris and serene golden beaches.",
      tags: ["Beach", "Whales"],
      region: "South Coast",
      imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80",
      isActive: true,
      featured: true
    },
    {
      id: "dest-galle-fort",
      name: "Galle Fort",
      tagline: "Colonial Charm",
      description: "Cobblestone streets, Dutch colonial architecture and ocean sunsets.",
      tags: ["History", "Culture"],
      region: "South Coast",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
      isActive: true,
      featured: true
    },
    {
      id: "dest-yala",
      name: "Yala Wilderness",
      tagline: "Untamed Wildlife",
      description: "Private leopard tracking and wild elephant safaris.",
      tags: ["Wildlife", "Safari"],
      region: "South East",
      imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
      isActive: true,
      featured: true
    }
  ];

  tours: Tour[] = [
    {
      id: "tour-grand-island-odyssey",
      title: "The Grand Island Odyssey",
      description: "A 14-day signature luxury loop across Sri Lanka's greatest cultural and coastal highlights.",
      duration: "14 Days / 13 Nights",
      type: "round",
      badge: { text: "Signature 14-Day Tour", class: "bg-gold" },
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      priceDisplay: "Price on Request"
    },
    {
      id: "tour-wild-heritage-highlands",
      title: "Wild Heritage & Highlands",
      description: "Private safari tracking, misty mountain tea estates, and coastal boutique relaxation.",
      duration: "10 Days / 9 Nights",
      type: "round",
      badge: { text: "Wildlife & Adventure", class: "bg-teal" },
      image: "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
      priceDisplay: "Price on Request"
    },
    {
      id: "tour-tea-trails-coastal-sanctuaries",
      title: "Tea Trails & Coastal Sanctuaries",
      description: "Boutique tea bungalows, private catamaran sailings, and romantic hideaways.",
      duration: "8 Days / 7 Nights",
      type: "round",
      badge: { text: "Boutique & Romance", class: "bg-charcoal" },
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
      priceDisplay: "Price on Request"
    }
  ];

  isLoading = true;

  constructor(
    private destinationService: DestinationService,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const featured = data.filter(d => d.featured);
          this.destinations = featured.length > 0 ? featured.slice(0, 5) : data.slice(0, 5);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('Backend loading, using fallback destinations:', err);
        this.isLoading = false;
      }
    });

    this.tourService.getTours('round', undefined, true).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.tours = data.slice(0, 3);
        }
      },
      error: (err) => {
        console.warn('Backend loading, using fallback tours:', err);
      }
    });
  }
}

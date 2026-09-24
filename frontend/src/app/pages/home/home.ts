import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
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
  // High-end placeholders so the site looks stunning even before the Flask API connects
  destinations: any[] = [
    {
      id: "dest-sigiriya",
      name: "Sigiriya & Cultural Triangle",
      tagline: "The Ancient Kingdoms",
      image: "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
      link: "/destinations/sigiriya",
      featured: true
    },
    {
      id: "dest-ella",
      name: "Ella & The Tea Highlands",
      tagline: "Emerald Peaks & Valleys",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
      link: "/destinations/ella",
      featured: true
    },
    {
      id: "dest-mirissa",
      name: "Mirissa & The South Coast",
      tagline: "Golden Sands & Whales",
      image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80",
      link: "/destinations/mirissa",
      featured: true
    },
    {
      id: "dest-galle",
      name: "Galle Fort",
      tagline: "Colonial Charm",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
      link: "/destinations/galle",
      featured: true
    },
    {
      id: "dest-yala",
      name: "Yala National Park",
      tagline: "Untamed Wilderness",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
      link: "/destinations/yala",
      featured: true
    }
  ];

  tours: any[] = [
    {
      id: "rt-essence",
      title: "The Essence of Zeilan",
      description: "A meticulously balanced 10-day journey combining ancient culture, lush highlands, and pristine southern beaches.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
      duration: "10 Days",
      guests: "2 - 6",
      route: "Negombo → Sigiriya → Kandy → Ella → Yala → Galle",
      priceType: "From",
      priceDisplay: "£1,450",
      link: "/round-tours/essence",
      badge: { text: "Most Popular", class: "bg-gold" }
    },
    {
      id: "rt-wild",
      title: "Untamed Sri Lanka",
      description: "Venture deep into the wilderness. Safari drives, luxury tented camps, and exclusive leopard tracking experiences.",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
      duration: "12 Days",
      guests: "2 - 4",
      route: "Wilpattu → Minneriya → Gal Oya → Yala",
      priceType: "From",
      priceDisplay: "£2,100",
      link: "/round-tours/wild",
      badge: { text: "Luxury Explorer", class: "bg-teal" }
    },
    {
      id: "rt-wellness",
      title: "Ayurveda & Wellness Retreat",
      description: "Rejuvenate your soul with holistic Ayurvedic treatments, daily yoga, and serene beachfront luxury.",
      image: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&auto=format&fit=crop&q=80",
      duration: "14 Days",
      guests: "Solo or Couples",
      route: "Weligama → Tangalle → Bentota",
      priceType: "From",
      priceDisplay: "£1,890",
      link: "/round-tours/wellness",
      badge: { text: "Wellness", class: "bg-charcoal" }
    }
  ];

  testimonials: any[] = [
    {
      id: "testi-1",
      text: "From our very first enquiry to the moment we landed back in Heathrow, the service was impeccable. Our guide, Nuwan, was exceptional.",
      authorName: "Eleanor & James",
      authorLocation: "London, UK",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "testi-2",
      text: "Zeilan Paradise arranged a private anniversary dinner for us in the tea hills that brought me to tears. Pure magic.",
      authorName: "Sarah M.",
      authorLocation: "Manchester, UK",
      authorImage: "https://images.unsplash.com/photo-1508214751196-bfd141285cb6?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "testi-3",
      text: "As seasoned travellers, we expect a lot. Zeilan exceeded every standard. The boutique hotels they selected were breathtaking.",
      authorName: "The Harrison Family",
      authorLocation: "Surrey, UK",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Attempt to fetch from API, but keep high-end placeholders if it fails (so the site never looks broken)
    this.apiService.getDestinations().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.destinations = data.filter(d => d.featured);
      },
      error: () => console.log('API not ready yet, using luxury placeholders.')
    });

    this.apiService.getFeaturedTours('uk').subscribe({
      next: (data) => {
        if (data && data.length > 0) this.tours = data;
      },
      error: () => console.log('API not ready yet, using luxury placeholders.')
    });

    this.apiService.getTestimonials('uk').subscribe({
      next: (data) => {
        if (data && data.length > 0) this.testimonials = data;
      },
      error: () => console.log('API not ready yet, using luxury placeholders.')
    });
  }
}

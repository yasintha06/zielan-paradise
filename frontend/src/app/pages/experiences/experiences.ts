import { Component, computed, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ParallaxDirective } from '../../directives/parallax';
import { PageHeroComponent } from '../../components/page-hero/page-hero';

interface Experience {
  title: string;
  theme: string;
  region: string;
  text: string;
  image: string;
}

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, ParallaxDirective, PageHeroComponent],
  templateUrl: './experiences.html',
  styleUrl: './experiences.css',
})
export class Experiences {
  readonly themes = ['Culture', 'Wildlife', 'Food', 'Wellness', 'Romance', 'Family'];
  theme = signal('All');

  readonly experiences: Experience[] = [
    { title: 'Sunrise on Lion Rock', theme: 'Culture', region: 'Sigiriya', image: 'sigiriya', text: 'Climb the 5th-century rock citadel at first light, before the heat and the crowds, with a guide who knows its stories.' },
    { title: 'Evening ceremony at the Temple of the Tooth', theme: 'Culture', region: 'Kandy', image: 'kandy', text: 'Drums, lamps and offerings at Sri Lanka’s most sacred temple, explained gently by your guide.' },
    { title: 'Saree draping & a cocktail dinner', theme: 'Culture', region: 'Anywhere', image: 'dambulla', text: 'Learn to drape a saree with a local stylist, then wear it to an evening of Sri Lankan cocktails and dinner.' },
    { title: 'Cycling the ancient capitals', theme: 'Culture', region: 'Anuradhapura & Polonnaruwa', image: 'anuradhapura', text: 'Ride between great stupas, royal baths and reservoirs that are more than two thousand years old.' },
    { title: 'Leopards of Yala', theme: 'Wildlife', region: 'Yala', image: 'yala', text: 'Private jeep safaris at dawn and dusk with an experienced naturalist, in the park with one of the highest leopard densities on earth.' },
    { title: 'The great elephant gathering', theme: 'Wildlife', region: 'Minneriya & Kaudulla', image: 'day-tour-yala', text: 'In the dry season, hundreds of wild elephants gather at ancient reservoirs. One of Asia’s great wildlife sights.' },
    { title: 'Blue whales off the south coast', theme: 'Wildlife', region: 'Mirissa (Nov – Apr)', image: 'day-tour-whale', text: 'Head out at dawn in search of the largest animal that has ever lived, with spinner dolphins often alongside.' },
    { title: 'Cook with a family, not just a chef', theme: 'Food', region: 'Kandy', image: 'nuwara-eliya', text: 'Grind spices, scrape coconut and cook a full rice-and-curry lunch in a family kitchen, then sit down to eat it together.' },
    { title: 'From tea leaf to cup', theme: 'Food', region: 'Hill country', image: 'day-tour-tea', text: 'Pluck with the tea pickers, follow the leaf through a working factory and finish with a private tasting.' },
    { title: 'Market to kitchen in Galle', theme: 'Food', region: 'Galle', image: 'day-tour-galle', text: 'Choose the morning’s catch at the fish market with a chef, then cook it together in a colonial villa.' },
    { title: 'Ayurveda with a qualified doctor', theme: 'Wellness', region: 'West coast', image: 'mirissa', text: 'A personal consultation and treatments tailored to you, from a single day of restoration to a full week’s programme.' },
    { title: 'Yoga above the tea fields', theme: 'Wellness', region: 'Hill country', image: 'tour-grand-odyssey', text: 'Morning yoga on a veranda with the mist lifting off the valleys, followed by a slow breakfast.' },
    { title: 'Hot-air balloon at dawn', theme: 'Romance', region: 'Dambulla & Sigiriya', image: 'tour-cultural-triangle', text: 'Float above lakes, jungle and Sigiriya Rock as the sun rises (weather permitting).' },
    { title: 'Candlelit dinner in a tea bungalow', theme: 'Romance', region: 'Hill country', image: 'tour-grand-odyssey', text: 'A private dinner for two in a restored planter’s bungalow, with log fires and starry skies.' },
    { title: 'A village day', theme: 'Family', region: 'Sigiriya', image: 'dambulla', text: 'A bullock-cart ride, a catamaran across the lake and a home-cooked lunch with a farming family.' },
    { title: 'Pottery & crafts for children', theme: 'Family', region: 'Cultural Triangle', image: 'tour-southern-coast', text: 'Hands-on sessions with village potters and wood carvers that children remember long after the trip.' },
    { title: 'The blue train to Ella', theme: 'Family', region: 'Hill country', image: 'ella', text: 'One of the world’s great train rides, through tea estates and cloud forest, in reserved seats.' },
  ];

  visible = computed(() => (this.theme() === 'All' ? this.experiences : this.experiences.filter((e) => e.theme === this.theme())));

  setTheme(t: string): void {
    this.theme.set(t);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }

  countFor(theme: string): number {
    return theme === 'All' ? this.experiences.length : this.experiences.filter((e) => e.theme === theme).length;
  }
}

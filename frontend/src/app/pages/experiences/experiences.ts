import { Component, computed, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ParallaxDirective } from '../../directives/parallax';
import { PageHeroComponent } from '../../components/page-hero/page-hero';

interface Experience {
  /** false hides the card until a real photo is added (delete it from the line to show the card again). */
  photoReady?: boolean;
  title: string;
  theme: string;
  region: string;
  text: string;
  image: string;
}

/** Set to true to show every card, including those still waiting for a real photo. */
const SHOW_CARDS_WITHOUT_PHOTOS = false;

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, ParallaxDirective, PageHeroComponent],
  templateUrl: './experiences.html',
  styleUrl: './experiences.css',
})
export class Experiences {
  readonly themes = ['Culture', 'Wildlife', 'Adventure', 'Food', 'Wellness', 'Romance', 'Family'];
  theme = signal('All');

  private readonly all: Experience[] = [
    { title: 'Sunrise on Lion Rock', theme: 'Culture', region: 'Sigiriya', image: 'sigiriya-rock-01', text: 'Climb the 5th-century rock citadel at first light, before the heat and the crowds, with a guide who knows its stories.' },
    { title: 'Evening ceremony at the Temple of the Tooth', theme: 'Culture', region: 'Kandy', image: 'kandy', text: 'Drums, lamps and offerings at Sri Lanka’s most sacred temple, explained gently by your guide.' },
    { photoReady: false, title: 'Saree draping & a cocktail dinner', theme: 'Culture', region: 'Anywhere', image: 'dambulla', text: 'Learn to drape a saree with a local stylist, then wear it to an evening of Sri Lankan cocktails and dinner.' },
    { title: 'Cycling the ancient capitals', theme: 'Culture', region: 'Anuradhapura & Polonnaruwa', image: 'polonnaruwa-vatadage-01', text: 'Ride between great stupas, royal baths and reservoirs that are more than two thousand years old.' },
    { title: 'Leopards of Yala', theme: 'Wildlife', region: 'Yala', image: 'untamed-leopard-01', text: 'Private jeep safaris at dawn and dusk with an experienced naturalist, in the park with one of the highest leopard densities on earth.' },
    { title: 'The great elephant gathering', theme: 'Wildlife', region: 'Minneriya & Kaudulla', image: 'daytour-minneriya-gathering-01', text: 'In the dry season, hundreds of wild elephants gather at ancient reservoirs. One of Asia’s great wildlife sights.' },
    { title: 'Blue whales off the south coast', theme: 'Wildlife', region: 'Mirissa (Dec – Apr)', image: 'activity-whale-watching-01', text: 'Head out at dawn in search of the largest animal that has ever lived, with spinner dolphins often alongside.' },
    { title: 'Walking the hill country', theme: 'Adventure', region: 'Hill country (Jan – Apr)', image: 'activity-hiking-ella-rock-01', text: 'Walk stages of the Pekoe Trail, climb Ella Rock, cross Horton Plains or make the night climb of Adam’s Peak (December to May).' },
    { title: 'White-water rafting', theme: 'Adventure', region: 'Kitulgala', image: 'activity-rafting-kitulgala-01', text: 'An add-on to any tour: rafting the river at Kitulgala, depending on water levels. Ask us for the best months.' },
    { title: 'Surf lessons', theme: 'Adventure', region: 'Arugam Bay & Weligama', image: 'activity-surf-lessons-01', text: 'Beginner lessons on gentle waves at Arugam Bay on the east coast or Weligama on the south coast. Ask us for the best months.' },
    { title: 'Snorkelling & diving', theme: 'Adventure', region: 'Trincomalee & Hikkaduwa', image: 'activity-snorkelling-turtle-01', text: 'Snorkel among coral and reef fish at Pigeon Island off Trincomalee (May to September) or at Hikkaduwa on the south-west coast (November to April).' },
    { title: 'River & lagoon boat trips', theme: 'Wildlife', region: 'Bentota & Batticaloa', image: 'bentota-madu-ganga-01', text: 'A boat through the mangroves of the Madu Ganga near Bentota to a cinnamon island, or out on the lagoon at Batticaloa on the east coast. All year.' },
    { title: 'Turtle watching', theme: 'Wildlife', region: 'Rekawa & Kosgoda', image: 'activity-turtle-watching-01', text: 'A guided evening visit to Rekawa beach near Tangalle to see sea turtles come ashore, or a turtle conservation project at Kosgoda. Ask us for the best months.' },
    { photoReady: false, title: 'Cook with a family, not just a chef', theme: 'Food', region: 'Kandy', image: 'footprints-crab-curry-01', text: 'Grind spices, scrape coconut and cook a full rice-and-curry lunch in a family kitchen, then sit down to eat it together.' },
    { title: 'From tea leaf to cup', theme: 'Food', region: 'Hill country', image: 'activity-tea-tasting-01', text: 'Pluck with the tea pickers, follow the leaf through a working factory and finish with a private tasting.' },
    { title: 'Market to kitchen in Galle', theme: 'Food', region: 'Galle', image: 'day-tour-galle', text: 'Choose the morning’s catch at the fish market with a chef, then cook it together in a colonial villa.' },
    { title: 'Ayurveda with a qualified doctor', theme: 'Wellness', region: 'West coast', image: 'activity-ayurveda-massage-01', text: 'A personal consultation and treatments tailored to you, from a single day of restoration to a full week’s programme.' },
    { photoReady: false, title: 'Yoga above the tea fields', theme: 'Wellness', region: 'Hill country', image: 'tour-grand-odyssey', text: 'Morning yoga on a veranda with the mist lifting off the valleys, followed by a slow breakfast.' },
    { photoReady: false, title: 'Hot-air balloon at dawn', theme: 'Romance', region: 'Dambulla & Sigiriya', image: 'tour-cultural-triangle', text: 'Float above lakes, jungle and Sigiriya Rock as the sun rises (weather permitting).' },
    { photoReady: false, title: 'Candlelit dinner in a tea bungalow', theme: 'Romance', region: 'Hill country', image: 'tour-grand-odyssey', text: 'A private dinner for two in a restored planter’s bungalow, with log fires and starry skies.' },
    { title: 'A village day', theme: 'Family', region: 'Sigiriya', image: 'classic-village-cycling-01', text: 'A bullock-cart ride, a catamaran across the lake and a home-cooked lunch with a farming family.' },
    { title: 'Pottery & crafts for children', theme: 'Family', region: 'Cultural Triangle', image: 'activity-pottery-01', text: 'Hands-on sessions with village potters and wood carvers that children remember long after the trip.' },
    { title: 'The blue train to Ella', theme: 'Family', region: 'Hill country', image: 'ella', text: 'One of the world’s great train rides, through tea estates and cloud forest, in reserved seats.' },
  ];

  /** Cards marked photoReady: false stay hidden until their photo exists. */
  readonly experiences = this.all.filter((e) => SHOW_CARDS_WITHOUT_PHOTOS || e.photoReady !== false);

  visible = computed(() => (this.theme() === 'All' ? this.experiences : this.experiences.filter((e) => e.theme === this.theme())));

  setTheme(t: string): void {
    this.theme.set(t);
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }

  countFor(theme: string): number {
    return theme === 'All' ? this.experiences.length : this.experiences.filter((e) => e.theme === theme).length;
  }
}

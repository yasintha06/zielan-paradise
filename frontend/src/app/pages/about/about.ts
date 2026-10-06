import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { ParallaxDirective } from '../../directives/parallax';
import { PageHeroComponent } from '../../components/page-hero/page-hero';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, MagneticDirective, ParallaxDirective, PageHeroComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly pillars = [
    { label: 'Vision', title: 'Sri Lanka, as it deserves to be seen', text: 'To be the most trusted way for discerning travellers to discover Sri Lanka: personally, thoughtfully and in comfort.' },
    { label: 'Mission', title: 'Journeys built around people', text: 'To listen first, then design private journeys that match each guest’s pace, interests and style, and to look after them at every step.' },
    { label: 'Values', title: 'Honest, local, responsible', text: 'Clear prices, no hidden extras and no pressure. We work with local guides, family-run businesses and ethical wildlife experiences.' },
  ];

  readonly strengths = [
    { title: 'UK-based planning', text: 'Speak to someone in your own time zone, by phone, WhatsApp or email, from the first idea to the day you fly.' },
    { title: 'Our own team on the island', text: 'Experienced, licensed chauffeur-guides who know the history, the wildlife and the best place for lunch.' },
    { title: 'Entirely private', text: 'No coaches and no fixed departures. Every journey is yours alone and moves at your pace.' },
    { title: 'Hand-picked stays', text: 'From planters’ bungalows to beach villas, we choose places for character, comfort and kind service.' },
    { title: 'Help around the clock', text: 'A local contact is a call away for the whole of your trip, day or night.' },
    { title: 'Nothing pushed on you', text: 'No forced shopping stops. Gem shops and spice gardens only if you ask for them.' },
  ];

  readonly promises = [
    'No elephant rides or shows. We watch wildlife in the wild, with respect.',
    'We favour locally owned hotels, restaurants and guides.',
    'Fair pay and proper rest for the chauffeur-guides who look after you.',
    'Plastic-light travel: refillable water on every journey.',
  ];
}

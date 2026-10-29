import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { ParallaxDirective } from '../../directives/parallax';
import { BgVideoComponent } from '../../components/bg-video/bg-video';
import { BUSINESS, SITE } from '../../config/site';
import { PageHeroComponent } from '../../components/page-hero/page-hero';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, MagneticDirective, ParallaxDirective, PageHeroComponent, BgVideoComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly site = SITE;
  readonly business = BUSINESS;

  readonly pillars = [
    { label: 'Vision', title: 'Sri Lanka, as it deserves to be seen', text: 'To be the most trusted way for discerning travellers to discover Sri Lanka: personally, thoughtfully and in comfort.' },
    { label: 'Mission', title: 'Journeys built around people', text: 'To listen first, then design private journeys that match each guest’s pace, interests and style, and to look after them at every step.' },
    { label: 'Values', title: 'Honest, local, responsible', text: 'Clear prices, no hidden extras and no pressure. We work with local guides, family-run businesses and ethical wildlife experiences.' },
  ];

  readonly strengths = [
    { title: 'UK-based planning', text: 'Speak to someone in your own time zone, by phone, WhatsApp or email, from the first idea to the day you fly.' },
    { title: 'Your own chauffeur-guide', text: 'A private, English-speaking chauffeur-guide for the whole journey, who knows the history, the wildlife and the best place for lunch.' },
    { title: 'Entirely private', text: 'No coaches and no fixed departures. Every journey is yours alone and moves at your pace.' },
    { title: 'Hand-picked stays', text: 'From planters’ bungalows to beach villas, we choose places for character, comfort and kind service.' },
    { title: 'Looked after throughout', text: 'Your chauffeur-guide is with you for the whole trip, and you can reach us by phone or WhatsApp.' },
    { title: 'Nothing pushed on you', text: 'No forced shopping stops. Gem shops and spice gardens only if you ask for them.' },
  ];

  readonly promises = [
    'No elephant rides or shows. We watch wildlife in the wild, with respect.',
    'We favour locally owned hotels, restaurants and guides.',
    'Fair pay and proper rest for the chauffeur-guides who look after you.',
    'Plastic-light travel: refillable water on every journey.',
  ];
}

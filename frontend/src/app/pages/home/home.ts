import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TourService, Tour } from '../../services/tour.service';
import { MotionService } from '../../services/motion.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { TourCardComponent } from '../../components/tour-card/tour-card';

const SLIDE_MS = 6500;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, MagneticDirective, TourCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private motion = inject(MotionService);
  private tourService = inject(TourService);

  readonly slides = [
    { image: 'sigiriya', place: 'Sigiriya · Cultural Triangle', alt: 'Sigiriya rock fortress rising from the jungle' },
    { image: 'ella', place: 'Nine Arches Bridge · Ella', alt: 'Blue train crossing the Nine Arches Bridge in Ella' },
    { image: 'yala', place: 'Yala National Park', alt: 'Leopard resting on a branch in Yala' },
    { image: 'tour-southern-coast', place: 'Stilt fishermen · South Coast', alt: 'Stilt fishermen on the southern coast' },
    { image: 'tour-grand-odyssey', place: 'The Hill Country', alt: 'Lake and green hills in the Sri Lankan highlands' },
  ];

  readonly marquee = ['Sigiriya', 'Kandy', 'Ella', 'Nuwara Eliya', 'Yala', 'Galle', 'Mirissa', 'Anuradhapura', 'Dambulla'];

  readonly facts = [
    { value: 8, suffix: '', label: 'UNESCO World Heritage Sites' },
    { value: 1340, suffix: ' km', label: 'Of tropical coastline' },
    { value: 2500, suffix: '+', label: 'Years of recorded history' },
    { value: 24, suffix: '/7', label: 'On-island support for you' },
  ];

  readonly destinations = [
    { name: 'Sigiriya', anchor: 'dest-sigiriya', tagline: 'The fortress in the sky', image: 'sigiriya' },
    { name: 'Kandy', anchor: 'dest-kandy', tagline: 'Temple of the Sacred Tooth', image: 'kandy' },
    { name: 'Ella', anchor: 'dest-ella', tagline: 'Emerald peaks & valleys', image: 'ella' },
    { name: 'Nuwara Eliya', anchor: 'dest-nuwara-eliya', tagline: 'Little England in the clouds', image: 'nuwara-eliya' },
    { name: 'Yala', anchor: 'dest-yala-national-park', tagline: 'Land of the leopard', image: 'yala' },
    { name: 'Galle', anchor: 'dest-galle-fort', tagline: 'A fort by the Indian Ocean', image: 'galle' },
    { name: 'Mirissa', anchor: 'dest-mirissa', tagline: 'Whales, waves & golden sand', image: 'mirissa' },
    { name: 'Anuradhapura', anchor: 'dest-anuradhapura', tagline: 'The first great kingdom', image: 'anuradhapura' },
    { name: 'Dambulla', anchor: 'dest-dambulla', tagline: 'Cave temples of gold', image: 'dambulla' },
  ];

  readonly styles = [
    { tag: 'Multi-day', title: 'Round Tours', text: 'Seven to fourteen days traversing the island’s greatest wonders, with your own chauffeur-guide.', cta: 'Explore round tours', link: '/round-tours', image: 'tour-cultural-triangle' },
    { tag: 'Single day', title: 'Day Tours', text: 'Perfectly paced private excursions: a safari at first light, a fort at sunset, a morning with the whales.', cta: 'Explore day tours', link: '/day-tours', image: 'day-tour-whale' },
    { tag: 'Fully bespoke', title: 'Tailor-Made', text: 'Tell us how you like to travel and we’ll compose a journey that exists only for you.', cta: 'Start planning', link: '/tailor-made', image: 'day-tour-tea' },
  ];

  readonly steps = [
    { title: 'Share your dream', text: 'Tell us when, who and what moves you, by form, call or WhatsApp.' },
    { title: 'Receive your itinerary', text: 'A private, day-by-day proposal with hand-picked stays and experiences.' },
    { title: 'Refine it together', text: 'We fine-tune every detail with you until it feels exactly right.' },
    { title: 'Travel, cared for', text: 'Your guide meets you on arrival, with our team on call around the clock.' },
  ];

  readonly promises = [
    { title: 'UK-based planning', text: 'Plan with a real person in your time zone, by phone, email or WhatsApp.', icon: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z'] },
    { title: 'Our own island team', text: 'Licensed chauffeur-guides who bring history, wildlife and culture to life.', icon: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'] },
    { title: 'Entirely private', text: 'No group coaches, no fixed departures. Your journey, your pace.', icon: ['M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z'] },
    { title: 'Care around the clock', text: 'From landing to departure, help is always one call away.', icon: ['M12 6v6l4 2', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'] },
  ];

  readonly gallery = [
    [{ image: 'anuradhapura', alt: 'Stupa at sunset in Anuradhapura' }, { image: 'day-tour-tea', alt: 'Tea estate in the hills' }],
    [{ image: 'day-tour-galle', alt: 'Aerial view of Galle Fort' }, { image: 'day-tour-yala', alt: 'Elephant beside a safari jeep' }],
    [{ image: 'dambulla', alt: 'Dambulla cave temple archway' }, { image: 'day-tour-whale', alt: 'Whale tail off Mirissa' }],
    [{ image: 'mirissa', alt: 'Coastline from above' }, { image: 'day-tour-kandy', alt: 'Temple of the Tooth in Kandy' }],
  ];

  tours: Tour[] = [
    { id: 'tour-grand-island-odyssey', title: 'The Grand Island Odyssey', description: 'A fourteen-day signature loop across Sri Lanka’s greatest cultural and coastal highlights.', duration: '14 Days / 13 Nights', type: 'round', badge: { text: 'Signature', class: '' }, image: 'img/tour-grand-odyssey-900.webp' },
    { id: 'tour-wild-heritage-highlands', title: 'Wild Heritage & Highlands', description: 'Private safari tracking, misty tea estates and boutique coastal calm.', duration: '10 Days / 9 Nights', type: 'round', badge: { text: 'Wildlife', class: '' }, image: 'img/tour-cultural-triangle-900.webp' },
    { id: 'tour-tea-trails-coastal-sanctuaries', title: 'Tea Trails & Coastal Sanctuaries', description: 'Planters’ bungalows, ocean hideaways and slow, romantic days.', duration: '8 Days / 7 Nights', type: 'round', badge: { text: 'Romance', class: '' }, image: 'img/tour-southern-coast-900.webp' },
  ];

  activeSlide = signal(0);
  openStyle = signal(0);

  private ctx: gsap.Context | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.tourService.getTours('round', undefined, true).subscribe({
      next: (data) => {
        if (data?.length) {
          this.tours = data.slice(0, 3);
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      },
      error: () => { /* keep curated fallback */ },
    });
  }

  ngAfterViewInit(): void {
    this.startSlides();
    this.zone.runOutsideAngular(() => {
      const root = this.el.nativeElement.querySelector('.zp-home') as HTMLElement;
      this.ctx = gsap.context(() => this.animate(root), root);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.ctx?.revert();
  }

  pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  goTo(i: number): void {
    this.activeSlide.set(i);
    this.startSlides();
  }

  scrollDown(): void {
    this.motion.scrollTo('#discover');
  }

  private startSlides(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.activeSlide.update((i) => (i + 1) % this.slides.length), SLIDE_MS);
  }

  private animate(root: HTMLElement): void {
    const reduced = this.motion.reducedMotion;
    const q = gsap.utils.selector(root);

    // Number counters run whether or not motion is reduced (they just jump to final value).
    q('[data-count]').forEach((el: HTMLElement) => {
      const end = Number(el.dataset['count']);
      const obj = { v: 0 };
      const fmt = (v: number) => Math.round(v).toLocaleString('en-GB');
      if (reduced) { el.textContent = fmt(end); return; }
      gsap.to(obj, {
        v: end, duration: 2.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = fmt(obj.v)),
      });
    });

    if (reduced) return;

    // ── Hero entrance (waits for the preloader) ──
    const title = q('[data-hero-title]')[0];
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'zp-line' });
    gsap.set(split.lines, { yPercent: 110 });
    gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 30 });
    gsap.set(q('[data-hero-media]'), { scale: 1.15 });
    this.motion.introDone.then(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to(q('[data-hero-media]'), { scale: 1, duration: 2.4 }, 0)
        .to(split.lines, { yPercent: 0, duration: 1.6, stagger: 0.12 }, 0.15)
        .to(q('[data-hero-fade]'), { opacity: 1, y: 0, duration: 1.4, stagger: 0.1 }, 0.55);
    });

    // Hero parallax out on scroll
    gsap.to(q('[data-hero-content]'), {
      yPercent: -25, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.zp-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(q('.zp-hero-slide img'), {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.zp-hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // ── Manifesto: words light up as you read ──
    q('[data-scrub-words]').forEach((p: HTMLElement) => {
      const words = SplitText.create(p, { type: 'words' }).words;
      gsap.fromTo(words, { opacity: 0.14 }, {
        opacity: 1, stagger: 0.08, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 50%', scrub: true },
      });
    });

    // ── Generic image parallax ──
    q('[data-parallax]').forEach((img: HTMLElement) => {
      const amt = Number(img.dataset['parallax']) || 10;
      gsap.fromTo(img, { yPercent: -amt / 2, scale: 1.12 }, {
        yPercent: amt / 2, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // ── Destinations: pinned horizontal scroll on wide screens ──
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = q('[data-dest-track]')[0] as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: q('[data-dest-pin]')[0], start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (st) => gsap.set(q('[data-dest-progress]'), { scaleX: st.progress }),
        },
      });
    });

    // ── How it works: gold line draws across ──
    gsap.fromTo(q('[data-steps-line]'), { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 75%', end: 'bottom 60%', scrub: true },
    });

    // ── Gallery columns drift at different speeds ──
    q('.zp-gallery-col').forEach((col: HTMLElement) => {
      const speed = Number(col.dataset['speed']) || 0;
      gsap.fromTo(col, { yPercent: speed }, {
        yPercent: -speed, ease: 'none',
        scrollTrigger: { trigger: '.zp-gallery-cols', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }
}

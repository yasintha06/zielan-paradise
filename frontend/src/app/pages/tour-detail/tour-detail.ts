import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, catchError, of, map } from 'rxjs';
import { TourService, Tour } from '../../services/tour.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { MagneticDirective } from '../../directives/magnetic';
import { PageHeroComponent, Crumb } from '../../components/page-hero/page-hero';
import { TourCardComponent } from '../../components/tour-card/tour-card';
import { imageUrl } from '../../utils/image';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, MagneticDirective, PageHeroComponent, TourCardComponent],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
})
export class TourDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);
  private seo = inject(SeoService);
  private motion = inject(MotionService);

  readonly site = SITE;
  tour = signal<Tour | null>(null);
  related = signal<Tour[]>([]);
  state = signal<'loading' | 'ready' | 'missing'>('loading');
  openDay = signal(0);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((p) => p.get('id') ?? ''),
      switchMap((id) => {
        this.state.set('loading');
        return this.tourService.getTourById(id).pipe(catchError(() => of(null)));
      })
    ).subscribe((tour) => {
      this.tour.set(tour);
      this.state.set(tour ? 'ready' : 'missing');
      this.openDay.set(0);
      if (!tour) return;
      this.seo.set({
        title: `${tour.title} | Zeilan Paradise`,
        description: tour.description || `${tour.duration} private journey: ${tour.route ?? ''}. ${tour.targetAudience ?? ''}`.trim(),
        image: imageUrl(tour.image),
      });
      this.tourService.getTours(tour.type).subscribe((list) =>
        this.related.set(list.filter((t) => t.id !== tour.id).slice(0, 3))
      );
    });
  }

  heroImage(t: Tour): string {
    return imageUrl(t.image, 2000);
  }

  crumbs(t: Tour): Crumb[] {
    return t.type === 'day'
      ? [{ label: 'Day Tours', link: '/day-tours' }, { label: t.title }]
      : [{ label: 'Round Tours', link: '/round-tours' }, { label: t.title }];
  }

  stops(t: Tour): string[] {
    return (t.route ?? '').split('→').map((s) => s.trim()).filter(Boolean);
  }

  dayLabel(d: { day?: string; dayNumber?: number | string }, i: number): string {
    const raw = String(d.day ?? d.dayNumber ?? i + 1);
    return raw.replace(/^day\s*/i, '');
  }

  toEnquire(): void {
    this.motion.scrollTo('#enquire');
  }

  toggleDay(i: number): void {
    this.openDay.set(this.openDay() === i ? -1 : i);
  }

  whatsappLink(t: Tour): string {
    return `${this.site.whatsappHref}?text=${encodeURIComponent(`Hello, I'm interested in "${t.title}". Could you tell me more?`)}`;
  }
}

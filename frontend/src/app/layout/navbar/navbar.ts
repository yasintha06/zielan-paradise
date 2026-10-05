import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic';

/** Routes whose page starts on a light background, so the bar must be solid from the top. */
const LIGHT_TOP_ROUTES = ['/admin'];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MagneticDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private motion = inject(MotionService);

  readonly site = SITE;
  readonly links = [
    { path: '/destinations', label: 'Destinations' },
    { path: '/round-tours', label: 'Round Tours' },
    { path: '/day-tours', label: 'Day Tours' },
    { path: '/tailor-made', label: 'Tailor-Made' },
    { path: '/contact', label: 'Contact' },
  ];
  readonly menuLinks = [{ path: '/', label: 'Home' }, ...this.links];

  scrolled = signal(false);
  hidden = signal(false);
  menuOpen = signal(false);
  private lightTop = signal(false);
  solid = () => this.scrolled() || this.lightTop();

  private off: (() => void) | null = null;

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.lightTop.set(LIGHT_TOP_ROUTES.some((r) => url.startsWith(r)));
      this.hidden.set(false);
      this.closeMenu();
    });
  }

  ngOnInit(): void {
    this.off = this.motion.onScroll((y, dir) => {
      const scrolled = y > 40;
      const hidden = y > 320 && dir > 0;
      if (scrolled !== this.scrolled()) this.scrolled.set(scrolled);
      if (hidden !== this.hidden()) this.hidden.set(hidden);
    });
  }

  ngOnDestroy(): void {
    this.off?.();
  }

  toggleMenu(): void {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    this.menuOpen.set(true);
    this.motion.stop();
    document.body.style.overflow = 'hidden';
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.motion.start();
    document.body.style.overflow = '';
  }
}

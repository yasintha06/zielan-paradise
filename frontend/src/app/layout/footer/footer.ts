import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MagneticDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private motion = inject(MotionService);
  readonly site = SITE;
  readonly year = new Date().getFullYear();
  /** The big "start planning" call to action is redundant on pages that are already the form. */
  showCta = signal(true);

  constructor() {
    inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.showCta.set(!['/contact', '/tailor-made', '/admin'].some((p) => url.startsWith(p)));
    });
  }

  toTop(): void {
    this.motion.scrollTo(0);
  }
}

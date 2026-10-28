import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic';
import { BgVideoComponent } from '../../components/bg-video/bg-video';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MagneticDirective, BgVideoComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private motion = inject(MotionService);
  readonly site = SITE;
  readonly year = new Date().getFullYear();
  /** The big "start planning" call to action is redundant on pages that are already the form. */
  showCta = signal(true);
  /** The tea-pickers film plays behind the call to action on the homepage only. */
  isHome = signal(false);

  constructor() {
    inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.isHome.set(url === '/' || url.startsWith('/?') || url.startsWith('/#'));
      this.showCta.set(!['/contact', '/tailor-made', '/admin'].some((p) => url.startsWith(p)));
    });
  }

  toTop(): void {
    this.motion.scrollTo(0);
  }
}

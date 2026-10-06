import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { PreloaderComponent } from './components/preloader/preloader';
import { CursorComponent } from './components/cursor/cursor';
import { WhatsappFabComponent } from './components/whatsapp-fab/whatsapp-fab';
import { MotionService } from './services/motion.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, PreloaderComponent, CursorComponent, WhatsappFabComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private motion = inject(MotionService);
  private seo = inject(SeoService);
  private router = inject(Router);

  /** The admin area has its own layout, so the public navbar, footer and extras are hidden there. */
  isAdmin = signal(false);

  ngOnInit(): void {
    this.motion.init();
    this.seo.init();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) =>
      this.isAdmin.set((e as NavigationEnd).urlAfterRedirects.startsWith('/admin'))
    );
  }

  /** In-page anchors would navigate home (because of <base href="/">), so move focus directly. */
  skipToMain(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}

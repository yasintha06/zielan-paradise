import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="sh" [class.sh--open]="menuOpen()">
      <aside class="sh-side" data-lenis-prevent>
        <a routerLink="/admin" class="sh-brand" (click)="menuOpen.set(false)">
          <img src="logo-light.png" alt="Zeilan Paradise" width="400" height="341" />
          <span>Admin</span>
        </a>
        <nav class="sh-nav" aria-label="Admin">
          @for (l of links; track l.path) {
            <a [routerLink]="l.path" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: l.exact }" (click)="menuOpen.set(false)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path [attr.d]="l.icon" /></svg>
              {{ l.label }}
            </a>
          }
        </nav>
        <div class="sh-foot">
          <a href="/" target="_blank" rel="noopener">View website ↗</a>
          <button type="button" (click)="logout()">Sign out</button>
        </div>
      </aside>

      <div class="sh-main">
        <header class="sh-top">
          <button type="button" class="sh-burger" (click)="menuOpen.set(!menuOpen())" aria-label="Toggle menu"><span></span><span></span></button>
          <img src="logo.png" alt="Zeilan Paradise" class="sh-top-logo" width="400" height="341" />
        </header>
        <div class="sh-content">
          <router-outlet />
        </div>
      </div>
      @if (menuOpen()) { <div class="sh-scrim" (click)="menuOpen.set(false)"></div> }
    </div>
  `,
  styles: `
    .sh { display: grid; grid-template-columns: 248px 1fr; min-height: 100svh; background: #f4f1ea; }
    .sh-side { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; background: var(--ink); color: var(--ivory); padding: 1.5rem 1rem; overflow-y: auto; }
    .sh-brand { display: flex; align-items: center; gap: 0.75rem; padding: 0 0.5rem 1.5rem; border-bottom: 1px solid rgba(246, 240, 226, 0.1); }
    .sh-brand img { height: 52px; width: auto; }
    .sh-brand span { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); }
    .sh-nav { display: grid; gap: 0.2rem; padding: 1.25rem 0; }
    .sh-nav a { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0.75rem; border-radius: 6px; font-size: 0.9rem; color: rgba(246, 240, 226, 0.72); transition: background 0.2s, color 0.2s; }
    .sh-nav a svg { width: 18px; height: 18px; flex-shrink: 0; }
    .sh-nav a:hover { background: rgba(246, 240, 226, 0.06); color: var(--ivory); }
    .sh-nav a.is-active { background: rgba(212, 175, 55, 0.14); color: var(--gold); }
    .sh-foot { margin-top: auto; display: grid; gap: 0.5rem; padding: 1rem 0.75rem 0; border-top: 1px solid rgba(246, 240, 226, 0.1); font-size: 0.82rem; }
    .sh-foot a, .sh-foot button { background: none; border: 0; padding: 0.35rem 0; text-align: left; color: rgba(246, 240, 226, 0.65); font-size: 0.82rem; }
    .sh-foot a:hover, .sh-foot button:hover { color: var(--gold); }
    .sh-main { min-width: 0; }
    .sh-top { display: none; }
    .sh-content { padding: clamp(1.25rem, 3vw, 2.75rem); max-width: 1320px; }
    .sh-scrim { display: none; }

    @media print {
      .sh { display: block; background: none; }
      .sh-side, .sh-top, .sh-scrim { display: none !important; }
      .sh-content { padding: 0; }
    }
    @media (max-width: 900px) {
      .sh { grid-template-columns: 1fr; }
      .sh-side { position: fixed; z-index: 60; left: 0; width: 260px; transform: translateX(-100%); transition: transform 0.35s var(--ease-out); }
      .sh--open .sh-side { transform: none; }
      .sh-scrim { display: block; position: fixed; inset: 0; z-index: 59; background: rgba(10, 31, 28, 0.4); }
      .sh-top { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: var(--white); border-bottom: 1px solid var(--pearl-dark); position: sticky; top: 0; z-index: 10; }
      .sh-top-logo { height: 40px; width: auto; }
      .sh-burger { position: relative; width: 40px; height: 40px; border: 1px solid var(--pearl-dark); border-radius: 8px; background: none; }
      .sh-burger span { position: absolute; left: 11px; right: 11px; height: 1.5px; background: var(--ink); }
      .sh-burger span:first-child { top: 15px; }
      .sh-burger span:last-child { top: 23px; }
    }
  `,
})
export class AdminShell {
  private auth = inject(AuthService);
  private router = inject(Router);
  menuOpen = signal(false);

  readonly links = [
    { path: '/admin', label: 'Overview', exact: true, icon: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
    { path: '/admin/enquiries', label: 'Enquiries', exact: false, icon: 'M4 5h16v11H8l-4 4zM8 9h8M8 12h5' },
    { path: '/admin/quotes', label: 'Costing & quotes', exact: false, icon: 'M7 3h10v18H7zM9.5 7h5M9.5 11h1M13.5 11h1M9.5 15h1M13.5 15h1' },
    { path: '/admin/tours', label: 'Tours', exact: false, icon: 'M3 20l6-14 4 8 3-5 5 11zM14 5a2 2 0 1 0 0-.1' },
    { path: '/admin/destinations', label: 'Destinations', exact: false, icon: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
    { path: '/admin/reviews', label: 'Reviews', exact: false, icon: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z' },
  ];

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.menuOpen.set(false));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}

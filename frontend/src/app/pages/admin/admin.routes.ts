import { Routes } from '@angular/router';
import { AdminShell } from './shell/admin-shell';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShell,
    children: [
      { path: '', loadComponent: () => import('./overview/admin-overview').then((m) => m.AdminOverview) },
      { path: 'enquiries', loadComponent: () => import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent) },
      { path: 'tours', loadComponent: () => import('./tours/admin-tours').then((m) => m.AdminTours) },
      { path: 'tours/new', loadComponent: () => import('./tours/tour-editor').then((m) => m.TourEditor) },
      { path: 'tours/:id', loadComponent: () => import('./tours/tour-editor').then((m) => m.TourEditor) },
      { path: 'destinations', loadComponent: () => import('./destinations/admin-destinations').then((m) => m.AdminDestinations) },
      { path: 'reviews', loadComponent: () => import('./reviews/admin-reviews').then((m) => m.AdminReviews) },
      { path: 'quotes', loadComponent: () => import('./quotes/admin-quotes').then((m) => m.AdminQuotes) },
      { path: 'quotes/new', loadComponent: () => import('./quotes/quote-calculator').then((m) => m.QuoteCalculator) },
      { path: 'quotes/:id', loadComponent: () => import('./quotes/quote-calculator').then((m) => m.QuoteCalculator) },
    ],
  },
];

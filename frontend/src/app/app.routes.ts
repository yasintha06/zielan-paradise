import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { adminGuard } from './guards/admin.guard';

const SUFFIX = ' | Zeilan Paradise';

// The home page ships in the main bundle; every other page loads on demand.
export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Zeilan Paradise | Luxury Tailor-Made Sri Lanka Holidays' },
  { path: 'round-tours', title: 'Round Tours of Sri Lanka' + SUFFIX, loadComponent: () => import('./pages/round-tours/round-tours').then((m) => m.RoundTours) },
  { path: 'day-tours', title: 'Private Day Tours in Sri Lanka' + SUFFIX, loadComponent: () => import('./pages/day-tours/day-tours').then((m) => m.DayTours) },
  { path: 'destinations', title: 'Sri Lanka Destinations' + SUFFIX, loadComponent: () => import('./pages/destinations/destinations').then((m) => m.Destinations) },
  { path: 'tours/:id', title: 'Journey' + SUFFIX, loadComponent: () => import('./pages/tour-detail/tour-detail').then((m) => m.TourDetail) },
  { path: 'tailor-made', title: 'Plan a Tailor-Made Journey' + SUFFIX, loadComponent: () => import('./pages/tailor-made/tailor-made').then((m) => m.TailorMade) },
  { path: 'contact', title: 'Contact Us' + SUFFIX, loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: 'privacy', title: 'Privacy Policy' + SUFFIX, loadComponent: () => import('./pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy) },
  { path: 'terms-and-conditions', title: 'Terms & Conditions' + SUFFIX, loadComponent: () => import('./pages/terms/terms').then((m) => m.Terms) },
  { path: 'admin/login', title: 'Admin' + SUFFIX, loadComponent: () => import('./pages/admin/admin-login/admin-login').then((m) => m.AdminLoginComponent) },
  { path: 'admin', title: 'Admin' + SUFFIX, canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent) },
  { path: '**', title: 'Page not found' + SUFFIX, loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];

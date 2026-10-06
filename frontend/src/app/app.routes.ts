import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { adminGuard } from './guards/admin.guard';

const SUFFIX = ' | Zeilan Paradise';

// The home page ships in the main bundle; every other page loads on demand.
export const routes: Routes = [
  {
    path: '', component: HomeComponent, title: 'Zeilan Paradise | Luxury Tailor-Made Sri Lanka Holidays',
    data: { description: 'Private, tailor-made journeys across Sri Lanka, planned with you from the UK and guided by our own team on the island.' },
  },
  {
    path: 'round-tours', title: 'Sri Lanka Round Tours' + SUFFIX,
    data: { description: 'Private multi-day journeys across Sri Lanka, from the ancient cities to tea country, wildlife and the coast. Every itinerary can be tailored.' },
    loadComponent: () => import('./pages/round-tours/round-tours').then((m) => m.RoundTours),
  },
  {
    path: 'day-tours', title: 'Private Day Tours in Sri Lanka' + SUFFIX,
    data: { description: 'Privately guided day tours in Sri Lanka: leopard safaris, whale watching, Galle Fort, Sigiriya, Kandy and tea country.' },
    loadComponent: () => import('./pages/day-tours/day-tours').then((m) => m.DayTours),
  },
  {
    path: 'destinations', title: 'Sri Lanka Destinations' + SUFFIX,
    data: { description: 'Discover Sri Lanka region by region: Sigiriya, Kandy, Ella, Nuwara Eliya, Yala, Galle, Mirissa, Anuradhapura and Dambulla.' },
    loadComponent: () => import('./pages/destinations/destinations').then((m) => m.Destinations),
  },
  {
    path: 'experiences', title: 'Sri Lanka Experiences' + SUFFIX,
    data: { description: 'Unforgettable experiences to add to your Sri Lanka journey: safaris, cookery with local families, Ayurveda, tea tasting and more.' },
    loadComponent: () => import('./pages/experiences/experiences').then((m) => m.Experiences),
  },
  {
    path: 'tours/:id', data: { dynamicSeo: true },
    loadComponent: () => import('./pages/tour-detail/tour-detail').then((m) => m.TourDetail),
  },
  {
    path: 'tailor-made', title: 'Plan a Tailor-Made Sri Lanka Journey' + SUFFIX,
    data: { description: 'Tell us how you love to travel and we will design a private Sri Lanka journey around you. Three short steps, about two minutes.' },
    loadComponent: () => import('./pages/tailor-made/tailor-made').then((m) => m.TailorMade),
  },
  {
    path: 'about', title: 'About Us' + SUFFIX,
    data: { description: 'A UK-based Sri Lanka specialist with our own team on the island. Private, responsible, tailor-made journeys.' },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'journal', title: 'Sri Lanka Travel Journal' + SUFFIX,
    data: { description: 'Practical guides to planning a Sri Lanka holiday: the best time to visit, two-week routes and tips for UK travellers.' },
    loadComponent: () => import('./pages/journal/journal').then((m) => m.Journal),
  },
  {
    path: 'journal/:slug', data: { dynamicSeo: true },
    loadComponent: () => import('./pages/journal/article').then((m) => m.ArticlePage),
  },
  {
    path: 'contact', title: 'Contact Us' + SUFFIX,
    data: { description: 'Talk to Zeilan Paradise by WhatsApp, phone or email, or send us a message to start planning your Sri Lanka journey.' },
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  { path: 'privacy', title: 'Privacy Policy' + SUFFIX, loadComponent: () => import('./pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy) },
  { path: 'terms-and-conditions', title: 'Terms & Conditions' + SUFFIX, loadComponent: () => import('./pages/terms/terms').then((m) => m.Terms) },
  { path: 'admin/login', title: 'Admin' + SUFFIX, loadComponent: () => import('./pages/admin/admin-login/admin-login').then((m) => m.AdminLoginComponent) },
  {
    path: 'admin', title: 'Admin' + SUFFIX, canActivate: [adminGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', title: 'Page not found' + SUFFIX, loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];

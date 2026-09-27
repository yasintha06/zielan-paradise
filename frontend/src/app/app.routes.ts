import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RoundTours } from './pages/round-tours/round-tours';
import { DayTours } from './pages/day-tours/day-tours';
import { Destinations } from './pages/destinations/destinations';
import { Contact } from './pages/contact/contact';
import { TailorMade } from './pages/tailor-made/tailor-made';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './guards/admin.guard';
import { TourDetail } from './pages/tour-detail/tour-detail';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Terms } from './pages/terms/terms';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'round-tours', component: RoundTours },
  { path: 'day-tours', component: DayTours },
  { path: 'destinations', component: Destinations },
  { path: 'tours/:id', component: TourDetail },
  { path: 'contact', component: Contact },
  { path: 'tailor-made', component: TailorMade },
  { path: 'privacy', component: PrivacyPolicy },
  { path: 'terms-and-conditions', component: Terms },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];

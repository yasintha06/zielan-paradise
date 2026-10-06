import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tour } from './tour.service';
import { Destination } from './destination.service';
import { Review } from './api';

export const LEAD_STATUSES = ['New', 'Contacted', 'Proposal sent', 'Booked', 'Closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  kind: 'planner' | 'contact';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  travelDates: string;
  guests: string;
  message: string;
  trip?: {
    month: string; days: number; adults: number; children: number; stay: string;
    interests: string[]; regions: string[]; pace: string; stage: string;
  };
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Overview {
  enquiries: number;
  enquiriesByStatus: Record<string, number>;
  tours: number;
  activeTours: number;
  destinations: number;
  reviews: number;
  quotes: number;
}

export interface QuoteSummary {
  id: string;
  title: string;
  clientName?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote<T = unknown> extends QuoteSummary {
  data: T;
}

/** Everything behind the admin login. The auth interceptor adds the token to these requests. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/admin`;

  overview(): Observable<Overview> { return this.http.get<Overview>(`${this.api}/overview`); }
  importCatalog(): Observable<{ addedTours: string[]; addedDestinations: string[] }> {
    return this.http.post<{ addedTours: string[]; addedDestinations: string[] }>(`${this.api}/catalog/import`, {});
  }
  images(): Observable<string[]> { return this.http.get<string[]>(`${this.api}/images`); }

  leads(): Observable<Lead[]> { return this.http.get<Lead[]>(`${this.api}/inquiries`); }
  updateLead(id: string, changes: Partial<Pick<Lead, 'status' | 'notes'>>): Observable<Lead> {
    return this.http.patch<Lead>(`${this.api}/inquiries/${encodeURIComponent(id)}`, changes);
  }
  deleteLead(id: string): Observable<unknown> { return this.http.delete(`${this.api}/inquiries/${encodeURIComponent(id)}`); }

  tours(): Observable<Tour[]> { return this.http.get<Tour[]>(`${this.api}/tours`); }
  createTour(tour: Partial<Tour>): Observable<Tour> { return this.http.post<Tour>(`${this.api}/tours`, tour); }
  updateTour(id: string, tour: Partial<Tour>): Observable<Tour> { return this.http.put<Tour>(`${this.api}/tours/${encodeURIComponent(id)}`, tour); }
  deleteTour(id: string): Observable<unknown> { return this.http.delete(`${this.api}/tours/${encodeURIComponent(id)}`); }

  destinations(): Observable<Destination[]> { return this.http.get<Destination[]>(`${this.api}/destinations`); }
  createDestination(d: Partial<Destination>): Observable<Destination> { return this.http.post<Destination>(`${this.api}/destinations`, d); }
  updateDestination(id: string, d: Partial<Destination>): Observable<Destination> {
    return this.http.put<Destination>(`${this.api}/destinations/${encodeURIComponent(id)}`, d);
  }
  deleteDestination(id: string): Observable<unknown> { return this.http.delete(`${this.api}/destinations/${encodeURIComponent(id)}`); }

  reviews(): Observable<Review[]> { return this.http.get<Review[]>(`${this.api}/testimonials`); }
  createReview(r: Partial<Review>): Observable<Review> { return this.http.post<Review>(`${this.api}/testimonials`, r); }
  updateReview(id: string, r: Partial<Review>): Observable<Review> { return this.http.put<Review>(`${this.api}/testimonials/${encodeURIComponent(id)}`, r); }
  deleteReview(id: string): Observable<unknown> { return this.http.delete(`${this.api}/testimonials/${encodeURIComponent(id)}`); }

  quotes(): Observable<QuoteSummary[]> { return this.http.get<QuoteSummary[]>(`${this.api}/quotes`); }
  quote<T>(id: string): Observable<Quote<T>> { return this.http.get<Quote<T>>(`${this.api}/quotes/${encodeURIComponent(id)}`); }
  createQuote<T>(q: { title: string; clientName?: string; status?: string; data: T }): Observable<Quote<T>> {
    return this.http.post<Quote<T>>(`${this.api}/quotes`, q);
  }
  updateQuote<T>(id: string, q: { title?: string; clientName?: string; status?: string; data?: T }): Observable<Quote<T>> {
    return this.http.put<Quote<T>>(`${this.api}/quotes/${encodeURIComponent(id)}`, q);
  }
  deleteQuote(id: string): Observable<unknown> { return this.http.delete(`${this.api}/quotes/${encodeURIComponent(id)}`); }
}

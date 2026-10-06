import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  id: string;
  authorName: string;
  authorLocation?: string;
  text: string;
  rating?: number;
  tripName?: string;
  travelDate?: string;
  source?: string;
  published?: boolean;
}

/** Public (no login) endpoints. Admin endpoints live in AdminService. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /** Published guest reviews; an empty list if there are none or the API is unreachable. */
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/testimonials`).pipe(catchError(() => of([])));
  }

  submitEnquiry(data: object): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/enquiries`, data);
  }

  submitInquiry(data: object): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/inquiries`, data);
  }
}

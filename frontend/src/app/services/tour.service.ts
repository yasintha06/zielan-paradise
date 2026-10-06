import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { DAY_TOURS, ROUND_TOURS } from '../data/catalog';

export interface TourItineraryDay {
  dayNumber?: number | string;
  day?: string;
  drive?: string;
  title: string;
  location?: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

export interface Tour {
  id: string;
  title: string;
  description?: string;
  duration: string;
  bestTime?: string;
  isActive?: boolean;
  sortOrder?: number;
  durationLabel?: string;
  targetAudience?: string;
  guests?: string;
  route?: string;
  category?: string;
  type: 'round' | 'day';
  badge?: {
    text: string;
    class: string;
  };
  image: string;
  price?: number | null;
  pricingType?: string;
  priceType?: string;
  priceDisplay?: string;
  priceTypeFull?: string;
  priceDisplayFull?: string;
  highlights?: string[];
  itinerary?: TourItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  featured?: boolean;
  market?: string;
  startTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = `${environment.apiUrl}/tours`;

  constructor(private http: HttpClient) {}

  /**
   * Strictly fetch all tours or filter by type/category/featured from MongoDB Atlas.
   */
  getTours(type?: 'round' | 'day', category?: string, featured?: boolean): Observable<Tour[]> {
    let url = this.apiUrl;
    const params: string[] = [];

    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (featured !== undefined) params.push(`featured=${featured}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<Tour[]>(url).pipe(
      map((tours) => (tours?.length ? tours : this.fallback(type, category, featured))),
      catchError(() => of(this.fallback(type, category, featured)))
    );
  }

  private fallback(type?: 'round' | 'day', category?: string, featured?: boolean): Tour[] {
    let tours = type === 'round' ? ROUND_TOURS : type === 'day' ? DAY_TOURS : [...ROUND_TOURS, ...DAY_TOURS];
    if (category) tours = tours.filter((t) => t.category === category);
    if (featured) tours = tours.filter((t) => t.featured);
    return tours;
  }

  /**
   * Strictly fetch Round Tours (Multi-day luxury journeys).
   */
  getRoundTours(): Observable<Tour[]> {
    return this.getTours('round');
  }

  /**
   * Strictly fetch Day Tours (Single-day private excursions).
   */
  getDayTours(): Observable<Tour[]> {
    return this.getTours('day');
  }

  /**
   * Fetch a single tour by ID from backend.
   */
  getTourById(id: string): Observable<Tour> {
    const local = [...ROUND_TOURS, ...DAY_TOURS].find((t) => t.id === id);
    return this.http.get<Tour>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => (local ? of(local) : throwError(() => err)))
    );
  }
}

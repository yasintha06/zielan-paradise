import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TourItineraryDay {
  day: number | string;
  title: string;
  location?: string;
  description: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  duration: string;
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

    return this.http.get<Tour[]>(url);
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
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }
}

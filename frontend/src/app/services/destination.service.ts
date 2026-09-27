import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Destination {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  bestFor?: string[];
  region: string;
  imageUrl: string;
  image?: string;
  isActive: boolean;
  featured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = `${environment.apiUrl}/destinations`;

  constructor(private http: HttpClient) {}

  /**
   * Exclusively fetch destinations directly from MongoDB Atlas backend API.
   */
  getDestinations(region?: string, tag?: string): Observable<Destination[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (region) params.push(`region=${encodeURIComponent(region)}`);
    if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<Destination[]>(url);
  }

  /**
   * Retrieve a single destination by ID or slug.
   */
  getDestinationById(id: string): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}`);
  }
}

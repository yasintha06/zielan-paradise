import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFeaturedTours(market: string = 'uk'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tours?featured=true&market=${market}`);
  }

  getRoundTours(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tours?type=round`);
  }

  getDayTours(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tours?type=day`);
  }

  getDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/destinations`);
  }

  getTestimonials(market: string = 'uk'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/testimonials?market=${market}`);
  }

  submitEnquiry(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enquiries`, data);
  }

  getAdminEnquiries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/enquiries`);
  }
}

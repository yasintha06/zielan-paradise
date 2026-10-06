import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'admin_jwt_token';

function readStorage(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: { username: string; password: string }): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((response) => {
        try {
          if (response?.access_token) localStorage.setItem(TOKEN_KEY, response.access_token);
        } catch {}
      })
    );
  }

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  getToken(): string | null {
    return readStorage();
  }

  /** True when a token exists and hasn't expired (the server re-checks every request anyway). */
  isLoggedIn(): boolean {
    const token = readStorage();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Adds the admin token to /api/admin requests, and sends you back to the login if it has expired. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isAdminApi = req.url.includes('/api/admin/') && !req.url.endsWith('/admin/login');
  const token = auth.getToken();

  const request = token && isAdminApi ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isAdminApi && (err.status === 401 || err.status === 422)) {
        auth.logout();
        router.navigate(['/admin/login'], { queryParams: { expired: 1 } });
      }
      return throwError(() => err);
    })
  );
};

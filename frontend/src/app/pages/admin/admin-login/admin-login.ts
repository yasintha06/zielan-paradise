import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  credentials = { username: '', password: '' };

  // Signals so the view always refreshes when the HTTP response arrives.
  isLoading = signal(false);
  errorMessage = signal(this.route.snapshot.queryParamMap.get('expired') ? 'Your session has ended. Please sign in again.' : '');

  onSubmit(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = {
      username: this.credentials.username.trim(),
      password: this.credentials.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 401
            ? 'That username or password is not right. The username is usually "admin".'
            : err.status === 429
              ? 'Too many attempts. Please wait 15 minutes, then try again.'
              : 'Could not reach the server. Please try again in a moment.'
        );
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  enquiries: any[] = [];
  isLoading = true;
  error = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEnquiries();
  }

  fetchEnquiries() {
    this.isLoading = true;
    this.error = '';
    this.apiService.getAdminEnquiries().subscribe({
      next: (data) => {
        this.enquiries = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 401 || err.status === 403 || err.status === 422) {
          // Token expired or invalid
          this.authService.logout();
          this.router.navigate(['/admin/login']);
        } else {
          this.error = 'Failed to load enquiries. Please check backend server connection.';
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}

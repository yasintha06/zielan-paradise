import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScrollRevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  encapsulation: ViewEncapsulation.None
})
export class Contact implements OnInit {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    travelDates: '',
    guests: '',
    interest: '',
    message: ''
  };

  isSubmitted = false;
  isSubmitting = false;

  interestOptions = [
    'Round Tours',
    'Day Tours',
    'Tailor-Made Journey',
    'Honeymoon / Anniversary',
    'Family Holiday',
    'Wellness Retreat',
    'Wildlife Safari',
    'General Enquiry'
  ];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tourId = params['tour'] || '';
      const tourName = params['tourName'] || '';

      if (tourName) {
        this.formData.message = `I am interested in requesting a bespoke proposal for: "${tourName}" (ID: ${tourId}).\n\nPlease provide itinerary customisation options and private chauffeur availability.`;
        if (tourId.startsWith('day-') || tourId.startsWith('dt-')) {
          this.formData.interest = 'Day Tours';
        } else {
          this.formData.interest = 'Round Tours';
        }
      }
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    
    const enquiryPayload = {
      type: 'contact',
      ...this.formData
    };

    this.apiService.submitEnquiry(enquiryPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting enquiry:', err);
        alert('There was an error submitting your enquiry. Please try again.');
      }
    });
  }

  resetForm() {
    this.isSubmitted = false;
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      travelDates: '',
      guests: '',
      interest: '',
      message: ''
    };
  }
}

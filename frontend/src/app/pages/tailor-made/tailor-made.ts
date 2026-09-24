import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-tailor-made',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScrollRevealDirective],
  templateUrl: './tailor-made.html',
  styleUrl: './tailor-made.css',
  encapsulation: ViewEncapsulation.None
})
export class TailorMade {
  currentStep = 1;
  totalSteps = 3;
  isSubmitted = false;
  isSubmitting = false;

  formData = {
    // Step 1 — About You
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2 — Your Journey
    travelDates: '',
    duration: '',
    guests: '',
    budget: '',
    // Step 3 — Your Preferences
    interests: [] as string[],
    accommodation: '',
    pace: '',
    message: ''
  };

  interestOptions = [
    'Cultural Heritage', 'Wildlife Safari', 'Beach & Coast',
    'Tea Highlands', 'Wellness & Ayurveda', 'Adventure & Hiking',
    'Food & Cooking', 'Photography', 'Honeymoon / Romance',
    'Family Activities', 'Train Journeys', 'Luxury Stays'
  ];

  accommodationOptions = [
    'Luxury Boutique Hotels',
    'Heritage & Colonial Properties',
    'Eco Lodges & Tented Camps',
    'Mix of All',
    'No Preference'
  ];

  paceOptions = [
    'Relaxed — fewer stops, more time per place',
    'Moderate — balanced between activity and rest',
    'Active — pack in as much as possible'
  ];

  howItWorks = [
    {
      step: '01',
      title: 'Share Your Vision',
      desc: 'Tell us about your dream trip — your interests, travel style, dates, and budget.'
    },
    {
      step: '02',
      title: 'We Design Your Itinerary',
      desc: 'Our experts handcraft a bespoke itinerary, selecting the best destinations, hotels, and experiences for you.'
    },
    {
      step: '03',
      title: 'Refine Together',
      desc: 'We collaborate with you to perfect every detail until the journey feels exactly right.'
    },
    {
      step: '04',
      title: 'Travel With Confidence',
      desc: 'Enjoy a flawless trip with 24/7 support, a dedicated guide, and every detail taken care of.'
    }
  ];

  toggleInterest(interest: string) {
    const idx = this.formData.interests.indexOf(interest);
    if (idx > -1) {
      this.formData.interests.splice(idx, 1);
    } else {
      this.formData.interests.push(interest);
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.formData.interests.includes(interest);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.isSubmitting = true;
    
    const enquiryPayload = {
      type: 'tailor-made',
      ...this.formData
    };

    this.apiService.submitEnquiry(enquiryPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting enquiry:', err);
        alert('There was an error submitting your tailor-made enquiry. Please try again.');
      }
    });
  }
}

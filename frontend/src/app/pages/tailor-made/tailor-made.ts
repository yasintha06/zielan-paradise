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
  submitError = '';

  // Standardized Mongoose/MongoDB Schema Model
  inquiryData = {
    clientName: {
      firstName: '',
      lastName: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    tripDetails: {
      estimatedMonth: 'October 2026',
      durationDays: 14,
      travelers: {
        adults: 2,
        children: 0
      },
      accommodationStyle: 'Luxury (5-Star & Premium Resorts)'
    },
    preferences: {
      interests: ['Wildlife & Safaris', 'Culture & Heritage'] as string[],
      regions: ['Cultural Triangle', 'Hill Country', 'South Coast'] as string[],
      pace: 'Balanced'
    },
    planningStage: 'Decided on Sri Lanka, need an itinerary',
    additionalNotes: ''
  };

  // Step 1 Options
  availableInterests = [
    { id: 'wildlife', name: 'Wildlife & Safaris', desc: 'Leopards, elephant gatherings & game drives', icon: '🐘' },
    { id: 'culture', name: 'Culture & Heritage', desc: 'UNESCO ancient citadels & sacred temples', icon: '🏛️' },
    { id: 'beaches', name: 'Beaches & Coast', desc: 'Golden shores, whale watching & catamarans', icon: '🌊' },
    { id: 'tea', name: 'Tea Country & Nature', desc: 'Misty plantations, waterfalls & scenic rail', icon: '🍃' },
    { id: 'wellness', name: 'Wellness & Ayurveda', desc: 'Holistic healing retreats & spa indulgence', icon: '🌿' },
    { id: 'gastronomy', name: 'Gastronomy & Spices', desc: 'Fine dining, tea masterclasses & spices', icon: '🌶️' }
  ];

  availableRegions = [
    { id: 'cultural-triangle', name: 'Cultural Triangle', desc: 'Sigiriya, Dambulla, Anuradhapura & Polonnaruwa' },
    { id: 'hill-country', name: 'Hill Country', desc: 'Kandy, Ella, Hatton & Nuwara Eliya' },
    { id: 'south-coast', name: 'South Coast', desc: 'Galle Fort, Mirissa, Weligama & Tangalle' },
    { id: 'east-coast', name: 'East Coast', desc: 'Trincomalee, Passikudah & Arugam Bay' },
    { id: 'national-parks', name: 'National Parks', desc: 'Yala, Wilpattu, Minneriya & Udawalawe' }
  ];

  paceOptions = [
    { value: 'Slow & Relaxed', label: 'Slow & Relaxed', desc: 'Fewer transfers, 3+ nights per stay, maximum downtime & leisure.' },
    { value: 'Balanced', label: 'Balanced (Recommended)', desc: 'The ideal cadence of private sightseeing, scenic journeys & rest.' },
    { value: 'Fast & Action-Packed', label: 'Fast & Action-Packed', desc: 'See everything possible across the island with active daily explorations.' }
  ];

  // Step 2 Options
  monthOptions = [
    'October 2026', 'November 2026', 'December 2026 (Festive)',
    'January 2027', 'February 2027', 'March 2027', 'April 2027 (Easter)',
    'May 2027', 'June 2027', 'July – August 2027 (Summer)', 'Flexible / Exploring Dates'
  ];

  accommodationStyles = [
    {
      value: 'Comfort (4-Star Heritage & Boutique)',
      title: 'Comfort (4-Star)',
      desc: 'Handpicked boutique properties, eco-lodges, and charming heritage hotels with personalized warmth.'
    },
    {
      value: 'Luxury (5-Star & Premium Resorts)',
      title: 'Luxury (5-Star & Premium)',
      desc: 'World-renowned 5-star resorts, historic colonial tea planter’s bungalows, and private oceanfront villas.'
    },
    {
      value: 'Ultra-Luxury & Private Estates',
      title: 'Ultra-Luxury & Private Estates',
      desc: 'Relais & Châteaux retreats, private helicopter transfers, and exclusive full-estate buyouts.'
    }
  ];

  // Step 3 Options
  planningStages = [
    { value: 'Ready to book', label: 'Ready to Book', desc: 'Dates/flights locked in, ready to finalize custom itinerary.' },
    { value: 'Decided on Sri Lanka, need an itinerary', label: 'Decided on Sri Lanka', desc: 'Committed to traveling, seeking expert itinerary curation.' },
    { value: 'Still researching', label: 'Still Researching', desc: 'Exploring possibilities and pricing for an upcoming journey.' }
  ];

  howItWorks = [
    {
      step: '01',
      title: 'Share Your Vision',
      desc: 'Tell us your interests, preferred rhythm, and must-see regions through our consultative designer.'
    },
    {
      step: '02',
      title: 'We Handcraft Your Itinerary',
      desc: 'Our private travel designers curate a day-by-day luxury itinerary tailored to your exact pace.'
    },
    {
      step: '03',
      title: 'Refine With Your Concierge',
      desc: 'We adjust hotels, private guides, and exclusive experiences until every detail is perfection.'
    },
    {
      step: '04',
      title: 'Seamless Private Travel',
      desc: 'Enjoy your chauffeured journey with 24/7 dedicated concierge care across Sri Lanka.'
    }
  ];

  constructor(private apiService: ApiService) {}

  toggleInterest(name: string): void {
    const list = this.inquiryData.preferences.interests;
    const idx = list.indexOf(name);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(name);
    }
  }

  isInterestSelected(name: string): boolean {
    return this.inquiryData.preferences.interests.includes(name);
  }

  toggleRegion(name: string): void {
    const list = this.inquiryData.preferences.regions;
    const idx = list.indexOf(name);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(name);
    }
  }

  isRegionSelected(name: string): boolean {
    return this.inquiryData.preferences.regions.includes(name);
  }

  nextStep(): void {
    this.submitError = '';
    if (this.currentStep === 1) {
      if (this.inquiryData.preferences.interests.length === 0) {
        this.submitError = 'Please select at least one travel interest to help us design your journey.';
        return;
      }
      if (this.inquiryData.preferences.regions.length === 0) {
        this.submitError = 'Please select at least one preferred region to visit.';
        return;
      }
    }
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.scrollToTop();
    }
  }

  prevStep(): void {
    this.submitError = '';
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    const el = document.getElementById('tm-designer-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    this.submitError = '';

    const fn = this.inquiryData.clientName.firstName.trim();
    const ln = this.inquiryData.clientName.lastName.trim();
    const em = this.inquiryData.contact.email.trim();

    if (!fn || !ln || !em) {
      this.submitError = 'Please provide your first name, last name, and email address.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      clientName: {
        firstName: fn,
        lastName: ln
      },
      contact: {
        email: em,
        phone: this.inquiryData.contact.phone.trim()
      },
      tripDetails: {
        estimatedMonth: this.inquiryData.tripDetails.estimatedMonth,
        durationDays: Number(this.inquiryData.tripDetails.durationDays) || 14,
        travelers: {
          adults: Number(this.inquiryData.tripDetails.travelers.adults) || 2,
          children: Number(this.inquiryData.tripDetails.travelers.children) || 0
        },
        accommodationStyle: this.inquiryData.tripDetails.accommodationStyle
      },
      preferences: {
        interests: this.inquiryData.preferences.interests,
        regions: this.inquiryData.preferences.regions,
        pace: this.inquiryData.preferences.pace
      },
      planningStage: this.inquiryData.planningStage,
      additionalNotes: this.inquiryData.additionalNotes.trim(),
      status: 'New Lead',
      submittedAt: new Date().toISOString()
    };

    this.apiService.submitInquiry(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.scrollToTop();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting tailor-made inquiry:', err);
        // Fallback gracefully so user gets a reassuring response
        this.isSubmitted = true;
        this.scrollToTop();
      }
    });
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.currentStep = 1;
    this.inquiryData = {
      clientName: { firstName: '', lastName: '' },
      contact: { email: '', phone: '' },
      tripDetails: {
        estimatedMonth: 'October 2026',
        durationDays: 14,
        travelers: { adults: 2, children: 0 },
        accommodationStyle: 'Luxury (5-Star & Premium Resorts)'
      },
      preferences: {
        interests: ['Wildlife & Safaris', 'Culture & Heritage'],
        regions: ['Cultural Triangle', 'Hill Country', 'South Coast'],
        pace: 'Balanced'
      },
      planningStage: 'Decided on Sri Lanka, need an itinerary',
      additionalNotes: ''
    };
  }
}

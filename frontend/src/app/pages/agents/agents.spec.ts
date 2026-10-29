import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Type } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from '../../services/api';
import { TourService } from '../../services/tour.service';

describe('Agents page', () => {
  let sent: Record<string, unknown>[];
  let Agents: Type<any>;
  let MotionService: Type<any>;

  beforeAll(async () => {
    // The animation library (GSAP) needs matchMedia, which the test browser doesn't provide.
    window.matchMedia ??= ((query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    // Scroll-reveal uses IntersectionObserver, also missing in the test browser.
    (window as any).IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} };
    ({ MotionService } = await import('../../services/motion.service'));
    ({ Agents } = await import('./agents'));
  });

  function create() {
    sent = [];
    TestBed.configureTestingModule({
      imports: [Agents],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { submitEnquiry: (data: Record<string, unknown>) => { sent.push(data); return of({}); } } },
        { provide: TourService, useValue: { getRoundTours: () => of([]), getDayTours: () => of([]) } },
        { provide: MotionService, useValue: { reducedMotion: true, introDone: Promise.resolve(), scrollTo: () => {} } },
      ],
    });
    const fixture = TestBed.createComponent(Agents);
    fixture.detectChanges();
    return fixture;
  }

  it('sends an agent enquiry with the company and the spam trap field', () => {
    const page = create().componentInstance;
    page.form = { name: 'Sam Agent', company: 'Example Travel', email: 'sam@agency.example', phone: '', message: 'February' };
    page.submit();
    expect(sent).toEqual([{
      type: 'agent', firstName: 'Sam Agent', company: 'Example Travel', email: 'sam@agency.example',
      phone: '', message: 'February', website: '',
    }]);
    expect(page.submitted()).toBe(true);
  });

  it('asks for the company before sending', () => {
    const page = create().componentInstance;
    page.form = { name: 'Sam', company: '', email: 'sam@agency.example', phone: '', message: '' };
    page.submit();
    expect(sent).toEqual([]);
    expect(page.error()).toContain('company');
  });

  it('keeps unconfirmed facts and the sample PDF hidden', () => {
    const fixture = create();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('commission');
    expect(text).not.toContain('How quickly');
    expect(text).not.toContain('Download sample itinerary');
    expect(text).toContain('Yasintha Agampodi');
  });
});

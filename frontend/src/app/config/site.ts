/**
 * Single source of truth for business contact details.
 * Change them here and every page (navbar, footer, CTAs) updates.
 */
export const SITE = {
  name: 'Zeilan Paradise',
  phoneDisplay: '+44 7818 792995',
  phoneHref: 'tel:+447818792995',
  whatsappHref: 'https://wa.me/447818792995',
  email: 'info@zeilanparadise.com',
  locations: 'United Kingdom · Sri Lanka',
  socials: {
    instagram: '',
    facebook: '',
  },
} as const;

/**
 * Company and trust details. An empty value is a TODO: whatever uses it stays hidden on the site
 * until the real fact is filled in here (never guess these).
 */
export const BUSINESS = {
  company: 'Zeilan Paradise (Pvt) Ltd',
  /** TODO: company registration number. */
  registrationNumber: '',
  founder: {
    name: 'Yasintha Agampodi',
    role: 'Founder and Director',
    /** TODO: photo path, e.g. 'img/founder-yasintha-900.webp'. */
    photo: '',
  },
  /** TODO: Sri Lanka office address. */
  sriLankaOffice: '',
} as const;

/** Travel agent page settings. Empty values are TODOs and stay hidden until confirmed. */
export const AGENTS = {
  /** TODO: e.g. 'We reply to agent enquiries within one working day.' */
  responseTime: '',
  /** TODO: how rates are quoted to agents (net rates, validity, currency). */
  ratesPolicy: '',
  /** TODO: commission policy. */
  commission: '',
  /** Drop a PDF at this path (frontend/public/files/...) and the download button appears by itself. */
  samplePdf: 'files/zeilan-sample-itinerary.pdf',
} as const;

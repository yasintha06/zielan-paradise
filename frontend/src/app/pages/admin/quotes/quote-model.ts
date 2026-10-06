/** Costing model, following the ATFL Lesson 3 method: transport + accommodation + meals + entrance + extras, then markup. */
export type Currency = 'GBP' | 'USD' | 'LKR';

export interface DayLeg { label: string; km: number; }
export interface HotelLine { name: string; nights: number; rooms: number; rate: number; currency: Currency; meal: string; supplements: number; }
export interface ActivityLine { name: string; perPerson: number; currency: Currency; included: boolean; }
export interface MealLine { name: string; count: number; perPerson: number; currency: Currency; }
export interface ExtraLine { name: string; amount: number; currency: Currency; }

export interface QuoteData {
  travelDates: string;
  adults: number;
  children: number;
  rates: { lkrPerGbp: number; usdPerGbp: number };
  transport: {
    vehicle: string; ratePerKm: number; legs: DayLeg[]; minKmPerDay: boolean;
    guideFeePerDay: number; guideNights: number; guideAccomPerNight: number; extras: number;
  };
  hotels: HotelLine[];
  activities: ActivityLine[];
  meals: MealLine[];
  extras: ExtraLine[];
  markupPct: number;
  notes: string;
}

/** Indicative industry rates from the course notes (LKR per km). Always check your current supplier rates. */
export const VEHICLES = [
  { name: 'Car (1–2 guests)', ratePerKm: 90, maxPax: 2 },
  { name: 'Micro van, flat roof (up to 5)', ratePerKm: 120, maxPax: 5 },
  { name: 'Van, high roof (up to 9)', ratePerKm: 140, maxPax: 9 },
  { name: 'Mini coach (up to 12)', ratePerKm: 170, maxPax: 12 },
  { name: '33-seat coach', ratePerKm: 230, maxPax: 30 },
];

export const MIN_KM_PER_DAY = 80;

export function blankQuote(): QuoteData {
  return {
    travelDates: '',
    adults: 2,
    children: 0,
    rates: { lkrPerGbp: 400, usdPerGbp: 1.3 },
    transport: {
      vehicle: VEHICLES[0].name, ratePerKm: VEHICLES[0].ratePerKm,
      legs: [{ label: 'Day 1', km: 35 }], minKmPerDay: true,
      guideFeePerDay: 4000, guideNights: 0, guideAccomPerNight: 3000, extras: 5000,
    },
    hotels: [],
    activities: [],
    meals: [],
    extras: [],
    markupPct: 20,
    notes: '',
  };
}

export function toGbp(amount: number, currency: Currency, rates: QuoteData['rates']): number {
  const a = Number(amount) || 0;
  if (currency === 'GBP') return a;
  if (currency === 'USD') return a / (Number(rates.usdPerGbp) || 1);
  return a / (Number(rates.lkrPerGbp) || 1);
}

export interface Totals {
  pax: number;
  km: number;
  transportLkr: number;
  transport: number;
  hotels: number;
  activities: number;
  meals: number;
  extras: number;
  cost: number;
  sell: number;
  profit: number;
  marginPct: number;
  perPerson: number;
  excludedPerPerson: { name: string; amount: number }[];
}

export function calculate(q: QuoteData): Totals {
  const r = q.rates;
  const pax = Math.max(1, (Number(q.adults) || 0) + (Number(q.children) || 0));
  const t = q.transport;
  const km = t.legs.reduce((sum, l) => sum + Math.max(Number(l.km) || 0, t.minKmPerDay ? MIN_KM_PER_DAY : 0), 0);
  const days = t.legs.length;
  const transportLkr =
    km * (Number(t.ratePerKm) || 0) +
    days * (Number(t.guideFeePerDay) || 0) +
    (Number(t.guideNights) || 0) * (Number(t.guideAccomPerNight) || 0) +
    (Number(t.extras) || 0);
  const transport = toGbp(transportLkr, 'LKR', r);
  const hotels = q.hotels.reduce(
    (s, h) => s + toGbp((Number(h.nights) || 0) * (Number(h.rooms) || 0) * (Number(h.rate) || 0) + (Number(h.supplements) || 0), h.currency, r), 0);
  const activities = q.activities.filter((a) => a.included).reduce((s, a) => s + toGbp((Number(a.perPerson) || 0) * pax, a.currency, r), 0);
  const meals = q.meals.reduce((s, m) => s + toGbp((Number(m.count) || 0) * (Number(m.perPerson) || 0) * pax, m.currency, r), 0);
  const extras = q.extras.reduce((s, e) => s + toGbp(Number(e.amount) || 0, e.currency, r), 0);
  const cost = transport + hotels + activities + meals + extras;
  const sell = cost * (1 + (Number(q.markupPct) || 0) / 100);
  const profit = sell - cost;
  return {
    pax, km, transportLkr, transport, hotels, activities, meals, extras, cost, sell, profit,
    marginPct: sell > 0 ? (profit / sell) * 100 : 0,
    perPerson: sell / pax,
    excludedPerPerson: q.activities.filter((a) => !a.included && a.name).map((a) => ({ name: a.name, amount: toGbp(a.perPerson, a.currency, r) })),
  };
}

/** Pull "165 km" style distances out of an itinerary's drive notes. */
export function kmFromDrive(drive?: string): number {
  const m = (drive ?? '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*km/i);
  return m ? Math.round(Number(m[1])) : 0;
}

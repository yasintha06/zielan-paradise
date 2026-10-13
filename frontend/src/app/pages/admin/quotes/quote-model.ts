/**
 * Costing model, following the ATFL course method (Lessons 3 and 5 and the costing workbooks):
 * transport + accommodation + entrance + meals + extras, then markup, priced per person sharing a double room,
 * with a single supplement, a triple reduction and child rates (40% with an extra bed, 25% without).
 */
export type Currency = 'GBP' | 'USD' | 'LKR';

export interface DayLeg { label: string; km: number; }
/** Rates are per room per night. Legacy quotes stored a single `rate` with a room count. */
export interface HotelLine {
  name: string; nights: number; currency: Currency; meal: string; supplements: number;
  sgl: number; dbl: number; tpl: number;
  rate?: number; rooms?: number;
}
export interface ActivityLine { name: string; perPerson: number; currency: Currency; included: boolean; }
export interface MealLine { name: string; count: number; perPerson: number; currency: Currency; }
export interface ExtraLine { name: string; amount: number; currency: Currency; }
export interface RoomMix { sgl: number; dbl: number; tpl: number; childWithBed: number; childNoBed: number; }

export interface QuoteData {
  travelDates: string;
  /** Derived from `rooms`; kept so older quotes still open. */
  adults: number;
  children: number;
  rooms: RoomMix;
  rates: { lkrPerGbp: number; usdPerGbp: number };
  transport: {
    vehicle: string; ratePerKm: number; legs: DayLeg[]; minKmPerDay: boolean;
    guideFeePerDay: number; guideNights: number; guideAccomPerNight: number;
    driverFeePerDay: number; driverNights: number; driverAccomPerNight: number;
    extras: number; vatPct: number;
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
  { name: '33-seat coach (up to 30)', ratePerKm: 230, maxPax: 30 },
  { name: '37-seat coach (up to 35)', ratePerKm: 230, maxPax: 35 },
  { name: '45-seat coach (up to 40)', ratePerKm: 330, maxPax: 40 },
  { name: '50-seat coach (up to 45)', ratePerKm: 350, maxPax: 45 },
];

export const MIN_KM_PER_DAY = 80;
export const MIN_MARKUP_PCT = 10;
/** Children sharing with parents pay this share of the per-person double price (course workbook). */
export const CHILD_WITH_BED = 0.4;
export const CHILD_NO_BED = 0.25;
/** Group sizes shown in the price-by-group-size table, as in the course workbook. */
export const SLABS = [2, 4, 6, 8, 10, 12];

export function blankQuote(): QuoteData {
  return {
    travelDates: '',
    adults: 2,
    children: 0,
    rooms: { sgl: 0, dbl: 1, tpl: 0, childWithBed: 0, childNoBed: 0 },
    rates: { lkrPerGbp: 400, usdPerGbp: 1.3 },
    transport: {
      vehicle: VEHICLES[0].name, ratePerKm: VEHICLES[0].ratePerKm,
      legs: [{ label: 'Day 1', km: 35 }], minKmPerDay: true,
      guideFeePerDay: 4000, guideNights: 0, guideAccomPerNight: 3000,
      driverFeePerDay: 0, driverNights: 0, driverAccomPerNight: 4000,
      extras: 5000, vatPct: 0,
    },
    hotels: [],
    activities: [],
    meals: [],
    extras: [],
    markupPct: 20,
    notes: '',
  };
}

const n = (v: unknown) => Number(v) || 0;

/** Bring a saved quote up to the current shape (older quotes had adults/children and one rate per hotel). */
export function normaliseQuote(saved: Partial<QuoteData>): QuoteData {
  const base = blankQuote();
  const q: QuoteData = {
    ...base, ...saved,
    rates: { ...base.rates, ...saved.rates },
    transport: { ...base.transport, ...saved.transport },
  } as QuoteData;
  if (!saved.rooms) {
    const adults = Math.max(1, n(saved.adults ?? 2));
    q.rooms = { sgl: adults % 2, dbl: Math.floor(adults / 2), tpl: 0, childWithBed: 0, childNoBed: n(saved.children) };
  }
  q.hotels = (q.hotels ?? []).map((h) => {
    if (h.dbl !== undefined) return h;
    const rate = n(h.rate);
    return { ...h, sgl: rate, dbl: rate, tpl: 0 };
  });
  return q;
}

export function toGbp(amount: number, currency: Currency, rates: QuoteData['rates']): number {
  const a = n(amount);
  if (currency === 'GBP') return a;
  if (currency === 'USD') return a / (n(rates.usdPerGbp) || 1);
  return a / (n(rates.lkrPerGbp) || 1);
}

export function vehicleFor(pax: number) {
  return VEHICLES.find((v) => pax <= v.maxPax) ?? VEHICLES[VEHICLES.length - 1];
}

export interface Totals {
  adults: number;
  children: number;
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
  /** Selling price per person sharing a double room. */
  perPerson: number;
  singleSupplement: number;
  tripleReduction: number;
  childWithBed: number;
  childNoBed: number;
  excludedPerPerson: { name: string; amount: number }[];
}

export function calculate(quote: QuoteData): Totals {
  const q = normaliseQuote(quote);
  const r = q.rates;
  const rm = q.rooms;
  const adults = n(rm.sgl) + 2 * n(rm.dbl) + 3 * n(rm.tpl);
  const children = n(rm.childWithBed) + n(rm.childNoBed);
  const pax = Math.max(1, adults + children);

  // 1. Transport (LKR): mileage, guide, driver and helper, their rooms, other costs, VAT.
  const t = q.transport;
  const km = t.legs.reduce((sum, l) => sum + Math.max(n(l.km), t.minKmPerDay ? MIN_KM_PER_DAY : 0), 0);
  const days = t.legs.length;
  const transportLkr =
    (km * n(t.ratePerKm) +
      days * n(t.guideFeePerDay) + n(t.guideNights) * n(t.guideAccomPerNight) +
      days * n(t.driverFeePerDay) + n(t.driverNights) * n(t.driverAccomPerNight) +
      n(t.extras)) * (1 + n(t.vatPct) / 100);
  const transport = toGbp(transportLkr, 'LKR', r);

  // 2. Accommodation: per person sharing a double, single supplement and triple reduction, all per stay.
  let dblShare = 0, singleSup = 0, tripleRed = 0, hotels = 0, hotelSupps = 0;
  for (const h of q.hotels) {
    const nights = n(h.nights);
    const g = (v: number) => toGbp(v, h.currency, r);
    const dbl = n(h.dbl);
    const sgl = n(h.sgl) || dbl;
    const tpl = n(h.tpl);
    dblShare += g(nights * dbl / 2);
    singleSup += g(nights * (sgl - dbl / 2));
    if (tpl) tripleRed += g(nights * (dbl / 2 - tpl / 3));
    hotels += g(nights * (n(rm.sgl) * sgl + n(rm.dbl) * dbl + n(rm.tpl) * (tpl || dbl * 1.5)));
    hotelSupps += g(n(h.supplements));
  }
  hotels += hotelSupps;

  // 3. Entrance fees, meals and extras.
  const activitiesPP = q.activities.filter((a) => a.included).reduce((s, a) => s + toGbp(a.perPerson, a.currency, r), 0);
  const mealsPP = q.meals.reduce((s, m) => s + toGbp(n(m.count) * n(m.perPerson), m.currency, r), 0);
  const extras = q.extras.reduce((s, e) => s + toGbp(e.amount, e.currency, r), 0);
  const activities = activitiesPP * pax;
  const meals = mealsPP * pax;

  // 4. Cost per person sharing, then markup. Supplements and reductions are applied at the end, as in the course.
  const costPP = transport / pax + dblShare + hotelSupps / pax + activitiesPP + mealsPP + extras / pax;
  const markup = 1 + n(q.markupPct) / 100;
  const perPerson = costPP * markup;
  const childWithBed = perPerson * CHILD_WITH_BED;
  const childNoBed = perPerson * CHILD_NO_BED;

  const sell = adults === 0 && children === 0 ? 0 :
    2 * n(rm.dbl) * perPerson +
    n(rm.sgl) * (perPerson + singleSup) +
    3 * n(rm.tpl) * (perPerson - tripleRed) +
    n(rm.childWithBed) * childWithBed +
    n(rm.childNoBed) * childNoBed;
  const cost = transport + hotels + activities + meals + extras;
  const profit = sell - cost;

  return {
    adults, children, pax, km, transportLkr, transport, hotels, activities, meals, extras, cost, sell, profit,
    marginPct: sell > 0 ? (profit / sell) * 100 : 0,
    perPerson, singleSupplement: singleSup, tripleReduction: tripleRed, childWithBed, childNoBed,
    excludedPerPerson: q.activities.filter((a) => !a.included && a.name).map((a) => ({ name: a.name, amount: toGbp(a.perPerson, a.currency, r) })),
  };
}

/** Per-person sharing price for different group sizes, using the right vehicle for each (course workbook layout). */
export function priceBySlab(quote: QuoteData, sizes = SLABS): { pax: number; vehicle: string; perPerson: number }[] {
  const q = normaliseQuote(quote);
  return sizes.map((size) => {
    const v = vehicleFor(size);
    const copy: QuoteData = {
      ...q,
      rooms: { sgl: size % 2, dbl: Math.floor(size / 2), tpl: 0, childWithBed: 0, childNoBed: 0 },
      transport: { ...q.transport, vehicle: v.name, ratePerKm: v.ratePerKm },
    };
    return { pax: size, vehicle: v.name, perPerson: calculate(copy).perPerson };
  });
}

/** Pull "165 km" style distances out of an itinerary's drive notes. */
export function kmFromDrive(drive?: string): number {
  const m = (drive ?? '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*km/i);
  return m ? Math.round(Number(m[1])) : 0;
}

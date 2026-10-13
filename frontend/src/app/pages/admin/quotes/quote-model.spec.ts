import { HotelLine, QuoteData, blankQuote, calculate, kmFromDrive, normaliseQuote, priceBySlab, toGbp } from './quote-model';

describe('quote costing', () => {
  it('reproduces the transport example from the course (Lesson 3)', () => {
    // 820 km by car at LKR 90/km, chauffeur LKR 4,000 x 6 days, LKR 5,000 other costs = LKR 102,800.
    const q = blankQuote();
    q.adults = 2;
    q.rates.lkrPerGbp = 300; // the course divides by 300 to convert
    q.transport.ratePerKm = 90;
    q.transport.minKmPerDay = false;
    q.transport.legs = [160, 80, 110, 250, 140, 80].map((km, i) => ({ label: `Day ${i + 1}`, km }));
    q.transport.guideFeePerDay = 4000;
    q.transport.guideNights = 0;
    q.transport.extras = 5000;
    q.markupPct = 0;

    const t = calculate(q);
    expect(t.km).toBe(820);
    expect(t.transportLkr).toBe(102800);
    expect(t.perPerson).toBeCloseTo(171.33, 2); // the course rounds this to $170
  });

  it('applies the 80 km minimum per day when enabled', () => {
    const q = blankQuote();
    q.transport.legs = [{ label: 'Day 1', km: 20 }, { label: 'Day 2', km: 150 }];
    q.transport.minKmPerDay = true;
    expect(calculate(q).km).toBe(230);
    q.transport.minKmPerDay = false;
    expect(calculate(q).km).toBe(170);
  });

  it('prices hotels per room per night with supplements, converting currencies', () => {
    const q = blankQuote();
    q.transport.legs = [];
    q.transport.extras = 0;
    q.rates.usdPerGbp = 1.25;
    q.hotels = [{ name: 'Heritance Kandalama', nights: 4, currency: 'USD', meal: 'BB', supplements: 250, sgl: 283, dbl: 283, tpl: 0 }];
    q.markupPct = 0;
    expect(calculate(q).hotels).toBeCloseTo((4 * 283 + 250) / 1.25, 6);
  });

  it('keeps excluded entrance fees out of the price but lists them per person', () => {
    const q = blankQuote();
    q.transport.legs = [];
    q.transport.extras = 0;
    q.activities = [
      { name: 'Sigiriya', perPerson: 30, currency: 'USD', included: false },
      { name: 'Train ride', perPerson: 10, currency: 'GBP', included: true },
    ];
    q.markupPct = 0;
    const t = calculate(q);
    expect(t.activities).toBe(20); // £10 x 2 guests
    expect(t.excludedPerPerson.map((x) => x.name)).toEqual(['Sigiriya']);
  });

  it('adds markup and reports margin', () => {
    const q = blankQuote();
    q.transport.legs = [];
    q.transport.extras = 0;
    q.extras = [{ name: 'Gift', amount: 100, currency: 'GBP' }];
    q.markupPct = 25;
    const t = calculate(q);
    expect(t.sell).toBe(125);
    expect(t.profit).toBe(25);
    expect(t.marginPct).toBe(20);
  });

  it('reproduces the 12-passenger transport example from Lesson 5', () => {
    // 820 km by mini coach at LKR 170, national guide 6,000 x 6 days + LKR 30,000 rooms,
    // driver + helper 4,000 x 6 days, others 10,000 = LKR 239,400; / 12 / 300 = $66.50 per person.
    const q = blankQuote();
    q.rooms = { sgl: 0, dbl: 6, tpl: 0, childWithBed: 0, childNoBed: 0 };
    q.rates.lkrPerGbp = 300;
    q.transport = {
      ...q.transport, ratePerKm: 170, minKmPerDay: false,
      legs: [160, 80, 110, 250, 140, 80].map((km, i) => ({ label: `Day ${i + 1}`, km })),
      guideFeePerDay: 6000, guideNights: 1, guideAccomPerNight: 30000,
      driverFeePerDay: 4000, driverNights: 0, extras: 10000,
    };
    q.markupPct = 0;
    const t = calculate(q);
    expect(t.transportLkr).toBe(239400);
    expect(t.transport / t.pax).toBeCloseTo(66.5, 2);
  });

  it('reproduces the 3-star costing workbook: $468.24 sharing, children at 40% and 25%', () => {
    const q = blankQuote();
    q.rates.lkrPerGbp = 321; // the workbook's USD rate; "GBP" here stands for the workbook's dollars
    q.transport = {
      ...q.transport, ratePerKm: 110, minKmPerDay: false,
      legs: [160, 80, 110, 250, 140, 80].map((km, i) => ({ label: `Day ${i + 1}`, km })),
      guideFeePerDay: 2000, driverFeePerDay: 2000, extras: 5000,
    };
    q.hotels = [60, 50, 40, 80, 70].map((dbl, i) => ({ name: `Hotel ${i + 1}`, nights: 1, currency: 'GBP' as const, meal: 'HB', supplements: 0, sgl: 0, dbl, tpl: 0 }));
    q.activities = [11, 8, 11, 10].map((perPerson, i) => ({ name: `Sight ${i}`, perPerson, currency: 'GBP' as const, included: true }));
    q.meals = [{ name: 'Lunch', count: 5, perPerson: 10, currency: 'GBP' }];
    q.markupPct = 10;
    const t = calculate(q);
    expect(t.transportLkr).toBe(119200);
    expect(t.perPerson).toBeCloseTo(468.24, 1);
    expect(t.childWithBed).toBeCloseTo(187.29, 1);
    expect(t.childNoBed).toBeCloseTo(117.06, 1);
  });

  it('works out the single supplement and triple reduction from room rates (4-star workbook)', () => {
    const q = blankQuote();
    q.transport.legs = [];
    q.transport.extras = 0;
    q.hotels = [[50, 60, 70], [256, 301, 406], [70, 80, 90], [90, 100, 120], [100, 120, 130]]
      .map(([sgl, dbl, tpl]) => ({ name: '', nights: 1, currency: 'GBP' as const, meal: 'BB', supplements: 0, sgl, dbl, tpl }));
    q.markupPct = 0;
    const t = calculate(q);
    expect(t.perPerson).toBeCloseTo(330.5, 6);
    expect(t.singleSupplement).toBeCloseTo(235.5, 6);
    expect(t.tripleReduction).toBeCloseTo(58.5, 6);
  });

  it('prices a mixed group: 3 doubles, 3 triples and 2 singles', () => {
    const q = blankQuote();
    q.transport.legs = [];
    q.transport.extras = 0;
    q.rooms = { sgl: 2, dbl: 3, tpl: 3, childWithBed: 0, childNoBed: 0 };
    q.hotels = [{ name: '', nights: 2, currency: 'GBP', meal: 'BB', supplements: 0, sgl: 80, dbl: 100, tpl: 120 }];
    q.markupPct = 0;
    const t = calculate(q);
    expect(t.adults).toBe(17);
    // Hotel bill: 2 nights x (2 x 80 + 3 x 100 + 3 x 120) = 1,640, and the group pays exactly that at 0% markup.
    expect(t.hotels).toBe(1640);
    expect(t.sell).toBeCloseTo(1640, 6);
  });

  it('opens older quotes saved with adults and a single hotel rate', () => {
    const old = { ...blankQuote(), adults: 3, children: 1 } as Partial<QuoteData>;
    delete old.rooms;
    old.hotels = [{ name: 'Old', nights: 2, rooms: 2, rate: 100, currency: 'GBP', meal: 'BB', supplements: 0 } as HotelLine];
    const q = normaliseQuote(old);
    expect(q.rooms).toEqual({ sgl: 1, dbl: 1, tpl: 0, childWithBed: 0, childNoBed: 1 });
    expect(q.hotels[0].dbl).toBe(100);
  });

  it('prices by group size with the right vehicle for each', () => {
    const q = blankQuote();
    q.transport.minKmPerDay = false;
    q.transport.legs = [{ label: 'Day 1', km: 100 }];
    q.transport.guideFeePerDay = 0;
    q.transport.extras = 0;
    q.rates.lkrPerGbp = 100;
    q.markupPct = 0;
    const slabs = priceBySlab(q, [2, 10]);
    expect(slabs[0].perPerson).toBeCloseTo((100 * 90) / 100 / 2, 6); // car
    expect(slabs[1].vehicle).toContain('Mini coach');
    expect(slabs[1].perPerson).toBeCloseTo((100 * 170) / 100 / 10, 6); // 10 guests need the mini coach
  });

  it('reads distances from itinerary drive notes', () => {
    expect(kmFromDrive('4 hrs · 165 km')).toBe(165);
    expect(kmFromDrive('Train 3 hrs + drive 3 hrs')).toBe(0);
    expect(kmFromDrive(undefined)).toBe(0);
    expect(toGbp(400, 'LKR', { lkrPerGbp: 400, usdPerGbp: 1.3 })).toBe(1);
  });
});

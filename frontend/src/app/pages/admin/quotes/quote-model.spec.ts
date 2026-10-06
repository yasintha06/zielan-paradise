import { blankQuote, calculate, kmFromDrive, toGbp } from './quote-model';

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
    q.hotels = [{ name: 'Heritance Kandalama', nights: 4, rooms: 1, rate: 283, currency: 'USD', meal: 'BB', supplements: 250 }];
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

  it('reads distances from itinerary drive notes', () => {
    expect(kmFromDrive('4 hrs · 165 km')).toBe(165);
    expect(kmFromDrive('Train 3 hrs + drive 3 hrs')).toBe(0);
    expect(kmFromDrive(undefined)).toBe(0);
    expect(toGbp(400, 'LKR', { lkrPerGbp: 400, usdPerGbp: 1.3 })).toBe(1);
  });
});

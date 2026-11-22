// Every person here is fictional sample data for the demo.

let n = 0
const id = (p) => `${p}${++n}`

// International result, shown as a passport stamp
const stamp = (event, city, country, cc, date, result, medal, mark, verifiedBy) =>
  ({ id: id('s'), event, city, country, cc, date, result, medal, mark, verifiedBy })

// Domestic result. source: 'published' (federation results feed), 'cosigned' (coach), 'self'
const res = (event, level, date, result, medal, mark, verifiedBy, source = 'published', ageGroup = '') =>
  ({ id: id('r'), event, level, date, result, medal, mark, verifiedBy, source, ageGroup })

const cert = (form, level, issuer, forEvent, status = 'Issued') => ({ id: id('c'), form, level, issuer, forEvent, status })

export const LEVELS = ['International', 'National', 'Khelo India', 'State', 'University', 'School', 'District']

// ───────────────────────── Athletes ─────────────────────────
const athletes = [
  {
    id: 'meera', name: 'Meera Iyer', gender: 'F', dob: '2005-06-14', age: 21,
    sport: 'Para Swimming', events: ['100m Butterfly', '400m Freestyle', '100m Freestyle'], para: true,
    classification: { cls: 'S9', status: 'Review', reviewYear: 2027, sdms: '38211', impairment: 'Physical (below-knee limb deficiency)', last: 'WPS World Series, Berlin, Apr 2025' },
    city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', represents: 'Karnataka', club: 'LaneSix Aquatics, Bengaluru',
    ids: [
      { label: 'SFI UID', value: 'KA-SW-24-04417', season: '2026-27', valid: true, issuer: 'sfi' },
      { label: 'Khelo India ID', value: 'KI-2023-118204', valid: true, issuer: 'khelo' },
      { label: 'WPS SDMS ID', value: '38211', valid: true, issuer: 'pci' },
    ],
    dobVerified: { by: 'ksa', doc: 'Birth certificate (registered within one year of birth)' },
    schemes: ['Khelo India Athlete (para swimming)'],
    stamps: [
      stamp('Asian Para Swimming Open', 'Bangkok', 'Thailand', 'TH', '2025-11-20', 'Bronze, 100m Butterfly S9', 'bronze', '1:09.95', 'pci'),
      stamp('WPS World Series', 'Berlin', 'Germany', 'DE', '2025-04-12', '5th, 100m Butterfly S9', null, '1:10.88', 'pci'),
      stamp('Para Swimming Youth Open', 'Dubai', 'UAE', 'AE', '2024-12-08', 'Silver, 400m Freestyle S9', 'silver', '5:02.40', 'pci'),
    ],
    results: [
      res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-12', 'Gold, 100m Butterfly S9', 'gold', '1:08.42', 'pci', 'published', 'Senior'),
      res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-13', 'Silver, 400m Freestyle S9', 'silver', '4:51.10', 'pci', 'published', 'Senior'),
      res('Khelo India Para Games 2025, New Delhi', 'Khelo India', '2025-12-14', 'Gold, 100m Butterfly S9', 'gold', '1:09.31', 'khelo', 'published', 'Open'),
      res('KSA State Para Aquatic Championship 2026, Bengaluru', 'State', '2026-08-02', 'Gold, 100m Butterfly S9', 'gold', '1:10.04', 'ksa', 'published', 'Senior'),
      res('Inter-University Para Aquatics 2026, Mangaluru', 'University', '2026-02-20', 'Gold, 100m Freestyle S9', 'gold', '1:03.90', null, 'cosigned', 'Open'),
    ],
    bests: [
      { event: '100m Butterfly S9', mark: '1:08.42', date: 'Oct 2026', standard: { name: 'WPS Worlds 2027 qualifying time (MQS)', mark: '1:10.50', met: true } },
      { event: '400m Freestyle S9', mark: '4:51.10', date: 'Oct 2026', standard: { name: 'WPS Worlds 2027 MQS', mark: '4:49.00', met: false, gap: '2.10s off' } },
      { event: '100m Freestyle S9', mark: '1:02.77', date: 'Jul 2026', standard: null },
    ],
    rankings: [{ list: 'WPS world rankings 2026', event: '100m Butterfly S9', rank: 14 }, { list: 'National ranking', event: '100m Butterfly S9', rank: 1 }],
    certificates: [
      cert('Form 1', 'International', 'pci', 'Asian Para Swimming Open 2025'),
      cert('Form 2', 'National', 'ksa', 'National Para Swimming Championships 2026'),
      cert('Khelo India certificate', 'Khelo India', 'khelo', 'Khelo India Para Games 2025'),
    ],
    team: [['c_arjun', 'Head coach'], ['p_sid', 'Physiotherapist'], ['n_kiran', 'Nutritionist']],
    backing: [],
    season: {
      label: '2027 season', goal: 'Qualify for WPS World Championships 2027 and get internationally re-classified',
      total: 650000, secured: 160000,
      items: [
        ['World Para Swimming Series, Berlin (travel, entry, classification)', 210000, 'Secured: family and KSA travel grant', 160000],
        ['12-week high-performance camp', 260000, null, 0],
        ['Racing suits and equipment', 80000, null, 0],
        ['Sports science and recovery', 100000, null, 0],
      ],
    },
    next: [
      { event: 'KSA State Senior Aquatic Championship', date: '2026-12-12', status: 'Entry open' },
      { event: 'National Para Swimming Championships 2027', date: '2027-02-08', status: 'Qualified' },
      { event: 'WPS World Series, Berlin', date: '2027-04-10', status: 'Needs funding' },
    ],
    story: 'Lost my left leg below the knee in a road accident at 11 and was back in the pool within a year. National champion in 100m butterfly. Studying B.Com at Christ University in the evenings.',
    openTo: ['Funding calls', 'Sponsorship', 'Speaking'],
    followers: 4210,
  },
  {
    id: 'karthik', name: 'Karthik Gowda', gender: 'M', dob: '2003-02-02', age: 23, sport: 'Para Swimming', events: ['50m Freestyle', '100m Freestyle'], para: true,
    classification: { cls: 'S10', status: 'Confirmed', sdms: '35102', impairment: 'Physical (congenital limb difference)', last: 'WPS World Series, Lignano, 2024' },
    city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', represents: 'Karnataka', club: 'Mysore District Swimming Association',
    ids: [{ label: 'SFI UID', value: 'KA-SW-21-01198', season: '2026-27', valid: true, issuer: 'sfi' }, { label: 'WPS SDMS ID', value: '35102', valid: true, issuer: 'pci' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: ['TOPS Development Group (para)'],
    stamps: [
      stamp('Asian Para Swimming Open', 'Bangkok', 'Thailand', 'TH', '2025-11-21', 'Silver, 50m Freestyle S10', 'silver', '26.10', 'pci'),
      stamp('WPS World Series', 'Lignano', 'Italy', 'IT', '2024-05-18', '4th, 50m Freestyle S10', null, '26.31', 'pci'),
    ],
    results: [
      res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-12', 'Gold, 50m Freestyle S10', 'gold', '25.88', 'pci'),
      res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-14', 'Gold, 100m Freestyle S10', 'gold', '56.90', 'pci'),
    ],
    bests: [{ event: '50m Freestyle S10', mark: '25.88', date: 'Oct 2026', standard: { name: 'WPS Worlds 2027 MQS', mark: '26.40', met: true } }],
    rankings: [{ list: 'WPS world rankings 2026', event: '50m Freestyle S10', rank: 11 }],
    certificates: [cert('Form 1', 'International', 'pci', 'Asian Para Swimming Open 2025')],
    team: [['c_arjun', 'Head coach'], ['p_sid', 'Physiotherapist']],
    backing: [{ orgId: 'blufin', programme: 'Para Swim Accelerator 2026', since: '2026-01', amount: 300000 }],
    story: 'Sprinter at heart; 50m is my race.', followers: 2890,
  },
  {
    id: 'tejas', name: 'Tejas Rao', gender: 'M', dob: '2008-09-30', age: 18, sport: 'Para Swimming', events: ['50m Freestyle', '100m Backstroke'], para: true,
    classification: { cls: 'S7', status: 'New', sdms: null, impairment: 'Physical (cerebral palsy)', last: 'National classification only (PCI), 2026' },
    city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', represents: 'Karnataka', club: 'Basavanagudi Aquatic Centre',
    ids: [{ label: 'SFI UID', value: 'KA-SW-25-07720', season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: [],
    stamps: [],
    results: [
      res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-13', 'Bronze, 100m Backstroke S7', 'bronze', '1:31.20', 'pci'),
      res('KSA State Para Aquatic Championship 2026, Bengaluru', 'State', '2026-08-02', 'Gold, 50m Freestyle S7', 'gold', '33.80', 'ksa'),
    ],
    bests: [{ event: '100m Backstroke S7', mark: '1:31.20', date: 'Oct 2026', standard: { name: 'WPS Worlds 2027 MQS', mark: '1:27.00', met: false, gap: '4.20s off' } }],
    rankings: [], certificates: [cert('Form 2', 'National', 'ksa', 'National Para Swimming Championships 2026')],
    team: [['c_arjun', 'Coach']], backing: [],
    season: { label: '2027 season', goal: 'First international classification', total: 280000, secured: 20000, items: [['International classification meet', 180000, null, 0], ['Coaching and pool time', 100000, 'Family', 20000]] },
    story: 'Started swimming as therapy at 9. First national medal this year.', followers: 640,
  },
  {
    id: 'aditya', name: 'Aditya Menon', gender: 'M', dob: '2009-03-11', age: 17, minor: true, sport: 'Para Swimming', events: ['50m Backstroke', '100m Freestyle'], para: true,
    classification: { cls: 'S6', status: 'Review', reviewYear: 2027, sdms: '41877', impairment: 'Physical', last: 'Asian Youth Para Games, Dubai, 2025' },
    city: 'Kochi', district: 'Ernakulam', state: 'Kerala', represents: 'Kerala', club: 'Regional Sports Centre, Kochi',
    ids: [{ label: 'SFI UID', value: 'KL-SW-23-03321', season: '2026-27', valid: true, issuer: 'sfi' }, { label: 'WPS SDMS ID', value: '41877', valid: true, issuer: 'pci' }],
    dobVerified: { by: 'sfi', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('Asian Youth Para Games', 'Dubai', 'UAE', 'AE', '2025-12-10', 'Bronze, 50m Backstroke S6', 'bronze', '39.88', 'pci')],
    results: [res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-13', 'Silver, 50m Backstroke S6', 'silver', '39.20', 'pci', 'published', 'Junior')],
    bests: [{ event: '50m Backstroke S6', mark: '39.20', date: 'Oct 2026', standard: null }],
    rankings: [], certificates: [], team: [['c_arjun', 'Camp coach'], ['p_joseph', 'Physiotherapist']],
    backing: [{ orgId: 'blufin', programme: 'Para Swim Accelerator 2026', since: '2026-01', amount: 240000 }, { orgId: 'gosports', programme: 'Para Champions Programme', since: '2025-06', amount: 200000 }],
    story: 'Profile managed with my parents.', followers: 1530,
  },
  // Applicants to Blufin's call (para swimmers across India)
  ...[
    ['fatima', 'Fatima Shaikh', 'F', 22, 'S8', 'Confirmed', 'Mumbai', 'Maharashtra', true, 2, 1, 'gold', '1:14.30', 'Silver, 100m Breaststroke SB7 (Asian Open 2025)', 'TH'],
    ['gurpreet', 'Gurpreet Singh', 'M', 25, 'S5', 'Review', 'Ludhiana', 'Punjab', true, 1, 0, 'silver', '1:38.10', null, null],
    ['kavin', 'Kavin Raj', 'M', 20, 'S11', 'Confirmed', 'Chennai', 'Tamil Nadu', true, 3, 1, 'gold', '29.70', 'Bronze, 50m Freestyle S11 (WPS World Series 2025)', 'DE'],
    ['pallavi', 'Pallavi Das', 'F', 19, 'S6', 'Review', 'Guwahati', 'Assam', false, 1, 0, 'bronze', '1:28.44', null, null],
    ['arun', 'Arun Kumar', 'M', 24, 'S14', 'Confirmed', 'Hyderabad', 'Telangana', true, 2, 0, 'gold', '58.90', null, null],
    ['nandini', 'Nandini Pawar', 'F', 16, 'S4', 'New', 'Pune', 'Maharashtra', true, 0, 0, 'gold', '1:52.00', null, null],
    ['salman', 'Salman Qadri', 'M', 21, 'S9', 'Confirmed', 'Srinagar', 'Jammu & Kashmir', false, 1, 0, 'silver', '1:11.60', null, null],
  ].map(([pid, name, gender, age, cls, status, city, state, dobOk, verifiedN, intlN, medal, mark, intl, cc]) => ({
    id: pid, name, gender, age, minor: age < 18, sport: 'Para Swimming', events: ['Freestyle'], para: true,
    classification: { cls, status, reviewYear: status === 'Review' ? 2027 : undefined, sdms: status === 'New' ? null : String(40000 + age * 37) },
    city, district: city, state, represents: state, club: `${city} Aquatic Club`,
    ids: [{ label: 'SFI UID', value: `${state.slice(0, 2).toUpperCase()}-SW-24-0${age}${age}`, season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: dobOk ? { by: 'sfi', doc: 'Birth certificate' } : null,
    schemes: [],
    stamps: intl ? [stamp(intl.includes('Asian') ? 'Asian Para Swimming Open' : 'WPS World Series', intl.includes('Asian') ? 'Bangkok' : 'Berlin', intl.includes('Asian') ? 'Thailand' : 'Germany', cc, '2025-11-20', intl.split(' (')[0], intl.startsWith('Silver') ? 'silver' : intl.startsWith('Bronze') ? 'bronze' : 'gold', mark, 'pci')] : [],
    results: Array.from({ length: Math.max(1, verifiedN) }).map((_, i) => res('National Para Swimming Championships 2026, Gwalior', 'National', '2026-10-1' + (2 + i), `${i === 0 ? medal[0].toUpperCase() + medal.slice(1) : 'Finalist'}, ${cls} event`, i === 0 ? medal : null, mark, verifiedN ? 'pci' : null, verifiedN ? 'published' : 'self')),
    bests: [], rankings: [], certificates: [], team: [], backing: [], story: '', followers: 300 + age * 20,
  })),
  // Other Karnataka swimmers (KSA registry)
  {
    id: 'ira', name: 'Ira Kulkarni', gender: 'F', dob: '2011-05-02', age: 15, minor: true, sport: 'Swimming', events: ['100m Backstroke', '200m Backstroke'], para: false,
    city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', represents: 'Karnataka', club: 'Dolphin Aquatics, Bengaluru', ageGroup: 'Group I-A (15)',
    ids: [{ label: 'SFI UID', value: 'KA-SW-22-05561', season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: [], stamps: [],
    results: [res('KSA State Sub-Junior & Junior Aquatic Championship 2026', 'State', '2026-05-30', 'Gold, 100m Backstroke (Group I-A)', 'gold', '1:07.40', 'ksa', 'published', 'Group I-A'), res('41st Sub-Junior National Aquatic Championships 2025', 'National', '2025-08-05', 'Bronze, 100m Backstroke (Group II)', 'bronze', '1:09.02', 'sfi')],
    bests: [{ event: '100m Backstroke', mark: '1:07.40', date: 'May 2026', standard: { name: 'Junior Nationals 2027 qualifying time', mark: '1:09.50', met: true } }],
    rankings: [], certificates: [cert('Form 2', 'National', 'ksa', 'Sub-Junior Nationals 2025')], team: [], backing: [], story: 'Profile managed with my parents.', followers: 410,
  },
  {
    id: 'nihal', name: 'Nihal Shenoy', gender: 'M', dob: '2010-01-18', age: 16, minor: true, sport: 'Swimming', events: ['50m Freestyle', '100m Freestyle'], para: false,
    city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', represents: 'Karnataka', club: 'Basavanagudi Aquatic Centre', ageGroup: 'Group I-B (16)',
    ids: [{ label: 'SFI UID', value: 'KA-SW-21-02290', season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: [], stamps: [],
    results: [res('KSA State Sub-Junior & Junior Aquatic Championship 2026', 'State', '2026-05-31', 'Gold, 50m Freestyle (Group I-B)', 'gold', '24.61', 'ksa', 'published', 'Group I-B')],
    bests: [{ event: '50m Freestyle', mark: '24.61', date: 'May 2026', standard: { name: 'Junior Nationals 2027 qualifying time', mark: '25.10', met: true } }],
    rankings: [], certificates: [], team: [], backing: [], story: 'Profile managed with my parents.', followers: 380,
  },
  {
    id: 'rohan', name: 'Rohan Prakash', gender: 'M', dob: '2009-07-07', age: 17, minor: true, sport: 'Swimming', events: ['200m IM', '400m IM'], para: false,
    city: 'Belagavi', district: 'Belagavi', state: 'Karnataka', represents: 'Karnataka', club: 'Belagavi Swimmers Club', ageGroup: 'Group I-C (17)',
    ids: [{ label: 'SFI UID', value: 'KA-SW-20-00981', season: '2025-26', valid: false, issuer: 'sfi' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: [], stamps: [],
    results: [res('KSA State Sub-Junior & Junior Aquatic Championship 2026', 'State', '2026-05-30', 'Silver, 400m IM (Group I-C)', 'silver', '4:48.90', 'ksa', 'published', 'Group I-C')],
    bests: [], rankings: [], certificates: [], team: [], backing: [], story: '', followers: 220,
  },
  {
    id: 'ananya', name: 'Ananya Gowda', gender: 'F', dob: '2012-10-21', age: 14, minor: true, sport: 'Swimming', events: ['200m Breaststroke'], para: false,
    city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', represents: 'Karnataka', club: 'Mysore District Swimming Association', ageGroup: 'Group II-C (14)',
    ids: [{ label: 'SFI UID', value: 'KA-SW-23-06612', season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: null, schemes: [], stamps: [],
    results: [res('KSA State Sub-Junior & Junior Aquatic Championship 2026', 'State', '2026-05-31', 'Gold, 200m Breaststroke (Group II-C)', 'gold', '2:48.12', 'ksa', 'published', 'Group II-C')],
    bests: [], rankings: [], certificates: [], team: [], backing: [], story: 'Profile managed with my parents.', followers: 150,
  },
  {
    id: 'siddharth', name: 'Siddharth Bhat', gender: 'M', dob: '2006-12-01', age: 19, sport: 'Swimming', events: ['100m Breaststroke', '200m Breaststroke'], para: false,
    city: 'Mangaluru', district: 'Dakshina Kannada', state: 'Karnataka', represents: 'Karnataka', club: 'Mangala Swimming Club', ageGroup: 'Senior',
    ids: [{ label: 'SFI UID', value: 'KA-SW-18-00412', season: '2026-27', valid: true, issuer: 'sfi' }],
    dobVerified: { by: 'ksa', doc: 'Birth certificate' }, schemes: [], stamps: [stamp('South Asian Aquatics Championship', 'Colombo', 'Sri Lanka', 'LK', '2025-10-04', 'Gold, 100m Breaststroke', 'gold', '1:03.80', 'sfi')],
    results: [res('77th Senior National Aquatic Championship', 'National', '2026-09-12', 'Bronze, 100m Breaststroke', 'bronze', '1:03.11', 'sfi')],
    bests: [{ event: '100m Breaststroke', mark: '1:03.11', date: 'Sep 2026', standard: { name: 'Asian Games "B" standard', mark: '1:02.70', met: false, gap: '0.41s off' } }],
    rankings: [], certificates: [cert('Form 1', 'International', 'sfi', 'South Asian Aquatics Championship 2025')], team: [], backing: [], story: '', followers: 1120,
  },
  // Badminton (BAI registry)
  {
    id: 'sana', name: 'Sana Qureshi', gender: 'F', dob: '2004-04-09', age: 22, sport: 'Para Badminton', events: ["Women's Singles", "Women's Doubles"], para: true,
    classification: { cls: 'SL4', status: 'Confirmed', impairment: 'Physical (lower limb)', last: 'BWF classification, Dubai 2024' },
    city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', represents: 'Uttar Pradesh', club: 'SmashPoint Badminton Academy, Hyderabad',
    ids: [{ label: 'BAI Player ID', value: 'BAI-UP-118420', valid: true, issuer: 'bai' }, { label: 'BWF ID', value: '96011', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate (BAI format, Annexure A)' }, schemes: ['TOPS Core Group (para)'],
    stamps: [stamp('BWF Para Badminton International', 'Dubai', 'UAE', 'AE', '2026-06-15', "Gold, Women's Singles SL4", 'gold', '21-17, 21-15', 'bai'), stamp('Asian Para Games', 'Nagoya', 'Japan', 'JP', '2026-10-25', "Silver, Women's Doubles SL3-SU5", 'silver', '', 'pci')],
    results: [res('National Para Badminton Championships 2026', 'National', '2026-02-02', "Gold, Women's Singles SL4", 'gold', '', 'bai')],
    bests: [], rankings: [{ list: 'BWF Para world ranking', event: 'WS SL4', rank: 7 }], certificates: [cert('Form 1', 'International', 'bai', 'BWF Para Badminton International 2026')],
    team: [['c_rajesh', 'Coach'], ['s_nandini', 'Sports psychologist']], backing: [{ orgId: 'gosports', programme: 'Para Champions Programme', since: '2024-04', amount: 450000 }], story: 'Polio at two, racket at nine.', followers: 7640,
  },
  {
    id: 'kavya', name: 'Kavya Reddy', gender: 'F', dob: '2007-08-25', age: 19, sport: 'Badminton', events: ["Women's Singles"], para: false,
    city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', represents: 'Telangana', club: 'SmashPoint Badminton Academy',
    ids: [{ label: 'BAI Player ID', value: 'BAI-TS-097554', valid: true, issuer: 'bai' }, { label: 'BWF ID', value: '88214', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate (BAI format)' }, schemes: [],
    stamps: [stamp('BWF International Challenge', 'Bengaluru', 'India', 'IN', '2026-09-28', "Winner, Women's Singles", 'gold', '21-19 18-21 21-16', 'bai'), stamp('BWF World Junior Championships', 'Guwahati', 'India', 'IN', '2025-10-10', "Quarterfinalist, Women's Singles", null, '', 'bai')],
    results: [res('Senior National Badminton Championships 2026', 'National', '2026-01-18', "Gold, Women's Singles", 'gold', '', 'bai')],
    bests: [], rankings: [{ list: 'BAI senior ranking', event: "Women's Singles", rank: 3 }, { list: 'BWF world ranking', event: 'WS', rank: 64 }],
    certificates: [cert('Form 1', 'International', 'bai', 'BWF World Junior Championships 2025')], team: [['c_rajesh', 'Coach']], backing: [{ orgId: 'ogq', programme: 'Junior Programme', since: '2023-07', amount: 600000 }], story: 'Left-hander, attacking game.', followers: 9870,
  },
  {
    id: 'dev', name: 'Dev Patil', gender: 'M', dob: '1997-11-03', age: 29, sport: 'Para Badminton', events: ["Men's Singles"], para: true,
    classification: { cls: 'WH2', status: 'Confirmed', impairment: 'Spinal cord injury', last: 'BWF classification, Bahrain 2026' },
    city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', represents: 'Maharashtra', club: 'SmashPoint Badminton Academy',
    ids: [{ label: 'BAI Player ID', value: 'BAI-MH-140021', valid: true, issuer: 'bai' }, { label: 'BWF ID', value: '99102', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('BWF Para Badminton International', 'Manama', 'Bahrain', 'BH', '2026-04-10', "Quarterfinalist, Men's Singles WH2", null, '', 'bai')],
    results: [res('National Para Badminton Championships 2026', 'National', '2026-02-02', "Bronze, Men's Singles WH2", 'bronze', '', 'bai')],
    bests: [], rankings: [{ list: 'BWF Para world ranking', event: 'MS WH2', rank: 18 }], certificates: [], team: [['c_rajesh', 'Coach']],
    backing: [{ orgId: 'blufin', programme: 'Equipment bank', since: '2026-03', amount: 120000 }], story: 'Found badminton in rehab.', followers: 2210,
  },
  {
    id: 'harsh', name: 'Harsh Vardhan', gender: 'M', dob: '2007-12-19', age: 18, sport: 'Badminton', events: ["Boys' Singles U-19"], para: false,
    city: 'Hyderabad', district: 'Rangareddy', state: 'Telangana', represents: 'Telangana', club: 'Gopichand Academy feeder centre',
    ids: [{ label: 'BAI Player ID', value: 'BAI-TS-121890', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate (BAI format)' }, schemes: [], stamps: [],
    results: [res('All India Junior Ranking Tournament, Bhubaneswar 2026', 'National', '2026-07-20', "Winner, Boys' Singles U-19", 'gold', '', 'bai', 'published', 'U-19')],
    bests: [], rankings: [{ list: 'BAI junior ranking', event: "Boys' Singles U-19", rank: 3 }], certificates: [], team: [], backing: [], story: '', followers: 1300,
  },
  {
    id: 'meghna', name: 'Meghna Iyer', gender: 'F', dob: '2008-03-15', age: 18, sport: 'Badminton', events: ["Girls' Singles U-19"], para: false,
    city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', represents: 'Karnataka', club: 'Prakash Padukone feeder programme',
    ids: [{ label: 'BAI Player ID', value: 'BAI-KA-119003', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate (BAI format)' }, schemes: [], stamps: [],
    results: [res('All India Junior Ranking Tournament, Bhubaneswar 2026', 'National', '2026-07-20', "Runner-up, Girls' Singles U-19", 'silver', '', 'bai', 'published', 'U-19')],
    bests: [], rankings: [{ list: 'BAI junior ranking', event: "Girls' Singles U-19", rank: 5 }], certificates: [], team: [], backing: [], story: '', followers: 900,
  },
  {
    id: 'diya', name: 'Diya Patel', gender: 'F', dob: '2012-06-01', age: 14, minor: true, sport: 'Badminton', events: ["Girls' Singles U-15"], para: false,
    city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', represents: 'Gujarat', club: 'Ahmedabad Shuttlers',
    ids: [{ label: 'BAI Player ID', value: 'BAI-GJ-160412', valid: true, issuer: 'bai' }],
    dobVerified: null, ageFlag: 'Registered on a medical age certificate; birth certificate in BAI format not yet submitted', schemes: [], stamps: [],
    results: [res('All India Sub-Junior Ranking Tournament, Goa 2026', 'National', '2026-05-20', "Semi-finalist, Girls' Singles U-15", null, '', 'bai', 'published', 'U-15')],
    bests: [], rankings: [{ list: 'BAI sub-junior ranking', event: "Girls' Singles U-15", rank: 12 }], certificates: [], team: [], backing: [], story: 'Profile managed with my parents.', followers: 120,
  },
  {
    id: 'aarav', name: 'Aarav Menon', gender: 'M', dob: '2010-02-14', age: 16, minor: true, sport: 'Badminton', events: ["Boys' Singles U-17"], para: false,
    city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', represents: 'Kerala', club: 'GV Raja Sports School',
    ids: [{ label: 'BAI Player ID', value: 'BAI-KL-133290', valid: true, issuer: 'bai' }],
    dobVerified: { by: 'bai', doc: 'Birth certificate (BAI format)' }, schemes: [], stamps: [],
    results: [res('All India Sub-Junior Ranking Tournament, Goa 2026', 'National', '2026-05-22', "Winner, Boys' Singles U-17", 'gold', '', 'bai', 'published', 'U-17')],
    bests: [], rankings: [{ list: 'BAI sub-junior ranking', event: "Boys' Singles U-17", rank: 2 }], certificates: [], team: [], backing: [], story: 'Profile managed with my parents.', followers: 520,
  },
  // A few more for Wins and Scout
  {
    id: 'rahul', name: 'Rahul Yadav', gender: 'M', dob: '2002-01-10', age: 24, sport: 'Para Athletics', events: ['Javelin'], para: true,
    classification: { cls: 'F64', status: 'Confirmed', impairment: 'Lower limb (prosthesis)', last: 'WPA Grand Prix, Dubai 2024' },
    city: 'Sonipat', district: 'Sonipat', state: 'Haryana', represents: 'Haryana', club: 'SAI Sonipat',
    ids: [{ label: 'WPA SDMS ID', value: '30091', valid: true, issuer: 'pci' }], dobVerified: { by: 'pci', doc: 'Birth certificate' }, schemes: ['TOPS Core Group (para)'],
    stamps: [stamp('Asian Para Games', 'Nagoya', 'Japan', 'JP', '2026-10-24', 'Bronze, Javelin F64', 'bronze', '64.12m', 'pci'), stamp('WPA Grand Prix', 'Paris', 'France', 'FR', '2026-08-14', 'Silver, Javelin F64', 'silver', '66.90m', 'pci')],
    results: [res('National Para Athletics Championships 2026', 'National', '2026-03-10', 'Gold, Javelin F64', 'gold', '65.40m', 'pci')],
    bests: [{ event: 'Javelin F64', mark: '66.90m', date: 'Aug 2026', standard: { name: 'WPA Worlds 2027 MQS', mark: '58.00m', met: true } }],
    rankings: [{ list: 'WPA world ranking', event: 'Javelin F64', rank: 4 }], certificates: [], team: [['c_shalini', 'Coach'], ['n_ritika', 'Nutritionist']],
    backing: [{ orgId: 'ogq', programme: 'Para programme', since: '2022-01', amount: 900000 }], story: "Farmer's son, prosthetic left leg since 2018.", followers: 11800,
  },
  {
    id: 'thangam', name: 'Thangam Selvaraj', gender: 'F', dob: '2001-05-05', age: 25, sport: 'Para Athletics', events: ['100m', 'Long Jump'], para: true,
    classification: { cls: 'T47', status: 'Confirmed', impairment: 'Upper limb', last: 'WPA Grand Prix, Bengaluru 2025' },
    city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', represents: 'Tamil Nadu', club: 'SAI Sonipat',
    ids: [{ label: 'WPA SDMS ID', value: '33410', valid: true, issuer: 'pci' }], dobVerified: { by: 'pci', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('Asian Para Games', 'Nagoya', 'Japan', 'JP', '2026-10-22', 'Silver, 100m T47', 'silver', '12.71', 'pci')],
    results: [res('National Para Athletics Championships 2026', 'National', '2026-03-11', 'Gold, Long Jump T47', 'gold', '5.42m', 'pci')],
    bests: [{ event: '100m T47', mark: '12.71', date: 'Oct 2026', standard: { name: 'WPA Worlds 2027 MQS', mark: '13.10', met: true } }],
    rankings: [{ list: 'WPA world ranking', event: '100m T47', rank: 9 }], certificates: [], team: [['c_shalini', 'Coach']],
    backing: [{ orgId: 'gosports', programme: 'Para Champions Programme', since: '2026-09', amount: 350000 }], story: 'Ran barefoot until 19.', followers: 5340,
  },
  {
    id: 'irfan', name: 'Irfan Sheikh', gender: 'M', dob: '1999-08-20', age: 27, sport: 'Para Powerlifting', events: ['Up to 72kg'], para: true,
    classification: { cls: 'Eligible', status: 'Confirmed', impairment: 'Post-polio', last: 'WPPO World Cup, Dubai 2026' },
    city: 'Srinagar', district: 'Srinagar', state: 'Jammu & Kashmir', represents: 'Jammu & Kashmir', club: 'Ironhouse Para Fitness, Delhi',
    ids: [], dobVerified: { by: 'pci', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('World Para Powerlifting World Cup', 'Dubai', 'UAE', 'AE', '2026-04-26', '5th, Up to 72kg', null, '196kg', 'pci')],
    results: [res('National Para Powerlifting Championships 2026', 'National', '2026-09-19', 'Gold & national record, Up to 72kg', 'gold', '201kg', 'pci')],
    bests: [], rankings: [], certificates: [], team: [['n_ritika', 'Nutritionist']],
    backing: [{ orgId: 'blufin', programme: 'Para Strength Fund', since: '2026-10', amount: 180000 }], story: 'Built my first bench from a charpai frame.', followers: 3310,
  },
  {
    id: 'ruhi', name: 'Ruhi Joshi', gender: 'F', dob: '2000-02-28', age: 26, sport: 'Para Table Tennis', events: ["Women's Singles Class 4"], para: true,
    classification: { cls: 'Class 4', status: 'Confirmed', impairment: 'Spina bifida' },
    city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', represents: 'Gujarat', club: 'Ahmedabad TT Club',
    ids: [], dobVerified: { by: 'pci', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('ITTF Para Open', 'Pattaya', 'Thailand', 'TH', '2026-07-05', "Gold, Women's Singles Class 4", 'gold', '3-1', 'pci')],
    results: [], bests: [], rankings: [{ list: 'ITTF Para world ranking', event: 'WS4', rank: 14 }], certificates: [], team: [['p_joseph', 'Physiotherapist']],
    backing: [{ orgId: 'blufin', programme: 'Para Swim Accelerator 2026 (multi-sport pilot)', since: '2026-01', amount: 200000 }], story: 'Weekend coach at a community club.', followers: 2760,
  },
  {
    id: 'tanvi', name: 'Tanvi Deshmukh', gender: 'F', dob: '2007-04-17', age: 19, sport: 'Swimming', events: ['200m IM', '400m IM'], para: false,
    city: 'Pune', district: 'Pune', state: 'Maharashtra', represents: 'Maharashtra', club: 'Balewadi High Performance Centre',
    ids: [{ label: 'SFI UID', value: 'MH-SW-19-00877', season: '2026-27', valid: true, issuer: 'sfi' }], dobVerified: { by: 'sfi', doc: 'Birth certificate' }, schemes: [],
    stamps: [stamp('Asian Aquatics Championships', 'Ahmedabad', 'India', 'IN', '2025-10-02', 'Finalist (6th), 400m IM', null, '4:51.02', 'sfi')],
    results: [res('77th Senior National Aquatic Championship', 'National', '2026-09-08', 'Gold & national record, 400m IM', 'gold', '4:47.31', 'sfi')],
    bests: [{ event: '400m IM', mark: '4:47.31', date: 'Sep 2026', standard: { name: 'Asian Games "A" standard', mark: '4:45.00', met: false, gap: '2.31s off' } }],
    rankings: [], certificates: [], team: [], backing: [{ orgId: 'gosports', programme: 'Athlete Scholarship Programme', since: '2024-01', amount: 500000 }], story: '', followers: 6120,
  },
  {
    id: 'lalrinpuii', name: 'Lalrinpuii Hmar', gender: 'F', dob: '2008-01-12', age: 18, sport: 'Archery', events: ['Recurve'], para: false,
    city: 'Aizawl', district: 'Aizawl', state: 'Mizoram', represents: 'Mizoram', club: 'Aizawl Archery Club',
    ids: [], dobVerified: { by: 'aai', doc: 'Birth certificate' }, schemes: ['Khelo India Athlete (archery)'],
    stamps: [stamp('World Archery Youth Championships', 'Winnipeg', 'Canada', 'CA', '2025-08-16', "Bronze, Recurve Women's Team U21", 'bronze', '', 'aai')],
    results: [res('Junior National Archery Championships 2026', 'National', '2026-04-04', 'Gold, Recurve Women U21', 'gold', '', 'aai')],
    bests: [], rankings: [], certificates: [], team: [], backing: [],
    season: { label: '2027 season', goal: 'Asia Cup selection', total: 350000, secured: 90000, items: [['Bow, limbs and arrows', 220000, 'Partly secured', 90000], ['Asia Cup travel', 130000, null, 0]] },
    story: 'Bamboo bow first, now 38 lb limbs.', followers: 2140,
  },
]

// ───────────────────── Coaches, support staff, academies ─────────────────────
// Each credential says who verified it. 'declared' means uploaded but not yet checked.
const cred = (name, by, status = 'verified') => ({ name, by, status })

const pros = [
  { id: 'c_arjun', name: 'Arjun Nair', role: 'coach', sport: 'Para Swimming', city: 'Bengaluru', state: 'Karnataka', worksAt: 'g_lanesix',
    headline: 'Head coach, LaneSix para squad. 14 national champions coached.',
    credentials: [cred('NIS Diploma in Swimming Coaching', 'SAI NIS Patiala'), cred('ASCA Level 3 Coach', 'American Swimming Coaches Association', 'declared'), cred('Para swimming classification awareness', 'PCI')],
    history: [['Head Coach, Para Swimming', 'LaneSix Aquatics', '2019 to present'], ['Assistant Coach', 'Basavanagudi Aquatic Centre', '2015 to 2019']] },
  { id: 'c_elena', name: 'Elena Kovacs', role: 'coach', sport: 'Swimming', city: 'Pune', state: 'Maharashtra', worksAt: null,
    headline: 'Foreign expert coach, medley and backstroke.',
    credentials: [cred('Master Coach', 'Hungarian Swimming Federation', 'declared'), cred('Expert coach appointment', 'SFI')],
    history: [['Expert Coach', 'Balewadi High Performance Centre', '2023 to present']] },
  { id: 'c_shalini', name: 'Shalini Mathur', role: 'coach', sport: 'Para Athletics', city: 'Sonipat', state: 'Haryana', worksAt: null,
    headline: 'Throws and sprints coach, national para athletics camp.',
    credentials: [cred('CECS Level 3', 'World Athletics'), cred('MSc Sports Science', 'University record', 'declared')],
    history: [['National Para Athletics Coach', 'PCI camp', '2021 to present']] },
  { id: 'c_rajesh', name: 'Rajesh Pillai', role: 'coach', sport: 'Badminton', city: 'Hyderabad', state: 'Telangana', worksAt: 'g_smashpoint',
    headline: 'Chief coach, SmashPoint Badminton Academy. Runs an integrated para squad.',
    credentials: [cred('BWF Level 2 Coach', 'BAI'), cred('BWF Para Badminton Coaching Course', 'BAI'), cred('NIS Certificate, Badminton', 'SAI NIS Patiala')],
    history: [['Chief Coach', 'SmashPoint Badminton Academy', '2016 to present']] },
  { id: 'c_gurdeep', name: 'Gurdeep Sandhu', role: 'coach', sport: 'Badminton', city: 'Lucknow', state: 'Uttar Pradesh', worksAt: null,
    headline: 'Junior development coach. Looking for players for a U-15 squad.',
    credentials: [cred('NIS Certificate, Badminton', 'SAI NIS Patiala', 'declared')],
    history: [['Coach', 'Lucknow district centre', '2018 to present']] },
  { id: 'p_sid', name: 'Siddharth Rao', role: 'physio', sport: 'Aquatics', city: 'Bengaluru', state: 'Karnataka', worksAt: 'g_lanesix',
    headline: 'Sports physiotherapist, shoulder specialist for swimmers.',
    credentials: [cred('MPT (Sports)', 'Karnataka State Allied Health Council'), cred('Dry needling level 2', 'Course provider', 'declared')],
    history: [['Team Physio', 'India para swimming tours', '2024 to 2026']] },
  { id: 'p_joseph', name: 'Joseph Mathew', role: 'physio', sport: 'Para sports', city: 'Kochi', state: 'Kerala', worksAt: null,
    headline: 'Neuro and paediatric sports physio.',
    credentials: [cred('MPT (Neurology)', 'Kerala State Allied Health Council'), cred('Bobath certified', 'Course provider', 'declared')],
    history: [['Consultant Physio', 'Kochi rehab centre', '2015 to present']] },
  { id: 'n_kiran', name: 'Kiran Hegde', role: 'nutritionist', sport: 'Para sports', city: 'Bengaluru', state: 'Karnataka', worksAt: 'g_lanesix',
    headline: 'Nutrition for para athletes.',
    credentials: [cred('MSc Sports Nutrition', 'University record'), cred('ISAK Level 1', 'ISAK', 'declared')],
    history: [['Nutrition Lead (volunteer)', 'Blufin Foundation', '2020 to present']] },
  { id: 'n_ritika', name: 'Dr. Ritika Sood', role: 'nutritionist', sport: 'Strength & throws', city: 'New Delhi', state: 'Delhi', worksAt: 'g_ironhouse',
    headline: 'Sports nutritionist for weight-class and throws athletes.',
    credentials: [cred('PhD, Food & Nutrition', 'University record'), cred('IOC Diploma in Sports Nutrition', 'IOC')],
    history: [['Consultant', 'National para athletics camp', '2022 to present']] },
  { id: 's_nandini', name: 'Dr. Nandini Rao', role: 'psychologist', sport: 'Precision & racket sports', city: 'Hyderabad', state: 'Telangana', worksAt: 'g_smashpoint',
    headline: 'Sports psychologist: pressure, focus and comebacks.',
    credentials: [cred('PhD, Sport Psychology', 'University record'), cred('RCI registration', 'Rehabilitation Council of India')],
    history: [['Consultant', 'SmashPoint Badminton Academy', '2020 to present']] },
]

const gyms = [
  { id: 'g_lanesix', name: 'LaneSix Aquatics', role: 'gym', sport: 'Aquatics', city: 'Bengaluru', state: 'Karnataka',
    headline: '50m pool with hoist and ramp entry. Home of the Blufin para squad.',
    credentials: [cred('KSA-affiliated club', 'KSA'), cred('Accessible facility audit', 'Blufin Foundation'), cred('Lifeguard certification', 'RLSS India', 'declared')],
    facilities: ['50m 8-lane pool', 'Pool hoist and ramp entry', 'Accessible changing rooms', 'Dryland gym'],
    programmes: ['Para swim squad', 'Learn-to-swim', 'Masters'] },
  { id: 'g_smashpoint', name: 'SmashPoint Badminton Academy', role: 'gym', sport: 'Badminton', city: 'Hyderabad', state: 'Telangana',
    headline: '12 courts with an integrated para badminton programme.',
    credentials: [cred('Affiliated academy', 'BAI'), cred('Wheelchair-accessible courts', 'Blufin Foundation')],
    facilities: ['12 synthetic courts', '2 wheelchair-accessible courts', 'Video analysis room'],
    programmes: ['Elite squad', 'Para badminton squad', 'Junior pathway'] },
  { id: 'g_ironhouse', name: 'Ironhouse Para Fitness', role: 'gym', sport: 'Adaptive strength', city: 'New Delhi', state: 'Delhi',
    headline: 'Adaptive strength gym for wheelchair users and amputees.',
    credentials: [cred('Para powerlifting training centre', 'PCI'), cred('Step-free access audit', 'Blufin Foundation')],
    facilities: ['Para powerlifting benches', 'Adaptive cable machines', 'Step-free throughout'],
    programmes: ['Para powerlifting club', 'Adaptive fitness for beginners'] },
  { id: 'g_balewadi', name: 'Balewadi Aquatics Centre', role: 'gym', sport: 'Aquatics', city: 'Pune', state: 'Maharashtra',
    headline: 'High-performance pool and sports science lab.',
    credentials: [cred('National camp venue', 'SFI'), cred('Sports science lab', 'Self-declared', 'declared')],
    facilities: ['50m pool', 'Diving pool', 'Sports science lab'],
    programmes: ['High-performance squad'] },
]

// Where athletes train (the athlete confirms the link from their passport)
const TRAINS_AT = { meera: 'g_lanesix', karthik: 'g_lanesix', tejas: 'g_lanesix', sana: 'g_smashpoint', kavya: 'g_smashpoint', dev: 'g_smashpoint', irfan: 'g_ironhouse', tanvi: 'g_balewadi' }
for (const a of athletes) if (TRAINS_AT[a.id]) a.trainsAt = TRAINS_AT[a.id]
// More confirmed coach links
const addTeam = (aid, pid, role) => { const a = athletes.find(x => x.id === aid); if (!a.team.some(([p]) => p === pid)) a.team.push([pid, role]) }
addTeam('tanvi', 'c_elena', 'Coach'); addTeam('ira', 'c_elena', 'Camp coach'); addTeam('irfan', 'n_ritika', 'Nutritionist')
addTeam('kavya', 's_nandini', 'Sports psychologist'); addTeam('tejas', 'p_sid', 'Physiotherapist')

export const GYMS = gyms
export const SEED_ATHLETES = athletes
export const PROS = pros
export const DEMO_ATHLETE = 'meera'

// Claims waiting on a federation, so the verification queue has something in it
const claim = (aid, r) => { const a = athletes.find(x => x.id === aid); a.results.unshift({ id: id('r'), source: 'self', verifiedBy: null, ...r }) }
claim('siddharth', { event: 'Karnataka State Open Masters & Senior Meet 2026, Mangaluru', level: 'State', date: '2026-11-09', result: 'Gold, 100m Breaststroke', medal: 'gold', mark: '1:04.02', pendingWith: 'ksa' })
claim('nihal', { event: 'Bengaluru Inter-Club Sprint Meet 2026', level: 'District', date: '2026-11-15', result: 'Gold, 50m Freestyle (Group I-B)', medal: 'gold', mark: '24.48', pendingWith: 'ksa' })
claim('harsh', { event: 'All India Junior Ranking Tournament, Raipur 2026', level: 'National', date: '2026-11-02', result: "Semi-finalist, Boys' Singles U-19", medal: null, mark: '', pendingWith: 'bai' })

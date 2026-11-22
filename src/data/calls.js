// Foundation calls and portfolio. Sample content for the demo.
//
// Each criterion is checked automatically against the athlete's passport.
// test keys are evaluated in lib/eligibility.js

export const STAGES = ['Applied', 'Screened', 'Panel review', 'Interview', 'Selected']

export const SEED_CALLS = [
  {
    id: 'blufin-psa-2027', orgId: 'blufin', mode: 'open',
    title: 'Para Swim Accelerator 2027',
    pitch: 'Twelve months of funded training for 10 para swimmers aiming at the 2027 World Championships and LA 2028.',
    support: [['Grant', 'Up to ₹3,00,000 per athlete'], ['Covers', 'Coaching, pool time, one international meet, sports science'], ['Also', 'Help booking international classification']],
    seats: 10, opens: '2026-11-15', closes: '2026-12-15', decision: '2027-01-20',
    criteria: [
      { label: 'Para swimmer with a national sport class', test: 'paraSport', arg: 'Para Swimming' },
      { label: 'National medal in 2025 or 2026', test: 'medalSince', arg: { level: 'National', year: 2025 } },
      { label: 'Aged 14 to 30 on 1 Jan 2027', test: 'ageRange', arg: [14, 30] },
      { label: 'Date of birth verified by a federation', test: 'dobVerified' },
    ],
    asks: [
      { key: 'passport', label: 'Sports Passport (results, classification, IDs)', auto: true },
      { key: 'budget', label: 'Season budget', auto: true },
      { key: 'coach', label: 'Coach endorsement', auto: false },
      { key: 'video', label: 'Two-minute training video', auto: false },
    ],
    panel: ['Sharath Gayakwad (Paralympian)', 'Head coach, Blufin squad', 'Independent sports scientist'],
    funder: 'tidewater',
  },
  {
    id: 'gosports-para-2027', orgId: 'gosports', mode: 'open',
    title: 'Para Champions Programme, 2027 cohort',
    pitch: 'Scholarships for emerging para athletes: training, competition, equipment and mentorship.',
    support: [['Scholarship', 'Need-based, up to ₹5,00,000 a year'], ['Also', 'Mentorship and athlete education']],
    seats: 20, opens: '2026-11-01', closes: '2026-12-20', decision: '2027-02-15',
    criteria: [
      { label: 'Para athlete in a Paralympic sport', test: 'para' },
      { label: 'National-level result in the last 24 months', test: 'levelSince', arg: { level: 'National', year: 2025 } },
      { label: 'Not currently on another GoSports scholarship', test: 'notBackedBy', arg: 'gosports' },
    ],
    asks: [{ key: 'passport', label: 'Sports Passport', auto: true }, { key: 'budget', label: 'Season budget', auto: true }, { key: 'coach', label: 'Coach endorsement', auto: false }],
  },
  {
    id: 'ogq-nominations', orgId: 'ogq', mode: 'nomination',
    title: 'Junior Programme: coach nominations',
    pitch: 'OGQ identifies athletes through its research team, coaches and scouts. Coaches can nominate athletes with podium potential; athletes cannot apply directly.',
    support: [['Support', 'Training, competition, coaching and sports science'], ['Route', 'Nomination by coach, then research team review']],
    seats: null, opens: '2026-10-01', closes: '2027-01-31', decision: 'Rolling',
    criteria: [
      { label: 'Olympic or Paralympic discipline', test: 'any' },
      { label: 'International result or top-3 national ranking', test: 'intlOrTop3' },
    ],
    asks: [{ key: 'passport', label: 'Sports Passport', auto: true }, { key: 'nomination', label: 'Nomination by your coach', auto: false }],
  },
  {
    id: 'blufin-equipment', orgId: 'blufin', mode: 'rolling',
    title: 'Equipment bank: racing wheelchairs, prosthetics, suits',
    pitch: 'Rolling requests for competition equipment for para athletes.',
    support: [['Grant', 'Up to ₹1,50,000, paid to the supplier'], ['Decision', 'Within 3 weeks']],
    seats: null, opens: '2026-04-01', closes: '2027-03-31', decision: 'Rolling',
    criteria: [{ label: 'Para athlete', test: 'para' }, { label: 'State-level result or higher', test: 'levelSince', arg: { level: 'State', year: 2024 } }],
    asks: [{ key: 'passport', label: 'Sports Passport', auto: true }, { key: 'quote', label: 'Supplier quotation', auto: false }],
  },
]

// Seeded applications to Blufin's accelerator (foundation review demo)
export const SEED_APPLICATIONS = {
  'blufin-psa-2027': [
    { athleteId: 'kavin', stage: 'Panel review', coach: true, video: true, at: '2026-11-16', score: [4, 4, 5] },
    { athleteId: 'fatima', stage: 'Panel review', coach: true, video: true, at: '2026-11-17', score: [5, 4, 4] },
    { athleteId: 'arun', stage: 'Screened', coach: true, video: false, at: '2026-11-18' },
    { athleteId: 'tejas', stage: 'Screened', coach: true, video: true, at: '2026-11-19' },
    { athleteId: 'gurpreet', stage: 'Applied', coach: false, video: true, at: '2026-11-20' },
    { athleteId: 'pallavi', stage: 'Applied', coach: true, video: false, at: '2026-11-21' },
    { athleteId: 'salman', stage: 'Applied', coach: false, video: false, at: '2026-11-21' },
    { athleteId: 'nandini', stage: 'Applied', coach: true, video: true, at: '2026-11-21' },
  ],
}

// Blufin's current portfolio: what a foundation tracks after selection
export const PORTFOLIO = {
  blufin: {
    donor: 'tidewater',
    period: 'Apr to Nov 2026',
    athletes: [
      { athleteId: 'karthik', programme: 'Para Swim Accelerator 2026', committed: 300000, spent: 236000, checkIn: 'On track', lastCheckIn: '2026-11-15', next: 'WPS World Series, Berlin (Apr 2027)' },
      { athleteId: 'aditya', programme: 'Para Swim Accelerator 2026', committed: 240000, spent: 151000, checkIn: 'On track', lastCheckIn: '2026-11-12', next: 'Junior para nationals (Feb 2027)' },
      { athleteId: 'ruhi', programme: 'Multi-sport pilot', committed: 200000, spent: 184000, checkIn: 'Needs attention', note: 'Wheelchair repair delayed training for 3 weeks', lastCheckIn: '2026-10-30', next: 'ITTF Para Open, Egypt (Feb 2027)' },
      { athleteId: 'dev', programme: 'Equipment bank', committed: 120000, spent: 120000, checkIn: 'Completed', lastCheckIn: '2026-09-01', next: 'National para badminton trials (Jan 2027)' },
      { athleteId: 'irfan', programme: 'Para Strength Fund', committed: 180000, spent: 42000, checkIn: 'On track', lastCheckIn: '2026-11-18', next: 'WPPO World Cup (Mar 2027)' },
    ],
    spendByCategory: [['Coaching and pool time', 268000], ['International competition and travel', 241000], ['Equipment', 156000], ['Sports science and medical', 68000]],
  },
}

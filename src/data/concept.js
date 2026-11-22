export const PROBLEM = [
  'An athlete\'s sporting record is scattered: certificates in a folder, results on federation PDFs, medals on Instagram, funding asks on WhatsApp.',
  'Funders, coaches, brands and selectors have no single place to find athletes, check their results, or see who already backs them.',
  'Support staff (coaches, nutritionists, physios, psychologists) have no portable record of the athletes they built.',
  'Funding calls, trials and competition entries are announced across dozens of websites and social accounts, and athletes miss deadlines.',
]

export const BENCHMARKS = [
  {
    name: 'LinkedIn', region: 'Global', category: 'Professional network',
    what: 'Profiles for people and pages for organisations, experience timelines, a follow-and-connect feed. Pro athletes are joining in growing numbers to build brands beyond their sport.',
    borrow: 'One graph for people and organisations. Experience timelines for coaches and support staff. Follow without needing a two-way connection.',
    gap: 'No structured sporting results, no verification by federations, no funding layer.',
  },
  {
    name: 'Hudl', region: 'US / Global', category: 'Video & stats',
    what: 'Every athlete gets a public profile with highlight reels and stats; athletes opt in to recruiting to unlock more detail for recruiters.',
    borrow: 'Opt-in discoverability levels. Highlights attached to results. A lifelong "digital scrapbook" of a career.',
    gap: 'Team-sport and school centric; little for para sport or individual Olympic disciplines in India.',
  },
  {
    name: 'Rivals (On3)', region: 'US', category: 'Verified recruiting',
    what: 'Athletes log stats and have their coach co-sign them for a verified stamp; unverified players are filtered out of coach searches.',
    borrow: 'Coach and federation co-signing of results. Verified results rank higher in searches.',
    gap: 'Paid, US college football focused.',
  },
  {
    name: 'NCSA & SportsRecruits', region: 'US', category: 'Recruiting marketplace',
    what: 'Recruiting profiles built to coach specifications; college coaches publish "Roster Needs" that match against athlete profiles; athletes are notified when coaches view or follow them.',
    borrow: 'Organisations publish needs (funding calls, trials) that auto-match athlete profiles. Profile-view notifications.',
    gap: 'Pay-to-play premium tiers; aimed at families buying recruiting services.',
  },
  {
    name: 'FieldLevel', region: 'US', category: 'Coach-led network',
    what: 'Athletes are invited by their current coaches to become searchable; free for athletes and coaches.',
    borrow: 'Coaches can create and manage profiles for their athletes. Free for athletes.',
    gap: 'Closed network; no public storytelling or funding.',
  },
  {
    name: 'Strava', region: 'Global', category: 'Sports social feed',
    what: 'A feed of activities from people you follow, kudos, comments, clubs whose posts land in members\' feeds, and favourites pinned to the top.',
    borrow: 'One-tap "cheer" instead of likes. Organisation posts delivered to followers. Activity-first feed that rewards consistency.',
    gap: 'Endurance and fitness focused; no careers, funding or verification.',
  },
  {
    name: 'GMTM (Gametime)', region: 'US', category: 'Exposure network',
    what: 'Athletes from age 10 to pro build profiles; the more they engage, the more exposure they get from camps, coaches and brands.',
    borrow: 'Engagement-driven exposure: active athletes surface higher for funders and brands.',
    gap: 'Thin trust layer.',
  },
  {
    name: 'Opendorse', region: 'US', category: 'Sponsorship marketplace',
    what: 'Public marketplace where fans, brands and donors find athletes, filter by organisation and offer deals; athlete rate cards.',
    borrow: 'Brands post sponsorship briefs; athletes are "open to" sponsorship, speaking, collaborations.',
    gap: 'Built around US college NIL rules.',
  },
  {
    name: 'GoFundMe Olympians hub', region: 'Global', category: 'Crowdfunding',
    what: 'A centralised page of verified fundraisers for Olympic athletes.',
    borrow: 'One verified hub for athlete fundraisers, with backer counts and progress.',
    gap: 'Generic crowdfunding; no sporting context or proof of results.',
  },
  {
    name: 'Australian Sports Foundation', region: 'Australia', category: 'Sport fundraising',
    what: 'Sport-specific fundraising platform for clubs and athletes with tax-deductible donations and personalised campaign pages; parents manage accounts for under-18s.',
    borrow: 'Itemised campaign pages, tax receipts through a registered partner foundation, guardian-managed profiles for minors.',
    gap: 'Fundraising only; no profiles, feed or opportunities.',
  },
  {
    name: 'GLL Sport Foundation', region: 'UK', category: 'Athlete awards',
    what: 'Annual application window for athlete awards; most recipients receive no other funding.',
    borrow: 'Time-boxed funding calls with clear windows and eligibility, visible in one calendar.',
    gap: 'One funder, one form.',
  },
  {
    name: 'Khelo India NSRS & KIRTI', region: 'India', category: 'Government repository',
    what: 'National repository where athletes, coaches and academies register and receive a Khelo India ID; KIRTI runs grassroots talent identification for ages 9 to 18.',
    borrow: 'Link a Khelo India ID to a Blufin profile to import and verify results.',
    gap: 'Administrative registry; not a public profile, feed or funding marketplace.',
  },
]

export const PILLARS = [
  {
    title: 'Verified sports CV',
    body: 'Every athlete gets a public profile: sport, classification, personal bests, rankings and a medal cabinet of results. Results can be co-signed by a coach or verified by a federation, and verified results rank higher in searches.',
    features: ['Medal cabinet with gold, silver and bronze counts', 'Results timeline by level (international, national, state)', 'Verification by coach, federation or Paralympic body', 'Guardian-managed profiles for under-18s'],
  },
  {
    title: 'The ecosystem graph',
    body: 'Coaches, nutritionists, physios, psychologists, gyms, foundations, federations, brands and media all have profiles, and every relationship is a link: coached by, backed by, supported by.',
    features: ['Coaches list certifications, experience and athletes coached', 'Support staff list services and athletes worked with', 'Foundations show who they currently back and their programmes', 'Gyms list facilities, accessibility and programmes'],
  },
  {
    title: 'Opportunity marketplace',
    body: 'Foundations post funding calls and scholarships, federations post trials and competitions, brands post sponsorship briefs, gyms and experts offer in-kind support. Athletes apply with their profile, so verified results travel with the application.',
    features: ['One calendar of deadlines', 'Eligibility matching ("You match 3 open calls")', 'Apply with profile, track status', 'Coach recommendations attached to applications'],
  },
  {
    title: 'Transparent athlete fundraising',
    body: 'Athletes can raise money with an itemised budget, a progress bar and a list of backers. Partner foundations can match and route donations so donors get tax receipts.',
    features: ['Itemised budgets', 'Foundation matching', 'Backer counts and updates'],
  },
  {
    title: 'A feed built on sport',
    body: 'Results, selection news, funding calls, competition alerts, training logs and media highlights from the people and organisations you follow. Cheers instead of likes.',
    features: ['Filters: results, funding and calls, competitions, media', 'Share a result straight from the medal cabinet', 'Organisation posts reach all followers'],
  },
  {
    title: 'Discovery for funders and scouts',
    body: 'Search by sport, state, para or Olympic discipline, role, and whether an athlete is raising funds or open to sponsorship.',
    features: ['Filters by role, sport, state, para', '"Raising funds" and "open to sponsorship" filters', 'Shortlists (roadmap)'],
  },
]

export const PERSONAS = [
  ['Athlete', 'Meera, 21, S9 para swimmer, Bengaluru', 'Show my results in one place, get found by funders, raise for Berlin.'],
  ['Coach', 'Arjun, para swimming head coach', 'A record of the athletes I built; recommend my swimmers to funders.'],
  ['Support staff', 'Kiran, nutritionist; Siddharth, physio', 'Show the athletes I work with and offer pro bono capacity.'],
  ['Foundation', 'Blufin, GoSports, OGQ', 'Run funding calls, shortlist verified athletes, show impact.'],
  ['Federation', 'PCI, SFI, AFI', 'Publish trials and entries, verify results.'],
  ['Brand & media', 'Stride, Podium Daily', 'Find athletes to sponsor and stories to tell.'],
]

export const ROADMAP = [
  ['Demo (this build)', 'Profiles for every role, medal cabinet, add a result, feed with filters, follow and cheer, opportunities with apply, athlete fundraising, discover.'],
  ['MVP (3 months)', 'Real accounts, coach co-sign, organisation pages with admins, funding-call applications inbox for foundations, email alerts for deadlines.'],
  ['V1 (6 to 9 months)', 'Federation verification API and Khelo India ID linking, partner-routed donations with tax receipts, guardian consent flows, highlights video.'],
  ['V2', 'Shortlists and scouting tools for funders, brand deal workflow, regional languages, WhatsApp updates.'],
]

export const METRICS = [
  ['Verified athlete profiles', 'Profiles with at least one co-signed or federation-verified result'],
  ['Applications per call', 'Average applications per funding call, and share from verified profiles'],
  ['Rupees routed to athletes', 'Fundraising and grants closed through the platform'],
  ['Weekly active organisations', 'Foundations, federations and brands posting or reviewing'],
]

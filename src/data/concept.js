export const INSIGHT = 'Indian sport is fragmented. Athletes, coaches, physios, nutritionists, academies, foundations and federations each keep their own records, and they find each other through whoever they happen to know. The proof that matters (results, age, sport class, certifications) lives in PDFs, photocopies and WhatsApp forwards. Blufin Discover puts everyone in one place with information verified by whoever issued it, so everyone becomes discoverable and the ecosystem starts working as one.'

export const JOBS = [
  {
    who: 'Athlete', example: 'Meera, 21, S9 para swimmer, Bengaluru',
    jobs: ['Prove my results without attesting photocopies again', 'Know which circulars and deadlines apply to me', 'Get funded for the season ahead', 'Claim sports-quota jobs and admissions later'],
    pains: ['Circulars arrive as forwarded PDFs; deadlines get missed', 'Every foundation has a different form', 'Classification status and ID renewals are easy to lose track of'],
    built: ['Sports Passport', 'Today: only what applies to me', 'Apply with my passport'],
  },
  {
    who: 'Coach, physio, nutritionist', example: 'Arjun Nair, para swimming coach; Siddharth Rao, physio',
    jobs: ['Be found by athletes and academies that need me', 'Show certifications that people can trust', 'Show who I actually work with'],
    pains: ['Credentials are just lines in a bio', 'Work comes only through word of mouth', 'Nothing links my record to my athletes\' results'],
    built: ['Profile with credentials verified by the issuing body', 'Connections confirmed by both sides', 'Listed in Discover by sport and state'],
  },
  {
    who: 'Academy or gym', example: 'LaneSix Aquatics, Bengaluru',
    jobs: ['Show facilities and programmes', 'Show which athletes train here and who coaches them', 'Be checked by funders and federations'],
    pains: ['Every academy claims champions', 'Funders cannot easily check facilities'],
    built: ['Academy profile with verified checks', 'Athletes and staff linked to it'],
  },
  {
    who: 'Foundation', example: 'Blufin, GoSports, OGQ',
    jobs: ['Find athletes with real potential, often before they apply', 'Run a fair call and select on evidence', 'Track athletes after selection', 'Report impact to CSR donors'],
    pains: ['Self-reported results are hard to check', 'Panels spend time on paperwork, not judgement', 'Impact reports are assembled by hand'],
    built: ['Discover unbacked talent, with a watchlist and invites', 'Calls with criteria checked automatically', 'Review board showing what is verified', 'Impact report from verified results'],
  },
  {
    who: 'State federation', example: 'Karnataka Swimming Association',
    jobs: ['Run age-group championships that pick the state team', 'Make sure every swimmer has a valid SFI UID', 'Publish results and selection lists', 'Issue certificates (Form 2)'],
    pains: ['Circulars reach clubs, not always swimmers', 'Ineligible entries discovered at the venue', 'Certificate requests handled one by one'],
    built: ['Targeted circulars with reach preview', 'Registry with expired-ID reminders', 'Publish results straight to passports', 'Verification queue'],
  },
  {
    who: 'National federation', example: 'Badminton Association of India',
    jobs: ['Allot player IDs and verify age', 'Run the ranking circuit and selection tournaments', 'Send entries to international events', 'Fight age fraud'],
    pains: ['Junior players registered on medical age certificates', 'Venue and date changes need to reach every entrant', 'Rankings, IDs and results live in separate places'],
    built: ['Age-proof review in the registry', 'Circulars that check BAI ID and age proof at entry', 'Results that update passports'],
  },
]

export const PASSPORT_FIELDS = [
  ['Federation IDs', 'SFI requires a valid UID for the current season for national entries; BAI accepts no entry without a Player ID and age proof. The passport shows each ID and whether it is valid this season.'],
  ['Verified date of birth', 'Age fraud is a live problem in junior sport. BAI runs an age-verification procedure with bans for fraud. A federation-verified birth record is the single most useful trust signal on a junior profile.'],
  ['Sport class and international status', 'Para athletes carry a sport class and a status (New, Review, Review with a fixed date, Confirmed). Status decides which World Para Swimming competitions they can enter, so it belongs next to the class.'],
  ['International stamps', 'Every international competition, shown as a passport stamp with country, date and result. It is the fastest way for a selector or funder to read a career.'],
  ['Results by level, with their source', 'International, national, Khelo India, state, university, school. Each shows whether the organiser published it, a coach co-signed it, or the athlete reported it.'],
  ['Standards and rankings', 'Personal bests against the qualifying time that matters next, such as a World Championships MQS, and current rankings.'],
  ['Sports-quota certificates', 'Government jobs and admissions ask for Form 1 (international, from the national federation), Form 2 (national, from the state association), Form 3 (university) and Form 4 (school). Federations can issue them digitally when they publish results.'],
  ['Connections', 'Coach, physio, nutritionist, academy, foundation backing and federations, each linked to its own verified profile and confirmed by both sides. Government schemes such as TOPS or Khelo India Athlete status sit alongside.'],
  ['Season plan and budget', 'The goal for the season and an itemised budget, with what is already secured. This is what funders actually decide on.'],
]

export const FOUNDATION_FLOW = [
  ['Scout', 'Many foundations find athletes through coaches and scouts before any call opens. OGQ, for example, works with a network of coaches and scouts and judges medal potential.'],
  ['Call', 'Others run time-boxed calls or programme windows with eligibility rules. GoSports and Hyundai\'s Samarth Para Sports Programme opened applications for a fixed window in June 2026.'],
  ['Screen and panel', 'Eligibility check, then an expert panel, sometimes an interview. Governing bodies may be asked to endorse.'],
  ['Support and check-ins', 'Grants are spent across coaching, travel, equipment and sports science, with regular check-ins.'],
  ['Report', 'Corporate donors fund this under Schedule VII item (vii) of the Companies Act and need to see impact. Government has said there are no specific indicators to assess the impact of CSR money routed to sport through NSDF.'],
]

export const PRINCIPLES = [
  ['Everyone, in one place', 'Athletes, support staff, academies, foundations and federations share one directory, so anyone can find anyone.'],
  ['Records, not posts', 'The core object is a verified record. Celebration (Wins) is built from it, not the other way round.'],
  ['Connections are confirmed', 'A coach appears on an athlete\'s profile only when both sides confirm it.'],
  ['Verification flows from the source', 'Federations publish the results they already hold. Athletes never have to prove the same medal twice.'],
  ['Eligibility is computed', 'Circulars and calls carry rules. Athletes only see what applies to them, already checked. Funders only read applications that qualify.'],
  ['One record, many uses', 'The same passport enters events, applies for funding, backs a sports-quota job application and shows sponsors who you are.'],
  ['Juniors are managed with guardians', 'Under-18 profiles are run with a parent or guardian, who also receives circulars.'],
]

export const BENCHMARKS = [
  ['LinkedIn', 'Identity and organisation pages', 'People and organisations on one graph', 'Built for careers, not sporting proof'],
  ['Hudl, Rivals (On3)', 'Athlete profiles; coach co-signed stats', 'Verified results rank higher in searches', 'US school and college focus'],
  ['NCSA, SportsRecruits', 'Recruiting profiles; coaches post roster needs', 'Organisations post needs that match against profiles', 'Pay-to-play premium tiers'],
  ['Strava', 'Feed, kudos, clubs', 'Lightweight cheering on wins', 'No verification or careers'],
  ['GoFundMe, Australian Sports Foundation', 'Athlete fundraising, tax-deductible in Australia', 'Itemised season budgets', 'Funding only'],
  ['Khelo India NSRS', 'National registry with Khelo India IDs', 'Link government IDs to the passport', 'A registry, not a tool athletes use'],
]

export const ROADMAP = [
  ['Pilot with one state and one foundation', 'Karnataka swimming and Blufin: results publishing, circulars, one call, impact report.'],
  ['Add national federations', 'SFI UID and BAI ID lookups, age-proof workflow, digital Form 1 and Form 2.'],
  ['Open to more funders', 'Calls and scouting for GoSports, OGQ and CSR teams; partner-routed donations with tax receipts.'],
  ['Athlete-facing extras', 'Regional languages, WhatsApp delivery of circulars, guardian accounts.'],
]

export const SOURCES = [
  ['SFI circular: Sub-Junior Nationals 2025 (UID mandatory)', 'https://www.swimming.org.in/wp-content/uploads/2025/07/Final-Circular-SubJunior-SW2025.pdf'],
  ['Deccan Herald: KSA splits age groups for state championships', 'https://deccanherald.com/amp/story/sports%2Fother-sports%2Fksa-aims-for-big-splash-with-rule-change-3101917'],
  ['BAI: player registration and age certificate', 'https://www.badmintonindia.org/download/players/ageformat/New BAI ID form for Junior.pdf'],
  ['BAI: Voluntary Age Rectification Scheme circular', 'https://badmintonindia.org/download/news/Circular for Voluntary Age Rectification Scheme.pdf'],
  ['BAI: national ranking guidelines', 'https://www.badmintonindia.org/download/news/INFO-National-Ranking-Guidelines.pdf'],
  ['CAG: sports quota recruitment norms (Forms 1 to 4)', 'https://cag.gov.in/uploads/recruitment_notice/Sports_Quota_Recruitmen_norms.pdf'],
  ['British Swimming: WPS classification status', 'https://www.britishswimming.org/performance/para-swimming/classification/classification-status/'],
  ['PIB: TOPS out-of-pocket allowance', 'https://pib.gov.in/PressReleasePage.aspx?PRID=2041702'],
  ['Lok Sabha answer on CSR in sport and NSDF', 'https://eparlib.sansad.in/bitstream/123456789/2988619/1/AU975_qg9yjO.pdf'],
  ['OGQ: selection process', 'https://ogq.org/selection-process/'],
  ['Hyundai and GoSports: Samarth applications 2026-27', 'https://www.hyundai.com/in/en/hyundai-story/media-center/press-release/hmi-foundation-gosports-kick-off-samarth'],
  ['Rivals (On3): verified profiles', 'https://www.on3.com/rivals/jaidyn-hampton-277147/claim-profile/'],
  ['SportsRecruits: roster needs', 'https://sportsrecruits.com/athletes/insights'],
  ['Australian Sports Foundation', 'https://asf.org.au/'],
  ['Khelo India NSRS', 'https://nsrsold.kheloindia.gov.in/home/about'],
]

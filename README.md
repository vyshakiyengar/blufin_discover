# Blufin Discover

A front-end demo of Blufin Discover: one verified sports record for every Indian athlete. Federations write results into it, athletes own it and use it to enter events and apply for funding, and foundations fund from it and report impact to donors.

The design and the research behind it are in [CONCEPT.md](CONCEPT.md) and on the `/concept` page.

This is a demo with sample data. All people are fictional. Organisation names are used for illustration; every notice, call, list and figure attached to them is sample content. There is no backend: everything is saved in the browser's local storage (use "Reset demo data" in the account menu).

## The four seats

Each seat has a short guide in the bottom corner.

- **Athlete (Meera Iyer, S9 para swimmer):** Today page with only the circulars and calls that apply to her, checked against her passport; a Sports Passport with verified identity and IDs, classification status, international stamps, results by level with their source, standards, sports-quota certificates, team, backing and season budget; add a result and ask the organiser to verify it; apply to a call with the passport.
- **Foundation (Blufin):** calls with criteria checked automatically and a live count of eligible athletes; a review board showing what is verified for each applicant; scouting with a watchlist and invites; a portfolio and an impact report for a CSR donor.
- **State federation (Karnataka Swimming Association):** verify results athletes claim; publish official results straight to passports and issue certificates; write circulars targeted by sport, age group and para class with a reach preview; remind swimmers with expired SFI UIDs.
- **National federation (Badminton Association of India):** registry with age-proof review; ranking-tournament circulars that check BAI Player ID and age proof; publish results.

Actions carry across seats: a result Meera claims appears in KSA's queue, and once verified it turns green on her passport; her application appears on Blufin's review board.

## Run locally

```bash
npm install
npm run dev
```

Deployed on Vercel from `main` (Vite preset; `vercel.json` rewrites all routes to `index.html`). Built with React, Vite, React Router and Tailwind CSS.

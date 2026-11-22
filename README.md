# Blufin Discover

Front-end demo of Blufin Discover: a talent discovery and community platform for Indian sport. Athletes keep a verified record of their results, coaches and support staff show the athletes they've built, and foundations, federations and brands post funding calls, trials and sponsorships.

This is a demo with sample data. All people are fictional. Organisation profiles use public names for illustration; their posts and calls are not real announcements. There is no backend: everything you do is saved in your browser's local storage.

## What you can do

- Sign in as Meera Iyer (S9 para swimmer), create a new athlete profile, or switch to a coach, foundation, federation, nutritionist or brand account
- Add a result with medal, level, proof and a verification request, and share it to the feed
- Browse a feed of 50 posts: results, funding calls, competition alerts, selection news, media highlights; filter by type
- Cheer, comment and follow
- View profiles for every role: athletes (medal cabinet, personal bests, rankings, team, itemised fundraiser), coaches (certifications, experience, athletes coached), support staff, gyms, foundations (athletes backed, open calls), federations
- Discover with search and filters (sport, state, para or Olympic, raising funds, open to sponsorship, verified)
- Apply to opportunities with your profile; as the organising foundation, see ranked applicants and shortlist
- Read the concept and benchmarking at `/concept` (also in [CONCEPT.md](CONCEPT.md))

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import the repo in Vercel. Framework preset: Vite. `vercel.json` rewrites all routes to `index.html`.

Built with React, Vite, React Router and Tailwind CSS.

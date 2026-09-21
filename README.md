# IlliniHousing

A full-stack apartment review platform built for UIUC students. Aggregates 430+ listings across Champaign-Urbana, lets verified tenants leave structured reviews, and uses Claude Haiku to generate AI summaries and power a real-time chat assistant.

**Live:** [illinihousing.vercel.app](https://illinihousing.vercel.app)

---

## Problem

UIUC students sign leases with almost no reliable information. Landlord review sites are generic and unstructured. Most students find out about mold, pest problems, or deposit disputes only after moving in. IlliniHousing fixes that with verified, structured reviews tied to specific buildings and landlords.

---

## What I Built

### Data pipeline
- Wrote 7 Python scrapers (one per major landlord) using `requests` and `BeautifulSoup` to pull listing data from landlord websites — some via HTML parsing, others via their internal REST APIs
- Scrapers group unit-level listings into buildings, normalize addresses for deduplication, and upsert into Supabase via the service role key
- Integrated the Google Places API to pull aggregate Google ratings for each landlord

### Backend / Database
- Postgres database on Supabase with tables for apartments, landlords, reviews, and user profiles
- Row-level security (RLS) policies so users can only edit their own reviews
- Supabase Auth for user accounts with verified tenant badges

### Frontend
- Next.js 14 App Router with server components for fast data fetching
- Apartment detail pages with satellite imagery (Google Maps Static API), amenity breakdown, 6-axis rating bars, landlord profile with Google rating, and per-building leasing URLs
- Interactive map (Mapbox GL) on the results page with color-coded pins by rating
- Preference quiz that scores and ranks apartments by budget, location, and amenities

### AI features
- **AI summary:** On demand, fetches all reviews for an apartment, sends them to Claude Haiku with a structured prompt, and stores the output (pros, cons, verdict) as JSON in the DB — shown permanently on the apartment page
- **AI chat assistant:** Floating chat widget on every page. Detects search intent in the user's message, fetches a snapshot of live apartment data from Supabase, injects it as context, and returns natural language recommendations. Hallucination is prevented by design — the model only synthesizes data provided in the prompt, never retrieves from training memory

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Database | Supabase (Postgres + Auth + RLS) |
| Scrapers | Python, Requests, BeautifulSoup |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5`) |
| Maps | Mapbox GL JS, Google Maps Static API |
| Landlord ratings | Google Places API |
| Deployment | Vercel |

---

## Scale

- **430+** apartments listed across Champaign-Urbana
- **7** landlords scraped and rated
- **6** review categories per apartment (maintenance, responsiveness, noise, cleanliness, value, pest control)
- Red flag detection system (mold, deposit disputes, hidden fees, safety concerns)

---

## Key Engineering Decisions

**Why Next.js App Router?** Server components let me fetch apartment data directly from Supabase on the server before sending HTML to the client — no loading spinners for the main content, better SEO.

**Why Supabase over a custom backend?** Supabase gives Postgres, Auth, and row-level security out of the box. It let me move fast without building an auth system from scratch, while still having full SQL control.

**Why Claude Haiku for AI features?** Fast and cheap enough to run on demand per page visit. The summaries are cached in the DB after first generation so repeat visitors don't incur API cost.

**Deduplication approach:** Address normalization — strip punctuation, lowercase, extract street number and primary street word, then match against existing DB records before inserting.

---

## Author

Saleh Salavudheen · [salehsalavudheen@gmail.com](mailto:salehsalavudheen@gmail.com)

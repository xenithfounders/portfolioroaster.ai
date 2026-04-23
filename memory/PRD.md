# PortfolioRoast.ai — PRD

## Original Problem Statement
User asked: "instead of stripe, use razorpay". Build the PortfolioRoast.ai app (per the uploaded HTML artifact) from scratch — an AI that reviews developer portfolios like a brutally honest FAANG senior engineer. 1 free roast per email, then ₹29 per roast via Razorpay.

## User Personas
- **Indian CS/IT student/graduate** applying for jobs, wants honest portfolio feedback
- **Freelance / early-career developer** iterating on their personal site/resume
- **Recruiter-tired devs** who want savage specifics, not polite generic tips

## Core Requirements (static)
1. Brutal, specific AI roast: score 1–10, 5 callouts, 5 fixes, one-liner verdict
2. Email capture for 1 free roast per address
3. ₹29 one-time payment via **Razorpay** for each subsequent roast (INR, UPI/Cards/Netbanking)
4. Shareable meme-card results page at `/roast/:id` (Twitter share)
5. Terminal / brutalist aesthetic (dark #0f0f0f, red #ff4500, Space Mono, hard shadows, rounded-none)

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Routes under `/api/*`.
  - `POST /api/roast/eligibility`, `POST /api/payment/create-order`, `POST /api/payment/verify`, `POST /api/roast/generate`, `GET /api/roast/{id}`
  - Collections: `emails`, `roasts`, `payments`
  - AI: Gemini 2.5 Pro via `emergentintegrations` (Emergent LLM key)
  - Payments: `razorpay` Python SDK with signature verification
- **Frontend**: React (CRA) + Tailwind + lucide-react + react-router + `react-razorpay` / hosted Razorpay Checkout.js
  - Pages: `/` (landing + form), `/roast/:id` (shareable result card)

## What's been implemented (2026-04-23)
- [x] Razorpay order creation + signature verification (backend)
- [x] Gemini 2.5 Pro roast engine with persona + strict JSON schema
- [x] URL scraping fallback; text input fallback
- [x] Email-gated free roast + payment-gated paid roast (one payment = one roast)
- [x] MongoDB persistence for emails, roasts, payments
- [x] Brutalist landing page: hero, marquee, terminal form, how-it-works, sample burn, pricing, FAQ, footer
- [x] Shareable `/roast/:id` meme card with Twitter share
- [x] 12/12 backend pytest cases passing, frontend e2e verified

### Iteration 2 (2026-04-23)
- [x] Multi-platform share grid: X/Twitter, LinkedIn, WhatsApp, Facebook, Telegram, Reddit
- [x] Copy-link button (with clipboard fallback + "Link copied!" confirmation)
- [x] Native Web Share API button (auto-shown on mobile-supported browsers)
- [x] Four legal pages with routes + brutalist styling:
  - `/terms` — Terms & Conditions
  - `/privacy` — Privacy Policy
  - `/refund` — Cancellation & Refund Policy
  - `/contact` — Contact Us (contact@pixelbond.in, xenithfounders@gmail.com, +91 93500 15443)
- [x] Footer updated: links to all 4 legal pages; brand line changed to "Built with scars by XenithHQ"

## Prioritized Backlog
- **P1** — Re-roast tier (₹99 "Deep Audit" pack: resume + LinkedIn + GitHub)
- **P1** — OG image generator (`/api/og/:id`) for better Twitter/LinkedIn previews
- **P2** — GitHub API deep integration (repo stars, last-commit, README presence)
- **P2** — Razorpay webhook endpoint for reconciliation
- **P2** — Simple admin dashboard (revenue, roasts/day, email list)
- **P3** — PDF resume upload (currently text paste only)
- **P3** — Move `_scrape_url` to `httpx.AsyncClient` (currently blocks event loop up to 12s)

## Next Action Items
1. Test the Razorpay checkout interactively with test card `4111 1111 1111 1111` / any future expiry / any CVV / any name, or UPI `success@razorpay`
2. Decide on adding OG image generation for viral Twitter shares
3. Consider adding the ₹99 Deep Audit tier once you have ~50 paying users

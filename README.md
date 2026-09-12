# Merit — Behavioral Banking Loyalty Infrastructure

A hackathon MVP: banks reward *financial discipline*, not just spending.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm run start
```

## Pages

- `/` — public landing page (hero, three actors, how it works, flywheel, pitch)
- `/dashboard` — customer Overview (plan snapshot, streak, points, next reward)
- `/dashboard/plan` — behavior model visualization (income allocation, contextual rules)
- `/dashboard/activity` — transactions with classification confidence + correction
- `/dashboard/rewards` — unlocked/locked rewards
- `/dashboard/status` — behavioral credential (tier, history, portability preview)
- `/bank` — bank partner dashboard (portfolio metrics, churn/redemption charts, live feed)
- `/architecture` — data-flow + privacy diagram, ecosystem flywheel

## The live demo

State lives in one React context (`lib/demo-context.tsx`) mounted at the root layout, so
it's shared across every page **as long as you navigate with the in-app links** (not a
hard browser refresh, which resets the mock data on purpose).

- **Simulate Month** (top bar, any customer page) → plan hits target, +250 points,
  streak +1, Adidas reward unlocks, and a new row appears in the bank's live engagement
  feed — click through to `/bank` to show it updating live.
- **Simulate Emergency Expense** (top bar or Activity page) → adds a €450 healthcare
  transaction, banner confirms it's excluded from discretionary scoring, status/streak
  unaffected.
- Reset icon appears next to the buttons after the first simulation, to rerun the demo.

All bank-side metrics are clearly labeled **simulated demo data**.

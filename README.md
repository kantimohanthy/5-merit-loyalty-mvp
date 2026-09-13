# MERIT × G-Core — Behavioral Banking Loyalty Infrastructure

A fintech hackathon MVP: banks reward *financial discipline*, not just spending.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts.

---

## Live Deployments

* **GitHub Pages Static Demo**: [kantimohanthy.github.io/5-merit-loyalty-mvp/](https://kantimohanthy.github.io/5-merit-loyalty-mvp/)
* **Vercel Production**: [5-merit-loyalty-mvp.vercel.app](https://5-merit-loyalty-mvp.vercel.app/)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Production build:

```bash
npm run build
npm run start
```

---

## GitHub Pages Static Demo Architecture

GitHub Pages is a static hosting platform. The GitHub Pages build uses:
- **Next.js Static Export** (`output: "export"`, `basePath: "/5-merit-loyalty-mvp"`)
- **Browser-Native Central Demo Engine** (`lib/demo-engine.ts`) with `localStorage` persistence (`MERIT_DEMO_ENGINE_STATE_V2`)
- **Zero Runtime Server Dependencies**: No Node.js server or writable SQLite required during jury evaluation. All simulation actions execute deterministically in the client browser.

---

## Jury-Facing Customer & Admin Experience

- **Customer App (`/bank`)**: Interactive banking interface with real-time balance tracking, category re-classification, and rate advantages.
- **MERIT Ecosystem (`/ecosystem`)**: Unified overview displaying verified streaks, multi-tier progression, budget allocation, Sarajevo summit pass celebration, and G-Market privileges.
- **Bank Admin (`/bank-admin`)**: Live portfolio event stream audit log reflecting real-time simulation events triggered across customer sessions.
- **G-Pass (`/ecosystem/passport`)**: Portable, zero-knowledge ecosystem identity credential preserving user reputation across financial partners.

---

## Simulation Controls

- **Simulate Month** → Advances month, increments streak (+1 mo), recalculates discretionary ratio, awards +250 GP, unlocks reward `r1`.
- **Simulate Emergency Expense** → Injects $450 healthcare expense, classifies as **PROTECTED**, adjusts target baseline without penalty.
- **Simulate Overspend** → Injects $380 discretionary expense, adjusts ratio, updates status to supportive *"Currently above discretionary target range"*.
- **Simulate Transfer** → Injects matching $500 transfer pair, flags as internal transfer, excludes from behavioral progress.
- **Reset Simulation** → Flushes `localStorage`, restores canonical initial demo state across all 19 routes for immediate repeatability.

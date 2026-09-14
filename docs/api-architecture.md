# API Architecture & Endpoint Specification

This document details the HTTP API endpoints implemented in G-Core, categorized by domain function and operational environment.

---

## Endpoint Classification Overview

Endpoints are explicitly divided into:
1. **Production-Style Interfaces**: Server-side endpoints backed by SQLite persistence (`lib/server/db.ts` & `lib/server/pipeline.ts`), adhering to REST principles and strict privacy boundaries.
2. **Hackathon Interactive Simulation Endpoints**: Convenience endpoints designed to trigger state transitions or client-side demonstration states during interactive evaluation.

---

## 1. Customer Profile Domain

### `GET /api/profiles`
* **Type**: Production-Style Interface
* **Description**: Fetches the active customer profile details, income baselines, and budget targets.
* **Response**: Customer metadata, verified history months, and current tier status.

---

## 2. Behavioral Evaluation Domain

### `GET /api/behavior/evaluate`
* **Type**: Production-Style Interface
* **Description**: Triggers the server-side behavioral pipeline (`runPipeline`).
* **Execution**: Normalizes transactions, executes anti-gaming transfer exclusion, applies protected expense rules, calculates the 0–1 Behavior Index, and returns dimension scores with reason codes.
* **Query Parameters**: `customerId` (default: `c1`)

---

## 3. Rewards & Campaign Domain

### `GET /api/rewards/eligible`
* **Type**: Production-Style Interface
* **Description**: Evaluates active partner campaigns against current customer behavioral state and category affinities. Returns unlocked vs. locked reward states with explicit "why" explainability arrays.

---

## 4. G-Core Ecosystem Domain

### `GET /api/gcore/state`
* **Type**: Production-Style Interface / Derived Egress
* **Description**: Fetches pseudonymous G-Pass identity, GP point balance, lifetime GP, tier index, and recent ledger activity for a customer.

### `GET /api/gcore/gmarket`
* **Type**: Production-Style Interface
* **Description**: Retrieves available G-Market experience, access, and privilege items along with real-time scarcity totals and claim counts.

### `POST /api/gcore/claim`
* **Type**: Production-Style Interface
* **Description**: Executes a G-Market item claim. Checks GP balance sufficiency and minimum tier prerequisites, deducts GP, increments claimed count, and appends a ledger transaction.

---

## 5. Bank Portfolio Domain

### `GET /api/bank/metrics`
* **Type**: Production-Style Interface
* **Description**: Provides aggregate portfolio metrics for bank administration dashboards (`/bank-admin`), including active customer counts, average behavioral score, total savings catalyzed, and live engagement event feed.

---

## 6. Hackathon Simulation Domain (Testing / Demo Controls)

> [!NOTE]
> These endpoints exist to support interactive evaluation in demo environments and client-side web static fallbacks.

| Endpoint | Method | Action |
| :--- | :--- | :--- |
| `/api/simulation/month` | `POST` | Advances calendar month (+1 mo streak, injects $150 savings deposit, triggers pipeline run). |
| `/api/simulation/emergency` | `POST` | Injects a $450 healthcare expense, verifies automatic protected category flag. |
| `/api/simulation/overspend` | `POST` | Injects a $250 discretionary shopping transaction, updating status to `AT_RISK`. |
| `/api/simulation/transfer` | `POST` | Injects matching $500 internal transfer pair, verifying anti-gaming detection. |
| `/api/simulation/switch-bank` | `POST` | Simulates bank migration: resets bank-local metrics to 0 while preserving G-Pass identity & GP balance. |
| `/api/simulation/reset` | `POST` | Flushes SQLite database and resets state to canonical initial baseline. |

---

## 7. Ecosystem Network Domain

### `GET /api/network/metrics`
* **Type**: Production-Style Interface
* **Description**: Aggregates multi-bank ecosystem network stats (total partner banks, total issued G-Pass credentials, total GP awarded, G-Market redemption velocity).

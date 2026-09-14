# G-Core Behavioral Engine

### Continued engineering development of the G-Core behavioral banking prototype

> [!NOTE]
> G-Core began as a 24-hour FinTech prototype created at **Adria Hack Sarajevo 2026**.
> This repository represents the **continued engineering development** of the system, focusing on transforming the original prototype into a rigorous, testable, explainable, and architecturally sound behavioral-finance engine.
> 
> * **Historical Hackathon Showcase Repository**: [kantimohanthy/Team-Empty-Sarajevo-Hackathon](https://github.com/kantimohanthy/Team-Empty-Sarajevo-Hackathon) *(preserved & untouched)*
> * **Historical Hackathon Live Site**: [kantimohanthy.github.io/Team-Empty-Sarajevo-Hackathon/](https://kantimohanthy.github.io/Team-Empty-Sarajevo-Hackathon/)

---

## 1. Project Purpose

Many retail banking loyalty programs are driven by transaction volume, card usage, product engagement, or account value. G-Core explores an alternative paradigm: **rewarding financial discipline, budget consistency, and savings regularity**. By evaluating how effectively customers manage their self-determined or bank-advised budget baselines, G-Core enables financial institutions to incentivize healthy financial habits without encouraging unnecessary debt or discretionary overspending.

---

## 2. Current System

The current system implements a server-side pipeline that ingests transaction feeds, applies rules-based classification, isolates protected expenses, detects internal transfer gaming patterns, evaluates a multi-dimensional behavioral index, and manages a pseudonymous loyalty identifier and prototype cross-institution portability concept (G-Pass).

---

## 3. Architecture

```
[ Transaction Feed ]
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Bank-Side Pipeline Engine (lib/server/pipeline.ts)      │
│                                                         │
│ 1. Classification Engine  ──> Rules-based merchant/MCC   │
│ 2. Context Detection      ──> Healthcare/Essential flag │
│ 3. Anti-Gaming Layer      ──> Internal transfer filter  │
│ 4. Behavior Engine        ──> Weighted 0-1 Index &      │
│                               Reason Codes              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Derived Pseudonymous Egress                             │
│ - G-Pass Hash (SHA-256)                                 │
│ - GP Delta & Tier Index                                 │
│ - Abstract Reason Codes                                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ G-Core Ecosystem & G-Market (lib/server/gcore-engine.ts)│
└─────────────────────────────────────────────────────────┘
```

---

## 4. Behavioral Evaluation

Behavior is evaluated across five fundamental financial discipline dimensions:

| Dimension | Key | Description | Weight |
| :--- | :--- | :--- | :--- |
| **Budget Consistency** | `budget` | Adherence to discretionary target spending limits. | 30% |
| **Payment Regularity** | `payment` | Regularity of fixed obligations and recurring payments. | 25% |
| **Savings Consistency** | `savings` | Frequency and stability of deposits into savings accounts. | 20% |
| **Liquidity Stability** | `liquidity` | Maintenance of positive liquidity buffer relative to commitments. | 15% |
| **Goal Completion** | `goal` | Ratio of savings achieved relative to monthly savings target. | 10% |

---

## 5. Deterministic Baseline

The behavioral discipline index is computed using a deterministic weighted formula:

$$\text{Behavior Index} = 0.30B + 0.25P + 0.20S + 0.15L + 0.10G$$

> [!IMPORTANT]
> **Model Parameter Disclaimer**: These weights are prototype design parameters inherited from the hackathon baseline. They are not empirically calibrated credit-risk coefficients. This metric is a behavioral discipline index, **NOT a credit score or default probability score**.

---

## 6. Context Detection

Not all expenses reflect discretionary spending choices. G-Core incorporates context detection to flag **protected essential expenses** (e.g., protected healthcare expenses, tuition). When flagged, protected transactions are excluded from discretionary budget spending totals, ensuring customers are not unfairly penalized for unavoidable life events.

---

## 7. Anti-Gaming

To prevent users from gaming loyalty rewards by repeatedly cycling funds between personal accounts to simulate "savings activity", G-Core includes an automated anti-gaming detection layer (`lib/server/anti-gaming-engine.ts`):
* **Pattern Detection**: Identifies matching outflow and inflow transfer pairs of equal magnitude occurring within a 24-hour window.
* **Exclusion Enforcement**: Excludes both sides of detected internal transfers from behavioral progress counting.

---

## 8. Explainability

Every decision generated by the behavior and classification engines emits explicit, typed reason codes to maintain complete auditability:
* `PROTECTED_HEALTHCARE_EXPENSE`: Healthcare transaction isolated from discretionary spend.
* `INTERNAL_TRANSFER_EXCLUDED`: Internal account transfer pair excluded from savings calculation.
* `BUDGET_WITHIN_BASELINE`: Discretionary spend remained within target range.
* `BUDGET_ABOVE_BASELINE`: Discretionary spend exceeded target baseline.
* `PAYMENT_CONSISTENT`: Fixed payment obligations met consistently.
* `SAVINGS_TARGET_MET`: Monthly savings deposit target achieved.
* `UNKNOWN_CATEGORY_FALLBACK`: Unrecognized merchant defaulted safely to general category.

---

## 9. Data Boundary

G-Core is designed around an intended data-boundary architecture:
* **Bank Environment (Intended Architecture)**: Retains PII, raw transaction logs, account numbers, and exact balances.
* **G-Core Layer (Intended Architecture)**: Designed to receive only pseudonymous G-Pass hashes (`G-HEXSHA256`), GP point deltas, tier levels, and abstract reason codes.

For details, see [docs/data-boundary.md](./docs/data-boundary.md).

---

## 10. Automated Testing

The codebase includes automated unit tests implemented in Vitest covering key domain requirements:
1. Protected healthcare transactions do not penalize discretionary behavior.
2. Matching internal transfers are excluded by anti-gaming logic.
3. Normal discretionary purchases are included.
4. Legitimate savings contributions are counted.
5. GP points exhibit idempotency (no duplicate awards on repeated events).
6. Tier thresholds behave deterministically.
7. Unknown categories fall back safely.
8. Zero transaction states execute cleanly.
9. Edge monetary values are handled safely.
10. Identical inputs yield identical outputs.

Run tests via:
```bash
npm run test
```

---

## 11. Fairness

Evaluating financial behavior across diverse income levels presents complex challenges regarding income bias, capacity differentials, and demographic impact. For a comprehensive discussion on fairness considerations and regulatory validation requirements, see [docs/fairness.md](./docs/fairness.md).

---

## 12. Longitudinal Modeling

Future development focuses on expanding single-period evaluations into 3, 6, and 12-month rolling observation windows to evaluate trend stability, balance volatility, and shock recovery. See [docs/longitudinal-modeling.md](./docs/longitudinal-modeling.md).

---

## 13. API Architecture

API routes are structured into production-style interfaces backed by SQLite and hackathon simulation endpoints. See [docs/api-architecture.md](./docs/api-architecture.md).

---

## 14. Research Questions

1. Can behavioral consistency be normalized fairly across very different financial capacities?
2. Which interventions measurably improve engagement or financial outcomes?
3. How stable are behavioral dimensions across 3/6/12-month windows?
4. Which signals remain useful after controlling for income?
5. Can contextual rewards outperform generic loyalty offers?
6. What minimum derived information is needed by a shared loyalty layer?

---

## 15. Engineering Roadmap

* **v0.1 — Hackathon Baseline**: Core pipeline, rules-based classifier, anti-gaming, SQLite database.
* **v0.2 — Tests + Reason Codes**: Vitest suite, centralized model metadata (`v0.1-hackathon-baseline`), typed explainability reason codes.
* **v0.3 — Historical Rolling Windows**: 3/6/12-month rolling evaluation features and trend decay.
* **v0.4 — Fairness & Normalization Experiments**: Income-normalized baseline adjustments and capacity-neutral scoring models.
* **v0.5 — Bank API Abstraction**: Bank / Open Banking adapter abstraction for enterprise integration (with providers like Plaid as optional integration examples).
* **v0.6 — Longitudinal Dataset Research**: Empirical validation using anonymized longitudinal transaction datasets.
* **Future**: Validated predictive and personalization models where statistically justified.

---

## 16. Repository Structure

```
gcore-development/
├── app/                  # Next.js App Router pages and API routes
├── components/           # UI components
├── docs/                 # Engineering, fairness, longitudinal, & data boundary docs
│   ├── api-architecture.md
│   ├── data-boundary.md
│   ├── fairness.md
│   └── longitudinal-modeling.md
├── lib/
│   ├── demo-engine.ts    # Browser-native fallback engine for static deployment
│   ├── mock-data.ts      # Canonical mock data baselines
│   ├── types.ts          # Core TypeScript domain types
│   └── server/           # Server-side pipeline & domain logic
│       ├── anti-gaming-engine.ts
│       ├── behavior-engine.ts
│       ├── classification-engine.ts
│       ├── db.ts
│       ├── gcore-engine.ts
│       ├── model-metadata.ts
│       ├── pipeline.ts
│       └── reward-engine.ts
├── tests/                # Vitest unit test suite
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 17. Hackathon Origin

This repository evolved from the original 24-hour prototype created for Adria Hack Sarajevo 2026. The historical showcase repository remains archived at [Team-Empty-Sarajevo-Hackathon](https://github.com/kantimohanthy/Team-Empty-Sarajevo-Hackathon).

---

## 18. Limitations

* **Hackathon-Origin Architecture**: Dual-execution path exists (server SQLite pipeline vs browser `demo-engine.ts`).
* **Simulated Data**: Current deployment operates on synthetic mock customer transaction data.
* **Prototype Model Weights**: Heuristic weights are not credit-risk calibrated.
* **No Formal Fairness Validation**: System has not undergone demographic disparity audits.
* **No Longitudinal Outcome Validation**: Scores have not been empirically linked to default or default-mitigation rates.
* **No Production Bank Integration**: Lacks enterprise HSM/KMS cryptographic salt management.
* **No Regulatory Approval**: No legal or regulatory assessment has been completed for lending, credit-reporting, or protected-class decisioning use cases. In a European deployment context, operational use would require applicable GDPR and privacy assessment, including a Data Protection Impact Assessment (DPIA) where required.
* **No Production Security Certification**: Intended for software engineering research and prototype demonstration.
* **Prototype Cross-Institution Portability**: Currently demonstrated as a proof-of-concept identity mechanism.

---

## 19. Local Development

Install dependencies:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Run test suite:
```bash
npm run test
```

Type-check TypeScript:
```bash
npm run type-check
```

Build production distribution:
```bash
npm run build
```

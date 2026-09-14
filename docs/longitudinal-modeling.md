# Longitudinal Modeling & Predictive Analytics Horizon

> [!IMPORTANT]
> **STATUS NOTICE**: The features and modeling techniques described in this document represent **future engineering research concepts**. They are **not implemented predictive models** in the current `v0.1-hackathon-baseline` prototype codebase.

---

## 1. Overview of Longitudinal Requirements

The current baseline engine evaluates customer behavior using single-period monthly snapshots. Real-world financial discipline and credit resilience, however, are inherently temporal. A robust behavioral evaluation framework must evaluate dynamic time-series patterns over 3, 6, and 12-month rolling observation windows.

---

## 2. Proposed Longitudinal Feature Set

Future iterations of G-Core aim to extract time-series features across multi-month windows:

| Feature Dimension | Description | Observation Window |
| :--- | :--- | :--- |
| **Payment Consistency** | Variance in recurring obligation fulfillment dates relative to bill issue dates. | 3, 6, 12 months |
| **Savings Regularity** | Auto-correlation of periodic savings deposits across pay cycles. | 6, 12 months |
| **Balance Volatility** | Standard deviation of daily end-of-day balances normalized by median income. | 3, 6 months |
| **Shock Recovery Velocity** | Time required (in days/cycles) for discretionary spend to return to baseline after an essential shock. | 12 months |
| **Behavioral Trend ($\Delta B$)** | Linear slope of weighted behavioral indices over consecutive evaluation cycles. | 3, 6 months |
| **Intervention Responsiveness** | Quantified change in discretionary allocation following non-punitive spend alerts. | 6, 12 months |

---

## 3. Advanced Modeling Methodologies (Future Research)

When sufficient longitudinal transactional datasets are integrated, G-Core can evaluate advanced quantitative models:

### A. Gradient Boosting (XGBoost / LightGBM)
* **Goal**: Predict short-term delinquency risk or savings default probability using non-linear feature interactions (e.g., balance volatility combined with discretionary spikes).

### B. Time-Series Feature Engineering & Recurrent Architectures
* **Goal**: Capture temporal sequence dependencies using LSTM/GRU networks or Transformer-based encoders applied to raw vector sequence embeddings of daily merchant activity.

### C. HDBSCAN Exploratory Clustering
* **Goal**: Unsupervised grouping of customer behavioral archetypes (e.g., "Seasonal Saver", "High Volatility / High Income", "Fixed Income Optimizer") to tailor personalized budget baselines rather than relying on uniform static thresholds.

### D. Contextual Bandits
* **Goal**: Dynamic personalization of loyalty offer recommendations (G-Market & Partner Perks) to maximize long-term savings engagement without manual heuristic campaign definitions.

### E. Survival Analysis (Cox Proportional Hazards)
* **Goal**: Estimate time-to-default or time-to-churn as a function of behavioral score decay, enabling preemptive financial wellness interventions.

---

## 4. Current Baseline vs. Longitudinal Target State

```
Current Baseline (v0.1):
[Single Month Txns] ──> [Static Heuristic Rules] ──> [Monthly Behavior Index]

Future Target State (v0.x):
[12-Month Time Series] ──> [Rolling Feature Extractor] ──> [Longitudinal ML Models] ──> [Predictive Risk & Reward Engine]
```

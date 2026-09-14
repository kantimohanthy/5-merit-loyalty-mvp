# Fairness & Demographic Assessment

> [!CAUTION]
> **DISCLAIMER**: The G-Core prototype is an experimental design baseline. **No claim is made that this system is fair, unbiased, or production-ready for automated credit or financial decisioning.** This document outlines the inherent fairness risks, structural bias considerations, and necessary future validation procedures required before any commercial or regulatory deployment. No legal or regulatory assessment has been completed for lending, credit-reporting, or protected-class decisioning use cases.

---

## 1. Relative vs. Absolute Financial Capacity

Standard credit evaluation mechanisms typically measure **absolute values** (e.g., net income, total liquid assets, total dollar debt). This design inherently privileges high-income individuals who possess higher absolute buffers against volatility.

G-Core attempts to shift evaluation toward **relative behavioral discipline** (e.g., adherence to personalized discretionary spend baselines, ratio of saved funds relative to self-determined target). However, relative ratios still introduce fairness complications if baselines are not normalized against living costs.

---

## 2. Income-Level Bias & Unavoidable Expenses

* **Fixed Obligation Compression**: Low-income households allocate a significantly higher percentage of net income to non-discretionary essential expenses (rent, utilities, basic groceries). Consequently, minor income shocks translate into immediate budget stress.
* **Elasticity of Discretionary Spend**: High-income accounts have elastic discretionary spending buffers that can be curtailed during shocks, whereas low-income accounts face inelastic essential burdens.
* **Protected Category Mechanics**: G-Core isolates protected categories (such as protected healthcare expenses or tuition) from discretionary behavior penalties. However, unclassified essential spikes (e.g., auto repairs required for employment) may still trigger false discretionary overspend signals.

---

## 3. Category Misclassification Risks

Rule-based or machine-learning transaction classifiers carry inherent error rates:
* **Merchant-Level Ambiguity**: A multi-department merchant (e.g., superstores) selling both essential groceries and discretionary electronics may be misclassified based on default Merchant Category Codes (MCC).
* **Cultural & Regional Variance**: Naming conventions in local or regional markets (e.g., local markets, small vendors) may trigger fallback classification (`UNKNOWN_CATEGORY_FALLBACK`), defaulting to discretionary treatment.

---

## 4. Thin-File & New-to-Bank Customers

* **Cold-Start Bias**: Customers with sparse transaction histories (<3–6 months) cannot establish verified consistency scores or tier milestones.
* **Systematic Under-scoring**: Without sufficient longitudinal data, thin-file customers may be locked into initial baseline tiers (`Member` / `DEVELOPING`), restricting access to rate privileges or G-Market rewards.

---

## 5. Potential Disparate Impact

Without formal empirical calibration across demographic subgroups:
* **Socioeconomic Disparities**: Score distributions may correlate with income tier or employment type (gig economy vs. salaried workers).
* **Geographic / Demographic Disparities**: Variations in local cost-of-living index could cause uniform spend thresholds to penalize customers in higher-cost urban centers.

---

## 6. Regulatory & Validation Requirements for Production

Before any operational deployment, G-Core requires:
1. **Subgroup Evaluation**: Empirical testing across protected demographic categories (age, gender, ethnicity, geographic region) to evaluate fair lending alignment and prevent disparate impact. In a European deployment context, operational use would require applicable GDPR and privacy assessment, including a Data Protection Impact Assessment (DPIA) where required.
2. **Sensitivity Analysis**: Rigorous perturbation analysis to verify that small variation in essential spending does not cause disproportionate rating drops.
3. **Outcome Validation**: Longitudinal studies confirming whether higher behavioral scores correlate with lower default rates without inducing bias.
4. **Human Review & Appeal Rights**: Clear administrative processes enabling customers to challenge misclassifications or appeal automated behavioral evaluations.

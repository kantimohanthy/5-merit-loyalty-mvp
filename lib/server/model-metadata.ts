/**
 * G-Core Behavioral Model Metadata & Baseline Parameters
 * Version: v0.1-hackathon-baseline
 */

export const BEHAVIOR_MODEL_VERSION = "v0.1-hackathon-baseline";

/**
 * Prototype Design Weights (inherited from hackathon baseline)
 * Formula: Behavior = 0.30B + 0.25P + 0.20S + 0.15L + 0.10G
 * 
 * DISCLAIMER: These weights are prototype design parameters inherited from the
 * hackathon baseline. They are not empirically calibrated credit-risk coefficients.
 * This metric is a behavioral discipline index, NOT a credit score or solvency score.
 */
export const MODEL_WEIGHTS = {
  budget: 0.30,   // B: Discretionary budget adherence score weight
  payment: 0.25,  // P: Obligation & payment regularity score weight
  savings: 0.20,  // S: Savings deposit consistency score weight
  liquidity: 0.15,// L: Liquidity stability score weight
  goal: 0.10,     // G: Goal completion progress score weight
} as const;

export const TIER_THRESHOLDS = {
  STRONG: 0.75,
  MODERATE: 0.50,
  DEVELOPING: 0.0,
} as const;

export const MODEL_ASSUMPTIONS = [
  "discretionary_spend_target_set_by_customer_or_bank_policy",
  "protected_healthcare_expenses_excluded_from_discretionary_spend",
  "same_day_internal_transfers_excluded_from_savings_and_discretionary_progress",
  "weights_sum_to_1.0_and_represent_heuristic_discipline_indicators",
] as const;

export const KNOWN_LIMITATIONS = [
  "prototype_weights_not_empirically_calibrated",
  "no_credit_risk_or_default_probability_validation",
  "monthly_window_granularity_only_no_longitudinal_decay",
  "simulated_data_environment",
] as const;

import type { Classification, PlanStatus } from "@/lib/types";

export interface CustomerStateRow {
  customer_id: string;
  income: number;
  fixed_obligations: number;
  discretionary_target: number;
  savings_target: number;
  savings_saved: number;
  tier: string;
  points: number;
  streak: number;
  verified_history_months: number;
  budget_score: number;
  savings_score: number;
  payment_score: number;
  liquidity_score: number;
}

export interface EvaluableTransaction {
  id: string;
  amount: number;
  classification: Classification;
  protectedFlag: boolean;
  excludedForGaming: boolean;
}

export interface BehaviorDimensionResult {
  label: string;
  key: "budget" | "savings" | "payment" | "liquidity" | "goal";
  score: number; // 0-1
  weight: number; // contribution to overall, 0-1
  value: "STRONG" | "MODERATE" | "DEVELOPING";
}

export interface BehaviorEvaluation {
  discretionarySpent: number;
  savingsSaved: number;
  status: PlanStatus;
  overall: number; // 0-1, the weighted Behavior Index
  dimensions: BehaviorDimensionResult[];
}

// Explainable weighted model — every weight below is visible and defensible,
// deliberately not "black box." Weights sum to 1.
const WEIGHTS = {
  budget: 0.3,
  savings: 0.2,
  payment: 0.25,
  liquidity: 0.15,
  goal: 0.1,
} as const;

function tierFor(score: number): "STRONG" | "MODERATE" | "DEVELOPING" {
  if (score >= 0.75) return "STRONG";
  if (score >= 0.5) return "MODERATE";
  return "DEVELOPING";
}

export function evaluateBehavior(
  state: CustomerStateRow,
  transactions: EvaluableTransaction[]
): BehaviorEvaluation {
  // Discretionary spend is computed live from transactions that actually
  // count — protected expenses and detected internal transfers are excluded,
  // which is the whole point of running this server-side instead of trusting
  // the client's own arithmetic.
  const discretionarySpent = transactions
    .filter(
      (t) =>
        t.classification === "discretionary" &&
        !t.protectedFlag &&
        !t.excludedForGaming
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Savings is computed live from actual savings-classified transactions
  // (not a stored scalar) — this is what "money moved into savings" means
  // to the engine, and it's what /api/simulation/month adds a real
  // transaction for, rather than just incrementing a number.
  const savingsSaved = transactions
    .filter((t) => t.classification === "savings" && !t.excludedForGaming)
    .reduce((sum, t) => sum + Math.max(0, t.amount), 0);

  const overspend = discretionarySpent > state.discretionary_target;
  const goalMet = savingsSaved >= state.savings_target;
  const status: PlanStatus = overspend ? "AT_RISK" : goalMet ? "ACHIEVED" : "ON_TRACK";

  const goalProgress = state.savings_target <= 0
    ? 1
    : Math.min(1, savingsSaved / state.savings_target);

  const rawDimensions: { label: string; key: BehaviorDimensionResult["key"]; score: number }[] = [
    { label: "Budget consistency", key: "budget", score: state.budget_score },
    { label: "Savings consistency", key: "savings", score: state.savings_score },
    { label: "Payment regularity", key: "payment", score: state.payment_score },
    { label: "Liquidity stability", key: "liquidity", score: state.liquidity_score },
    { label: "Goal completion", key: "goal", score: goalProgress },
  ];

  const dimensions: BehaviorDimensionResult[] = rawDimensions.map((d) => ({
    ...d,
    weight: WEIGHTS[d.key],
    value: tierFor(d.score),
  }));

  const overall =
    state.budget_score * WEIGHTS.budget +
    state.savings_score * WEIGHTS.savings +
    state.payment_score * WEIGHTS.payment +
    state.liquidity_score * WEIGHTS.liquidity +
    goalProgress * WEIGHTS.goal;

  return {
    discretionarySpent,
    savingsSaved,
    status,
    overall,
    dimensions,
  };
}

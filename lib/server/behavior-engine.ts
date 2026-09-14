import type { Classification, PlanStatus } from "@/lib/types";
import { BEHAVIOR_MODEL_VERSION, MODEL_WEIGHTS } from "./model-metadata";

export type ReasonCode =
  | "PROTECTED_HEALTHCARE_EXPENSE"
  | "INTERNAL_TRANSFER_EXCLUDED"
  | "BUDGET_WITHIN_BASELINE"
  | "BUDGET_ABOVE_BASELINE"
  | "PAYMENT_CONSISTENT"
  | "SAVINGS_TARGET_MET"
  | "UNKNOWN_CATEGORY_FALLBACK";

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
  modelVersion: string;
  discretionarySpent: number;
  savingsSaved: number;
  status: PlanStatus;
  overall: number; // 0-1, the weighted Behavior Index
  dimensions: BehaviorDimensionResult[];
  reasonCodes: ReasonCode[];
}

function tierFor(score: number): "STRONG" | "MODERATE" | "DEVELOPING" {
  if (score >= 0.75) return "STRONG";
  if (score >= 0.5) return "MODERATE";
  return "DEVELOPING";
}

export function evaluateBehavior(
  state: CustomerStateRow,
  transactions: EvaluableTransaction[]
): BehaviorEvaluation {
  const discretionarySpent = transactions
    .filter(
      (t) =>
        t.classification === "discretionary" &&
        !t.protectedFlag &&
        !t.excludedForGaming
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
    weight: MODEL_WEIGHTS[d.key],
    value: tierFor(d.score),
  }));

  const overall =
    state.budget_score * MODEL_WEIGHTS.budget +
    state.savings_score * MODEL_WEIGHTS.savings +
    state.payment_score * MODEL_WEIGHTS.payment +
    state.liquidity_score * MODEL_WEIGHTS.liquidity +
    goalProgress * MODEL_WEIGHTS.goal;

  const reasonCodes: ReasonCode[] = [];
  if (transactions.some((t) => t.protectedFlag)) {
    reasonCodes.push("PROTECTED_HEALTHCARE_EXPENSE");
  }
  if (transactions.some((t) => t.excludedForGaming)) {
    reasonCodes.push("INTERNAL_TRANSFER_EXCLUDED");
  }
  if (overspend) {
    reasonCodes.push("BUDGET_ABOVE_BASELINE");
  } else {
    reasonCodes.push("BUDGET_WITHIN_BASELINE");
  }
  if (state.payment_score >= 0.75) {
    reasonCodes.push("PAYMENT_CONSISTENT");
  }
  if (goalMet) {
    reasonCodes.push("SAVINGS_TARGET_MET");
  }

  return {
    modelVersion: BEHAVIOR_MODEL_VERSION,
    discretionarySpent,
    savingsSaved,
    status,
    overall,
    dimensions,
    reasonCodes,
  };
}

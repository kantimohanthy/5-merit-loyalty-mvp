import { describe, it, expect } from "vitest";
import {
  evaluateBehavior,
  type CustomerStateRow,
  type EvaluableTransaction,
} from "@/lib/server/behavior-engine";
import { BEHAVIOR_MODEL_VERSION } from "@/lib/server/model-metadata";

const mockState: CustomerStateRow = {
  customer_id: "c1",
  income: 3000,
  fixed_obligations: 1200,
  discretionary_target: 800,
  savings_target: 300,
  savings_saved: 0,
  tier: "MODERATE",
  points: 100,
  streak: 2,
  verified_history_months: 6,
  budget_score: 0.8,
  savings_score: 0.7,
  payment_score: 0.85,
  liquidity_score: 0.75,
};

describe("Behavior Engine", () => {
  it("Requirement 1: protected healthcare transaction does not unfairly penalize discretionary behavior", () => {
    const transactions: EvaluableTransaction[] = [
      {
        id: "t1",
        amount: -450,
        classification: "essential",
        protectedFlag: true,
        excludedForGaming: false,
      },
      {
        id: "t2",
        amount: -200,
        classification: "discretionary",
        protectedFlag: false,
        excludedForGaming: false,
      },
    ];

    const result = evaluateBehavior(mockState, transactions);

    expect(result.discretionarySpent).toBe(200);
    expect(result.status).not.toBe("AT_RISK");
    expect(result.reasonCodes).toContain("PROTECTED_HEALTHCARE_EXPENSE");
    expect(result.reasonCodes).toContain("BUDGET_WITHIN_BASELINE");
  });

  it("Requirement 3: normal discretionary purchase remains included", () => {
    const transactions: EvaluableTransaction[] = [
      {
        id: "t1",
        amount: -300,
        classification: "discretionary",
        protectedFlag: false,
        excludedForGaming: false,
      },
      {
        id: "t2",
        amount: -600,
        classification: "discretionary",
        protectedFlag: false,
        excludedForGaming: false,
      },
    ];

    const result = evaluateBehavior(mockState, transactions);

    expect(result.discretionarySpent).toBe(900);
    expect(result.status).toBe("AT_RISK"); // 900 > discretionary_target (800)
    expect(result.reasonCodes).toContain("BUDGET_ABOVE_BASELINE");
  });

  it("Requirement 4: legitimate savings contribution is counted", () => {
    const transactions: EvaluableTransaction[] = [
      {
        id: "t1",
        amount: 350,
        classification: "savings",
        protectedFlag: false,
        excludedForGaming: false,
      },
    ];

    const result = evaluateBehavior(mockState, transactions);

    expect(result.savingsSaved).toBe(350);
    expect(result.status).toBe("ACHIEVED");
    expect(result.reasonCodes).toContain("SAVINGS_TARGET_MET");
  });

  it("Requirement 6: tier thresholds behave deterministically", () => {
    const stateLow: CustomerStateRow = {
      ...mockState,
      budget_score: 0.4,
      savings_score: 0.4,
      payment_score: 0.4,
      liquidity_score: 0.4,
      savings_target: 500,
    };

    const resultLow = evaluateBehavior(stateLow, []);
    const budgetDim = resultLow.dimensions.find((d) => d.key === "budget");
    expect(budgetDim?.value).toBe("DEVELOPING");

    const stateHigh: CustomerStateRow = {
      ...mockState,
      budget_score: 0.85,
    };
    const resultHigh = evaluateBehavior(stateHigh, []);
    const budgetDimHigh = resultHigh.dimensions.find((d) => d.key === "budget");
    expect(budgetDimHigh?.value).toBe("STRONG");
  });

  it("Requirement 8: zero transaction state does not crash", () => {
    const result = evaluateBehavior(mockState, []);

    expect(result.discretionarySpent).toBe(0);
    expect(result.savingsSaved).toBe(0);
    expect(result.modelVersion).toBe(BEHAVIOR_MODEL_VERSION);
    expect(result.dimensions).toHaveLength(5);
  });

  it("Requirement 9: relevant edge monetary values handled safely", () => {
    const edgeTransactions: EvaluableTransaction[] = [
      { id: "e1", amount: 0, classification: "discretionary", protectedFlag: false, excludedForGaming: false },
      { id: "e2", amount: -0.01, classification: "discretionary", protectedFlag: false, excludedForGaming: false },
      { id: "e3", amount: -999999.99, classification: "discretionary", protectedFlag: true, excludedForGaming: false },
    ];

    const result = evaluateBehavior(mockState, edgeTransactions);

    expect(result.discretionarySpent).toBe(0.01);
    expect(result.status).toBe("ON_TRACK");
  });

  it("Requirement 10: identical inputs produce identical outputs", () => {
    const transactions: EvaluableTransaction[] = [
      { id: "t1", amount: -150, classification: "discretionary", protectedFlag: false, excludedForGaming: false },
      { id: "t2", amount: 200, classification: "savings", protectedFlag: false, excludedForGaming: false },
    ];

    const result1 = evaluateBehavior(mockState, transactions);
    const result2 = evaluateBehavior(mockState, transactions);

    expect(result1).toEqual(result2);
  });
});

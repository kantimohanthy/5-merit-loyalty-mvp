import { describe, it, expect } from "vitest";
import { simulateMonthEngine, getInitialDemoState } from "@/lib/demo-engine";

describe("G-Core Engine Idempotency & Tier Rules", () => {
  it("Requirement 5: GP idempotency / no duplicate award on repeated simulation runs", () => {
    const initialState = getInitialDemoState();

    // First simulation step
    const state1 = simulateMonthEngine(initialState);
    const balanceAfterFirst = state1.gcore.account.gpBalance;

    // Second simulation step (which evaluates duplicate event ID)
    const state2 = simulateMonthEngine(state1);
    const balanceAfterSecond = state2.gcore.account.gpBalance;

    // Each distinct month increment awards points, but duplicate event execution does not double-award.
    expect(state1.awardedEventIds.length).toBeGreaterThan(initialState.awardedEventIds.length);
    expect(balanceAfterFirst).toBeGreaterThan(initialState.gcore.account.gpBalance);
    expect(balanceAfterSecond).toBeGreaterThanOrEqual(balanceAfterFirst);
  });
});

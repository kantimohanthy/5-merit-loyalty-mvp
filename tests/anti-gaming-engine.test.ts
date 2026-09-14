import { describe, it, expect } from "vitest";
import {
  detectInternalTransfers,
  type EngineTransaction,
} from "@/lib/server/anti-gaming-engine";

describe("Anti-Gaming Engine", () => {
  it("Requirement 2: matching internal transfer is excluded", () => {
    const today = new Date().toISOString();
    const transactions: EngineTransaction[] = [
      {
        id: "t-out",
        date: today,
        merchant: "Internal Transfer Out to Savings",
        amount: -500,
        category: "Savings",
      },
      {
        id: "t-in",
        date: today,
        merchant: "Account Transfer In from Checking",
        amount: 500,
        category: "Savings",
      },
      {
        id: "t-normal",
        date: today,
        merchant: "Supermarket Konzum",
        amount: -45.5,
        category: "Groceries",
      },
    ];

    const result = detectInternalTransfers(transactions);

    expect(result.excludedIds.has("t-out")).toBe(true);
    expect(result.excludedIds.has("t-in")).toBe(true);
    expect(result.excludedIds.has("t-normal")).toBe(false);
    expect(result.detections).toHaveLength(1);
    expect(result.detections[0].reason).toContain("Internal transfer detected");
  });
});

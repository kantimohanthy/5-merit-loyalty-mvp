import { describe, it, expect } from "vitest";
import { classifyTransaction } from "@/lib/server/classification-engine";

describe("Classification Engine", () => {
  it("Requirement 7: unknown category fails safely", () => {
    const result = classifyTransaction({
      merchant: "XYZ Unrecognized Merchant 999",
      mcc: "9999",
    });

    expect(result.category).toBe("Other");
    expect(result.classification).toBe("discretionary");
    expect(result.confidence).toBe(0.55);
    expect(result.reasonCode).toBe("UNKNOWN_CATEGORY_FALLBACK");
  });

  it("handles missing inputs safely without throwing", () => {
    const result = classifyTransaction({});

    expect(result.category).toBe("Other");
    expect(result.classification).toBe("discretionary");
    expect(result.reasonCode).toBe("UNKNOWN_CATEGORY_FALLBACK");
  });

  it("classifies merchant rules accurately", () => {
    const edu = classifyTransaction({ merchant: "University of Sarajevo Tuition" });
    expect(edu.category).toBe("Education");
    expect(edu.classification).toBe("essential");
    expect(edu.reasonCode).toBe("MERCHANT_RULE_MATCH");

    const health = classifyTransaction({ merchant: "Central Pharmacy Health" });
    expect(health.category).toBe("Healthcare");
    expect(health.classification).toBe("essential");
  });
});

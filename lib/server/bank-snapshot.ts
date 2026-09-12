import type Database from "better-sqlite3";
import { readEngagementFeed } from "./event-engine";
import type { BankMetrics } from "@/lib/types";

const BASELINE = {
  customersEnrolled: 120000,
  monthlyActivePct: 74,
  savingsImprovementPct: 21,
  churnProgramPct: 7.2,
  churnStandardPct: 13.6,
  redemptionGenericPct: 3,
  redemptionBehavioralPct: 19,
};

export function readBankSnapshot(db: Database.Database): BankMetrics {
  return { ...BASELINE, engagementFeed: readEngagementFeed(db, 6) };
}

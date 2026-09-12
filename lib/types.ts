export type Classification = "essential" | "discretionary" | "savings";

export type Category =
  | "Rent"
  | "Healthcare"
  | "Education"
  | "Groceries"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Subscriptions"
  | "Travel"
  | "Savings"
  | "Other";

export interface CategoryConfidence {
  category: Category;
  confidence: number; // 0-1
}

export interface Transaction {
  id: string;
  date: string; // ISO
  merchant: string;
  amount: number; // negative = outflow, positive = inflow
  category: Category;
  classification: Classification;
  confidence: number; // 0-1, confidence in the top category
  alternates: CategoryConfidence[];
  confirmed: boolean;
  note?: string;
  flaggedEssential?: boolean; // true for e.g. emergency medical, excluded from discretionary scoring
  excludedReason?: string; // anti-gaming exclusion (e.g. detected internal transfer), server-computed
}

export type PlanStatus = "ON_TRACK" | "AT_RISK" | "ACHIEVED";

export interface MonthlyPlan {
  income: number;
  fixedObligations: number;
  discretionaryTarget: number;
  savingsTarget: number;
  discretionarySpent: number;
  savingsSaved: number;
  status: PlanStatus;
}

export type RewardStatus = "unlocked" | "locked";

export interface Reward {
  id: string;
  merchant: string;
  title: string; // e.g. "20% OFF"
  category: Category;
  status: RewardStatus;
  reason?: string;
  requirement?: string;
  progress?: number; // 0-1 toward unlocking, when locked
}

export type Tier = "START" | "PLUS" | "PRIME";

export interface BehaviorDimension {
  label: string;
  value: "STRONG" | "MODERATE" | "DEVELOPING";
  score: number; // 0-1 for bar rendering
}

export interface StatusProfile {
  tier: Tier;
  verifiedHistoryMonths: number;
  currentStreak: number;
  points: number;
  dimensions: BehaviorDimension[];
}

export interface Customer {
  name: string;
  age: number;
  profile: string;
  memberSince: string; // e.g. "Mar 2025"
}

export interface EngagementEvent {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
}

export interface BankMetrics {
  customersEnrolled: number;
  monthlyActivePct: number;
  savingsImprovementPct: number;
  churnProgramPct: number;
  churnStandardPct: number;
  redemptionGenericPct: number;
  redemptionBehavioralPct: number;
  engagementFeed: EngagementEvent[];
}

export type GCoreTierLabel = "Member" | "Silver" | "Gold" | "Platinum" | "Diamond";
export const TIER_LABELS: readonly GCoreTierLabel[] = ["Member", "Silver", "Gold", "Platinum", "Diamond"] as const;

export interface GCoreAccount {
  gPass: string;
  tierIndex: number;
  tierLabel: GCoreTierLabel;
  gpBalance: number;
  gpLifetime: number;
  nextTierAt: number | null;
}

export interface GCoreLedgerEntry {
  id: string;
  gpDelta: number;
  reason: string;
  kind: "goal_completed" | "tenure_advanced" | "gmarket_claim";
  createdAt: string;
}

export interface GMarketItem {
  id: string;
  title: string;
  category: "experience" | "access" | "privilege";
  description: string;
  gpCost: number;
  minTierIndex: number;
  scarcityTotal: number;
  scarcityClaimed: number;
  scarcityRemaining: number;
}

export type ClaimFailureReason = "insufficient_gp" | "tier_too_low" | "sold_out" | "not_found";

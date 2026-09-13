import {
  BankMetrics,
  Category,
  Classification,
  Customer,
  MonthlyPlan,
  Reward,
  StatusProfile,
  Transaction,
  GCoreAccount,
  GCoreLedgerEntry,
  GMarketItem,
  ClaimFailureReason,
  EngagementEvent,
} from "@/lib/types";
import {
  CUSTOMER,
  INITIAL_BANK_METRICS,
  INITIAL_PLAN,
  INITIAL_REWARDS,
  INITIAL_STATUS,
  INITIAL_TRANSACTIONS,
} from "@/lib/mock-data";

export interface Celebration {
  pointsAwarded: number;
  newStreak: number;
  unlockedRewardId: string | null;
}

export interface ExcludedTransfer {
  transactionId: string;
  reason: string;
}

export interface RewardDetail {
  id: string;
  why: string[];
}

export interface DemoEngineState {
  customer: Customer;
  plan: MonthlyPlan;
  transactions: Transaction[];
  rewards: Reward[];
  rewardDetails: RewardDetail[];
  status: StatusProfile;
  bank: BankMetrics;
  gcore: {
    account: GCoreAccount;
    ledger: GCoreLedgerEntry[];
    items: GMarketItem[];
  };
  celebration: Celebration | null;
  emergencyActive: boolean;
  transferBannerActive: boolean;
  overspendActive: boolean;
  switchedBank: boolean;
  excludedTransfers: ExcludedTransfer[];
  monthSimulated: boolean;
  awardedEventIds: string[];
  lastUpdated: string;
}

const STORAGE_KEY = "MERIT_DEMO_ENGINE_STATE_V2";

export const INITIAL_GMARKET_ITEMS: GMarketItem[] = [
  {
    id: "gm1",
    title: "Priority Airport Lounge Access Pass",
    category: "access",
    description: "Complimentary single-use lounge access across 45+ partner airports.",
    gpCost: 350,
    minTierIndex: 1, // Silver
    scarcityTotal: 50,
    scarcityClaimed: 12,
    scarcityRemaining: 38,
  },
  {
    id: "gm2",
    title: "1-on-1 Wealth Advisor Consultation",
    category: "privilege",
    description: "Personalized 45-minute financial planning session with a certified advisor.",
    gpCost: 500,
    minTierIndex: 2, // Gold
    scarcityTotal: 25,
    scarcityClaimed: 19,
    scarcityRemaining: 6,
  },
  {
    id: "gm3",
    title: "Exclusive Sarajevo Dining Privilege",
    category: "experience",
    description: "Chef's table reservation & complimentary tasting pairing at Petica.",
    gpCost: 200,
    minTierIndex: 1, // Silver
    scarcityTotal: 30,
    scarcityClaimed: 14,
    scarcityRemaining: 16,
  },
  {
    id: "gm4",
    title: "Zero Foreign Exchange Transaction Fee",
    category: "privilege",
    description: "Waive all FX fees for up to €2,000 international spending over 30 days.",
    gpCost: 300,
    minTierIndex: 2, // Gold
    scarcityTotal: 100,
    scarcityClaimed: 45,
    scarcityRemaining: 55,
  },
  {
    id: "gm5",
    title: "24/7 Dedicated Concierge Helpline",
    category: "access",
    description: "Direct priority phone & WhatsApp support line across all partner institutions.",
    gpCost: 800,
    minTierIndex: 3, // Platinum
    scarcityTotal: 15,
    scarcityClaimed: 8,
    scarcityRemaining: 7,
  },
  {
    id: "gm6",
    title: "Annual European FinTech & Loyalty Summit Pass",
    category: "experience",
    description: "VIP ticket & invitation to the executive roundtable in Sarajevo.",
    gpCost: 500,
    minTierIndex: 2, // Gold
    scarcityTotal: 5,
    scarcityClaimed: 0,
    scarcityRemaining: 5,
  },
];

export const INITIAL_GCORE_ACCOUNT: GCoreAccount = {
  gPass: "G-P_8F3A",
  tierIndex: 2, // Gold / PRIME
  tierLabel: "Gold",
  gpBalance: 2900,
  gpLifetime: 2900,
  nextTierAt: 24,
};

export const INITIAL_GCORE_LEDGER: GCoreLedgerEntry[] = [
  {
    id: "gleg-init-2",
    gpDelta: 200,
    reason: "6-month tenure milestone reached",
    kind: "tenure_advanced",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "gleg-init-1",
    gpDelta: 50,
    reason: "Behavioral goal completed — Savings streak",
    kind: "goal_completed",
    createdAt: "2026-08-01T09:30:00.000Z",
  },
];

export function getInitialDemoState(): DemoEngineState {
  return {
    customer: { ...CUSTOMER },
    plan: { ...INITIAL_PLAN },
    transactions: INITIAL_TRANSACTIONS.map((t) => ({ ...t })),
    rewards: INITIAL_REWARDS.map((r) => ({ ...r })),
    rewardDetails: [
      {
        id: "r1",
        why: ["Discretionary spending strictly within personalized target limit.", "3-month verified savings history at XYZ Bank."],
      },
      {
        id: "r2",
        why: ["5-month active savings streak.", "Zero overdraft occurrences across 6 billing cycles."],
      },
    ],
    status: {
      ...INITIAL_STATUS,
      dimensions: INITIAL_STATUS.dimensions.map((d) => ({ ...d })),
    },
    bank: {
      ...INITIAL_BANK_METRICS,
      engagementFeed: INITIAL_BANK_METRICS.engagementFeed.map((e) => ({ ...e })),
    },
    gcore: {
      account: { ...INITIAL_GCORE_ACCOUNT },
      ledger: INITIAL_GCORE_LEDGER.map((l) => ({ ...l })),
      items: INITIAL_GMARKET_ITEMS.map((i) => ({ ...i })),
    },
    celebration: null,
    emergencyActive: false,
    transferBannerActive: false,
    overspendActive: false,
    switchedBank: false,
    excludedTransfers: [],
    monthSimulated: false,
    awardedEventIds: ["init-seed-1", "init-seed-2"],
    lastUpdated: new Date().toISOString(),
  };
}

export function loadDemoState(): DemoEngineState {
  if (typeof window === "undefined") {
    return getInitialDemoState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoEngineState;
      if (parsed && parsed.customer && parsed.plan && parsed.gcore) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  const initialState = getInitialDemoState();
  saveDemoState(initialState);
  return initialState;
}

export function saveDemoState(state: DemoEngineState): void {
  if (typeof window === "undefined") return;
  try {
    const updated = { ...state, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage write errors
  }
}

export function resetDemoState(): DemoEngineState {
  const initialState = getInitialDemoState();
  saveDemoState(initialState);
  return initialState;
}

export function simulateMonthEngine(state: DemoEngineState): DemoEngineState {
  const newStreak = state.status.currentStreak + 1;
  const newVerifiedMonths = state.status.verifiedHistoryMonths + 1;
  const eventId = `month-sim-${newStreak}-${newVerifiedMonths}`;

  const isDuplicate = state.awardedEventIds.includes(eventId);

  const nextTxnId = `t-sim-m-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const newSavingsTxn: Transaction = {
    id: nextTxnId,
    date: nowIso.split("T")[0],
    merchant: "Automatic Savings Deposit",
    amount: 150,
    category: "Savings",
    classification: "savings",
    confidence: 1.0,
    alternates: [{ category: "Savings", confidence: 1.0 }],
    confirmed: true,
  };

  const updatedTransactions = [newSavingsTxn, ...state.transactions];

  const updatedPlan: MonthlyPlan = {
    ...state.plan,
    savingsSaved: state.plan.savingsSaved + 150,
    status: "ACHIEVED",
  };

  const updatedDimensions = state.status.dimensions.map((d) => {
    if (d.label === "Budget consistency") return { ...d, score: Math.min(1, d.score + 0.04), value: "STRONG" as const };
    if (d.label === "Savings consistency") return { ...d, score: Math.min(1, d.score + 0.05), value: "STRONG" as const };
    if (d.label === "Goal completion") return { ...d, score: 1.0, value: "STRONG" as const };
    return d;
  });

  let gpAward = 0;
  const newLedger: GCoreLedgerEntry[] = [...state.gcore.ledger];
  const newAwarded = [...state.awardedEventIds];

  if (!isDuplicate) {
    gpAward = 250;
    newAwarded.push(eventId);
    newLedger.unshift({
      id: `gleg-sim-${Date.now()}`,
      gpDelta: 250,
      reason: `Monthly goal completed — Budget consistency maintained (${newStreak}-mo streak)`,
      kind: "goal_completed",
      createdAt: nowIso,
    });
  }

  const updatedGpBalance = state.gcore.account.gpBalance + gpAward;
  const updatedGpLifetime = state.gcore.account.gpLifetime + gpAward;

  let newTierIndex = state.gcore.account.tierIndex;
  if (newVerifiedMonths >= 24 && newTierIndex < 3) {
    newTierIndex = 3; // EXCLUSIVE / Platinum
  } else if (newVerifiedMonths >= 18 && newTierIndex < 2) {
    newTierIndex = 2; // PRIME / Gold
  }
  const newTierLabel = (["Member", "Silver", "Gold", "Platinum", "Diamond"] as const)[newTierIndex];

  const updatedRewards: Reward[] = state.rewards.map((r) => {
    if (r.id === "r1") {
      return {
        ...r,
        status: "unlocked",
        reason: "Unlocked automatically for achieving monthly budget target.",
        progress: 1.0,
      };
    }
    if (r.id === "r2" && newStreak >= 3) {
      return {
        ...r,
        status: "unlocked",
        reason: "Unlocked for 3-month savings streak.",
        progress: 1.0,
      };
    }
    return r;
  });

  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-sim-${Date.now()}`,
      label: "Monthly Goal Completed",
      detail: `${state.customer.name} hit monthly budget target. Streak advanced to ${newStreak} months (+${gpAward} GP).`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const celebration: Celebration = {
    pointsAwarded: gpAward,
    newStreak,
    unlockedRewardId: "r1",
  };

  const nextState: DemoEngineState = {
    ...state,
    plan: updatedPlan,
    transactions: updatedTransactions,
    rewards: updatedRewards,
    status: {
      ...state.status,
      currentStreak: newStreak,
      verifiedHistoryMonths: newVerifiedMonths,
      points: state.status.points + gpAward,
      dimensions: updatedDimensions,
    },
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
    gcore: {
      ...state.gcore,
      account: {
        ...state.gcore.account,
        tierIndex: newTierIndex,
        tierLabel: newTierLabel,
        gpBalance: updatedGpBalance,
        gpLifetime: updatedGpLifetime,
      },
      ledger: newLedger,
    },
    celebration,
    monthSimulated: true,
    awardedEventIds: newAwarded,
  };

  saveDemoState(nextState);
  return nextState;
}

export function simulateEmergencyEngine(state: DemoEngineState): DemoEngineState {
  const nowIso = new Date().toISOString();
  const emergencyTxn: Transaction = {
    id: `txn-emer-${Date.now()}`,
    date: nowIso.split("T")[0],
    merchant: "Emergency Medical Care",
    amount: -450,
    category: "Healthcare",
    classification: "essential",
    confidence: 0.98,
    alternates: [{ category: "Healthcare", confidence: 0.98 }],
    confirmed: true,
    flaggedEssential: true,
    excludedReason: "Protected expense — excluded from discretionary-behavior evaluation.",
  };

  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-emer-${Date.now()}`,
      label: "Protected Healthcare Expense Classified",
      detail: `${state.customer.name}: €450 Healthcare expense automatically recognized as protected. Discretionary score unaffected.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const nextState: DemoEngineState = {
    ...state,
    transactions: [emergencyTxn, ...state.transactions],
    emergencyActive: true,
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
  };

  saveDemoState(nextState);
  return nextState;
}

export function simulateOverspendEngine(state: DemoEngineState): DemoEngineState {
  const nowIso = new Date().toISOString();
  const overspendTxn: Transaction = {
    id: `txn-over-${Date.now()}`,
    date: nowIso.split("T")[0],
    merchant: "Boutique Shopping & Dining",
    amount: -250,
    category: "Shopping",
    classification: "discretionary",
    confidence: 0.94,
    alternates: [{ category: "Shopping", confidence: 0.94 }],
    confirmed: true,
  };

  const updatedSpent = state.plan.discretionarySpent + 250;
  const updatedPlan: MonthlyPlan = {
    ...state.plan,
    discretionarySpent: updatedSpent,
    status: updatedSpent > state.plan.discretionaryTarget ? "AT_RISK" : state.plan.status,
  };

  const updatedRewards = state.rewards.map((r) => {
    if (r.id === "r1" && r.status === "locked") {
      return { ...r, requirement: "Paused — outside discretionary range this month" };
    }
    return r;
  });

  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-over-${Date.now()}`,
      label: "Discretionary Spending Above Target",
      detail: `${state.customer.name} discretionary spending is currently above target limit (€${updatedSpent} vs €${state.plan.discretionaryTarget}). Non-punitive guidance issued.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const nextState: DemoEngineState = {
    ...state,
    plan: updatedPlan,
    transactions: [overspendTxn, ...state.transactions],
    rewards: updatedRewards,
    overspendActive: true,
    monthSimulated: true,
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
  };

  saveDemoState(nextState);
  return nextState;
}

export function simulateTransferEngine(state: DemoEngineState): DemoEngineState {
  const nowIso = new Date().toISOString();
  const transferOutTxn: Transaction = {
    id: `txn-trans-out-${Date.now()}`,
    date: nowIso.split("T")[0],
    merchant: "Transfer Out to External Savings",
    amount: -500,
    category: "Other",
    classification: "discretionary",
    confidence: 0.99,
    alternates: [{ category: "Other", confidence: 0.99 }],
    confirmed: true,
    excludedReason: "Internal transfer detected — excluded from behavioral progress.",
  };

  const transferInTxn: Transaction = {
    id: `txn-trans-in-${Date.now()}`,
    date: nowIso.split("T")[0],
    merchant: "Transfer In from External Account",
    amount: 500,
    category: "Other",
    classification: "discretionary",
    confidence: 0.99,
    alternates: [{ category: "Other", confidence: 0.99 }],
    confirmed: true,
    excludedReason: "Internal transfer detected — excluded from behavioral progress.",
  };

  const updatedExcluded = [
    { transactionId: transferOutTxn.id, reason: "Internal transfer pattern detected" },
    { transactionId: transferInTxn.id, reason: "Internal transfer pattern detected" },
    ...state.excludedTransfers,
  ];

  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-trans-${Date.now()}`,
      label: "Internal Transfer Pattern Detected",
      detail: "Anti-gaming rule matched: matching internal transfer excluded from behavioral savings progress.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const nextState: DemoEngineState = {
    ...state,
    transactions: [transferOutTxn, transferInTxn, ...state.transactions],
    transferBannerActive: true,
    excludedTransfers: updatedExcluded,
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
  };

  saveDemoState(nextState);
  return nextState;
}

export function claimGMarketItemEngine(
  state: DemoEngineState,
  itemId: string
): { nextState: DemoEngineState; result: { success: true } | { success: false; reason: ClaimFailureReason } } {
  const item = state.gcore.items.find((i) => i.id === itemId);
  if (!item) return { nextState: state, result: { success: false, reason: "not_found" } };

  if (item.scarcityRemaining <= 0) return { nextState: state, result: { success: false, reason: "sold_out" } };
  if (state.gcore.account.tierIndex < item.minTierIndex) return { nextState: state, result: { success: false, reason: "tier_too_low" } };
  if (state.gcore.account.gpBalance < item.gpCost) return { nextState: state, result: { success: false, reason: "insufficient_gp" } };

  const eventId = `claim-${itemId}`;
  if (state.awardedEventIds.includes(eventId) && item.id === "gm6") {
    return { nextState: state, result: { success: false, reason: "sold_out" } };
  }

  const nowIso = new Date().toISOString();
  const updatedItems = state.gcore.items.map((i) => {
    if (i.id === itemId) {
      const newClaimed = i.scarcityClaimed + 1;
      return {
        ...i,
        scarcityClaimed: newClaimed,
        scarcityRemaining: Math.max(0, i.scarcityTotal - newClaimed),
      };
    }
    return i;
  });

  const newBalance = state.gcore.account.gpBalance - item.gpCost;
  const newLedgerEntry: GCoreLedgerEntry = {
    id: `gleg-claim-${Date.now()}`,
    gpDelta: -item.gpCost,
    reason: `Claimed: ${item.title}`,
    kind: "gmarket_claim",
    createdAt: nowIso,
  };

  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-claim-${Date.now()}`,
      label: "G-Market Experience Claimed",
      detail: `${state.customer.name} claimed ${item.title} for ${item.gpCost} GP.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const celebration: Celebration | null = item.id === "gm6" ? {
    pointsAwarded: 500,
    newStreak: state.status.currentStreak,
    unlockedRewardId: "gm6",
  } : state.celebration;

  const nextState: DemoEngineState = {
    ...state,
    gcore: {
      ...state.gcore,
      account: {
        ...state.gcore.account,
        gpBalance: newBalance,
      },
      ledger: [newLedgerEntry, ...state.gcore.ledger],
      items: updatedItems,
    },
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
    celebration,
    awardedEventIds: [...state.awardedEventIds, eventId],
  };

  saveDemoState(nextState);
  return { nextState, result: { success: true } };
}

export function simulateSwitchBankEngine(state: DemoEngineState): DemoEngineState {
  const updatedFeed: EngagementEvent[] = [
    {
      id: `feed-switch-${Date.now()}`,
      label: "Bank Switch Simulated",
      detail: "G-Pass identity & GP balance preserved across banks. Bank-local points reset to zero.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    ...state.bank.engagementFeed.slice(0, 8),
  ];

  const nextState: DemoEngineState = {
    ...state,
    status: {
      ...state.status,
      tier: "START",
      points: 0,
      currentStreak: 0,
    },
    switchedBank: true,
    bank: {
      ...state.bank,
      engagementFeed: updatedFeed,
    },
  };

  saveDemoState(nextState);
  return nextState;
}

export function confirmTransactionEngine(
  state: DemoEngineState,
  id: string,
  category: Category
): DemoEngineState {
  const updatedTxns = state.transactions.map((t) => {
    if (t.id === id) {
      const classification: Classification =
        category === "Savings"
          ? "savings"
          : ["Rent", "Healthcare", "Education", "Groceries", "Transport"].includes(category)
          ? "essential"
          : "discretionary";
      return {
        ...t,
        category,
        classification,
        confirmed: true,
        confidence: 1.0,
      };
    }
    return t;
  });

  const nextState: DemoEngineState = {
    ...state,
    transactions: updatedTxns,
  };

  saveDemoState(nextState);
  return nextState;
}

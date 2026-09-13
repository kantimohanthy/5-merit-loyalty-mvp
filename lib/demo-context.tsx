"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BankMetrics,
  Category,
  Classification,
  Customer,
  MonthlyPlan,
  Reward,
  StatusProfile,
  Transaction,
} from "./types";
import {
  CUSTOMER,
  INITIAL_BANK_METRICS,
  INITIAL_PLAN,
  INITIAL_REWARDS,
  INITIAL_STATUS,
  INITIAL_TRANSACTIONS,
} from "./mock-data";

export const CATEGORY_CLASSIFICATION: Record<Category, Classification> = {
  Rent: "essential",
  Healthcare: "essential",
  Education: "essential",
  Groceries: "essential",
  Transport: "essential",
  Shopping: "discretionary",
  Entertainment: "discretionary",
  Subscriptions: "discretionary",
  Travel: "discretionary",
  Savings: "savings",
  Other: "discretionary",
};

const CUSTOMER_ID = "alex-001";

export interface Celebration {
  pointsAwarded: number;
  newStreak: number;
  unlockedRewardId: string | null;
}

interface ExcludedTransfer {
  transactionId: string;
  reason: string;
}

export interface RewardDetail {
  id: string;
  why: string[];
}

interface DemoState {
  customer: Customer;
  plan: MonthlyPlan;
  transactions: Transaction[];
  rewards: Reward[];
  rewardDetails: RewardDetail[];
  status: StatusProfile;
  bank: BankMetrics;
  celebration: Celebration | null;
  emergencyActive: boolean;
  transferBannerActive: boolean;
  excludedTransfers: ExcludedTransfer[];
  monthSimulated: boolean;
  loading: boolean;
  hydrated: boolean;
}

// Everything the backend can hand back in one snapshot — the client no
// longer computes any of this itself, it only renders it.
interface ServerSnapshot {
  customer: Customer;
  plan: MonthlyPlan;
  status: StatusProfile;
  transactions: Transaction[];
  rewards: Reward[];
  rewardDetails?: RewardDetail[];
  bank: BankMetrics;
  excludedTransfers?: ExcludedTransfer[];
  celebration?: Celebration;
}

function optimisticInitialState(): DemoState {
  return {
    customer: CUSTOMER,
    plan: { ...INITIAL_PLAN },
    transactions: INITIAL_TRANSACTIONS.map((t) => ({ ...t })),
    rewards: INITIAL_REWARDS.map((r) => ({ ...r })),
    rewardDetails: [],
    status: {
      ...INITIAL_STATUS,
      dimensions: INITIAL_STATUS.dimensions.map((d) => ({ ...d })),
    },
    bank: {
      ...INITIAL_BANK_METRICS,
      engagementFeed: INITIAL_BANK_METRICS.engagementFeed.map((e) => ({ ...e })),
    },
    celebration: null,
    emergencyActive: false,
    transferBannerActive: false,
    excludedTransfers: [],
    monthSimulated: false,
    loading: true,
    hydrated: false,
  };
}

async function postJSON<T = ServerSnapshot>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

async function getJSON<T = ServerSnapshot>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

interface DemoContextValue extends DemoState {
  simulateMonth: () => Promise<void>;
  simulateEmergency: () => Promise<void>;
  simulateOverspend: () => Promise<void>;
  simulateTransfer: () => Promise<void>;
  confirmTransaction: (id: string, category: Category) => Promise<void>;
  clearCelebration: () => void;
  triggerCelebration: (celebration: Celebration) => void;
  clearEmergencyBanner: () => void;
  clearTransferBanner: () => void;
  reset: () => Promise<void>;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(optimisticInitialState);

  const applySnapshot = useCallback(
    (snapshot: ServerSnapshot, extra?: Partial<DemoState>) => {
      setState((prev) => ({
        ...prev,
        customer: snapshot.customer,
        plan: snapshot.plan,
        status: snapshot.status,
        transactions: snapshot.transactions,
        rewards: snapshot.rewards,
        rewardDetails: snapshot.rewardDetails ?? prev.rewardDetails,
        bank: snapshot.bank,
        excludedTransfers: snapshot.excludedTransfers ?? prev.excludedTransfers,
        loading: false,
        hydrated: true,
        ...extra,
      }));
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    getJSON(`/api/state?customerId=${CUSTOMER_ID}`)
      .then((data) => {
        if (!cancelled) applySnapshot(data);
      })
      .catch(() => {
        // Backend unreachable (e.g. previewed without `npm run dev`) — keep
        // the optimistic seed data so the UI still renders something.
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateMonth = useCallback(async () => {
    const data = await postJSON("/api/simulation/month", { customerId: CUSTOMER_ID });
    applySnapshot(data, { celebration: data.celebration ?? null, monthSimulated: true });
  }, [applySnapshot]);

  const simulateEmergency = useCallback(async () => {
    const data = await postJSON("/api/simulation/emergency", { customerId: CUSTOMER_ID });
    applySnapshot(data, { emergencyActive: true });
  }, [applySnapshot]);

  const simulateOverspend = useCallback(async () => {
    const data = await postJSON("/api/simulation/overspend", { customerId: CUSTOMER_ID });
    applySnapshot(data, { monthSimulated: true });
  }, [applySnapshot]);

  const simulateTransfer = useCallback(async () => {
    const data = await postJSON("/api/simulation/transfer", { customerId: CUSTOMER_ID });
    applySnapshot(data, { transferBannerActive: true });
  }, [applySnapshot]);

  const confirmTransaction = useCallback(
    async (id: string, category: Category) => {
      await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: CUSTOMER_ID, category }),
      });
      const data = await getJSON(`/api/state?customerId=${CUSTOMER_ID}`);
      applySnapshot(data);
    },
    [applySnapshot]
  );

  const clearCelebration = useCallback(
    () => setState((prev) => ({ ...prev, celebration: null })),
    []
  );
  const clearEmergencyBanner = useCallback(
    () => setState((prev) => ({ ...prev, emergencyActive: false })),
    []
  );
  const clearTransferBanner = useCallback(
    () => setState((prev) => ({ ...prev, transferBannerActive: false })),
    []
  );

  const reset = useCallback(async () => {
    const data = await postJSON("/api/simulation/reset", { customerId: CUSTOMER_ID });
    applySnapshot(data, {
      celebration: null,
      emergencyActive: false,
      transferBannerActive: false,
      monthSimulated: false,
    });
  }, [applySnapshot]);

  const triggerCelebration = useCallback((celebration: Celebration) => {
    setState((prev) => ({ ...prev, celebration }));
  }, []);

  return (
    <DemoContext.Provider
      value={{
        ...state,
        simulateMonth,
        simulateEmergency,
        simulateOverspend,
        simulateTransfer,
        confirmTransaction,
        clearCelebration,
        triggerCelebration,
        clearEmergencyBanner,
        clearTransferBanner,
        reset,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return ctx;
}

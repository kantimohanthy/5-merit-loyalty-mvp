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
  loadDemoState,
  saveDemoState,
  resetDemoState,
  simulateMonthEngine,
  simulateEmergencyEngine,
  simulateOverspendEngine,
  simulateTransferEngine,
  confirmTransactionEngine,
  Celebration,
  ExcludedTransfer,
  RewardDetail,
  DemoEngineState,
} from "./demo-engine";

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
  overspendActive: boolean;
  switchedBank: boolean;
  excludedTransfers: ExcludedTransfer[];
  monthSimulated: boolean;
  loading: boolean;
  hydrated: boolean;
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

function mapEngineStateToDemoState(engineState: DemoEngineState): DemoState {
  return {
    customer: engineState.customer,
    plan: engineState.plan,
    transactions: engineState.transactions,
    rewards: engineState.rewards,
    rewardDetails: engineState.rewardDetails,
    status: engineState.status,
    bank: engineState.bank,
    celebration: engineState.celebration,
    emergencyActive: engineState.emergencyActive,
    transferBannerActive: engineState.transferBannerActive,
    overspendActive: engineState.overspendActive,
    switchedBank: engineState.switchedBank,
    excludedTransfers: engineState.excludedTransfers,
    monthSimulated: engineState.monthSimulated,
    loading: false,
    hydrated: true,
  };
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [engineState, setEngineState] = useState<DemoEngineState>(() => loadDemoState());

  // Background non-blocking sync with API backend if available
  const syncWithBackendAsync = useCallback((endpoint: string, body?: object) => {
    if (typeof window === "undefined") return;
    fetch(endpoint, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).catch(() => {
      // Swallowed on Vercel preview/production so client demo engine remains 100% reliable
    });
  }, []);

  useEffect(() => {
    const loaded = loadDemoState();
    setEngineState(loaded);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "MERIT_DEMO_ENGINE_STATE_V2") {
        setEngineState(loadDemoState());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const simulateMonth = useCallback(async () => {
    setEngineState((prev) => {
      const next = simulateMonthEngine(prev);
      saveDemoState(next);
      return next;
    });
    syncWithBackendAsync("/api/simulation/month", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const simulateEmergency = useCallback(async () => {
    setEngineState((prev) => {
      const next = simulateEmergencyEngine(prev);
      saveDemoState(next);
      return next;
    });
    syncWithBackendAsync("/api/simulation/emergency", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const simulateOverspend = useCallback(async () => {
    setEngineState((prev) => {
      const next = simulateOverspendEngine(prev);
      saveDemoState(next);
      return next;
    });
    syncWithBackendAsync("/api/simulation/overspend", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const simulateTransfer = useCallback(async () => {
    setEngineState((prev) => {
      const next = simulateTransferEngine(prev);
      saveDemoState(next);
      return next;
    });
    syncWithBackendAsync("/api/simulation/transfer", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const confirmTransaction = useCallback(
    async (id: string, category: Category) => {
      setEngineState((prev) => {
        const next = confirmTransactionEngine(prev, id, category);
        saveDemoState(next);
        return next;
      });
      syncWithBackendAsync(`/api/transactions/${id}`, { customerId: CUSTOMER_ID, category });
    },
    [syncWithBackendAsync]
  );

  const clearCelebration = useCallback(() => {
    setEngineState((prev) => {
      const next = { ...prev, celebration: null };
      saveDemoState(next);
      return next;
    });
  }, []);

  const clearEmergencyBanner = useCallback(() => {
    setEngineState((prev) => {
      const next = { ...prev, emergencyActive: false };
      saveDemoState(next);
      return next;
    });
  }, []);

  const clearTransferBanner = useCallback(() => {
    setEngineState((prev) => {
      const next = { ...prev, transferBannerActive: false };
      saveDemoState(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    const fresh = resetDemoState();
    setEngineState(fresh);
    syncWithBackendAsync("/api/simulation/reset", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const triggerCelebration = useCallback((celebration: Celebration) => {
    setEngineState((prev) => {
      const next = { ...prev, celebration };
      saveDemoState(next);
      return next;
    });
  }, []);

  const demoState = mapEngineStateToDemoState(engineState);

  return (
    <DemoContext.Provider
      value={{
        ...demoState,
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

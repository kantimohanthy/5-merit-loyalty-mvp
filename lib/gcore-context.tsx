"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  GCoreAccount,
  GCoreLedgerEntry,
  GMarketItem,
  ClaimFailureReason,
} from "./types";
import {
  loadDemoState,
  saveDemoState,
  claimGMarketItemEngine,
  simulateSwitchBankEngine,
  DemoEngineState,
} from "./demo-engine";

const CUSTOMER_ID = "alex-001";

interface GCoreState {
  account: GCoreAccount | null;
  ledger: GCoreLedgerEntry[];
  items: GMarketItem[];
  loading: boolean;
  switchedBank: boolean;
}

interface GCoreContextValue extends GCoreState {
  claim: (itemId: string) => Promise<{ success: boolean; reason?: ClaimFailureReason }>;
  switchBank: () => Promise<void>;
  refresh: () => Promise<void>;
  clearSwitchedBankFlag: () => void;
}

const GCoreContext = createContext<GCoreContextValue | null>(null);

export function GCoreProvider({ children }: { children: React.ReactNode }) {
  const [engineState, setEngineState] = useState<DemoEngineState>(() => loadDemoState());

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

  const refresh = useCallback(async () => {
    const loaded = loadDemoState();
    setEngineState(loaded);
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

  const claim = useCallback(
    async (itemId: string): Promise<{ success: boolean; reason?: ClaimFailureReason }> => {
      let resResult: { success: boolean; reason?: ClaimFailureReason } = { success: false, reason: "not_found" };
      setEngineState((prev) => {
        const { nextState, result } = claimGMarketItemEngine(prev, itemId);
        resResult = result;
        if (result.success) {
          saveDemoState(nextState);
          return nextState;
        }
        return prev;
      });
      syncWithBackendAsync("/api/gcore/claim", { customerId: CUSTOMER_ID, itemId });
      return resResult;
    },
    [syncWithBackendAsync]
  );

  const switchBank = useCallback(async () => {
    setEngineState((prev) => {
      const next = simulateSwitchBankEngine(prev);
      saveDemoState(next);
      return next;
    });
    syncWithBackendAsync("/api/simulation/switch-bank", { customerId: CUSTOMER_ID });
  }, [syncWithBackendAsync]);

  const clearSwitchedBankFlag = useCallback(() => {
    setEngineState((prev) => {
      const next = { ...prev, switchedBank: false };
      saveDemoState(next);
      return next;
    });
  }, []);

  return (
    <GCoreContext.Provider
      value={{
        account: engineState.gcore.account,
        ledger: engineState.gcore.ledger,
        items: engineState.gcore.items,
        loading: false,
        switchedBank: engineState.switchedBank,
        claim,
        switchBank,
        refresh,
        clearSwitchedBankFlag,
      }}
    >
      {children}
    </GCoreContext.Provider>
  );
}

export function useGCore(): GCoreContextValue {
  const ctx = useContext(GCoreContext);
  if (!ctx) {
    throw new Error("useGCore must be used within a GCoreProvider");
  }
  return ctx;
}

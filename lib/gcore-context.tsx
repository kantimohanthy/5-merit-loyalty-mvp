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

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

async function postJSON<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data.error) {
      throw new Error(data.error);
    }
    throw new Error(`${path} failed: ${res.status}`);
  }
  return res.json();
}

export function GCoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GCoreState>({
    account: null,
    ledger: [],
    items: [],
    loading: true,
    switchedBank: false,
  });

  const refresh = useCallback(async () => {
    try {
      const [stateData, gmarketData] = await Promise.all([
        getJSON<{ account: GCoreAccount; ledger: GCoreLedgerEntry[] }>(
          `/api/gcore/state?customerId=${CUSTOMER_ID}`
        ),
        getJSON<{ items: GMarketItem[] }>(`/api/gcore/gmarket`),
      ]);

      setState((prev) => ({
        ...prev,
        account: stateData.account,
        ledger: stateData.ledger,
        items: gmarketData.items ?? [],
        loading: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getJSON<{ account: GCoreAccount; ledger: GCoreLedgerEntry[] }>(
        `/api/gcore/state?customerId=${CUSTOMER_ID}`
      ),
      getJSON<{ items: GMarketItem[] }>(`/api/gcore/gmarket`),
    ])
      .then(([stateData, gmarketData]) => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            account: stateData.account,
            ledger: stateData.ledger,
            items: gmarketData.items ?? [],
            loading: false,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const claim = useCallback(
    async (itemId: string): Promise<{ success: boolean; reason?: ClaimFailureReason }> => {
      try {
        const res = await postJSON<{
          account: GCoreAccount;
          ledger: GCoreLedgerEntry[];
        }>("/api/gcore/claim", { customerId: CUSTOMER_ID, itemId });

        const gmarketData = await getJSON<{ items: GMarketItem[] }>("/api/gcore/gmarket").catch(
          () => ({ items: [] })
        );

        setState((prev) => ({
          ...prev,
          account: res.account,
          ledger: res.ledger,
          items: gmarketData.items ?? prev.items,
        }));

        return { success: true };
      } catch (err) {
        const reason = (err instanceof Error ? err.message : "not_found") as ClaimFailureReason;
        return { success: false, reason };
      }
    },
    []
  );

  const switchBank = useCallback(async () => {
    const data = await postJSON<{
      gcore: { account: GCoreAccount; ledger: GCoreLedgerEntry[] };
    }>("/api/simulation/switch-bank", { customerId: CUSTOMER_ID });

    setState((prev) => ({
      ...prev,
      account: data.gcore.account,
      ledger: data.gcore.ledger,
      switchedBank: true,
    }));
  }, []);

  const clearSwitchedBankFlag = useCallback(() => {
    setState((prev) => ({ ...prev, switchedBank: false }));
  }, []);

  return (
    <GCoreContext.Provider
      value={{
        ...state,
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

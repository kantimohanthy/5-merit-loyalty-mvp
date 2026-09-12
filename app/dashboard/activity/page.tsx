"use client";

import { useState } from "react";
import {
  ChevronDown,
  CircleAlert,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Repeat2,
} from "lucide-react";
import { useDemo, CATEGORY_CLASSIFICATION } from "@/lib/demo-context";
import { Card, Pill, SectionLabel } from "@/components/ui";
import { cn, formatEuro } from "@/lib/utils";
import type { Category, Transaction } from "@/lib/types";

const ALL_CATEGORIES: Category[] = [
  "Rent",
  "Healthcare",
  "Education",
  "Groceries",
  "Transport",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Travel",
  "Savings",
  "Other",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function TransactionRow({ txn }: { txn: Transaction }) {
  const { confirmTransaction } = useDemo();
  const [open, setOpen] = useState(false);
  const isInflow = txn.amount > 0;

  return (
    <div className={cn("border-b border-line last:border-b-0", (txn.flaggedEssential || txn.excludedReason) && "bg-positive-50/40")}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-cream/50"
      >
        <div className="w-16 shrink-0 text-xs text-navy-500">
          {formatDate(txn.date)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-ink">
              {txn.merchant}
            </span>
            {txn.flaggedEssential && (
              <ShieldCheck size={14} className="shrink-0 text-positive-600" />
            )}
            {txn.excludedReason && (
              <ShieldAlert size={14} className="shrink-0 text-amber-600" />
            )}
            {!txn.confirmed && (
              <CircleAlert size={14} className="shrink-0 text-amber-500" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-500">
            <span>{txn.category}</span>
            <span>·</span>
            <span className="capitalize">{txn.classification}</span>
          </div>
        </div>
        <div
          className={cn(
            "w-20 shrink-0 text-right font-display text-base",
            isInflow ? "text-positive-600" : "text-ink"
          )}
        >
          {formatEuro(txn.amount)}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-navy-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="rounded-xl border border-line bg-cream/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <SectionLabel>Classification confidence</SectionLabel>
                <div className="mt-1 font-display text-2xl text-ink">
                  {Math.round(txn.confidence * 100)}%
                </div>
              </div>
              <Pill tone={txn.classification === "essential" ? "positive" : txn.classification === "savings" ? "navy" : "amber"}>
                {txn.classification === "essential"
                  ? "Fixed obligation"
                  : txn.classification === "savings"
                  ? "Savings"
                  : "Discretionary"}
              </Pill>
            </div>

            <div className="mt-3 space-y-1.5">
              {txn.alternates.map((a) => (
                <div key={a.category} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 text-navy-600">{a.category}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/70">
                    <div
                      className="h-full rounded-full bg-navy-700"
                      style={{ width: `${a.confidence * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-navy-500">
                    {Math.round(a.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-navy-600">
              {txn.excludedReason
                ? txn.excludedReason
                : txn.flaggedEssential
                ? "Protected expense — excluded from discretionary-behavior evaluation."
                : txn.classification === "essential"
                ? "This expense is treated as a fixed obligation and does not negatively affect your discretionary target."
                : txn.classification === "savings"
                ? "Counted toward your monthly savings goal."
                : "This expense counts toward your discretionary target."}
            </p>

            {!txn.confirmed && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="text-xs font-medium text-navy-600">
                  Not quite right? Correct the category:
                </span>
                <select
                  defaultValue={txn.category}
                  onChange={(e) =>
                    confirmTransaction(txn.id, e.target.value as Category)
                  }
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy-800"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c} ({CATEGORY_CLASSIFICATION[c]})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => confirmTransaction(txn.id, txn.category)}
                  className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActivityPage() {
  const { transactions, simulateEmergency, simulateTransfer } = useDemo();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel>Activity</SectionLabel>
          <h1 className="mt-2 font-display text-3xl text-ink">
            Recent transactions
          </h1>
          <p className="mt-3 max-w-xl text-navy-600">
            Every transaction is classified automatically with a confidence
            score. Tap one to see why, and correct it if we got it wrong.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={simulateEmergency}
            className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:border-navy-500/40"
          >
            <Sparkles size={15} />
            Simulate emergency expense
          </button>
          <button
            onClick={simulateTransfer}
            className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:border-navy-500/40"
          >
            <Repeat2 size={15} />
            Simulate internal transfer
          </button>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        {transactions.map((txn) => (
          <TransactionRow key={txn.id} txn={txn} />
        ))}
      </Card>
    </div>
  );
}

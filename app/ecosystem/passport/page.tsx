"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Globe2,
  RefreshCw,
  Award,
  Zap,
  CheckCircle2,
  Landmark,
} from "lucide-react";
import { Card, Pill, SectionLabel, Button } from "@/components/ui";
import { useGCore } from "@/lib/gcore-context";
import { useDemo } from "@/lib/demo-context";
import { TIER_LABELS } from "@/lib/types";

export default function EcosystemPassportPage() {
  const { account, ledger, switchBank, loading, switchedBank } = useGCore();
  const demo = useDemo();
  const [switching, setSwitching] = useState(false);

  const handleSwitchBank = async () => {
    setSwitching(true);
    await switchBank();
    try {
      await demo.reset();
    } catch {}
    setSwitching(false);
  };

  if (loading || !account) {
    return (
      <div className="flex items-center justify-center py-12 text-navy-600">
        <RefreshCw className="animate-spin text-navy-800" size={20} />
        <span className="ml-2 font-medium text-xs">Loading G-Pass Network State...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <SectionLabel>Portable Identity &amp; Network Ledger</SectionLabel>
        <h1 className="mt-1 font-display text-3xl text-ink">G-Pass Passport</h1>
        <p className="mt-1 text-xs text-navy-600">
          Your G-Pass holds your verified network status and accumulated GP balance across all participating financial institutions.
        </p>
      </div>

      {/* Privacy Guarantee */}
      <Card className="flex items-start gap-3.5 border-positive-200 bg-positive-50/40 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-positive-600" />
        <div className="text-xs text-navy-700">
          <span className="font-semibold text-ink">Strict Privacy Boundary Guarantee:</span>{" "}
          Only your pseudonymous <code className="rounded bg-white px-1.5 py-0.5 font-mono text-navy-900 border border-line">{account.gPass}</code> identifier and point changes ever leave your bank.
          G-Core <span className="font-semibold text-ink">never sees your transactions, merchants, or amounts</span>.
        </div>
      </Card>

      {/* Identity Card & Tier Ladder */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-2">
              <SectionLabel>Network Identity (G-Pass)</SectionLabel>
              <Pill tone="neutral" className="font-mono text-xs">
                <Lock size={10} className="mr-1 text-navy-500" />
                Pseudonymous Hash
              </Pill>
            </div>
            <div className="mt-1 font-mono font-bold text-2xl tracking-wider text-ink">
              {account.gPass}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <SectionLabel>GP Balance</SectionLabel>
              <div className="mt-0.5 flex items-center justify-end gap-1.5 font-display text-3xl text-ink">
                <Sparkles size={20} className="text-amber-500" />
                {account.gpBalance.toLocaleString()}
              </div>
              <div className="text-xs text-navy-500">
                {account.gpLifetime.toLocaleString()} lifetime GP earned
              </div>
            </div>
            <div className="h-10 w-px bg-line hidden sm:block" />
            <div className="text-right">
              <SectionLabel>Status Tier</SectionLabel>
              <div className="mt-1">
                <Pill tone="navy" className="px-3 py-1 font-semibold text-sm">
                  <Award size={14} className="mr-1 text-amber-400" />
                  {account.tierLabel} Tier
                </Pill>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Segment Tier Progression */}
        <div className="mt-6">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-navy-600">
            <span>G-Core Status Progression</span>
            <span>
              {account.nextTierAt !== null
                ? `Next tier at ${account.nextTierAt} months verified history`
                : "Highest Status Tier (Diamond)"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {TIER_LABELS.map((label: string, idx: number) => {
              const isActive = idx === account.tierIndex;
              const isPassed = idx < account.tierIndex;
              return (
                <div
                  key={label}
                  className={`rounded-lg border p-2.5 text-center transition-all ${
                    isActive
                      ? "border-navy-900 bg-navy-900 text-white shadow-card"
                      : isPassed
                      ? "border-positive-200 bg-positive-50/60 text-positive-900"
                      : "border-line bg-cream/40 text-navy-400 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
                    {isPassed && <CheckCircle2 size={12} className="text-positive-600" />}
                    {isActive && <Sparkles size={12} className="text-amber-400" />}
                    Tier {idx}
                  </div>
                  <div className={`mt-1 font-display text-sm ${isActive ? "text-white" : isPassed ? "text-ink" : "text-navy-400"}`}>
                    {label}
                  </div>
                  <div className={`mt-0.5 text-[10px] ${isActive ? "text-white/70" : "text-navy-500"}`}>
                    {idx * 6}mo history
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Explainer Block */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5 flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Zap size={18} />
          </div>
          <div>
            <div className="font-semibold text-xs text-ink">
              Behavioral Goal Completion (+50 GP)
            </div>
            <p className="mt-1 text-xs text-navy-600 leading-relaxed">
              Earned each time you achieve a monthly MERIT reward target. Transmitted as a generic signal without merchant details.
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Award size={18} />
          </div>
          <div>
            <div className="font-semibold text-xs text-ink">
              Tenure Milestones (+200 GP &amp; Tier Advancement)
            </div>
            <p className="mt-1 text-xs text-navy-600 leading-relaxed">
              Earned every 6 months of verified financial history, advancing your network tier up to Diamond.
            </p>
          </div>
        </Card>
      </div>

      {/* Simulate Switch Bank Panel */}
      <Card className="border-2 border-dashed border-navy-500/20 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="font-display text-lg text-ink">Ecosystem Loyalty vs. Bank Lock-In</div>
            <div className="text-xs text-navy-500">
              Test changing banks live. Watch bank-local tier/points reset to zero while G-Core status survives untouched.
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSwitchBank}
            disabled={switching}
            className="bg-navy-900 text-white hover:bg-navy-800 text-xs"
          >
            <RefreshCw className={switching ? "animate-spin" : ""} size={14} />
            {switching ? "Switching..." : "Simulate Switch Bank"}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className={`rounded-xl border p-4 transition-all ${switchedBank ? "border-amber-300 bg-amber-50/40" : "border-line bg-cream/40"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-navy-700" />
                <span className="font-semibold text-xs text-ink">Bank-Local Loyalty</span>
              </div>
              <Pill tone={switchedBank ? "amber" : "neutral"}>
                {switchedBank ? "Reset on Bank Switch" : "Bank-Specific"}
              </Pill>
            </div>
            <div className="mt-3 space-y-1.5 rounded-lg bg-white p-3 text-xs">
              <div className="flex justify-between border-b border-line pb-1">
                <span className="text-navy-500">Bank Loyalty Tier</span>
                <span className={`font-semibold ${switchedBank ? "text-amber-700" : "text-ink"}`}>{switchedBank ? "START (Reset)" : "PLUS"}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-1">
                <span className="text-navy-500">Bank Points</span>
                <span className={`font-semibold ${switchedBank ? "text-amber-700" : "text-ink"}`}>{switchedBank ? "0 pts" : "2,500 pts"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">Monthly Streak</span>
                <span className={`font-semibold ${switchedBank ? "text-amber-700" : "text-ink"}`}>{switchedBank ? "0 mo" : "5 mo"}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-4 transition-all ${switchedBank ? "border-positive-300 bg-positive-50/40" : "border-navy-900 bg-navy-950 text-white"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 size={16} className={switchedBank ? "text-positive-700" : "text-white"} />
                <span className={`font-semibold text-xs ${switchedBank ? "text-positive-950" : "text-white"}`}>G-Core Network Status</span>
              </div>
              <Pill tone={switchedBank ? "positive" : "navy"}>
                {switchedBank ? "Survived Untouched!" : "Portable Concept"}
              </Pill>
            </div>
            <div className={`mt-3 space-y-1.5 rounded-lg p-3 text-xs ${switchedBank ? "bg-white text-navy-900" : "bg-white/10 text-white"}`}>
              <div className={`flex justify-between border-b pb-1 ${switchedBank ? "border-line" : "border-white/10"}`}>
                <span className={switchedBank ? "text-navy-500" : "text-white/70"}>G-Pass</span>
                <span className="font-mono font-semibold">{account.gPass}</span>
              </div>
              <div className={`flex justify-between border-b pb-1 ${switchedBank ? "border-line" : "border-white/10"}`}>
                <span className={switchedBank ? "text-navy-500" : "text-white/70"}>Network Tier</span>
                <span className={`font-semibold ${switchedBank ? "text-positive-700" : "text-amber-400"}`}>{account.tierLabel} Tier (Unchanged)</span>
              </div>
              <div className="flex justify-between">
                <span className={switchedBank ? "text-navy-500" : "text-white/70"}>GP Balance</span>
                <span className={`font-semibold ${switchedBank ? "text-positive-700" : "text-amber-400"}`}>{account.gpBalance} GP (Unchanged)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Ledger History */}
      <Card className="p-5">
        <SectionLabel>G-Core Ledger History</SectionLabel>
        <div className="mt-3 space-y-2">
          {ledger.map((entry) => {
            const isPos = entry.gpDelta > 0;
            return (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border border-line bg-cream/30 px-3.5 py-2.5 text-xs">
                <div>
                  <div className="font-semibold text-ink">{entry.reason}</div>
                  <div className="text-[10px] text-navy-500">{new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div className={`font-display text-sm font-semibold ${isPos ? "text-positive-600" : "text-navy-900"}`}>
                  {isPos ? `+${entry.gpDelta}` : entry.gpDelta} GP
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

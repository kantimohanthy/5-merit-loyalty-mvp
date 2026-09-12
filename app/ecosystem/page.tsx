"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Sparkles,
  Globe2,
  RefreshCw,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Layers,
} from "lucide-react";
import { Card, Pill, SectionLabel, Button } from "@/components/ui";
import { useGCore } from "@/lib/gcore-context";
import { useDemo } from "@/lib/demo-context";
import { TIER_LABELS, type ClaimFailureReason, type GMarketItem } from "@/lib/types";

export default function EcosystemPage() {
  const { account, ledger, items, claim, switchBank, loading, switchedBank } = useGCore();
  const demo = useDemo();

  const [claimStatus, setClaimStatus] = useState<{
    itemId: string;
    loading: boolean;
    error?: string;
    success?: string;
  } | null>(null);

  const [switching, setSwitching] = useState(false);

  const handleClaim = async (item: GMarketItem) => {
    setClaimStatus({ itemId: item.id, loading: true });
    const res = await claim(item.id);
    if (res.success) {
      setClaimStatus({
        itemId: item.id,
        loading: false,
        success: `Successfully claimed ${item.title}!`,
      });
    } else {
      const errorMessages: Record<ClaimFailureReason, string> = {
        tier_too_low: `Requires ${TIER_LABELS[item.minTierIndex]} tier or higher.`,
        insufficient_gp: `Requires ${item.gpCost} GP (you have ${account?.gpBalance ?? 0} GP).`,
        sold_out: "This reward is sold out.",
        not_found: "Item not found.",
      };
      setClaimStatus({
        itemId: item.id,
        loading: false,
        error: errorMessages[res.reason ?? "not_found"],
      });
    }
  };

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
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex items-center gap-3 text-navy-600">
          <RefreshCw className="animate-spin text-navy-800" size={20} />
          <span className="font-medium text-sm">Loading G-Core network state...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Header matching /architecture header pattern */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
              M
            </span>
            <span className="font-display text-lg text-ink">Merit</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/bank"
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-cream"
            >
              <ArrowLeft size={14} />
              Bank dashboard
            </Link>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-navy-800 sm:flex"
            >
              Customer app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Top Hero Section */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionLabel>Neutral Cross-Bank Network Layer</SectionLabel>
            <h1 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
              G-Core Ecosystem
            </h1>
            <p className="mt-2 max-w-2xl text-navy-600 text-sm">
              Portable financial status outside the bank. G-Core operates an independent,
              cross-bank loyalty ledger. Earn points (GP) for financial consistency and tenure that stay with you across institutions.
            </p>
          </div>
          <Pill tone="navy" className="py-1.5 px-3">
            <Globe2 size={13} className="mr-1 text-positive-400" />
            Active Ecosystem Layer
          </Pill>
        </div>

        {/* Privacy Boundary Banner */}
        <Card className="mt-6 flex items-start gap-3.5 border-positive-200 bg-positive-50/40 p-4">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-positive-600" />
          <div className="text-xs sm:text-sm text-navy-700">
            <span className="font-semibold text-ink">Strict Privacy Boundary Guarantee:</span>{" "}
            Only your pseudonymous <code className="rounded bg-white px-1.5 py-0.5 font-mono text-navy-900 border border-line">{account.gPass}</code> identifier and point changes ever leave your bank.
            G-Core <span className="font-semibold text-ink">never sees your transactions, merchants, or amounts</span>.
          </div>
        </Card>

        {/* Identity & Status Card */}
        <Card className="mt-8 p-6">
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
                <SectionLabel>G-Core Status Tier</SectionLabel>
                <div className="mt-1">
                  <Pill tone="navy" className="px-3 py-1 font-semibold text-sm">
                    <Award size={14} className="mr-1 text-amber-400" />
                    {account.tierLabel} Tier
                  </Pill>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Segment Tier Ladder */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-navy-600">
              <span>G-Core Status Progression</span>
              <span>
                {account.nextTierAt !== null
                  ? `Next tier at ${account.nextTierAt} months verified history`
                  : "Highest Status Tier (Diamond)"}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
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
                    <div
                      className={`mt-1 font-display text-sm ${
                        isActive ? "text-white" : isPassed ? "text-ink" : "text-navy-400"
                      }`}
                    >
                      {label}
                    </div>
                    <div
                      className={`mt-0.5 text-[10px] ${
                        isActive ? "text-white/70" : "text-navy-500"
                      }`}
                    >
                      {idx * 6}mo history
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* How You Earn GP Explainer Block */}
        <div className="mt-8">
          <SectionLabel>Earning Rules &amp; Transparency</SectionLabel>
          <h2 className="mt-1 font-display text-xl text-ink">How GP Accrues</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="p-5 flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                <Zap size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">
                  Behavioral Goal Completion (+50 GP)
                </div>
                <p className="mt-1 text-xs text-navy-600 leading-relaxed">
                  Earned automatically each time you achieve a MERIT reward or financial target.
                  G-Core receives only a generic signal (&ldquo;Behavioral goal completed&rdquo;) — no merchant, item, or transaction details are ever transmitted.
                </p>
              </div>
            </Card>

            <Card className="p-5 flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                <Award size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">
                  Tenure Milestones (+200 GP &amp; Tier Advancement)
                </div>
                <p className="mt-1 text-xs text-navy-600 leading-relaxed">
                  Earned every 6 months of verified financial history. Each milestone advances your
                  G-Core network tier (Member &rarr; Silver &rarr; Gold &rarr; Platinum &rarr; Diamond) and awards a recurring 200 GP bonus.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* "Simulate Switch Bank" Live Demo Moment */}
        <div className="mt-12">
          <SectionLabel>Live Architectural Demo</SectionLabel>
          <h2 className="mt-1 font-display text-2xl text-ink">
            Ecosystem Loyalty vs. Bank Lock-In
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-navy-600">
            If you switch banks, your bank-local MERIT tier, points, and streak reset — but your G-Core identity, tier, and GP balance survive completely untouched.
          </p>

          <Card className="mt-4 border-2 border-dashed border-navy-500/20 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <div className="font-display text-lg text-ink">Simulate Bank Migration</div>
                <div className="text-xs text-navy-500">
                  Click below to simulate leaving Bank A and joining Bank B.
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleSwitchBank}
                disabled={switching}
                className="bg-navy-900 text-white hover:bg-navy-800"
              >
                <RefreshCw className={switching ? "animate-spin" : ""} size={15} />
                {switching ? "Switching Bank..." : "Simulate Switch Bank"}
              </Button>
            </div>

            {/* Side-by-side comparison */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column: Bank Local */}
              <div
                className={`rounded-xl border p-5 transition-all ${
                  switchedBank
                    ? "border-amber-300 bg-amber-50/40 ring-2 ring-amber-400/30"
                    : "border-line bg-cream/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark size={18} className="text-navy-700" />
                    <span className="font-semibold text-sm text-ink">Bank-Local Loyalty</span>
                  </div>
                  <Pill tone={switchedBank ? "amber" : "neutral"}>
                    {switchedBank ? "Reset on Bank Switch" : "Bank-Specific"}
                  </Pill>
                </div>
                <p className="mt-2 text-xs text-navy-500">
                  Maintained inside Bank A. Tied strictly to your relationship with Bank A.
                </p>
                <div className="mt-4 space-y-2 rounded-lg bg-white p-3 text-xs">
                  <div className="flex justify-between border-b border-line pb-1.5">
                    <span className="text-navy-500">Bank Loyalty Tier</span>
                    <span
                      className={`font-semibold ${
                        switchedBank ? "text-amber-700 font-bold" : "text-ink"
                      }`}
                    >
                      {switchedBank ? "START (Reset to 0)" : "PLUS"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-line pb-1.5">
                    <span className="text-navy-500">Bank Loyalty Points</span>
                    <span
                      className={`font-semibold ${
                        switchedBank ? "text-amber-700 font-bold" : "text-ink"
                      }`}
                    >
                      {switchedBank ? "0 pts (Reset)" : "2,500 pts"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500">Monthly Streak</span>
                    <span
                      className={`font-semibold ${
                        switchedBank ? "text-amber-700 font-bold" : "text-ink"
                      }`}
                    >
                      {switchedBank ? "0 mo (Reset)" : "5 mo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: G-Core Network */}
              <div
                className={`rounded-xl border p-5 transition-all ${
                  switchedBank
                    ? "border-positive-300 bg-positive-50/40 ring-2 ring-positive-500/30"
                    : "border-navy-900 bg-navy-950 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className={switchedBank ? "text-positive-700" : "text-white"} />
                    <span
                      className={`font-semibold text-sm ${
                        switchedBank ? "text-positive-950" : "text-white"
                      }`}
                    >
                      G-Core Network Status
                    </span>
                  </div>
                  <Pill tone={switchedBank ? "positive" : "navy"}>
                    {switchedBank ? "Survived Untouched!" : "Cross-Bank Portable"}
                  </Pill>
                </div>
                <p
                  className={`mt-2 text-xs ${
                    switchedBank ? "text-positive-800" : "text-white/70"
                  }`}
                >
                  Independent network layer. Neutral across all participating financial institutions.
                </p>
                <div
                  className={`mt-4 space-y-2 rounded-lg p-3 text-xs ${
                    switchedBank ? "bg-white text-navy-900" : "bg-white/10 text-white"
                  }`}
                >
                  <div
                    className={`flex justify-between border-b pb-1.5 ${
                      switchedBank ? "border-line" : "border-white/10"
                    }`}
                  >
                    <span className={switchedBank ? "text-navy-500" : "text-white/70"}>
                      G-Pass Identity
                    </span>
                    <span className="font-mono font-semibold">{account.gPass}</span>
                  </div>
                  <div
                    className={`flex justify-between border-b pb-1.5 ${
                      switchedBank ? "border-line" : "border-white/10"
                    }`}
                  >
                    <span className={switchedBank ? "text-navy-500" : "text-white/70"}>
                      G-Core Network Tier
                    </span>
                    <span
                      className={`font-semibold ${
                        switchedBank ? "text-positive-700" : "text-amber-400"
                      }`}
                    >
                      {account.tierLabel} Tier (Unchanged)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={switchedBank ? "text-navy-500" : "text-white/70"}>
                      GP Balance
                    </span>
                    <span
                      className={`font-semibold ${
                        switchedBank ? "text-positive-700" : "text-amber-400"
                      }`}
                    >
                      {account.gpBalance} GP (Unchanged)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* G-Market Section */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <SectionLabel>G-Market Access</SectionLabel>
              <h2 className="mt-1 font-display text-2xl text-ink">Status Experiences &amp; Privileges</h2>
              <p className="mt-1 text-xs text-navy-600 max-w-xl">
                Scarce, status-gated experiences and privileges. Not purchasable with money — built to reward long-term financial consistency across the network.
              </p>
            </div>
            <Pill tone="amber">
              <Sparkles size={12} className="mr-1" />
              Status-Gated Access
            </Pill>
          </div>

          {claimStatus?.success && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-positive-50 border border-positive-200 p-3 text-xs text-positive-700 font-medium">
              <CheckCircle2 size={16} />
              {claimStatus.success}
            </div>
          )}

          {claimStatus?.error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 font-medium">
              <AlertCircle size={16} />
              {claimStatus.error}
            </div>
          )}

          {/* G-Market Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const categoryTones: Record<string, "neutral" | "positive" | "amber" | "navy"> = {
                access: "navy",
                privilege: "positive",
                experience: "amber",
              };

              const tierRequiredLabel = TIER_LABELS[item.minTierIndex];
              const meetsTier = account.tierIndex >= item.minTierIndex;
              const meetsGp = account.gpBalance >= item.gpCost;
              const hasScarcity = item.scarcityRemaining > 0;
              const canClaim = meetsTier && meetsGp && hasScarcity;

              let disabledReason = "";
              if (!hasScarcity) disabledReason = "Sold Out";
              else if (!meetsTier) disabledReason = `Requires ${tierRequiredLabel} Tier`;
              else if (!meetsGp) disabledReason = `Need ${item.gpCost} GP (Have ${account.gpBalance})`;

              const isLoadingThis = claimStatus?.itemId === item.id && claimStatus.loading;

              return (
                <Card key={item.id} className="flex flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Pill tone={categoryTones[item.category] ?? "neutral"} className="capitalize">
                        {item.category}
                      </Pill>
                      <span className="text-[11px] font-medium text-navy-500">
                        {item.scarcityRemaining} / {item.scarcityTotal} left
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-navy-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-line pt-4">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="text-navy-500">Min. Tier: <strong className="text-ink">{tierRequiredLabel}</strong></span>
                      <span className="font-display font-semibold text-base text-ink flex items-center gap-1">
                        <Sparkles size={14} className="text-amber-500" />
                        {item.gpCost} GP
                      </span>
                    </div>

                    <Button
                      variant={canClaim ? "primary" : "secondary"}
                      onClick={() => handleClaim(item)}
                      disabled={!canClaim || isLoadingThis}
                      className="w-full text-xs py-2"
                    >
                      {isLoadingThis
                        ? "Claiming..."
                        : canClaim
                        ? "Claim Reward"
                        : disabledReason}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* G-Core Ledger History Panel */}
        <div className="mt-12">
          <SectionLabel>Network Ledger Transparency</SectionLabel>
          <h2 className="mt-1 font-display text-2xl text-ink">G-Core Ledger History</h2>
          <p className="mt-1 text-xs text-navy-600">
            Append-only record of all earned and redeemed GP. Every change includes an explicit, rules-based reason string.
          </p>

          <Card className="mt-4 p-5">
            {ledger.length === 0 ? (
              <div className="py-8 text-center text-xs text-navy-400">
                No G-Core ledger entries recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {ledger.map((entry) => {
                  const isPositive = entry.gpDelta > 0;
                  const kindLabels: Record<string, string> = {
                    goal_completed: "Goal Milestone",
                    tenure_advanced: "Tenure Milestone",
                    gmarket_claim: "Market Claim",
                  };
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border border-line bg-cream/30 px-4 py-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full font-bold ${
                            isPositive
                              ? "bg-positive-100 text-positive-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPositive ? "+" : "-"}
                        </span>
                        <div>
                          <div className="font-semibold text-ink">{entry.reason}</div>
                          <div className="mt-0.5 text-[11px] text-navy-500">
                            {kindLabels[entry.kind] ?? entry.kind} &bull;{" "}
                            {new Date(entry.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`font-display text-sm font-semibold ${
                          isPositive ? "text-positive-600" : "text-navy-900"
                        }`}
                      >
                        {isPositive ? `+${entry.gpDelta}` : entry.gpDelta} GP
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

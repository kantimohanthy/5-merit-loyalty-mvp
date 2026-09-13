"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Ticket,
  Calendar,
  Gift,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Flame,
  Lock,
  MapPin,
  Building,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { useGCore } from "@/lib/gcore-context";
import { Card, Pill, SectionLabel } from "@/components/ui";
import { formatEuroPlain } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const TIER_THRESHOLDS = [
  { label: "Member", minGp: 0, perk: "Basic network entry & pseudonymous G-Pass identity." },
  { label: "Silver", minGp: 200, perk: "50 GP monthly bonus + early access to network drops." },
  { label: "Gold", minGp: 500, perk: "Priority wealth advisor sessions & FinTech Summit access." },
  { label: "Platinum", minGp: 1000, perk: "Airport lounge passes & 100 GP monthly tier bonus." },
  { label: "Diamond", minGp: 2000, perk: "24/7 dedicated personal concierge line across partners." },
];

const DIMENSION_REASONING: Record<string, string> = {
  "Budget consistency": "Based on keeping discretionary spend strictly under target across 3+ consecutive billing cycles.",
  "Savings consistency": "Evaluated from automated monthly transfers into your dedicated emergency and wealth savings accounts.",
  "Payment regularity": "Computed from on-time settlement of recurring fixed obligations, utilities, and subscriptions.",
  "Liquidity stability": "Measures maintenance of a minimum balance buffer above your personalized emergency threshold.",
  "Goal completion": "Tracks progress toward your planned monthly savings target versus discretionary ceiling.",
};

interface MonthSummary {
  month: string;
  status: "ACHIEVED" | "ON_TRACK" | "AT_RISK";
  discretionarySpent: number;
  savingsSaved: number;
  remaining: number;
  note: string;
}

export default function EcosystemOverviewPage() {
  const { customer, plan, status, triggerCelebration } = useDemo();
  const { account, claim } = useGCore();
  const [activeDimensionPopover, setActiveDimensionPopover] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const gTierLabel = account?.tierLabel ?? "Gold";
  const gBalance = account?.gpBalance ?? 600;
  const currentTierIndex = account?.tierIndex ?? 2; // Default Gold
  const nextTier = TIER_THRESHOLDS[Math.min(currentTierIndex + 1, TIER_THRESHOLDS.length - 1)];
  const currentTierMin = TIER_THRESHOLDS[currentTierIndex].minGp;
  const gpNeeded = nextTier.minGp - currentTierMin;
  const gpProgress = Math.max(0, gBalance - currentTierMin);
  const ringPct = nextTier.minGp > currentTierMin
    ? Math.min(100, Math.round((gpProgress / gpNeeded) * 100))
    : 100;

  // Real 5 dimensions from behavior-engine
  const dimensions = status.dimensions || [];
  const targetsHitCount = dimensions.filter((d) => d.score >= 0.5).length;
  const onTrack = plan.status !== "AT_RISK";

  // Historical month list derived from current data
  const historicalMonths: MonthSummary[] = [
    {
      month: "Sept 2026 (Current)",
      status: plan.status,
      discretionarySpent: plan.discretionarySpent,
      savingsSaved: plan.savingsSaved,
      remaining: Math.max(0, plan.discretionaryTarget - plan.discretionarySpent),
      note: "Current billing cycle active. Discretionary spending within target limit.",
    },
    {
      month: "Aug 2026",
      status: "ACHIEVED",
      discretionarySpent: 310,
      savingsSaved: 140,
      remaining: 50,
      note: "Met savings target of €140 and stayed under €360 discretionary ceiling.",
    },
    {
      month: "Jul 2026",
      status: "ACHIEVED",
      discretionarySpent: 340,
      savingsSaved: 120,
      remaining: 40,
      note: "Maintained 100% payment regularity and built 2-month consistency streak.",
    },
  ];

  // Summit countdown calculation (Target: Nov 15, 2026)
  const summitDate = new Date("2026-11-15T09:00:00Z");
  const now = new Date("2026-09-13T00:00:00Z");
  const daysRemaining = Math.max(1, Math.ceil((summitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Requirement checks for Annual Summit (gm6)
  const isGoldOrHigher = currentTierIndex >= 2;
  const hasGpCost = gBalance >= 500;
  const hasStreak = status.currentStreak >= 3;
  const canClaimSummit = isGoldOrHigher && hasGpCost && hasStreak && !claimSuccess;

  const handleClaimSummit = async () => {
    if (!canClaimSummit) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await claim("gm6");
      if (res.success) {
        setClaimSuccess(true);
        triggerCelebration({
          pointsAwarded: 50,
          newStreak: status.currentStreak,
          unlockedRewardId: "gm6",
        });
      } else {
        setClaimError(res.reason || "Failed to claim item");
      }
    } catch {
      // Fallback optimistic claim
      setClaimSuccess(true);
      triggerCelebration({
        pointsAwarded: 50,
        newStreak: status.currentStreak,
        unlockedRewardId: "gm6",
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header Row */}
      <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>
            {customer.profile} &bull; Member since {customer.memberSince}
          </SectionLabel>
          <h1 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            {greeting()}, {customer.name.split(" ")[0]}.
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span
              className={
                onTrack
                  ? "flex h-7 items-center gap-1.5 rounded-full bg-positive-50 px-3 text-sm font-medium text-positive-600 border border-positive-200"
                  : "flex h-7 items-center gap-1.5 rounded-full bg-amber-50 px-3 text-sm font-medium text-amber-600 border border-amber-200"
              }
            >
              <CheckCircle2 size={15} />
              {plan.status === "ACHIEVED"
                ? "You hit your target this month."
                : "You are on track this month."}
            </span>

            {/* Privacy Trust Chip */}
            <span className="flex h-7 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-xs font-semibold text-navy-600 shadow-2xs">
              <Lock size={12} className="text-emerald-600" />
              Transactions stay at XYZ Bank. Only monthly scores reach G-Core.
            </span>
          </div>
        </div>

        {/* Status Badge Card */}
        <Card className="flex items-center gap-4 bg-navy-900 text-white p-4.5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-navy-900 shadow-xs">
            <Award size={24} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              G-Core Network Status
            </div>
            <div className="font-display text-2xl text-white">{gTierLabel} Tier</div>
            <div className="mt-0.5 text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles size={12} /> {gBalance.toLocaleString()} GP Balance
            </div>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Wider — 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Behavioral Plan Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <SectionLabel>Monthly Behavioral Plan</SectionLabel>
                <h2 className="mt-1 font-display text-xl text-ink">
                  Behavioral Target Matrix
                </h2>
              </div>
              <Pill tone={targetsHitCount >= 4 ? "positive" : "amber"}>
                Hit {targetsHitCount} of 5 targets on track
              </Pill>
            </div>

            {/* 4-Stat Plan Snapshot Grid */}
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-line bg-paper/60 p-4 text-xs sm:grid-cols-4">
              <div>
                <span className="text-navy-500 font-medium">Income</span>
                <div className="mt-1 font-display text-lg text-ink font-bold">
                  {formatEuroPlain(plan.income)}
                </div>
                <div className="mt-0.5 text-[10px] text-navy-400">steady &bull; 3-mo avg</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Fixed obligations</span>
                <div className="mt-1 font-display text-lg text-ink font-bold">
                  {formatEuroPlain(plan.fixedObligations)}
                </div>
                <div className="mt-0.5 text-[10px] text-navy-400">rent, phone, transit</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Discretionary target</span>
                <div className="mt-1 font-display text-lg text-ink font-bold">
                  {formatEuroPlain(plan.discretionaryTarget)}
                </div>
                <div className="mt-0.5 text-[10px] text-amber-600 font-medium">personal ceiling</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Savings target</span>
                <div className="mt-1 font-display text-lg text-ink font-bold">
                  {formatEuroPlain(plan.savingsTarget)}
                </div>
                <div className="mt-0.5 text-[10px] text-positive-600 font-medium">monthly target</div>
              </div>
            </div>

            {/* 5 Real Behavior Dimensions */}
            <div className="mt-6 space-y-4">
              {dimensions.map((dim) => {
                const pctVal = Math.round(dim.score * 100);
                const isPopoverOpen = activeDimensionPopover === dim.label;
                return (
                  <div
                    key={dim.label}
                    className="rounded-xl border border-line bg-paper/60 p-4 transition-all hover:border-navy-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink">{dim.label}</span>
                        <button
                          onClick={() =>
                            setActiveDimensionPopover(isPopoverOpen ? null : dim.label)
                          }
                          className="text-navy-400 hover:text-navy-700 transition-colors p-0.5 rounded"
                          title="Click to view explanation"
                        >
                          <Info size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            dim.value === "STRONG"
                              ? "bg-positive-50 text-positive-600 border border-positive-200"
                              : dim.value === "MODERATE"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {dim.value}
                        </span>
                        <span className="font-mono text-xs font-bold text-ink">
                          {pctVal}%
                        </span>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          dim.value === "STRONG"
                            ? "bg-positive-500"
                            : dim.value === "MODERATE"
                            ? "bg-amber-500"
                            : "bg-navy-600"
                        }`}
                        style={{ width: animatedProgress ? `${pctVal}%` : "0%" }}
                      />
                    </div>

                    {/* Interactive "Why this number?" Popover */}
                    {isPopoverOpen && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-navy-700 animate-fade-up">
                        <div className="font-semibold text-amber-900 flex items-center gap-1 mb-1">
                          <Sparkles size={13} className="text-amber-600" />
                          Rationale &amp; Evaluation Logic
                        </div>
                        <p>{DIMENSION_REASONING[dim.label] || "Computed from continuous monthly pipeline data snapshot."}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Consistency Window Strip */}
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Consistency Window Strip</SectionLabel>
                <span className="text-xs text-navy-500 font-medium">
                  {status.currentStreak} months streak active
                </span>
              </div>

              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, idx) => {
                  const isCurrent = m === "Sep";
                  const isVerified = idx >= 3;
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setSelectedMonth(selectedMonth === m ? null : m)
                      }
                      className={`flex flex-col items-center justify-center rounded-lg p-2.5 flex-1 min-w-[50px] transition-all border ${
                        selectedMonth === m
                          ? "border-navy-900 bg-navy-900 text-white shadow-xs"
                          : isCurrent
                          ? "border-amber-300 bg-amber-50 text-navy-900"
                          : isVerified
                          ? "border-positive-200 bg-positive-50 text-positive-700"
                          : "border-line bg-paper text-navy-400"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {m}
                      </span>
                      <div className="mt-1 flex items-center justify-center">
                        {isVerified || isCurrent ? (
                          <Check size={14} className="stroke-[3]" />
                        ) : (
                          <span className="text-xs font-mono font-bold">&bull;</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Clickable Month Detail Expansion */}
              {selectedMonth && (
                <div className="mt-3 rounded-lg border border-line bg-cream/70 p-3.5 text-xs text-navy-700 animate-fade-up">
                  <div className="font-semibold text-ink flex items-center justify-between mb-1">
                    <span>Month Breakdown: {selectedMonth}</span>
                    <button
                      onClick={() => setSelectedMonth(null)}
                      className="text-navy-400 hover:text-navy-700"
                    >
                      &times;
                    </button>
                  </div>
                  <p>
                    Verified financial behavior targets met. Discretionary spending kept under ceiling, maintaining consistent portable G-Core status accrual.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Last 3 Months Panel with Stacked Track Bars */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <SectionLabel>Historical Record</SectionLabel>
                <h3 className="font-display text-lg text-ink">Last 3 Months History</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-navy-500 font-medium">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-navy-900" /> Spent
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-positive-500" /> Saved
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-300" /> Left
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {historicalMonths.map((m) => {
                const total = m.discretionarySpent + m.savingsSaved + m.remaining;
                const spentPct = Math.round((m.discretionarySpent / total) * 100);
                const savedPct = Math.round((m.savingsSaved / total) * 100);
                const leftPct = Math.max(0, 100 - spentPct - savedPct);

                return (
                  <div
                    key={m.month}
                    className="rounded-xl border border-line bg-paper p-4 hover:border-navy-500/30 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-ink">{m.month}</div>
                      <span className="rounded-full bg-positive-50 border border-positive-200 px-2 py-0.5 text-[10px] font-bold text-positive-600 uppercase">
                        {m.status}
                      </span>
                    </div>

                    {/* Stacked Multi-Segment Track Bar */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-line flex">
                      <div
                        className="h-full bg-navy-900 transition-all duration-700"
                        style={{ width: `${spentPct}%` }}
                        title={`Spent: €${m.discretionarySpent}`}
                      />
                      <div
                        className="h-full bg-positive-500 transition-all duration-700"
                        style={{ width: `${savedPct}%` }}
                        title={`Saved: €${m.savingsSaved}`}
                      />
                      <div
                        className="h-full bg-slate-300 transition-all duration-700"
                        style={{ width: `${leftPct}%` }}
                        title={`Left: €${m.remaining}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-navy-600 pt-0.5">
                      <span>{m.note}</span>
                      <span className="font-mono font-bold text-ink shrink-0">
                        €{m.discretionarySpent} spent &bull; €{m.savingsSaved} saved
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (Narrower — 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Animated Tier Ring Visualization & Ladder */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <SectionLabel>G-Core Status Ladder</SectionLabel>
                <h3 className="font-display text-lg text-ink">Network Tier Ring</h3>
              </div>
              <Pill tone="amber">{gTierLabel} Tier</Pill>
            </div>

            {/* Circular Progress Ring */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-44 w-44 -rotate-90 transform">
                  {/* Background Circle */}
                  <circle
                    cx="88"
                    cy="88"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-line"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="88"
                    cy="88"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-amber-500 transition-all duration-1000 ease-out"
                    fill="transparent"
                    strokeDasharray="440"
                    strokeDashoffset={
                      animatedProgress ? 440 - (440 * ringPct) / 100 : 440
                    }
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Badge Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500">
                    Current Status
                  </span>
                  <span className="font-display text-2xl text-ink font-bold">
                    {gTierLabel}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <Sparkles size={12} /> {gBalance} GP
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-navy-600">
                {currentTierIndex < TIER_THRESHOLDS.length - 1 ? (
                  <span>
                    Earn <strong className="text-ink">{nextTier.minGp - gBalance} more GP</strong> to reach <strong className="text-amber-600">{nextTier.label} Tier</strong>.
                  </span>
                ) : (
                  <span className="text-positive-600 font-semibold">
                    You have achieved highest Diamond status!
                  </span>
                )}
              </div>
            </div>

            {/* Hoverable Tier Ladder List */}
            <div className="mt-6 space-y-2 border-t border-line pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 mb-2">
                Network Tier Progression (Hover for Perks)
              </div>

              {TIER_THRESHOLDS.map((tier, idx) => {
                const isReached = currentTierIndex >= idx;
                const isHovered = hoveredTier === tier.label;
                return (
                  <div
                    key={tier.label}
                    onMouseEnter={() => setHoveredTier(tier.label)}
                    onMouseLeave={() => setHoveredTier(null)}
                    onClick={() => setHoveredTier((prev) => (prev === tier.label ? null : tier.label))}
                    className={`relative rounded-xl border p-3 transition-all cursor-pointer ${
                      isReached
                        ? "border-amber-300 bg-amber-50/70 text-navy-900"
                        : "border-line bg-paper text-navy-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isReached
                              ? "bg-amber-400 text-navy-900"
                              : "bg-line text-navy-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-ink">{tier.label}</span>
                      </div>
                      <span className="text-xs font-semibold font-mono">
                        {tier.minGp} GP
                      </span>
                    </div>

                    {/* Hover Perk Tooltip Card */}
                    {isHovered && (
                      <div className="mt-2 rounded-lg border border-amber-200 bg-white p-2.5 text-xs text-navy-700 shadow-sm animate-fade-up">
                        <div className="font-semibold text-amber-900">Unlocked Perk:</div>
                        <p className="mt-0.5">{tier.perk}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Annual FinTech Summit Exclusive Event Card */}
          <Card className="p-6 border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-card">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-amber-600" />
                <SectionLabel>Exclusive Network Event</SectionLabel>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Limited Seats &bull; 5 Left
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 flex items-center gap-1">
                  <MapPin size={11} /> Sarajevo &bull; Once a Year
                </div>
                <h3 className="font-display text-xl text-ink mt-0.5">
                  Annual European FinTech &amp; Loyalty Summit Pass
                </h3>
              </div>

              <p className="text-xs text-navy-600 leading-relaxed">
                Exclusive invitation to the annual executive roundtable and VIP networking reception in Sarajevo.
              </p>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 text-xs text-navy-700 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/80 font-medium">
                <Clock size={14} className="text-amber-600" />
                <span>Event in <strong>{daysRemaining} days</strong> &bull; Registration closes soon</span>
              </div>

              {/* Checklist with Status Icons */}
              <div className="space-y-2.5 border-t border-amber-100 pt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
                  Eligibility Criteria Checklist
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-navy-700">
                    {isGoldOrHigher ? (
                      <Check size={14} className="text-positive-600 font-bold" />
                    ) : (
                      <X size={14} className="text-rose-500 font-bold" />
                    )}
                    Gold Tier Requirement
                  </span>
                  <span className="font-semibold text-ink">
                    {gTierLabel} Tier {isGoldOrHigher ? "✓" : "(Requires Gold)"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-navy-700">
                    {hasGpCost ? (
                      <Check size={14} className="text-positive-600 font-bold" />
                    ) : (
                      <X size={14} className="text-rose-500 font-bold" />
                    )}
                    GP Balance Cost
                  </span>
                  <span className="font-semibold text-ink">
                    500 GP (Have {gBalance} GP) {hasGpCost ? "✓" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-navy-700">
                    {hasStreak ? (
                      <Check size={14} className="text-positive-600 font-bold" />
                    ) : (
                      <X size={14} className="text-rose-500 font-bold" />
                    )}
                    Verified Consistency Streak
                  </span>
                  <span className="font-semibold text-ink">
                    3+ Months ({status.currentStreak} Months) {hasStreak ? "✓" : ""}
                  </span>
                </div>
              </div>

              {/* Error Message if any */}
              {claimError && (
                <div className="text-xs text-rose-600 font-medium pt-1">
                  {claimError}
                </div>
              )}

              {/* Interactive Claim Button */}
              <button
                onClick={handleClaimSummit}
                disabled={!canClaimSummit || claiming}
                className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold shadow-xs transition-colors ${
                  claimSuccess
                    ? "bg-positive-500 text-white cursor-default"
                    : canClaimSummit
                    ? "bg-navy-900 text-white hover:bg-navy-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {claimSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> Invitation Claimed &amp; Confirmed!
                  </>
                ) : claiming ? (
                  "Processing Claim..."
                ) : canClaimSummit ? (
                  <>
                    <Sparkles size={15} className="text-amber-400" />
                    Claim Summit Invitation (500 GP)
                  </>
                ) : (
                  "Requirements Not Yet Met"
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

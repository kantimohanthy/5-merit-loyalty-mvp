"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Award,
  Info,
  ChevronRight,
  Clock,
  Ticket,
  Check,
  X,
  Flame,
  Lock,
  MapPin,
  RotateCcw,
  PlayCircle,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
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

interface DemoPreset {
  hello: string;
  tierIndex: number; // 0: STANDARD, 1: PLUS, 2: PRIME, 3: EXCLUSIVE, 4: ELITE
  tierLabel: string;
  mon: number;
  gp: number;
  monthChipText: string;
  planStatus: "ON TRACK" | "ACHIEVED" | "AT_RISK";
  discTarget: number;
  discWhy: string;
  budgetCap: number;
  spentAmount: number;
  spentPct: number;
  spentText: string;
  overdraftText: string;
  balancePct: number;
  balanceText: string;
  savingsPct: number;
  savingsText: string;
  nextBoxText: string;
  coldNoteText: string;
  summitBadgeText: string;
  summitBadgeOk: boolean;
  rqTierMet: boolean;
  rqTierSubText: string;
  rqGpMet: boolean;
  rqGpSubText: string;
}

const PRESETS: DemoPreset[] = [
  {
    hello: "Good morning, Alex.",
    tierIndex: 2,
    tierLabel: "PRIME",
    mon: 2,
    gp: 2900,
    monthChipText: "✓ You are on track this month",
    planStatus: "ON TRACK",
    discTarget: 376,
    discWhy: "median €392 −4% step",
    budgetCap: 376,
    spentAmount: 77,
    spentPct: 21,
    spentText: "€77 spent · €299 left",
    overdraftText: "Lowest so far €212 ✓",
    balancePct: 94,
    balanceText: "Now €390 · €22 to go",
    savingsPct: 100,
    savingsText: "€150 saved ✓",
    nextBoxText: "Next: EXCLUSIVE in 4 successful months → +350 GP/month and the Annual Summit unlocks.",
    coldNoteText: "Window 3 of 4 · month 2. Your budget tightened by 2% because you hit it twice in a row.",
    summitBadgeText: "Locked · EXCLUSIVE required",
    summitBadgeOk: false,
    rqTierMet: false,
    rqTierSubText: "You are PRIME · 4 successful months to go",
    rqGpMet: true,
    rqGpSubText: "You have 2,900 GP",
  },
  {
    hello: "Good morning, Alex.",
    tierIndex: 2,
    tierLabel: "PRIME",
    mon: 5,
    gp: 4210,
    monthChipText: "✓ On track · 3/5 already this month",
    planStatus: "ON TRACK",
    discTarget: 368,
    discWhy: "median €392 −6% step",
    budgetCap: 368,
    spentAmount: 288,
    spentPct: 78,
    spentText: "€288 spent · €80 left",
    overdraftText: "Lowest so far €140 ✓",
    balancePct: 97,
    balanceText: "Now €431 · €12 to go",
    savingsPct: 100,
    savingsText: "€150 saved ✓",
    nextBoxText: "EXCLUSIVE next month if this month counts → +350 GP/month, Annual Summit, trip-abroad draw. You've used your one miss (month 4); a second miss resets the window.",
    coldNoteText: "Window 3 of 4 · month 5. One miss used.",
    summitBadgeText: "Locked · 1 month to go",
    summitBadgeOk: false,
    rqTierMet: false,
    rqTierSubText: "PRIME · EXCLUSIVE next month if this month counts",
    rqGpMet: true,
    rqGpSubText: "You have 4,210 GP",
  },
  {
    hello: "Good morning, Alex — you're EXCLUSIVE.",
    tierIndex: 3,
    tierLabel: "EXCLUSIVE",
    mon: 0,
    gp: 4735,
    monthChipText: "✓ New tier this month",
    planStatus: "ACHIEVED",
    discTarget: 361,
    discWhy: "median €392 −8% step",
    budgetCap: 361,
    spentAmount: 15,
    spentPct: 4,
    spentText: "€15 spent · €346 left",
    overdraftText: "Lowest so far €402 ✓",
    balancePct: 10,
    balanceText: "Now €402 · €40 to go",
    savingsPct: 0,
    savingsText: "€0 saved · €150 to go",
    nextBoxText: "Next: ELITE after 6 more successful months → +450 GP/month, closed area, priority in the year's big draws.",
    coldNoteText: "Window 4 of 4 to ELITE starts now. Your monthly bonus rose from 250 to 350 GP.",
    summitBadgeText: "Eligible ✓",
    summitBadgeOk: true,
    rqTierMet: true,
    rqTierSubText: "EXCLUSIVE · earned over 18 months",
    rqGpMet: true,
    rqGpSubText: "You have 4,735 GP",
  },
];

const LADDER = [
  { label: "STANDARD", bonus: 50 },
  { label: "PLUS", bonus: 150 },
  { label: "PRIME", bonus: 250 },
  { label: "EXCLUSIVE", bonus: 350 },
  { label: "ELITE", bonus: 450 },
];

export default function EcosystemOverviewPage() {
  const { customer, plan, status, triggerCelebration, simulateMonth, simulateEmergency, reset, monthSimulated } = useDemo();
  const { account, claim } = useGCore();

  const [presetIndex, setPresetIndex] = useState(0);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeWhyPopover, setActiveWhyPopover] = useState(false);
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const cur = PRESETS[presetIndex];
  const gPassHash = account?.gPass ?? "p_8f3a";

  const handleSimulateMonthClick = async () => {
    setPresetIndex((prev) => Math.min(prev + 1, PRESETS.length - 1));
    setEmergencyActive(false);
    try {
      await simulateMonth();
    } catch {}
  };

  const handleSimulateEmergencyClick = async () => {
    setEmergencyActive((prev) => !prev);
    try {
      await simulateEmergency();
    } catch {}
  };

  const handleResetClick = async () => {
    setPresetIndex(0);
    setEmergencyActive(false);
    try {
      await reset();
    } catch {}
  };

  const handleClaimSummit = async () => {
    if (!cur.rqTierMet && !cur.summitBadgeOk) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await claim("gm6");
      if (res.success) {
        setClaimSuccess(true);
        triggerCelebration({
          pointsAwarded: 350,
          newStreak: status.currentStreak,
          unlockedRewardId: "gm6",
        });
      } else {
        setClaimError(res.reason || "Failed to claim Summit Pass");
      }
    } catch {
      setClaimSuccess(true);
      triggerCelebration({
        pointsAwarded: 350,
        newStreak: status.currentStreak,
        unlockedRewardId: "gm6",
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 text-navy-900">
      {/* Top Header & Action Controls Bar */}
      <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-500">
            Online banking &bull; G-Core Ecosystem &bull; G-Pass{" "}
            <span className="font-mono text-navy-900 bg-paper px-1.5 py-0.5 rounded border border-line">
              {gPassHash}
            </span>
          </div>

          <h1 className="mt-1 font-display text-3xl font-bold text-ink lg:text-4xl">
            {cur.hello}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-2xs">
              {cur.monthChipText}
            </span>

            {/* Privacy Trust Chip */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy-600 shadow-2xs">
              <Lock size={12} className="text-emerald-600" />
              Your transactions <strong className="text-ink font-semibold">stay at XYZ Bank</strong>. Only monthly results reach G-Core.
            </span>
          </div>
        </div>

        {/* Top Right Controls & Preset Switcher */}
        <div className="flex flex-col items-start sm:items-end gap-2.5 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSimulateMonthClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white hover:bg-navy-800 transition-colors shadow-xs"
            >
              <PlayCircle size={15} />
              Simulate Month
            </button>

            <button
              onClick={handleSimulateEmergencyClick}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold transition-colors ${
                emergencyActive
                  ? "bg-rose-50 border-rose-300 text-rose-700"
                  : "bg-white border-line text-navy-900 hover:bg-paper"
              }`}
            >
              <HeartPulse size={15} className={emergencyActive ? "text-rose-600" : "text-amber-600"} />
              Simulate Emergency Expense
            </button>

            <button
              onClick={handleResetClick}
              title="Reset Demo State"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-navy-500 hover:bg-paper hover:text-navy-900 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-navy-300 bg-white/70 p-1 text-xs text-navy-500 w-full sm:w-auto">
            <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-navy-400">
              Demo state:
            </span>
            <button
              onClick={() => {
                setPresetIndex(0);
                setEmergencyActive(false);
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                presetIndex === 0
                  ? "bg-navy-900 text-white shadow-2xs"
                  : "bg-transparent text-navy-600 hover:bg-paper"
              }`}
            >
              PRIME &bull; month 2
            </button>
            <button
              onClick={() => {
                setPresetIndex(1);
                setEmergencyActive(false);
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                presetIndex === 1
                  ? "bg-navy-900 text-white shadow-2xs"
                  : "bg-transparent text-navy-600 hover:bg-paper"
              }`}
            >
              PRIME &bull; month 5
            </button>
            <button
              onClick={() => {
                setPresetIndex(2);
                setEmergencyActive(false);
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                presetIndex === 2
                  ? "bg-navy-900 text-white shadow-2xs"
                  : "bg-transparent text-navy-600 hover:bg-paper"
              }`}
            >
              EXCLUSIVE reached
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN (Wider — 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Monthly Behavioral Plan */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <SectionLabel>Monthly Behavioral Plan</SectionLabel>
                <div className="mt-1 text-xs text-navy-600">
                  Computed from{" "}
                  <span className="font-semibold underline decoration-dotted decoration-navy-400 cursor-help" title="Personal targets = median of your last 3 months at XYZ Bank. No general norm.">
                    your own last 3 months
                  </span>
                  . Hit <strong className="text-ink">3 of 5</strong> to make the month count.
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {cur.planStatus}
              </span>
            </div>

            {/* 4-Stat Grid */}
            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-line bg-paper/60 p-4 text-xs sm:grid-cols-4">
              <div>
                <span className="text-navy-500 font-medium">Income</span>
                <div className="mt-1 font-display text-xl font-bold text-ink">
                  {formatEuroPlain(plan.income)}
                </div>
                <div className="mt-0.5 text-[10px] text-navy-400">steady &bull; 3-month avg</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Fixed obligations</span>
                <div className="mt-1 font-display text-xl font-bold text-ink">
                  {formatEuroPlain(plan.fixedObligations)}
                </div>
                <div className="mt-0.5 text-[10px] text-navy-400">rent, phone, transit</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Discretionary target</span>
                <div className="mt-1 font-display text-xl font-bold text-ink">
                  €{cur.discTarget}
                </div>
                <div className="mt-0.5 text-[10px] text-amber-700 font-semibold">{cur.discWhy}</div>
              </div>
              <div>
                <span className="text-navy-500 font-medium">Savings target</span>
                <div className="mt-1 font-display text-xl font-bold text-ink">
                  {formatEuroPlain(plan.savingsTarget)}
                </div>
                <div className="mt-0.5 text-[10px] text-emerald-700 font-semibold">median of last 3 months</div>
              </div>
            </div>

            {/* 5 Target Rows */}
            <div className="mt-6 space-y-4">
              {/* Target 1: Budget */}
              <div className="grid grid-cols-12 gap-3 items-center border-t border-line pt-3.5 text-xs">
                <div className="col-span-1 flex justify-center">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center font-bold text-[10px] ${
                    emergencyActive ? "bg-rose-600 border-rose-600 text-white" : cur.spentPct <= 100 ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-slate-400"
                  }`}>
                    {emergencyActive ? "✕" : cur.spentPct <= 100 ? "✓" : ""}
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-bold text-ink text-sm">Budget</div>
                  <div className="text-[11px] text-navy-500">
                    Discretionary ≤ <strong>€{cur.budgetCap}</strong> &bull;{" "}
                    <button
                      onClick={() => setActiveWhyPopover((prev) => !prev)}
                      className="underline decoration-dotted text-navy-600 hover:text-navy-900 font-medium"
                    >
                      why this number?
                    </button>
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        emergencyActive ? "bg-rose-600" : "bg-navy-900"
                      }`}
                      style={{ width: animatedProgress ? (emergencyActive ? "100%" : `${cur.spentPct}%`) : "0%" }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-navy-600">
                    {emergencyActive ? "€403 spent · €43 over the band" : cur.spentText}
                  </div>
                </div>
                <div className="col-span-2 text-right font-bold font-mono text-sm text-ink">
                  100 <span className="text-[10px] font-normal text-navy-500">GP</span>
                </div>
              </div>

              {/* Rationale Popover if active */}
              {activeWhyPopover && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-navy-800 animate-fade-up">
                  <strong className="text-amber-900 font-bold">Why €{cur.budgetCap}?</strong> Median of your last 3 months discretionary spending (€392), minus the progression step (−4% after consecutive hits). Tightens 2% after two hits in a row; loosens after a miss; drops automatically if income drops.
                </div>
              )}

              {/* Target 2: No overdraft */}
              <div className="grid grid-cols-12 gap-3 items-center border-t border-line pt-3.5 text-xs">
                <div className="col-span-1 flex justify-center">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 border-2 border-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-bold text-ink text-sm">No overdraft</div>
                  <div className="text-[11px] text-navy-500">Balance never below €0 this month</div>
                </div>
                <div className="col-span-5 text-xs font-semibold text-emerald-700">
                  {cur.overdraftText}
                </div>
                <div className="col-span-2 text-right font-bold font-mono text-sm text-ink">
                  50 <span className="text-[10px] font-normal text-navy-500">GP</span>
                </div>
              </div>

              {/* Target 3: Month-end balance */}
              <div className="grid grid-cols-12 gap-3 items-center border-t border-line pt-3.5 text-xs">
                <div className="col-span-1 flex justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                    &bull;
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-bold text-ink text-sm">Month-end balance</div>
                  <div className="text-[11px] text-navy-500">Close ≥ <strong>€412</strong> &bull; last month&apos;s close</div>
                </div>
                <div className="col-span-5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-700"
                      style={{ width: animatedProgress ? `${cur.balancePct}%` : "0%" }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-navy-600">{cur.balanceText}</div>
                </div>
                <div className="col-span-2 text-right font-bold font-mono text-sm text-ink">
                  75 <span className="text-[10px] font-normal text-navy-500">GP</span>
                </div>
              </div>

              {/* Target 4: Savings */}
              <div className="grid grid-cols-12 gap-3 items-center border-t border-line pt-3.5 text-xs">
                <div className="col-span-1 flex justify-center">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 border-2 border-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-bold text-ink text-sm">Savings</div>
                  <div className="text-[11px] text-navy-500">Transfer ≥ <strong>€150</strong> &bull; your usual amount</div>
                </div>
                <div className="col-span-5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                      style={{ width: animatedProgress ? `${cur.savingsPct}%` : "0%" }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700 font-semibold">{cur.savingsText}</div>
                </div>
                <div className="col-span-2 text-right font-bold font-mono text-sm text-ink">
                  75 <span className="text-[10px] font-normal text-navy-500">GP</span>
                </div>
              </div>

              {/* Target 5: Hold an investment */}
              <div className="grid grid-cols-12 gap-3 items-center border-t border-line pt-3.5 text-xs">
                <div className="col-span-1 flex justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                    &bull;
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-bold text-slate-600 text-sm">Hold an investment</div>
                  <div className="text-[11px] text-navy-400">No open position — not required for 3/5</div>
                </div>
                <div className="col-span-5 text-xs text-navy-400">—</div>
                <div className="col-span-2 text-right font-bold font-mono text-sm text-navy-400">
                  75 <span className="text-[10px] font-normal text-navy-400">GP</span>
                </div>
              </div>
            </div>

            {/* Emergency Alert Box if active */}
            {emergencyActive && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 animate-fade-up">
                <strong className="font-bold">Emergency expense −€250 (laptop repair).</strong> Budget target missed for this month. The month can <strong>still count</strong> if you hit 3 of the other 4 — no overdraft and savings are already in.
              </div>
            )}

            {/* Card Footer: Hit Count & Window */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-xs">
              <div>
                <div className="font-display text-lg font-bold text-ink">
                  {emergencyActive ? "2" : presetIndex === 1 ? "3" : "2"} / 5 hit{" "}
                  <span className="text-xs font-normal text-navy-500">&bull; 3 needed &bull; 19 days left</span>
                </div>
                <div className="mt-0.5 text-[11px] text-navy-500">
                  Points are booked at month close. Tier bonus is added on top.
                </div>
              </div>

              <div className="text-right">
                <SectionLabel>Consistency &bull; 6-month window &bull; 1 miss allowed</SectionLabel>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="h-2.5 w-6 rounded bg-emerald-600" />
                  <span className="h-2.5 w-6 rounded bg-emerald-600" />
                  <span className="h-2.5 w-6 rounded border-2 border-navy-900 bg-white" />
                  <span className="h-2.5 w-6 rounded bg-line" />
                  <span className="h-2.5 w-6 rounded bg-line" />
                  <span className="h-2.5 w-6 rounded bg-line" />
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-navy-500">
              {cur.coldNoteText}
            </div>
          </Card>

          {/* Card 2: Last 3 Months */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <SectionLabel>Historical Record</SectionLabel>
                <h3 className="font-display text-lg font-bold text-ink">Last 3 months</h3>
                <div className="mt-0.5 text-xs text-navy-500">
                  Your spending habits at XYZ Bank — the data behind this month&apos;s targets. Stays in the bank.
                </div>
              </div>

              <Link
                href="/ecosystem/activity"
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-paper transition-colors"
              >
                Full activity &rarr;
              </Link>
            </div>

            {/* Header Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-500">
              <span>After fixed obligations you had <strong className="text-ink">€570</strong> each month</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-3 rounded-xs bg-navy-900 inline-block" /> Spent
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-3 rounded-xs bg-emerald-600 inline-block" /> Saved
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-3 rounded-xs bg-slate-300 inline-block" /> Left in account
                </span>
              </div>
            </div>

            {/* 3 Stacked Track Rows */}
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center text-xs">
                <div className="col-span-3 sm:col-span-2 font-semibold text-navy-600">June</div>
                <div className="col-span-9 sm:col-span-6 h-4 rounded-md bg-line overflow-hidden flex">
                  <div className="bg-navy-900 h-full" style={{ width: `${(398 / 570) * 100}%` }} title="Spent: €398" />
                  <div className="bg-emerald-600 h-full" style={{ width: `${(150 / 570) * 100}%` }} title="Saved: €150" />
                  <div className="bg-slate-300 h-full" style={{ width: `${(22 / 570) * 100}%` }} title="Left: €22" />
                </div>
                <div className="col-span-12 sm:col-span-4 text-left sm:text-right font-medium text-navy-700 text-[11px] sm:text-xs">
                  <strong>€398</strong> spent &bull; <strong>€150</strong> saved &bull; €22 left
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center text-xs">
                <div className="col-span-3 sm:col-span-2 font-semibold text-navy-600">July</div>
                <div className="col-span-9 sm:col-span-6 h-4 rounded-md bg-line overflow-hidden flex">
                  <div className="bg-navy-900 h-full" style={{ width: `${(385 / 570) * 100}%` }} title="Spent: €385" />
                  <div className="bg-emerald-600 h-full" style={{ width: `${(120 / 570) * 100}%` }} title="Saved: €120" />
                  <div className="bg-slate-300 h-full" style={{ width: `${(65 / 570) * 100}%` }} title="Left: €65" />
                </div>
                <div className="col-span-12 sm:col-span-4 text-left sm:text-right font-medium text-navy-700 text-[11px] sm:text-xs">
                  <strong>€385</strong> spent &bull; <strong>€120</strong> saved &bull; €65 left
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center text-xs">
                <div className="col-span-3 sm:col-span-2 font-semibold text-navy-600">August</div>
                <div className="col-span-9 sm:col-span-6 h-4 rounded-md bg-line overflow-hidden flex">
                  <div className="bg-navy-900 h-full" style={{ width: `${(392 / 570) * 100}%` }} title="Spent: €392" />
                  <div className="bg-emerald-600 h-full" style={{ width: `${(150 / 570) * 100}%` }} title="Saved: €150" />
                  <div className="bg-slate-300 h-full" style={{ width: `${(28 / 570) * 100}%` }} title="Left: €28" />
                </div>
                <div className="col-span-12 sm:col-span-4 text-left sm:text-right font-medium text-navy-700 text-[11px] sm:text-xs">
                  <strong>€392</strong> spent &bull; <strong>€150</strong> saved &bull; €28 left
                </div>
              </div>

              {/* Median Line Row */}
              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center text-xs border-t border-dashed border-line pt-3">
                <div className="col-span-3 sm:col-span-2 font-bold text-navy-900">Median</div>
                <div className="col-span-9 sm:col-span-6 relative h-6">
                  <div className="absolute left-[68%] top-0 bottom-0 border-l-2 border-dashed border-navy-900 flex items-center pl-1 font-semibold text-[10px] text-navy-900 whitespace-nowrap">
                    €392 spent
                  </div>
                  <div className="absolute left-[26%] top-0 bottom-0 border-l-2 border-dashed border-emerald-600 flex items-center pl-1 font-semibold text-[10px] text-emerald-700 whitespace-nowrap">
                    €150 saved
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-4 text-left sm:text-right text-[11px] text-navy-500 font-medium">
                  &rarr; this month: budget ≤ €376 (−4%) &bull; save ≥ €150
                </div>
              </div>
            </div>

            {/* 3 Month Detail Cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-paper/60 p-3.5 text-xs">
                <div className="flex items-center justify-between font-bold text-ink mb-2">
                  June <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px]">4/5</span>
                </div>
                <dl className="space-y-1.5 text-[11px]">
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Month-end balance</dt><dd className="font-semibold text-ink">€319</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Top category</dt><dd className="text-navy-700">Food &amp; dining &bull; €138</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Biggest purchase</dt><dd className="text-navy-700">Concert ticket &bull; €65</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Lowest balance</dt><dd className="text-navy-700">€184 &bull; never below 0</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Savings day</dt><dd className="text-navy-700">28th</dd></div>
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-paper/60 p-3.5 text-xs">
                <div className="flex items-center justify-between font-bold text-ink mb-2">
                  July <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px]">3/5</span>
                </div>
                <dl className="space-y-1.5 text-[11px]">
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Month-end balance</dt><dd className="font-semibold text-ink">€384 <span className="text-emerald-600">▲</span></dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Top category</dt><dd className="text-navy-700">Transport &bull; €96</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Biggest purchase</dt><dd className="text-navy-700">Adidas Baščaršija &bull; €59</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Lowest balance</dt><dd className="text-navy-700">€140 &bull; never below 0</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Savings day</dt><dd className="text-navy-700">12th &bull; <span className="text-amber-700 font-medium">€120, target missed</span></dd></div>
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-paper/60 p-3.5 text-xs">
                <div className="flex items-center justify-between font-bold text-ink mb-2">
                  August <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px]">4/5</span>
                </div>
                <dl className="space-y-1.5 text-[11px]">
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Month-end balance</dt><dd className="font-semibold text-ink">€412 <span className="text-emerald-600">▲</span> &bull; this month&apos;s floor</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Top category</dt><dd className="text-navy-700">Food &amp; dining &bull; €121</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Biggest purchase</dt><dd className="text-navy-700">Textbooks &bull; €88</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Lowest balance</dt><dd className="text-navy-700">€212 &bull; never below 0</dd></div>
                  <div><dt className="text-navy-400 font-medium uppercase text-[9px] tracking-wider">Savings day</dt><dd className="text-navy-700">2nd</dd></div>
                </dl>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-navy-500 leading-relaxed">
              Pattern: 41% of your discretionary spending lands in the first 10 days; savings moved from the 28th to the 2nd — that&apos;s why your savings target is now easier to hit. Night-time (00–05) purchases: 2 in 3 months.
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (Narrower — 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Your Status */}
          <Card className="p-6">
            <SectionLabel>G-Core Status &amp; Tier Ladder</SectionLabel>
            <h3 className="mt-1 font-display text-lg font-bold text-ink">Your status</h3>

            {/* Ring & Tier Badge */}
            <div className="mt-4 flex items-center gap-4">
              {/* Circular Tier Progress Ring */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-navy-900">
                  {cur.mon}/6
                </div>
              </div>

              <div>
                <div className="font-display text-2xl font-bold text-ink">
                  {cur.tierLabel}
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  Month {cur.mon} of 6 &bull; earned at XYZ Bank
                </span>
              </div>
            </div>

            {/* KV Stats */}
            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-line bg-paper/50 p-3.5">
              <div>
                <div className="font-display text-xl font-bold text-ink">
                  +{LADDER[cur.tierIndex].bonus} GP
                </div>
                <div className="text-[11px] text-navy-500">every month for this tier</div>
              </div>
              <div>
                <div className="font-display text-xl font-bold text-ink">
                  {cur.gp.toLocaleString("en-US")} GP
                </div>
                <div className="text-[11px] text-navy-500">balance &bull; valid at every member bank</div>
              </div>
            </div>

            {/* 5-Tier Step Ladder Bar */}
            <div className="mt-5 grid grid-cols-5 gap-1.5 border-t border-line pt-4">
              {LADDER.map((item, idx) => {
                const isActive = idx <= cur.tierIndex;
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setHoveredTierIndex(idx)}
                    onMouseLeave={() => setHoveredTierIndex(null)}
                    onClick={() => setHoveredTierIndex(hoveredTierIndex === idx ? null : idx)}
                    className={`rounded-lg border p-2 text-center transition-all cursor-pointer ${
                      isActive
                        ? "border-amber-400 bg-amber-50 text-navy-900 font-bold"
                        : "border-line bg-paper text-navy-400"
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider">{item.label}</div>
                    <div className="text-[10px] font-mono">+{item.bonus}</div>
                  </div>
                );
              })}
            </div>

            {/* Next Tier Callout */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-navy-800">
              {cur.nextBoxText}
            </div>

            <div className="mt-3 text-[11px] text-navy-500">
              Tier is earned at this bank — switching banks restarts it. GP is yours everywhere.
            </div>
          </Card>

          {/* Card 2: Exclusive Network Summit Event */}
          <Card className="overflow-hidden p-0 border-amber-200 bg-white shadow-card">
            {/* Hero Image Container */}
            <div className="relative h-48 w-full bg-navy-950 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent z-10" />
              <div className="absolute top-3 right-3 z-20">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  cur.summitBadgeOk
                    ? "bg-emerald-600 text-white"
                    : "bg-navy-900/80 text-white border border-white/30 backdrop-blur-xs"
                }`}>
                  {cur.summitBadgeText}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-20 z-20 text-white">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  Annual event &bull; Sarajevo &bull; once a year
                </div>
                <div className="font-display text-xl font-bold mt-0.5 text-white">
                  Exclusive Network Summit
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-20 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-xs font-medium">
                <strong className="font-bold text-sm">214</strong> days
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
                Entry requires all three &bull; no tickets sold, ever
              </div>

              {/* Requirements List */}
              <div className="space-y-2.5 text-xs">
                {/* Req 1: Loyalty Tier EXCLUSIVE */}
                <div className={`flex items-start gap-3 rounded-xl border p-3 ${
                  cur.rqTierMet ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"
                }`}>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                    cur.rqTierMet ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                  }`}>
                    {cur.rqTierMet ? "✓" : "✕"}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-ink">
                      Loyalty tier <strong className="underline text-amber-700">EXCLUSIVE</strong> or higher
                    </div>
                    <div className="text-[11px] text-navy-500 mt-0.5">
                      {cur.rqTierSubText}
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    cur.rqTierMet ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {cur.rqTierMet ? "met" : "missing"}
                  </span>
                </div>

                {/* Req 2: GP Cost */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-ink">2,500 GP entry</div>
                    <div className="text-[11px] text-navy-500 mt-0.5">
                      {cur.rqGpSubText}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    met
                  </span>
                </div>

                {/* Req 3: Verified G-Pass */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-ink">Verified G-Pass at the door</div>
                    <div className="text-[11px] text-navy-500 mt-0.5">
                      Checked live &bull; not transferable &bull; no invitations
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    ready
                  </span>
                </div>
              </div>

              {/* Claim Action Button */}
              <button
                onClick={handleClaimSummit}
                disabled={!cur.rqTierMet && !cur.summitBadgeOk || claiming}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold shadow-xs transition-all ${
                  claimSuccess
                    ? "bg-emerald-600 text-white"
                    : cur.rqTierMet || cur.summitBadgeOk
                    ? "bg-navy-900 text-white hover:bg-navy-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {claimSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> Summit Pass Claimed &amp; Confirmed!
                  </>
                ) : claiming ? (
                  "Processing Claim..."
                ) : cur.rqTierMet || cur.summitBadgeOk ? (
                  <>
                    <Sparkles size={15} className="text-amber-400" />
                    Claim Summit Invitation (2,500 GP)
                  </>
                ) : (
                  "Locked &bull; Requirements Not Yet Met"
                )}
              </button>

              <div className="text-[11px] text-navy-500">
                Points alone don&apos;t open the door; money can&apos;t buy the tier. 640 members were eligible last year.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Demo Notes Legend Box */}
      <div className="mt-8 rounded-xl border border-dashed border-navy-300 bg-paper/80 p-5 text-xs text-navy-700 space-y-2">
        <strong className="text-ink font-bold text-sm">Demo notes.</strong> Left: monthly behavioral plan (5 targets, 3/5 rule, &quot;why this number&quot;), then the last 3 months that produced those targets. Right: tier card, then the Annual Summit with its hard requirements.
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-navy-600">
          <li>
            <strong className="text-navy-900 font-semibold">Simulate Emergency Expense</strong> shows the 3/5 rule doing its job: budget misses, month still counts, one miss consumed.
          </li>
          <li>
            <strong className="text-navy-900 font-semibold">Simulate Month</strong> advances PRIME month 2 &rarr; month 5 &rarr; EXCLUSIVE reached (bonus 250 &rarr; 350, Annual Summit unlocks).
          </li>
          <li>
            <strong className="text-navy-900 font-semibold">Last 3 months</strong>: the dashed line is the 3-month median that becomes this month&apos;s budget base — the personal-target mechanism made visible.
          </li>
        </ul>
      </div>
    </div>
  );
}

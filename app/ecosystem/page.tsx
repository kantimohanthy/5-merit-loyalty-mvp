"use client";

import Link from "next/link";
import { CheckCircle2, Flame, Gift, Sparkles, ArrowRight, Award } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { useGCore } from "@/lib/gcore-context";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";
import { formatEuroPlain, pct } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function EcosystemOverviewPage() {
  const { customer, plan, status, rewards } = useDemo();
  const { account } = useGCore();

  const discretionaryPct = pct(plan.discretionarySpent, plan.discretionaryTarget);
  const savingsPct = pct(plan.savingsSaved, plan.savingsTarget);
  const remaining = Math.max(0, plan.discretionaryTarget - plan.discretionarySpent);
  const nextReward = rewards.find((r) => r.status === "locked") ?? rewards[0];
  const onTrack = plan.status !== "AT_RISK";

  const gTierLabel = account?.tierLabel ?? "Gold";
  const gBalance = account?.gpBalance ?? 600;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>
            {customer.profile} &bull; Member since {customer.memberSince}
          </SectionLabel>
          <h1 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            {greeting()}, {customer.name.split(" ")[0]}.
          </h1>
          <div className="mt-3 flex items-center gap-2">
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
          </div>
        </div>

        {/* Combined Status Badge Card */}
        <Card className="flex items-center gap-4 bg-navy-900 text-white p-4 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-navy-900">
            <Award size={22} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              MERIT Status
            </div>
            <div className="font-display text-2xl text-white">{gTierLabel}</div>
            <div className="mt-0.5 text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles size={12} /> {gBalance.toLocaleString()} GP Balance
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Monthly Behavioral Plan</SectionLabel>
            <Pill tone={onTrack ? "positive" : "amber"}>
              {plan.status.replace("_", " ")}
            </Pill>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-navy-500 text-xs">Income</div>
              <div className="mt-1 font-display text-xl text-ink">
                {formatEuroPlain(plan.income)}
              </div>
            </div>
            <div>
              <div className="text-navy-500 text-xs">Fixed obligations</div>
              <div className="mt-1 font-display text-xl text-ink">
                {formatEuroPlain(plan.fixedObligations)}
              </div>
            </div>
            <div>
              <div className="text-navy-500 text-xs">Discretionary target</div>
              <div className="mt-1 font-display text-xl text-ink">
                {formatEuroPlain(plan.discretionaryTarget)}
              </div>
            </div>
            <div>
              <div className="text-navy-500 text-xs">Savings target</div>
              <div className="mt-1 font-display text-xl text-ink">
                {formatEuroPlain(plan.savingsTarget)}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-navy-700 font-medium">Discretionary spent</span>
                <span className="font-medium text-ink">
                  {formatEuroPlain(plan.discretionarySpent)} / {formatEuroPlain(plan.discretionaryTarget)}
                </span>
              </div>
              <ProgressBar value={discretionaryPct} tone="navy" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-navy-700 font-medium">Savings</span>
                <span className="font-medium text-ink">
                  {formatEuroPlain(plan.savingsSaved)} / {formatEuroPlain(plan.savingsTarget)}
                </span>
              </div>
              <ProgressBar value={savingsPct} tone="positive" />
            </div>
          </div>

          {remaining > 0 ? (
            <p className="mt-5 text-xs text-navy-600">
              You&rsquo;re{" "}
              <span className="font-semibold text-ink">
                {formatEuroPlain(remaining)}
              </span>{" "}
              away from your monthly target. Stay on track to unlock your next reward.
            </p>
          ) : (
            <p className="mt-5 text-xs text-positive-600 font-medium">
              You&rsquo;ve stayed within your personalized target this month.
            </p>
          )}

          <Link
            href="/ecosystem/goals"
            className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-navy-800 hover:text-navy-900"
          >
            See goal breakdown &rarr;
          </Link>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <SectionLabel>Consistency Streak</SectionLabel>
            </div>
            <div className="mt-1.5 font-display text-3xl text-ink">
              {status.currentStreak} months
            </div>
            <div className="mt-1 text-xs text-navy-500">
              Consecutive months on track
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-navy-700" />
              <SectionLabel>Network GP Points</SectionLabel>
            </div>
            <div className="mt-1.5 font-display text-3xl text-ink">
              {gBalance.toLocaleString()} GP
            </div>
            <div className="mt-1 text-xs text-navy-500">
              Portable cross-bank balance
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-5 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Gift size={20} />
          </div>
          <div>
            <SectionLabel>Next reward</SectionLabel>
            <p className="mt-1 text-xs text-navy-700">
              {nextReward.status === "unlocked"
                ? `${nextReward.merchant} &bull; ${nextReward.title} is ready to redeem.`
                : `Stay within your target to unlock ${nextReward.merchant} &bull; ${nextReward.title}.`}
            </p>
          </div>
        </div>
        <Link
          href="/ecosystem/rewards"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:border-navy-500/40"
        >
          View rewards <ArrowRight size={14} />
        </Link>
      </Card>
    </div>
  );
}

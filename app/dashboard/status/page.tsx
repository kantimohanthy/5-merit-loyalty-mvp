"use client";

import { ShieldCheck, Globe2, Lock } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";

const TIER_ORDER = ["START", "PLUS", "PRIME"] as const;

function toneFor(value: string) {
  if (value === "STRONG") return "positive" as const;
  if (value === "MODERATE") return "amber" as const;
  return "neutral" as const;
}

export default function StatusPage() {
  const { status, plan, transactions } = useDemo();

  const stability = Math.round(
    (status.dimensions.reduce((a, d) => a + d.score, 0) / status.dimensions.length) * 100
  );
  const overspend = plan.discretionarySpent > plan.discretionaryTarget;
  const hasProtectedExpense = transactions.some((t) => t.flaggedEssential);

  const reasons: { positive: boolean; text: string }[] = [
    { positive: true, text: "Fixed obligations covered in full" },
    {
      positive: plan.savingsSaved >= plan.savingsTarget,
      text:
        plan.savingsSaved >= plan.savingsTarget
          ? "Monthly savings goal met"
          : "Savings progressing toward this month's goal",
    },
    {
      positive: !overspend,
      text: overspend
        ? "Discretionary spending currently above personalized range"
        : "Discretionary spending within personalized range",
    },
    ...(hasProtectedExpense
      ? [{ positive: true, text: "Protected expense correctly excluded from evaluation" }]
      : []),
    {
      positive: status.currentStreak >= 3,
      text:
        status.currentStreak >= 3
          ? "Consistent behavior across previous periods"
          : "Building consistency month over month",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <SectionLabel>Passport</SectionLabel>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Your MERIT Status
      </h1>
      <p className="mt-3 max-w-xl text-navy-600">
        Your status reflects long-term behavioral consistency, not how
        wealthy you are.
      </p>

      <Card className="mt-7 overflow-hidden p-0">
        <div className="bg-navy-900 px-6 py-7 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                MERIT Status
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {TIER_ORDER.map((t) => (
                <span
                  key={t}
                  className={`h-1.5 w-6 rounded-full ${
                    TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(status.tier)
                      ? "bg-amber-400"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 font-display text-4xl">{status.tier}</div>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/75">
            <div>
              Verified history{" "}
              <span className="font-semibold text-white">
                {status.verifiedHistoryMonths} months
              </span>
            </div>
            <div>
              Current streak{" "}
              <span className="font-semibold text-white">
                {status.currentStreak} months
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-baseline justify-between">
            <SectionLabel>Behavioral Stability</SectionLabel>
            <span className="font-display text-2xl text-ink">{stability}/100</span>
          </div>

          <div className="mt-4 space-y-4">
            {status.dimensions.map((d) => (
              <div key={d.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-navy-700">{d.label}</span>
                  <Pill tone={toneFor(d.value)}>{d.value}</Pill>
                </div>
                <ProgressBar
                  value={d.score}
                  tone={
                    d.value === "STRONG"
                      ? "positive"
                      : d.value === "MODERATE"
                      ? "amber"
                      : "navy"
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-line bg-cream/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              Why this score
            </div>
            <div className="mt-2.5 space-y-1.5">
              {reasons.map((r) => (
                <div key={r.text} className="flex items-start gap-2 text-sm text-navy-700">
                  <span
                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                      r.positive ? "bg-positive-500" : "bg-amber-500"
                    }`}
                  />
                  {r.text}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-navy-600">
            Explainable and rules-based — every input above is visible, and
            protected expenses like emergency or healthcare costs are treated
            contextually rather than counted against you.
          </p>
        </div>
      </Card>

      <Card className="mt-5 p-6">
        <div className="flex items-center gap-2">
          <Globe2 size={17} className="text-navy-700" />
          <SectionLabel>Portable Behavioral Financial Passport</SectionLabel>
          <Pill className="ml-auto">
            <Lock size={11} className="mr-1" />
            Concept · future layer
          </Pill>
        </div>
        <p className="mt-3 text-sm text-navy-600">
          With explicit consent, your MERIT Status could eventually travel
          with you between participating institutions — without exposing your
          complete transaction history. This is a future concept, not a live
          credit bureau or lending decision.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-cream/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-navy-600">
            Passport preview
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <div className="text-navy-500">Verified history</div>
              <div className="font-semibold text-ink">
                {status.verifiedHistoryMonths}mo
              </div>
            </div>
            <div>
              <div className="text-navy-500">Consistency streak</div>
              <div className="font-semibold text-ink">
                {status.currentStreak}mo
              </div>
            </div>
            <div>
              <div className="text-navy-500">MERIT Status</div>
              <div className="font-semibold text-ink">{status.tier}</div>
            </div>
            <div>
              <div className="text-navy-500">Raw transactions</div>
              <div className="font-semibold text-ink">Not shared</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

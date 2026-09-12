"use client";

import { Target, CheckCircle2 } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";

function toneFor(value: string) {
  if (value === "STRONG") return "positive" as const;
  if (value === "MODERATE") return "amber" as const;
  return "neutral" as const;
}

export default function EcosystemGoalsPage() {
  const { status, plan, transactions } = useDemo();

  const overallCompletion = Math.round(
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
      <SectionLabel>Financial Goal Progress</SectionLabel>
      <h1 className="mt-2 font-display text-3xl text-ink">Personalized Goals</h1>
      <p className="mt-2 max-w-xl text-xs text-navy-600">
        Goals are calibrated to your income and fixed commitments. Meeting these targets builds long-term financial consistency and unlocks network rewards.
      </p>

      <Card className="mt-6 overflow-hidden p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-navy-900" />
            <div>
              <div className="font-display text-xl text-ink">Goal Completion Index</div>
              <div className="text-xs text-navy-500">Longitudinal evaluation across 5 dimensions</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-ink">{overallCompletion}%</div>
            <Pill tone={overallCompletion >= 75 ? "positive" : "amber"}>
              {overallCompletion >= 75 ? "Strong Progress" : "Developing"}
            </Pill>
          </div>
        </div>

        {/* Goal Dimension Progress Bars */}
        <div className="mt-6 space-y-4">
          {status.dimensions.map((d) => {
            const pctVal = Math.round(d.score * 100);
            return (
              <div key={d.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                  <span className="text-navy-800">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{pctVal}%</span>
                    <Pill tone={toneFor(d.value)} className="text-[10px] py-0.5 px-2">
                      {d.value}
                    </Pill>
                  </div>
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
            );
          })}
        </div>

        {/* Why This Score Explainability Panel */}
        <div className="mt-6 rounded-xl border border-line bg-cream/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-700">
            <CheckCircle2 size={14} className="text-positive-600" />
            Rule-Based Rationale (&ldquo;Why this score&rdquo;)
          </div>
          <div className="mt-2.5 space-y-2">
            {reasons.map((r) => (
              <div key={r.text} className="flex items-start gap-2 text-xs text-navy-700">
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

        <p className="mt-4 text-xs text-navy-500 leading-relaxed">
          Fully explainable and rules-based. Protected expenses (such as emergency medical care) are automatically excluded from discretionary behavior scoring.
        </p>
      </Card>
    </div>
  );
}

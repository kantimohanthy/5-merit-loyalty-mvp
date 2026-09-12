"use client";

import { useDemo } from "@/lib/demo-context";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";
import { formatEuroPlain, pct } from "@/lib/utils";
import { ShieldCheck, TrendingUp, History, Target } from "lucide-react";

const NON_DISCRETIONARY = [
  "Rent",
  "Tuition",
  "Medical expenses",
  "Utilities",
  "Necessary transport",
  "Insurance",
  "Emergency expenses",
];

const DISCRETIONARY = ["Entertainment", "Shopping", "Dining", "Optional travel"];

export default function PlanPage() {
  const { plan } = useDemo();

  const fixedShare = pct(plan.fixedObligations, plan.income);
  const discretionaryShare = pct(plan.discretionaryTarget, plan.income);
  const savingsShare = pct(plan.savingsTarget, plan.income);

  const discretionaryPct = pct(plan.discretionarySpent, plan.discretionaryTarget);
  const savingsPct = pct(plan.savingsSaved, plan.savingsTarget);

  return (
    <div className="mx-auto max-w-4xl">
      <SectionLabel>My Plan</SectionLabel>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Your personalized monthly plan
      </h1>
      <p className="mt-3 max-w-2xl text-navy-600">
        Built from your own income pattern and obligations — not a universal
        budget. Your plan adapts as your situation changes.
      </p>

      <Card className="mt-7 p-6">
        <div className="flex items-center justify-between">
          <SectionLabel>Income allocation</SectionLabel>
          <span className="font-display text-lg text-ink">
            {formatEuroPlain(plan.income)} / month
          </span>
        </div>

        <div className="mt-4 flex h-8 w-full overflow-hidden rounded-full border border-line">
          <div
            className="flex items-center justify-center bg-navy-700 text-[11px] font-medium text-white"
            style={{ width: `${fixedShare * 100}%` }}
          >
            {fixedShare > 0.12 && "Fixed"}
          </div>
          <div
            className="flex items-center justify-center bg-navy-400 text-[11px] font-medium text-white"
            style={{ width: `${discretionaryShare * 100}%`, backgroundColor: "#8896b8" }}
          >
            {discretionaryShare > 0.12 && "Discretionary"}
          </div>
          <div
            className="flex items-center justify-center bg-positive-500 text-[11px] font-medium text-white"
            style={{ width: `${savingsShare * 100}%` }}
          >
            {savingsShare > 0.08 && "Savings"}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-navy-700" />
            <div>
              <div className="text-navy-500">Fixed obligations</div>
              <div className="font-semibold text-ink">
                {formatEuroPlain(plan.fixedObligations)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "#8896b8" }}
            />
            <div>
              <div className="text-navy-500">Discretionary target</div>
              <div className="font-semibold text-ink">
                {formatEuroPlain(plan.discretionaryTarget)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-positive-500" />
            <div>
              <div className="text-navy-500">Savings target</div>
              <div className="font-semibold text-ink">
                {formatEuroPlain(plan.savingsTarget)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Discretionary spending</SectionLabel>
            <Pill tone={discretionaryPct < 1 ? "positive" : "amber"}>
              {formatEuroPlain(plan.discretionarySpent)} / {formatEuroPlain(plan.discretionaryTarget)}
            </Pill>
          </div>
          <div className="mt-4">
            <ProgressBar value={discretionaryPct} tone="navy" />
          </div>
          <p className="mt-3 text-sm text-navy-500">
            Entertainment, shopping, dining and optional travel — spending you
            choose to make.
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Savings progress</SectionLabel>
            <Pill tone="positive">
              {formatEuroPlain(plan.savingsSaved)} / {formatEuroPlain(plan.savingsTarget)}
            </Pill>
          </div>
          <div className="mt-4">
            <ProgressBar value={savingsPct} tone="positive" />
          </div>
          <p className="mt-3 text-sm text-navy-500">
            Set from what&rsquo;s realistic after your obligations — not a
            fixed percentage rule.
          </p>
        </Card>
      </div>

      <Card className="mt-5 p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={17} className="text-navy-700" />
          <SectionLabel>How we evaluate context</SectionLabel>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-navy-600">
          A €1,000 emergency hospital payment is not treated the same way as
          €1,000 of unnecessary discretionary spending. A large rent payment
          does not hurt your evaluation just because it&rsquo;s a big share of
          your income.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-cream/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              Non-discretionary
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {NON_DISCRETIONARY.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-navy-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-cream/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              Discretionary
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DISCRETIONARY.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-navy-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
          <History size={17} className="mt-0.5 shrink-0 text-navy-700" />
          <div className="text-sm text-navy-600">
            <span className="font-semibold text-ink">Your own history.</span>{" "}
            We compare this month to your past patterns, not a universal
            budget.
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
          <Target size={17} className="mt-0.5 shrink-0 text-navy-700" />
          <div className="text-sm text-navy-600">
            <span className="font-semibold text-ink">Your obligations.</span>{" "}
            Fixed costs are set aside before discretionary targets are built.
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
          <TrendingUp size={17} className="mt-0.5 shrink-0 text-navy-700" />
          <div className="text-sm text-navy-600">
            <span className="font-semibold text-ink">Your trajectory.</span>{" "}
            Consistency over 3–6 months matters more than any single week.
          </div>
        </div>
      </div>
    </div>
  );
}

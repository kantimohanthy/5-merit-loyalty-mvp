"use client";

import { AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Card, SectionLabel } from "./ui";
import { formatEuroPlain } from "@/lib/utils";

function donutArcs(
  segments: { label: string; value: number; color: string }[],
  income: number,
  size: number,
  stroke: number
) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const sum = segments.reduce((a, s) => a + s.value, 0);
  const scale = sum > income ? income / sum : 1;

  let offset = 0;
  return segments.map((s) => {
    const frac = (s.value * scale) / income;
    const len = c * frac;
    const el = (
      <circle
        key={s.label}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={s.color}
        strokeWidth={stroke}
        strokeDasharray={`${len} ${c - len}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray .7s ease, stroke .3s ease" }}
      />
    );
    offset += len;
    return el;
  });
}

export function MonthlyDonut() {
  const { plan, simulateOverspend } = useDemo();
  const overspend = plan.discretionarySpent > plan.discretionaryTarget;
  const size = 172;
  const stroke = 20;

  const segments = [
    { label: "Fixed obligations", value: plan.fixedObligations, color: "#131c33" },
    {
      label: "Discretionary spent",
      value: plan.discretionarySpent,
      color: overspend ? "#b3432f" : "#8896b8",
    },
    { label: "Savings", value: plan.savingsSaved, color: "#3d8148" },
  ];

  const rawPct = Math.round((plan.discretionarySpent / plan.discretionaryTarget) * 100);
  const statusWord = plan.status === "ACHIEVED" ? "ACHIEVED" : overspend ? "ABOVE RANGE" : "ON TRACK";
  const statusColor = overspend ? "#b3432f" : "#2f6738";

  const remaining = Math.max(0, plan.discretionaryTarget - plan.discretionarySpent);
  const over = Math.max(0, plan.discretionarySpent - plan.discretionaryTarget);

  return (
    <Card className="p-6">
      <SectionLabel>This month, at a glance</SectionLabel>

      <div className="relative mx-auto mt-4" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - stroke) / 2}
            fill="none"
            stroke="#e6e2d8"
            strokeWidth={stroke}
          />
          {donutArcs(segments, plan.income, size, stroke)}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div
            className="text-[10px] font-semibold uppercase tracking-[.1em]"
            style={{ color: statusColor }}
          >
            {statusWord}
          </div>
          <div className="mt-1 font-display text-2xl text-ink">{rawPct}%</div>
          <div className="text-[10px] text-navy-500">of discretionary target</div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-navy-700">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
            <span className="font-semibold text-ink">{formatEuroPlain(s.value)}</span>
          </div>
        ))}
      </div>

      {overspend ? (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "#e7c3b8", background: "#fbeee9" }}>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#b3432f" }}>
            <AlertTriangle size={16} className="shrink-0" />
            Outside your range this month
          </div>
          <p className="mt-1.5 text-sm text-navy-700">
            You&rsquo;re{" "}
            <span className="font-semibold" style={{ color: "#b3432f" }}>
              {formatEuroPlain(over)}
            </span>{" "}
            above your personalized discretionary range. Bring it back in range to keep Adidas
            20% moving toward unlock.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-positive-100 bg-positive-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-positive-600">
            <CheckCircle2 size={16} className="shrink-0" />
            You&rsquo;re on track
          </div>
          <p className="mt-1.5 text-sm text-navy-700">
            You&rsquo;ve saved <span className="font-semibold text-ink">{formatEuroPlain(plan.savingsSaved)}</span>{" "}
            and kept <span className="font-semibold text-ink">{formatEuroPlain(remaining)}</span> of
            headroom — that&rsquo;s exactly why Adidas 20% is within reach.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-navy-500">
        This isn&rsquo;t about spending less — it&rsquo;s about staying consistent with your own
        plan. Your MERIT Status reflects consistency, not wealth: stay in range and you unlock{" "}
        <em>more</em>, never less.
      </p>

      <button
        onClick={simulateOverspend}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-500/40 hover:bg-cream"
      >
        <TrendingDown size={16} />
        Simulate Overspend
      </button>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Users,
  Activity,
  TrendingUp,
  Repeat,
  Network,
  Globe2,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";

interface BankCustomer {
  id: string;
  name: string;
  profile: string;
  memberSince: string;
  live: boolean;
  behavioral: { label: string; value: number }[];
  campaign: {
    merchant: string;
    title: string;
    reason: string;
    objective: string;
  };
}

// Only one customer here is real — Jamie is an illustrative second profile
// so the jury sees the dashboard isn't a single-row demo. Never blur the two:
// Alex is labeled Live and is read straight from the same backend snapshot
// driving the Customer Wallet demo; Jamie is labeled Simulated.
const JAMIE_NOVAK: BankCustomer = {
  id: "jamie-002",
  name: "Jamie Novak",
  profile: "Student",
  memberSince: "Jan 2026",
  live: false,
  behavioral: [
    { label: "Budget consistency", value: 0.62 },
    { label: "Savings consistency", value: 0.55 },
    { label: "Payment regularity", value: 0.58 },
    { label: "Liquidity stability", value: 0.5 },
    { label: "Goal completion", value: 0.48 },
  ],
  campaign: {
    merchant: "Spotify",
    title: "1 month free",
    reason: "Consistent subscription spend + building a savings streak.",
    objective: "Engagement & habit formation",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900/5 text-navy-800">
          <Icon size={16} />
        </div>
        <SectionLabel>{label}</SectionLabel>
      </div>
      <div className="mt-2.5 font-display text-3xl text-ink">{value}</div>
      <div className="mt-1 text-sm text-navy-500">{sub}</div>
    </Card>
  );
}

const NAVY = "#131c33";
const SAGE = "#8896b8";
const GREEN = "#3d8148";

export default function BankDashboardPage() {
  const { bank, customer, status, rewards, rewardDetails } = useDemo();
  const [selectedId, setSelectedId] = useState("alex-001");

  // Alex's card is built live from the exact same pipeline snapshot driving
  // the Customer Wallet demo — whatever the jury just watched happen there
  // (Simulate Month, a reward unlocking) shows up here too, no re-fetch.
  const bestReward =
    rewards.find((r) => r.status === "unlocked") ??
    [...rewards]
      .filter((r) => r.status === "locked")
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];
  const bestWhy = bestReward
    ? rewardDetails.find((d) => d.id === bestReward.id)?.why ?? []
    : [];

  const liveAlex: BankCustomer = {
    id: "alex-001",
    name: customer.name,
    profile: customer.profile,
    memberSince: customer.memberSince,
    live: true,
    behavioral: status.dimensions.map((d) => ({ label: d.label, value: d.score })),
    campaign: bestReward
      ? {
          merchant: bestReward.merchant,
          title: bestReward.title,
          reason:
            bestReward.status === "unlocked"
              ? bestWhy.join(" + ") || bestReward.reason || ""
              : bestReward.requirement ?? "",
          objective:
            bestReward.status === "unlocked"
              ? "Engagement & retention"
              : "Engagement & habit formation",
        }
      : {
          merchant: "—",
          title: "",
          reason: "No eligible campaign yet this cycle.",
          objective: "—",
        },
  };

  const BANK_CUSTOMERS: BankCustomer[] = [liveAlex, JAMIE_NOVAK];
  const selected =
    BANK_CUSTOMERS.find((c) => c.id === selectedId) ?? BANK_CUSTOMERS[0];

  const churnData = [
    { name: "Behavior Program", value: bank.churnProgramPct, fill: GREEN },
    { name: "Standard", value: bank.churnStandardPct, fill: SAGE },
  ];
  const redemptionData = [
    {
      name: "Generic offer",
      value: bank.redemptionGenericPct,
      fill: SAGE,
    },
    {
      name: "Behavior + preference",
      value: bank.redemptionBehavioralPct,
      fill: GREEN,
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-display text-sm text-navy-900">
              M
            </span>
            <div>
              <div className="font-display text-base leading-tight">Merit</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                Bank partner view
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionStatus dark />
            <Link
              href="/architecture"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 hover:bg-white/5 sm:flex"
            >
              <Network size={14} />
              Architecture
            </Link>
            <Link
              href="/ecosystem"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 hover:bg-white/5 sm:flex"
            >
              <Globe2 size={14} />
              G-Core Network
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-900 hover:bg-white/90"
            >
              <ArrowLeft size={14} />
              Customer app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-ink">
              Portfolio overview
            </h1>
            <p className="mt-1 text-navy-600">
              Behavioral loyalty program performance across enrolled
              customers.
            </p>
          </div>
          <Pill tone="amber">Simulated demo data</Pill>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Customers enrolled"
            value={bank.customersEnrolled.toLocaleString("en-US")}
            sub="18–25 segment"
          />
          <StatCard
            icon={Activity}
            label="Monthly active"
            value={`${bank.monthlyActivePct}%`}
            sub="engaging with the program"
          />
          <StatCard
            icon={TrendingUp}
            label="Improving savings behavior"
            value={`+${bank.savingsImprovementPct}%`}
            sub="vs. enrollment baseline"
          />
          <StatCard
            icon={Repeat}
            label="Behavioral reward redemption"
            value={`${bank.redemptionBehavioralPct}%`}
            sub="vs. 3% for generic offers"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit p-5">
            <SectionLabel>Select a customer</SectionLabel>
            <div className="mt-3 space-y-2">
              {BANK_CUSTOMERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                    c.id === selectedId
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-line bg-white text-navy-800 hover:border-navy-500/40"
                  }`}
                >
                  <span>
                    <span className="flex items-center gap-1.5">
                      <span className="block font-medium">{c.name}</span>
                      <Pill
                        tone={c.live ? "positive" : "neutral"}
                        className={
                          c.id === selectedId
                            ? "border-white/20 bg-white/10 text-white"
                            : ""
                        }
                      >
                        {c.live ? "Live" : "Simulated"}
                      </Pill>
                    </span>
                    <span
                      className={`block text-xs ${
                        c.id === selectedId ? "text-white/60" : "text-navy-500"
                      }`}
                    >
                      {c.profile} · since {c.memberSince}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-navy-700" />
                <SectionLabel>Behavioral profile — {selected.name}</SectionLabel>
                <Pill tone={selected.live ? "positive" : "neutral"}>
                  {selected.live ? "Live from pipeline" : "Simulated"}
                </Pill>
              </div>
              <div className="mt-4 space-y-3.5">
                {selected.behavioral.map((d) => (
                  <div key={d.label}>
                    <div className="mb-1 flex items-center justify-between text-xs text-navy-600">
                      <span>{d.label}</span>
                      <span className="font-semibold text-ink">
                        {Math.round(d.value * 100)}%
                      </span>
                    </div>
                    <ProgressBar value={d.value} tone="navy" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden p-5">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-amber-500" />
                <SectionLabel>Recommended campaign</SectionLabel>
              </div>
              <div className="mt-4 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg text-ink">
                    {selected.campaign.merchant}
                  </div>
                  <div className="font-display text-lg text-amber-600">
                    {selected.campaign.title}
                  </div>
                </div>
                <p className="mt-2 text-sm text-navy-600">
                  {selected.campaign.reason}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-cream/60 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                  Expected objective
                </span>
                <span className="text-sm font-semibold text-ink">
                  {selected.campaign.objective}
                </span>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <SectionLabel>12-month churn</SectionLabel>
            <p className="mt-1 text-sm text-navy-500">
              Program participants vs. standard customers.
            </p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke="#e6e2d8" />
                  <XAxis
                    type="number"
                    domain={[0, 16]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12, fill: "#334469" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 12, fill: "#131c33" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(19,28,51,0.04)" }}
                    formatter={(v: number) => [`${v}%`, "Churn"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                    {churnData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <SectionLabel>Reward redemption rate</SectionLabel>
            <p className="mt-1 text-sm text-navy-500">
              Generic offers vs. personalized behavioral rewards.
            </p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redemptionData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke="#e6e2d8" />
                  <XAxis
                    type="number"
                    domain={[0, 22]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12, fill: "#334469" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fontSize: 12, fill: "#131c33" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(19,28,51,0.04)" }}
                    formatter={(v: number) => [`${v}%`, "Redemption"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                    {redemptionData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-navy-700" />
              <SectionLabel>Customer segment</SectionLabel>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill>18–25</Pill>
              <Pill>Students</Pill>
              <Pill>First-job professionals</Pill>
            </div>
            <p className="mt-4 text-sm text-navy-600">
              Early-relationship customers with limited financial history —
              acquired now, retained through salary, savings, credit and
              lending products later.
            </p>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <SectionLabel>Live engagement feed</SectionLabel>
            <p className="mt-1 text-sm text-navy-500">
              Updates as customers complete monthly targets.
            </p>
            <div className="mt-4 space-y-3">
              {bank.engagementFeed.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 border-b border-line pb-3 text-sm last:border-b-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium text-ink">{e.label}</div>
                    <div className="text-navy-500">{e.detail}</div>
                  </div>
                  <div className="shrink-0 text-xs text-navy-400">
                    {e.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <SectionLabel>Why this matters</SectionLabel>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["Retention", "Engagement", "Financial wellness", "Customer lifetime value"].map(
              (label) => (
                <div
                  key={label}
                  className="rounded-xl border border-line bg-cream/60 px-4 py-3 text-center text-sm font-medium text-navy-700"
                >
                  {label}
                </div>
              )
            )}
          </div>
        </Card>

        <Link
          href="/architecture"
          className="mt-6 flex items-center justify-between rounded-xl2 border border-line bg-navy-900 px-6 py-5 text-white transition-colors hover:bg-navy-800"
        >
          <div>
            <div className="font-display text-lg">
              See how customer data stays with the bank
            </div>
            <div className="mt-1 text-sm text-white/70">
              Raw transactions never leave your infrastructure — only minimal
              behavioral signals are shared.
            </div>
          </div>
          <Network size={22} className="shrink-0 text-white/70" />
        </Link>
      </main>
    </div>
  );
}

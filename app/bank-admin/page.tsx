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
  Users,
  Activity,
  TrendingUp,
  Repeat,
  Network,
  Globe2,
  Sparkles,
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
      <div className="flex items-center justify-between">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-2 font-display text-3xl text-ink">{value}</div>
      <div className="mt-1 text-xs text-navy-500">{sub}</div>
    </Card>
  );
}

const GREEN = "#15803d";
const SAGE = "#cbd5e1";

export default function BankAdminPage() {
  const { bank, customer, status, rewards, rewardDetails } = useDemo();
  const [selectedId, setSelectedId] = useState("alex-001");

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
    <div className="min-h-screen bg-paper pb-16">
      <header className="border-b border-line bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-display text-sm text-navy-900">
              M
            </span>
            <div>
              <div className="font-display text-base leading-tight">Merit Admin</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                Internal &bull; Staff View
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionStatus dark />
            <Link
              href="/network"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 hover:bg-white/5 sm:flex"
            >
              <Network size={14} />
              Network Story
            </Link>
            <Link
              href="/ecosystem"
              className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-900 hover:bg-white/90"
            >
              <Globe2 size={14} />
              G-Core Product
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionLabel>Institutional Portfolio</SectionLabel>
            <h1 className="mt-1 font-display text-3xl text-ink">
              Behavioral Intelligence Console
            </h1>
            <p className="mt-1 text-sm text-navy-600">
              Aggregate portfolio metrics, behavioral segment analytics, and automated campaign recommendations.
            </p>
          </div>
          <Pill tone="navy">Internal Staff Access Only</Pill>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Enrolled customers"
            value={bank.customersEnrolled.toLocaleString()}
            sub="Active behavioral tracking"
          />
          <StatCard
            icon={Activity}
            label="Monthly active"
            value={`${bank.monthlyActivePct}%`}
            sub="Engaged in monthly plan"
          />
          <StatCard
            icon={TrendingUp}
            label="Savings improvement"
            value={`+${bank.savingsImprovementPct}%`}
            sub="vs unguided baseline"
          />
          <StatCard
            icon={Repeat}
            label="Annualized churn"
            value={`${bank.churnProgramPct}%`}
            sub={`vs ${bank.churnStandardPct}% standard cohort`}
          />
        </div>

        {/* Customer Record Inspection Section */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel>Customer Record Inspection</SectionLabel>
              <h2 className="mt-1 font-display text-2xl text-ink">
                Behavioral Profile &amp; Match
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-line bg-white p-1 shadow-sm">
              {BANK_CUSTOMERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedId === c.id
                      ? "bg-navy-900 text-white"
                      : "text-navy-700 hover:bg-cream"
                  }`}
                >
                  <span>{c.name}</span>
                  {c.live && (
                    <span className="rounded-full bg-positive-500 px-1.5 py-0.2 text-[10px] uppercase font-bold text-white">
                      Live
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Customer Details & Scores */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-xl text-ink">{selected.name}</div>
                  <div className="mt-0.5 text-xs text-navy-500">
                    {selected.profile} &bull; Member since {selected.memberSince}
                  </div>
                </div>
                <Pill tone={selected.live ? "positive" : "neutral"}>
                  {selected.live ? "Live Data" : "Simulated"}
                </Pill>
              </div>

              <div className="mt-6 space-y-3.5">
                <SectionLabel>Behavioral Consistency Matrix</SectionLabel>
                {selected.behavioral.map((b) => (
                  <div key={b.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-navy-700 font-medium">{b.label}</span>
                      <span className="font-semibold text-ink">{Math.round(b.value * 100)}%</span>
                    </div>
                    <ProgressBar value={b.value} tone="navy" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Campaign Recommendation Engine */}
            <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <SectionLabel>Automated Campaign Fit</SectionLabel>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-b border-line pb-3">
                  <div className="font-display text-2xl text-ink">
                    {selected.campaign.merchant} &bull; {selected.campaign.title}
                  </div>
                  <Pill tone="amber">{selected.campaign.objective}</Pill>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase text-navy-500">
                    Behavioral Match Rationale
                  </div>
                  <p className="mt-1 text-sm text-navy-700 leading-relaxed">
                    {selected.campaign.reason}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-cream/60 p-4 border border-line">
                <div className="text-xs text-navy-600">
                  <strong className="text-ink">Contextual Targeting Notice:</strong> Offers unlock based on verified financial targets, never forced spending thresholds.
                </div>
                <Link
                  href="/ecosystem"
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold text-navy-900 hover:underline"
                >
                  View in Customer Product &rarr;
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <SectionLabel>Retention &amp; Churn Impact</SectionLabel>
            <h3 className="mt-1 font-display text-lg text-ink">Annualized Churn Rate (%)</h3>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {churnData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <SectionLabel>Offer Performance</SectionLabel>
            <h3 className="mt-1 font-display text-lg text-ink">Redemption Rate (%)</h3>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redemptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {redemptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-center text-xs text-navy-400">
          Internal MERIT Admin &bull; <Link href="/demo" className="text-navy-600 underline hover:text-navy-900">Open Demo 1 (Behavioral Intelligence Walkthrough)</Link>
        </div>
      </main>
    </div>
  );
}

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
  ShieldCheck,
  Building2,
  Lock,
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
    <div className="rounded-xl border border-xyz-border bg-xyz-card p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-xyz-primary text-white shadow-2xs">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-2 font-bold text-3xl text-xyz-ink">{value}</div>
      <div className="mt-1 text-xs text-xyz-ink-soft">{sub}</div>
    </div>
  );
}

const BLUE_PRIMARY = "#0B3D91";
const BLUE_ACCENT = "#2E7DD7";

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
    { name: "Behavior Program", value: bank.churnProgramPct, fill: BLUE_PRIMARY },
    { name: "Standard Cohort", value: bank.churnStandardPct, fill: BLUE_ACCENT },
  ];
  const redemptionData = [
    {
      name: "Generic offer",
      value: bank.redemptionGenericPct,
      fill: BLUE_ACCENT,
    },
    {
      name: "Behavior + preference",
      value: bank.redemptionBehavioralPct,
      fill: BLUE_PRIMARY,
    },
  ];

  return (
    <div className="min-h-screen bg-xyz-surface text-xyz-ink pb-16">
      {/* Header Styled in XYZ Blue System */}
      <header className="border-b border-xyz-border bg-xyz-sidebar-bg text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-xyz-accent font-bold text-white text-base shadow-2xs">
              XYZ
            </div>
            <div>
              <div className="font-bold text-lg leading-tight text-white tracking-tight">
                XYZ Bank Admin
              </div>
              <div className="text-[11px] uppercase tracking-wider text-xyz-sidebar-ink/70 font-medium">
                Internal Staff Console &bull; Behavioral Analytics
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionStatus dark />
            <Link
              href="/network"
              className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 sm:flex transition-colors"
            >
              <Network size={14} />
              Network Architecture
            </Link>
            <Link
              href="/ecosystem"
              className="flex items-center gap-1.5 rounded-full bg-xyz-accent px-3.5 py-1.5 text-xs font-bold text-white hover:bg-xyz-accent/90 transition-colors shadow-2xs"
            >
              <Globe2 size={14} />
              G-Core Product
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-xyz-ink-soft font-semibold">
              Institutional Portfolio Analytics
            </div>
            <h1 className="mt-1 text-2xl font-bold text-xyz-ink">
              Behavioral Intelligence Console
            </h1>
            <p className="mt-1 text-xs text-xyz-ink-soft">
              Aggregate portfolio metrics, customer risk segmentation, and contextual offer recommendation Engine.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-xyz-accent-soft px-3 py-1 text-xs font-semibold text-xyz-primary border border-xyz-accent/20">
            <ShieldCheck size={14} className="text-xyz-accent" />
            Internal Staff Access Only
          </div>
        </div>

        {/* Portfolio Key Stats */}
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
              <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                Customer Record Inspection
              </div>
              <h2 className="mt-1 text-xl font-bold text-xyz-ink">
                Behavioral Profile &amp; Match Rationale
              </h2>
            </div>

            {/* Customer Switcher */}
            <div className="flex items-center gap-2 rounded-full border border-xyz-border bg-xyz-card p-1 shadow-2xs">
              {BANK_CUSTOMERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedId === c.id
                      ? "bg-xyz-primary text-white shadow-2xs"
                      : "text-xyz-ink-soft hover:bg-xyz-surface hover:text-xyz-ink"
                  }`}
                >
                  <span>{c.name}</span>
                  {c.live && (
                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[9px] uppercase font-bold text-white">
                      Live
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Customer Details & Behavioral Matrix */}
            <div className="rounded-xl border border-xyz-border bg-xyz-card p-6 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg text-xyz-ink">{selected.name}</div>
                  <div className="mt-0.5 text-xs text-xyz-ink-soft">
                    {selected.profile} &bull; Member since {selected.memberSince}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    selected.live
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {selected.live ? "Live Data" : "Simulated"}
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                  Behavioral Consistency Matrix
                </div>
                {selected.behavioral.map((b) => (
                  <div key={b.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-xyz-ink-soft font-medium">{b.label}</span>
                      <span className="font-semibold text-xyz-ink">{Math.round(b.value * 100)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-xyz-surface">
                      <div
                        className="h-full rounded-full bg-xyz-primary transition-all duration-500"
                        style={{ width: `${Math.round(b.value * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Recommendation Engine */}
            <div className="lg:col-span-2 rounded-xl border border-xyz-border bg-xyz-card p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                    Automated Campaign Fit Rationale
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-xyz-border pb-3">
                  <div className="font-bold text-xl text-xyz-ink">
                    {selected.campaign.merchant} &bull; {selected.campaign.title}
                  </div>
                  <span className="rounded-full bg-xyz-accent-soft px-3 py-1 text-xs font-bold text-xyz-primary border border-xyz-accent/30">
                    {selected.campaign.objective}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-xyz-ink-soft">
                    Behavioral Match Rationale
                  </div>
                  <p className="mt-1.5 text-xs text-xyz-ink-soft leading-relaxed">
                    {selected.campaign.reason}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-xyz-surface p-4 border border-xyz-border">
                <div className="text-xs text-xyz-ink-soft">
                  <strong className="text-xyz-ink font-semibold">Contextual Targeting Notice:</strong> Offers unlock based on verified financial targets, never forced spending thresholds.
                </div>
                <Link
                  href="/ecosystem"
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-xyz-primary hover:text-xyz-primary-dark"
                >
                  View in Customer Product &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-xyz-border bg-xyz-card p-6 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
              Retention &amp; Churn Impact
            </div>
            <h3 className="mt-1 font-bold text-base text-xyz-ink">Annualized Churn Rate (%)</h3>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
          </div>

          <div className="rounded-xl border border-xyz-border bg-xyz-card p-6 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
              Offer Performance Metrics
            </div>
            <h3 className="mt-1 font-bold text-base text-xyz-ink">Redemption Rate (%)</h3>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redemptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
          </div>
        </div>

        <div className="mt-8 border-t border-xyz-border pt-6 text-center text-xs text-xyz-ink-soft">
          Internal XYZ Bank Admin &bull; <Link href="/demo" className="text-xyz-primary font-semibold underline hover:text-xyz-primary-dark">Open Demo 1 (Behavioral Intelligence Walkthrough)</Link>
        </div>
      </main>
    </div>
  );
}

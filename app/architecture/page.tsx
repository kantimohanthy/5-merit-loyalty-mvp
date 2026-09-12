"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Lock,
  Landmark,
  Users,
  Store,
  Network,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { Card, Pill, SectionLabel } from "@/components/ui";

function Step({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-3.5 py-2.5">
      <div className="break-words text-sm font-semibold text-ink">{title}</div>
      <div className="mt-0.5 break-words text-xs text-navy-500">{detail}</div>
    </div>
  );
}

interface NetworkMetrics {
  participatingBanks: number;
  participatingUsers: number;
  behavioralCredentialsIssued: number;
  rewardPartners: number;
  avgVerifiedTenureMonths: number;
}

const FALLBACK_METRICS: NetworkMetrics = {
  participatingBanks: 4,
  participatingUsers: 120000,
  behavioralCredentialsIssued: 96000,
  rewardPartners: 30,
  avgVerifiedTenureMonths: 14,
};

export default function ArchitecturePage() {
  const [metrics, setMetrics] = useState<NetworkMetrics>(FALLBACK_METRICS);

  useEffect(() => {
    fetch("/api/network/metrics")
      .then((r) => r.json())
      .then((data) => setMetrics(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
              M
            </span>
            <span className="font-display text-lg text-ink">Merit</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/ecosystem"
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-cream"
            >
              <Globe2 size={14} />
              G-Core Network
            </Link>
            <Link
              href="/bank"
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-cream"
            >
              <ArrowLeft size={14} />
              Bank dashboard
            </Link>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-navy-800 sm:flex"
            >
              Customer app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <SectionLabel>Ecosystem &amp; architecture</SectionLabel>
        <h1 className="mt-2 max-w-2xl font-display text-3xl text-ink lg:text-4xl">
          Raw transaction data stays with the bank.
        </h1>
        <p className="mt-3 max-w-2xl text-navy-600">
          The behavioral engine runs inside — or directly adjacent to — each
          participating bank&rsquo;s own infrastructure. Only minimal,
          verified behavioral outputs (G-Pass &amp; GP deltas) ever leave it.
        </p>

        <Card className="mt-8 overflow-x-auto p-6">
          <div className="flex min-w-[860px] items-stretch gap-3">
            <div className="flex w-40 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-cream/60 px-3 text-center">
              <Users size={20} className="text-navy-700" />
              <div className="mt-2 text-sm font-semibold text-ink">
                Customer
              </div>
              <div className="mt-1 text-xs text-navy-500">
                Everyday spending &amp; saving
              </div>
            </div>

            <div className="flex items-center text-navy-300">
              <ArrowRight size={20} />
            </div>

            <div className="flex-1 rounded-xl2 border-2 border-dashed border-navy-500/30 bg-white p-4">
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-navy-800" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-800">
                  Participating bank — controlled infrastructure
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Step title="Raw transactions" detail="Never leaves the bank" />
                <Step title="Classification" detail="Category + confidence" />
                <Step title="Behavior engine" detail="Contextual, longitudinal" />
                <Step title="Goal engine" detail="Personalized targets" />
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-positive-50 px-3 py-2 text-xs font-medium text-positive-600">
                <Lock size={13} />
                Minimal verified behavioral output only — not raw transactions
              </div>
            </div>

            <div className="flex items-center text-navy-300">
              <ArrowRight size={20} />
            </div>

            <div className="flex w-44 shrink-0 flex-col items-center justify-center rounded-xl border border-navy-900 bg-navy-900 px-3 text-center text-white">
              <Globe2 size={20} className="text-amber-400" />
              <div className="mt-2 text-sm font-semibold text-white">
                G-Core Network
              </div>
              <div className="mt-1 text-[11px] text-white/70">
                Neutral Status Standard &amp; G-Pass (Live)
              </div>
            </div>

            <div className="flex items-center text-navy-300">
              <ArrowRight size={20} />
            </div>

            <div className="flex w-40 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-cream/60 px-3 text-center">
              <Store size={20} className="text-navy-700" />
              <div className="mt-2 text-sm font-semibold text-ink">
                Merchant network
              </div>
              <div className="mt-1 text-xs text-navy-500">
                Relevant rewards &amp; G-Market
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-start gap-3 p-5">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-positive-600" />
            <p className="text-sm text-navy-600">
              <span className="font-semibold text-ink">
                Your raw banking data stays with your bank.
              </span>{" "}
              Only minimal behavioral signals are shared where required, and
              users control participation.
            </p>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Lock size={18} className="mt-0.5 shrink-0 text-navy-700" />
            <p className="text-sm text-navy-600">
              <span className="font-semibold text-ink">
                Portable status does not mean portable transaction history.
              </span>{" "}
              Federation carries verified signals, never line-item data.
            </p>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Globe2 size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-sm text-navy-600">
              <span className="font-semibold text-ink">
                Governance Boundary:
              </span>{" "}
              G-Core defines the common status standard, earning rules, and tier definitions across participating banks — but banks keep full control of their own products, pricing, and lending decisions.
            </p>
          </Card>
        </div>

        <div className="mt-12">
          <SectionLabel>The core flywheel</SectionLabel>
          <h2 className="mt-2 font-display text-2xl text-ink">
            Value compounds across all three sides.
          </h2>
          <div className="mt-6 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <Card className="p-5">
              <Users size={18} className="text-navy-700" />
              <div className="mt-2 font-display text-lg text-ink">Customer</div>
              <p className="mt-1 text-sm text-navy-600">
                Better financial habits + personally relevant rewards →
                higher engagement.
              </p>
            </Card>
            <div className="hidden items-center justify-center text-navy-300 lg:flex">
              <ArrowRight size={20} />
            </div>
            <div className="flex items-center justify-center text-navy-300 lg:hidden">
              <ArrowDown size={20} />
            </div>
            <Card className="p-5">
              <Landmark size={18} className="text-navy-700" />
              <div className="mt-2 font-display text-lg text-ink">Bank</div>
              <p className="mt-1 text-sm text-navy-600">
                Higher retention + lifetime value → a better reward
                ecosystem.
              </p>
            </Card>
            <div className="hidden items-center justify-center text-navy-300 lg:flex">
              <ArrowRight size={20} />
            </div>
            <div className="flex items-center justify-center text-navy-300 lg:hidden">
              <ArrowDown size={20} />
            </div>
            <Card className="p-5">
              <Store size={18} className="text-navy-700" />
              <div className="mt-2 font-display text-lg text-ink">Merchant</div>
              <p className="mt-1 text-sm text-navy-600">
                Higher-intent customers + relevant campaigns → better offers,
                back to the customer.
              </p>
            </Card>
          </div>
        </div>

        <Card className="mt-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel>Federation vision</SectionLabel>
              <p className="mt-2 max-w-xl text-sm text-navy-600">
                The system becomes more valuable as participating
                institutions join — but it stands on its own for the first
                bank.
              </p>
            </div>
            <Pill tone="navy">Value(1 bank) &gt; 0</Pill>
          </div>
        </Card>

        <div className="mt-12">
          <div className="flex items-center gap-2">
            <SectionLabel>Portable Behavioral Financial Passport</SectionLabel>
            <Pill className="ml-1">
              <Lock size={11} className="mr-1" />
              Concept · future layer
            </Pill>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-navy-600">
            A simulated view of what the ecosystem looks like once more
            institutions participate. This is a future concept, not a live
            credit bureau, lending decision, or data-sharing commitment.
          </p>
          <Card className="mt-4 p-6">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
              <div>
                <div className="font-display text-2xl text-ink">{metrics.participatingBanks}</div>
                <div className="mt-1 text-xs text-navy-500">
                  Participating banks
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-ink">
                  {Math.round(metrics.participatingUsers / 1000)}K
                </div>
                <div className="mt-1 text-xs text-navy-500">
                  Participating users
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-ink">
                  {Math.round(metrics.behavioralCredentialsIssued / 1000)}K
                </div>
                <div className="mt-1 text-xs text-navy-500">
                  Behavioral credentials issued
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-ink">{metrics.rewardPartners}+</div>
                <div className="mt-1 text-xs text-navy-500">
                  Reward partners
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-ink">{metrics.avgVerifiedTenureMonths}mo</div>
                <div className="mt-1 text-xs text-navy-500">
                  Avg. verified tenure
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-navy-500">
              Simulated ecosystem figures for demonstration purposes only.
            </p>
          </Card>
        </div>

        <div className="mt-12 rounded-xl2 border border-line bg-navy-950 px-6 py-10 text-center text-white sm:px-10">
          <p className="mx-auto max-w-2xl font-display text-2xl leading-relaxed sm:text-3xl">
            MERIT turns financial behavior into a relationship customers want
            to keep.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <Users size={18} className="mx-auto text-white/80" />
              <div className="mt-2 text-sm font-semibold">Customer</div>
              <div className="mt-1 text-xs text-white/60">
                Build healthier financial behavior
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <Landmark size={18} className="mx-auto text-white/80" />
              <div className="mt-2 text-sm font-semibold">Bank</div>
              <div className="mt-1 text-xs text-white/60">
                Build deeper relationships
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <Store size={18} className="mx-auto text-white/80" />
              <div className="mt-2 text-sm font-semibold">Merchant</div>
              <div className="mt-1 text-xs text-white/60">
                Reach customers with greater relevance
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

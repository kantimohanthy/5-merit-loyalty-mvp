"use client";

import { motion } from "framer-motion";
import { Gift, Lock, Sparkles, Flame } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";
import { MonthlyDonut } from "@/components/MonthlyDonut";

export default function RewardsPage() {
  const { rewards, rewardDetails, status, plan } = useDemo();
  const unlocked = rewards.filter((r) => r.status === "unlocked");
  const locked = rewards.filter((r) => r.status === "locked");
  const overspend = plan.discretionarySpent > plan.discretionaryTarget;
  const whyFor = (id: string) => rewardDetails.find((d) => d.id === id)?.why ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <SectionLabel>Rewards</SectionLabel>
      <h1 className="mt-2 font-display text-3xl text-ink">Your rewards</h1>
      <p className="mt-3 max-w-xl text-navy-600">
        Rewards unlock when your financial goals and your spending
        preferences line up — never at random. Staying disciplined earns you
        more offers, not fewer.
      </p>

      <div className="mt-7 grid grid-cols-3 gap-4">
        <Card className="p-5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Sparkles size={15} className="text-navy-700" />
            <SectionLabel>Points</SectionLabel>
          </div>
          <div className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {status.points.toLocaleString("en-US")}
          </div>
        </Card>
        <Card className="p-5 text-center sm:text-left">
          <SectionLabel>Status</SectionLabel>
          <div className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {status.tier}
          </div>
        </Card>
        <Card className="p-5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Flame size={15} className="text-amber-500" />
            <SectionLabel>Streak</SectionLabel>
          </div>
          <div className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {status.currentStreak}mo
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <MonthlyDonut />
        </div>

        <div>
          {unlocked.length > 0 && (
            <div>
              <SectionLabel>Unlocked</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {unlocked.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl2 border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                        <Gift size={18} />
                      </div>
                      <Pill tone="amber">{r.category}</Pill>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="font-display text-lg text-ink">
                        {r.merchant}
                      </div>
                      <div className="font-display text-xl text-amber-600">
                        {r.title}
                      </div>
                    </div>
                    {r.reason && (
                      <p className="mt-2 text-sm text-navy-600">{r.reason}</p>
                    )}
                    {whyFor(r.id).length > 0 && (
                      <div className="mt-3 space-y-1 border-t border-amber-100 pt-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
                          Why this offer
                        </div>
                        {whyFor(r.id).map((w) => (
                          <div key={w} className="flex items-start gap-1.5 text-xs text-navy-600">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                            {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className={unlocked.length > 0 ? "mt-9" : ""}>
            <SectionLabel>Keep going</SectionLabel>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {locked.map((r) => {
                const atRisk = overspend && r.id === "r1";
                return (
                  <Card key={r.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-navy-500">
                        <Lock size={16} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {atRisk && <Pill tone="amber">At risk</Pill>}
                        <Pill>{r.category}</Pill>
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="font-display text-lg text-ink">
                        {r.merchant}
                      </div>
                      <div className="font-display text-lg text-navy-700">
                        {r.title}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-navy-600">
                      {atRisk
                        ? "Paused — outside your personalized range this month."
                        : r.requirement}
                    </p>
                    {typeof r.progress === "number" && (
                      <div className="mt-3">
                        <ProgressBar value={r.progress} tone="amber" />
                        <div className="mt-1 text-right text-xs text-navy-500">
                          {Math.round(r.progress * 100)}% there
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

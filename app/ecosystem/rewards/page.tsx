"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Lock,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { useGCore } from "@/lib/gcore-context";
import { Card, Pill, ProgressBar, SectionLabel, Button } from "@/components/ui";
import { MonthlyDonut } from "@/components/MonthlyDonut";
import { TIER_LABELS, type ClaimFailureReason, type GMarketItem } from "@/lib/types";

export default function EcosystemRewardsPage() {
  const { rewards, rewardDetails, status, plan } = useDemo();
  const { account, items, claim } = useGCore();

  const unlocked = rewards.filter((r) => r.status === "unlocked");
  const locked = rewards.filter((r) => r.status === "locked");
  const overspend = plan.discretionarySpent > plan.discretionaryTarget;
  const whyFor = (id: string) => rewardDetails.find((d) => d.id === id)?.why ?? [];

  const [claimStatus, setClaimStatus] = useState<{
    itemId: string;
    loading: boolean;
    error?: string;
    success?: string;
  } | null>(null);

  const handleClaim = async (item: GMarketItem) => {
    setClaimStatus({ itemId: item.id, loading: true });
    const res = await claim(item.id);
    if (res.success) {
      setClaimStatus({
        itemId: item.id,
        loading: false,
        success: `Successfully claimed ${item.title}!`,
      });
    } else {
      const errorMessages: Record<ClaimFailureReason, string> = {
        tier_too_low: `Requires ${TIER_LABELS[item.minTierIndex]} tier or higher.`,
        insufficient_gp: `Requires ${item.gpCost} GP (you have ${account?.gpBalance ?? 0} GP).`,
        sold_out: "This reward is sold out.",
        not_found: "Item not found.",
      };
      setClaimStatus({
        itemId: item.id,
        loading: false,
        error: errorMessages[res.reason ?? "not_found"],
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <SectionLabel>Rewards &amp; Network Access</SectionLabel>
      <h1 className="mt-2 font-display text-3xl text-ink">Rewards &amp; G-Market</h1>
      <p className="mt-2 max-w-xl text-xs text-navy-600">
        Earn merchant benefits automatically by achieving your financial targets, and redeem accumulated G-Core Points (GP) for scarce network experiences.
      </p>

      {/* Top Stat Summary Cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card className="p-5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Sparkles size={15} className="text-amber-500" />
            <SectionLabel>GP Balance</SectionLabel>
          </div>
          <div className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {(account?.gpBalance ?? 600).toLocaleString("en-US")} GP
          </div>
        </Card>
        <Card className="p-5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Award size={15} className="text-navy-700" />
            <SectionLabel>Network Tier</SectionLabel>
          </div>
          <div className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {account?.tierLabel ?? "Gold"}
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

      {/* Section 1: Your Behavioral Rewards */}
      <div className="mt-10 border-t border-line pt-8">
        <div className="flex items-center justify-between">
          <div>
            <SectionLabel>Section 1 &bull; Merchant Network</SectionLabel>
            <h2 className="mt-1 font-display text-2xl text-ink">Behavioral Rewards</h2>
            <p className="mt-1 text-xs text-navy-600">
              Unlocked automatically when your financial targets match merchant campaign objectives.
            </p>
          </div>
          <Pill tone="positive">Free with Goal Achievement</Pill>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <MonthlyDonut />
          </div>

          <div>
            {unlocked.length > 0 && (
              <div>
                <SectionLabel>Unlocked Offers</SectionLabel>
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
                        <div className="font-display text-xl text-amber-600 font-bold">
                          {r.title}
                        </div>
                      </div>
                      {r.reason && (
                        <p className="mt-2 text-xs text-navy-600">{r.reason}</p>
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

            <div className={unlocked.length > 0 ? "mt-8" : ""}>
              <SectionLabel>Keep Going</SectionLabel>
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
                      <p className="mt-2 text-xs text-navy-600">
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

      {/* Section 2: G-Market Scarce Experiences */}
      <div className="mt-14 border-t border-line pt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <SectionLabel>Section 2 &bull; Cross-Bank Privilege Market</SectionLabel>
            <h2 className="mt-1 font-display text-2xl text-ink">G-Market Access</h2>
            <p className="mt-1 text-xs text-navy-600 max-w-xl">
              Status-gated experiences and privileges priced in GP. Scarce availability, tier requirements apply.
            </p>
          </div>
          <Pill tone="navy">
            <Sparkles size={12} className="mr-1 text-amber-400" />
            GP-Priced Network Access
          </Pill>
        </div>

        {claimStatus?.success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-positive-50 border border-positive-200 p-3 text-xs text-positive-700 font-medium">
            <CheckCircle2 size={16} />
            {claimStatus.success}
          </div>
        )}

        {claimStatus?.error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 font-medium">
            <AlertCircle size={16} />
            {claimStatus.error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const categoryTones: Record<string, "neutral" | "positive" | "amber" | "navy"> = {
              access: "navy",
              privilege: "positive",
              experience: "amber",
            };

            const userTierIdx = account?.tierIndex ?? 2;
            const userGp = account?.gpBalance ?? 600;
            const tierRequiredLabel = TIER_LABELS[item.minTierIndex];
            const meetsTier = userTierIdx >= item.minTierIndex;
            const meetsGp = userGp >= item.gpCost;
            const hasScarcity = item.scarcityRemaining > 0;
            const canClaim = meetsTier && meetsGp && hasScarcity;

            let disabledReason = "";
            if (!hasScarcity) disabledReason = "Sold Out";
            else if (!meetsTier) disabledReason = `Requires ${tierRequiredLabel} Tier`;
            else if (!meetsGp) disabledReason = `Need ${item.gpCost} GP (Have ${userGp})`;

            const isLoadingThis = claimStatus?.itemId === item.id && claimStatus.loading;

            return (
              <Card key={item.id} className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone={categoryTones[item.category] ?? "neutral"} className="capitalize">
                      {item.category}
                    </Pill>
                    <span className="text-[11px] font-medium text-navy-500">
                      {item.scarcityRemaining} / {item.scarcityTotal} left
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-navy-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-navy-500">Min. Tier: <strong className="text-ink">{tierRequiredLabel}</strong></span>
                    <span className="font-display font-semibold text-base text-ink flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500" />
                      {item.gpCost} GP
                    </span>
                  </div>

                  <Button
                    variant={canClaim ? "primary" : "secondary"}
                    onClick={() => handleClaim(item)}
                    disabled={!canClaim || isLoadingThis}
                    className="w-full text-xs py-2"
                  >
                    {isLoadingThis
                      ? "Claiming..."
                      : canClaim
                      ? "Claim Experience"
                      : disabledReason}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

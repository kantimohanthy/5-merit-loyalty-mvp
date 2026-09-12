import type { RewardStatus } from "@/lib/types";
import type { CustomerStateRow } from "./behavior-engine";

export interface RewardRow {
  id: string;
  customer_id: string;
  merchant: string;
  title: string;
  category: string;
  status: RewardStatus;
  reason: string | null;
  requirement: string | null;
  progress: number | null;
}

export interface RewardEvaluationInput {
  state: CustomerStateRow;
  discretionarySpent: number;
  savingsSaved: number;
  goalMet: boolean;
  overspend: boolean;
  merchants: string[]; // this period's transaction merchants, for affinity detection
}

export interface RewardEvaluationOutcome {
  reward: RewardRow;
  newlyUnlocked: boolean;
  why: string[];
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/**
 * Campaign eligibility is deliberately separate from the behavior engine.
 * The behavior engine answers "how is the customer doing?" — this answers
 * "which available offer fits this customer right now?" Each campaign is a
 * small, named rule set with an explicit "why," never a bare score threshold.
 */
export function evaluateRewards(
  rewards: RewardRow[],
  input: RewardEvaluationInput
): RewardEvaluationOutcome[] {
  const goalProgress =
    input.state.savings_target <= 0
      ? 1
      : clamp(input.savingsSaved / input.state.savings_target);
  const hasAdidasAffinity = input.merchants.some((m) => /adidas/i.test(m));

  return rewards.map((reward) => {
    if (reward.id === "r1") {
      const conditions = {
        target: input.goalMet && !input.overspend,
        affinity: hasAdidasAffinity,
        campaignActive: true,
      };
      const eligible = conditions.target && conditions.affinity && conditions.campaignActive;
      const wasLocked = reward.status === "locked";
      const why = [
        conditions.target
          ? "Monthly behavioral target achieved"
          : "Monthly behavioral target not yet achieved",
        conditions.affinity
          ? "Sportswear affinity detected"
          : "No sportswear affinity detected this period",
        "Campaign is active",
      ];
      if (eligible) {
        return {
          reward: {
            ...reward,
            status: "unlocked",
            reason:
              "Unlocked because you maintained your monthly target and sportswear is one of your preferred categories.",
            progress: 1,
          },
          newlyUnlocked: wasLocked,
          why,
        };
      }
      return {
        reward: { ...reward, status: "locked", progress: goalProgress },
        newlyUnlocked: false,
        why,
      };
    }

    if (reward.id === "r2") {
      const eligible = input.state.streak >= 3 && input.goalMet;
      const wasLocked = reward.status === "locked";
      const progress = clamp(clamp(input.state.streak / 3) * 0.5 + goalProgress * 0.5);
      const why = [
        input.state.streak >= 3
          ? `${input.state.streak}-month streak maintained`
          : "Streak not yet at 3 months",
        input.goalMet ? "Savings goal met" : "Savings goal not yet met",
      ];
      if (eligible) {
        return {
          reward: {
            ...reward,
            status: "unlocked",
            reason: "Unlocked for a 3+ month streak with savings goal met.",
            progress: 1,
          },
          newlyUnlocked: wasLocked,
          why,
        };
      }
      return { reward: { ...reward, status: "locked", progress }, newlyUnlocked: false, why };
    }

    if (reward.id === "r3") {
      const eligible = !input.overspend;
      const wasLocked = reward.status === "locked";
      const progress = clamp(
        1 - Math.max(0, input.discretionarySpent) / Math.max(1, input.state.discretionary_target)
      );
      const why = [
        input.overspend
          ? "Discretionary spending currently above personalized range"
          : "Discretionary spending within personalized range",
      ];
      if (eligible && wasLocked) {
        // Stays available rather than "spent" — it's a recurring in-range perk.
        return {
          reward: { ...reward, status: "locked", progress: 1 },
          newlyUnlocked: false,
          why,
        };
      }
      return { reward: { ...reward, status: "locked", progress }, newlyUnlocked: false, why };
    }

    // r4 and any future always-on rewards: carried through unchanged.
    return { reward, newlyUnlocked: false, why: reward.reason ? [reward.reason] : [] };
  });
}

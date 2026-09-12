import { getDb } from "./db";
import { detectInternalTransfers, type EngineTransaction } from "./anti-gaming-engine";
import { evaluateBehavior, type CustomerStateRow } from "./behavior-engine";
import { evaluateRewards, type RewardRow } from "./reward-engine";
import { writeEvent } from "./event-engine";
import { syncGCoreForPipelineRun } from "./gcore-engine";
import type {
  BehaviorDimension,
  Category,
  Classification,
  Customer,
  MonthlyPlan,
  Reward,
  StatusProfile,
  Transaction,
} from "@/lib/types";

interface TransactionRow {
  id: string;
  customer_id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  classification: string;
  confidence: number;
  alternates_json: string;
  confirmed: number;
  protected: number;
  exclude_reason: string | null;
  created_at: string;
}

export interface PipelineSnapshot {
  customer: Customer;
  plan: MonthlyPlan;
  status: StatusProfile;
  transactions: Transaction[];
  rewards: Reward[];
  protectedExpenses: { transactionId: string; reason: string }[];
  excludedTransfers: { transactionId: string; reason: string }[];
  newlyUnlockedRewardIds: string[];
  rewardDetails: { id: string; why: string[] }[];
  trace: string[];
}

function toDomainTransaction(
  row: TransactionRow,
  excludedForGaming: boolean
): Transaction {
  return {
    id: row.id,
    date: row.date,
    merchant: row.merchant,
    amount: row.amount,
    category: row.category as Category,
    classification: row.classification as Classification,
    confidence: row.confidence,
    alternates: JSON.parse(row.alternates_json),
    confirmed: !!row.confirmed,
    flaggedEssential: row.protected === 1 ? true : undefined,
    excludedReason: excludedForGaming
      ? "Internal transfer detected — excluded from behavioral progress."
      : undefined,
  };
}

/**
 * Runs the full server-side pipeline for one customer: normalize → context
 * (protected expenses) → anti-gaming → behavior engine → reward engine →
 * persist reward state → emit events for anything that changed. This is the
 * single source of truth every API route reads from — the frontend never
 * computes a behavioral outcome itself.
 */
export function runPipeline(
  customerId: string,
  opts: { emitEvents?: boolean } = {}
): PipelineSnapshot {
  const db = getDb();

  const customerRow = db
    .prepare(`SELECT * FROM customers WHERE id = ?`)
    .get(customerId) as
    | { id: string; name: string; age: number; profile: string; member_since: string }
    | undefined;
  if (!customerRow) throw new Error(`Unknown customer: ${customerId}`);

  const state = db
    .prepare(`SELECT * FROM customer_state WHERE customer_id = ?`)
    .get(customerId) as CustomerStateRow;

  const txnRows = db
    .prepare(`SELECT * FROM transactions WHERE customer_id = ? ORDER BY date DESC, rowid DESC`)
    .all(customerId) as TransactionRow[];

  const rewardRows = db
    .prepare(`SELECT * FROM rewards WHERE customer_id = ?`)
    .all(customerId) as RewardRow[];

  // --- Anti-gaming: detect internal-transfer pairs before anything counts them ---
  const engineTxns: EngineTransaction[] = txnRows.map((t) => ({
    id: t.id,
    date: t.date,
    merchant: t.merchant,
    amount: t.amount,
    category: t.category,
  }));
  const { excludedIds, detections } = detectInternalTransfers(engineTxns);

  // --- Behavior engine ---
  const evaluable = txnRows.map((t) => ({
    id: t.id,
    amount: t.amount,
    classification: t.classification as Classification,
    protectedFlag: t.protected === 1,
    excludedForGaming: excludedIds.has(t.id),
  }));
  const behavior = evaluateBehavior(state, evaluable);
  const goalMet = behavior.savingsSaved >= state.savings_target;
  const overspend = behavior.status === "AT_RISK";

  // --- Reward engine (separate concern: "which offer fits now?") ---
  const outcomes = evaluateRewards(rewardRows, {
    state,
    discretionarySpent: behavior.discretionarySpent,
    savingsSaved: behavior.savingsSaved,
    goalMet,
    overspend,
    merchants: txnRows.map((t) => t.merchant),
  });

  const updateReward = db.prepare(
    `UPDATE rewards SET status = ?, reason = ?, progress = ? WHERE id = ? AND customer_id = ?`
  );
  const newlyUnlockedRewardIds: string[] = [];
  for (const outcome of outcomes) {
    updateReward.run(
      outcome.reward.status,
      outcome.reward.reason ?? null,
      outcome.reward.progress ?? null,
      outcome.reward.id,
      customerId
    );
    if (outcome.newlyUnlocked) {
      newlyUnlockedRewardIds.push(outcome.reward.id);
      if (opts.emitEvents) {
        writeEvent(db, customerId, "reward_unlocked", {
          merchant: outcome.reward.merchant,
          title: outcome.reward.title,
        });
      }
    }
  }

  syncGCoreForPipelineRun(db, customerId, {
    newlyUnlockedRewardIds,
    verifiedHistoryMonths: state.verified_history_months,
    emitLedger: !!opts.emitEvents,
  });

  // Gate event emission on first detection only (idempotent across repeat
  // pipeline runs) by persisting the exclusion reason onto the transaction
  // row the first time it's found.
  const markExcluded = db.prepare(
    `UPDATE transactions SET exclude_reason = ? WHERE id = ? AND exclude_reason IS NULL`
  );
  for (const d of detections) {
    const result = markExcluded.run(d.reason, d.transactionId);
    const pairResult = markExcluded.run(d.reason, d.pairedWithId);
    if ((result.changes > 0 || pairResult.changes > 0) && opts.emitEvents) {
      writeEvent(db, customerId, "internal_transfer_excluded", {
        transactionId: d.transactionId,
      });
    }
  }

  // --- Assemble response in the exact shapes the frontend already expects ---
  const protectedExpenses = txnRows
    .filter((t) => t.protected === 1)
    .map((t) => ({
      transactionId: t.id,
      reason: "Protected expense — excluded from discretionary-behavior evaluation.",
    }));

  const excludedTransfers = detections.map((d) => ({
    transactionId: d.transactionId,
    reason: d.reason,
  }));

  const transactions = txnRows.map((t) => toDomainTransaction(t, excludedIds.has(t.id)));

  const dimensions: BehaviorDimension[] = behavior.dimensions.map((d) => ({
    label: d.label,
    value: d.value,
    score: d.score,
  }));

  const essentialCount = txnRows.filter((t) => t.classification === "essential").length;
  const discretionaryCount = txnRows.filter((t) => t.classification === "discretionary").length;
  const r1 = outcomes.find((o) => o.reward.id === "r1");

  const trace = [
    `${txnRows.length} transactions ingested`,
    `${txnRows.length} transactions normalized`,
    `${essentialCount} essential / ${discretionaryCount} discretionary`,
    protectedExpenses.length > 0
      ? `${protectedExpenses.length} protected expense${protectedExpenses.length > 1 ? "s" : ""} detected`
      : "No protected expenses this period",
    "Behavioral profile generated",
    `${outcomes.length} campaigns evaluated`,
    r1 && r1.reward.status === "unlocked"
      ? `${r1.reward.merchant} campaign selected`
      : "No new campaign eligible this cycle",
  ];

  return {
    customer: {
      name: customerRow.name,
      age: customerRow.age,
      profile: customerRow.profile,
      memberSince: customerRow.member_since,
    },
    plan: {
      income: state.income,
      fixedObligations: state.fixed_obligations,
      discretionaryTarget: state.discretionary_target,
      savingsTarget: state.savings_target,
      discretionarySpent: behavior.discretionarySpent,
      savingsSaved: behavior.savingsSaved,
      status: behavior.status,
    },
    status: {
      tier: state.tier as StatusProfile["tier"],
      verifiedHistoryMonths: state.verified_history_months,
      currentStreak: state.streak,
      points: state.points,
      dimensions,
    },
    transactions,
    rewards: outcomes.map((o) => ({
      id: o.reward.id,
      merchant: o.reward.merchant,
      title: o.reward.title,
      category: o.reward.category as Category,
      status: o.reward.status,
      reason: o.reward.reason ?? undefined,
      requirement: o.reward.requirement ?? undefined,
      progress: o.reward.progress ?? undefined,
    })),
    protectedExpenses,
    excludedTransfers,
    newlyUnlockedRewardIds,
    rewardDetails: outcomes.map((o) => ({ id: o.reward.id, why: o.why })),
    trace,
  };
}

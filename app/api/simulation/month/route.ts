import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";
import { ingestTransaction } from "@/lib/server/ingest";
import { writeEvent } from "@/lib/server/event-engine";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

const POINTS_PER_MONTH = 250;
const MIN_MONTHLY_CONTRIBUTION = 50;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const db = getDb();

  const state = db
    .prepare(`SELECT * FROM customer_state WHERE customer_id = ?`)
    .get(customerId) as
    | { streak: number; points: number; verified_history_months: number; budget_score: number; payment_score: number; savings_target: number }
    | undefined;
  if (!state) {
    return NextResponse.json({ error: "Unknown customer" }, { status: 404 });
  }

  // Reaching the monthly savings target is modeled as a real transaction —
  // not a scalar flipped behind the scenes — so the behavior engine's own
  // live sum of savings-classified transactions is what actually moves.
  const { current_savings: currentSavings } = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS current_savings FROM transactions
       WHERE customer_id = ? AND classification = 'savings' AND exclude_reason IS NULL`
    )
    .get(customerId) as { current_savings: number };
  const contribution = Math.max(MIN_MONTHLY_CONTRIBUTION, state.savings_target - currentSavings);
  ingestTransaction(db, customerId, {
    merchant: "Automatic Savings Transfer",
    amount: contribution,
    confirmed: true,
  });

  const newStreak = state.streak + 1;
  db.prepare(
    `UPDATE customer_state SET
       points = points + ?,
       streak = ?,
       verified_history_months = verified_history_months + 1,
       budget_score = MIN(1, budget_score + 0.02),
       payment_score = MIN(1, payment_score + 0.02)
     WHERE customer_id = ?`
  ).run(POINTS_PER_MONTH, newStreak, customerId);

  writeEvent(db, customerId, "monthly_target_achieved", { streak: newStreak });

  const snapshot = runPipeline(customerId, { emitEvents: true });
  const bank = readBankSnapshot(db);

  return NextResponse.json({
    ...snapshot,
    bank,
    celebration: {
      pointsAwarded: POINTS_PER_MONTH,
      newStreak,
      unlockedRewardId: snapshot.newlyUnlockedRewardIds[0] ?? null,
    },
  });
}

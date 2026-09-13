import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { ingestTransaction } from "@/lib/server/ingest";
import { writeEvent } from "@/lib/server/event-engine";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const amount = typeof body.amount === "number" ? body.amount : 220;
  const db = getDb();

  ingestTransaction(db, customerId, {
    merchant: "Weekend Getaway",
    amount: -amount,
  });

  const snapshot = runPipeline(customerId, { emitEvents: false });
  if (snapshot.plan.status === "AT_RISK") {
    writeEvent(db, customerId, "discretionary_range_exceeded", { amount });
  }

  const bank = readBankSnapshot(db);
  return NextResponse.json({ ...snapshot, bank });
}

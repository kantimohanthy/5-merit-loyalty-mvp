import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { ingestTransaction } from "@/lib/server/ingest";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Anti-gaming demonstration: moving €500 between your own accounts should
// never look like "savings behavior." We insert the matching outflow/inflow
// pair; the anti-gaming engine (run inside the pipeline) detects and
// excludes both legs, and logs why.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const amount = typeof body.amount === "number" ? body.amount : 500;
  const db = getDb();
  const now = new Date().toISOString().slice(0, 10);
  const pairId = randomUUID().slice(0, 8);

  ingestTransaction(db, customerId, {
    id: `transfer-out-${pairId}`,
    merchant: "Internal Transfer — Checking",
    amount: -amount,
    date: now,
  });
  ingestTransaction(db, customerId, {
    id: `transfer-in-${pairId}`,
    merchant: "Internal Transfer — Savings",
    amount,
    date: now,
  });

  // emitEvents: true lets the pipeline's first-detection gate log
  // "internal_transfer_excluded" exactly once for this new pair.
  const snapshot = runPipeline(customerId, { emitEvents: true });
  const bank = readBankSnapshot(db);
  return NextResponse.json({ ...snapshot, bank });
}

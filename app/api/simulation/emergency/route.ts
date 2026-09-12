import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { ingestTransaction, transactionExists } from "@/lib/server/ingest";
import { writeEvent } from "@/lib/server/event-engine";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMERGENCY_ID = "emergency-1";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const db = getDb();

  if (!transactionExists(db, EMERGENCY_ID)) {
    ingestTransaction(db, customerId, {
      id: EMERGENCY_ID,
      merchant: "Sarajevo Clinical Center",
      amount: -450,
      mcc: "5912",
      protectedFlag: true,
    });
    writeEvent(db, customerId, "emergency_expense_detected", { amount: 450 });
  }

  const snapshot = runPipeline(customerId, { emitEvents: false });
  const bank = readBankSnapshot(db);
  return NextResponse.json({ ...snapshot, bank });
}

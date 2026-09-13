import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID, resetCustomer } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const db = getDb();

  resetCustomer(db, customerId);

  const snapshot = runPipeline(customerId, { emitEvents: false });
  const bank = readBankSnapshot(db);
  return NextResponse.json({ ...snapshot, bank });
}

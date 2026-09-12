import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID, getDb } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Full state bundle for the client demo shell: hydrates the customer app on
// first load and after any correction that isn't itself a "simulate *"
// action. Every simulate/* endpoint returns this same shape directly.
export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
  try {
    const snapshot = runPipeline(customerId, { emitEvents: false });
    const bank = readBankSnapshot(getDb());
    return NextResponse.json({ ...snapshot, bank });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 404 }
    );
  }
}

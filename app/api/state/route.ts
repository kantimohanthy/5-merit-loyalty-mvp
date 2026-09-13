import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID, getDb } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

// Full state bundle for the client demo shell: hydrates the customer app on
// first load and after any correction that isn't itself a "simulate *"
// action. Every simulate/* endpoint returns this same shape directly.
export async function GET(req: Request) {
  if (process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
    return NextResponse.json({ state: null });
  }
  const url = new URL(req?.url ?? "http://localhost");
  const customerId = url.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
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

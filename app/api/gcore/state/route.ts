import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { readGCoreAccount, listGCoreLedger } from "@/lib/server/gcore-engine";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function GET(req: Request) {
  if (process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
    return NextResponse.json({ account: null, ledger: [] });
  }
  const url = new URL(req?.url ?? "http://localhost");
  const customerId = url.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
  try {
    const db = getDb();
    const account = readGCoreAccount(db, customerId);
    const ledger = listGCoreLedger(db, customerId);
    return NextResponse.json({ account, ledger });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

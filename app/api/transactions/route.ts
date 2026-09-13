import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { ingestTransaction } from "@/lib/server/ingest";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function GET(req: Request) {
  if (process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
    return NextResponse.json({ transactions: [] });
  }
  const url = new URL(req?.url ?? "http://localhost");
  const customerId = url.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM transactions WHERE customer_id = ? ORDER BY date DESC, rowid DESC`)
    .all(customerId);
  return NextResponse.json({ transactions: rows });
}

// Ingestion endpoint — the API contract a real bank webhook / open-banking
// feed would call. The simulation endpoints use the same underlying
// ingestTransaction() helper directly.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  if (!body.merchant || typeof body.amount !== "number") {
    return NextResponse.json({ error: "merchant and amount are required" }, { status: 400 });
  }
  const db = getDb();
  const result = ingestTransaction(db, customerId, {
    merchant: body.merchant,
    amount: body.amount,
    date: body.date,
    mcc: body.mcc,
  });
  return NextResponse.json(result, { status: 201 });
}

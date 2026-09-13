import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { claimGMarketItem } from "@/lib/server/gcore-engine";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const itemId = body.itemId;

  if (!itemId || typeof itemId !== "string") {
    return NextResponse.json({ error: "not_found" }, { status: 400 });
  }

  const db = getDb();
  const result = claimGMarketItem(db, customerId, itemId);

  if (!result.success) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ account: result.account, ledger: result.ledger });
}

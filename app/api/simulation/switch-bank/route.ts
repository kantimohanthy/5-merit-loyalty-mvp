import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { simulateSwitchBank } from "@/lib/server/gcore-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const db = getDb();

  const result = simulateSwitchBank(db, customerId);

  return NextResponse.json({
    ...result.snapshot,
    bank: result.bank,
    gcore: result.gcore,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;

  try {
    const snapshot = runPipeline(customerId, { emitEvents: false });
    return NextResponse.json({ customer: snapshot.customer, plan: snapshot.plan });
  } catch {
    return NextResponse.json({ error: "Unknown customer" }, { status: 404 });
  }
}

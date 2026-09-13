import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function GET(req: Request) {
  if (process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
    return NextResponse.json({ profiles: [] });
  }
  const url = new URL(req?.url ?? "http://localhost");
  const customerId = url.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;

  try {
    const snapshot = runPipeline(customerId, { emitEvents: false });
    return NextResponse.json({ customer: snapshot.customer, plan: snapshot.plan });
  } catch {
    return NextResponse.json({ error: "Unknown customer" }, { status: 404 });
  }
}

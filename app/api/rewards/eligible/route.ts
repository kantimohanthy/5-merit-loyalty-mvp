import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
  try {
    const snapshot = runPipeline(customerId, { emitEvents: false });
    return NextResponse.json({
      rewards: snapshot.rewards.map((r) => ({
        ...r,
        why: snapshot.rewardDetails.find((d) => d.id === r.id)?.why ?? [],
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 404 }
    );
  }
}

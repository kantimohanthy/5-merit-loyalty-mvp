import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

export async function GET(req: Request) {
  if (process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
    return NextResponse.json({ rewards: [] });
  }
  const url = new URL(req?.url ?? "http://localhost");
  const customerId = url.searchParams.get("customerId") ?? DEFAULT_CUSTOMER_ID;
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

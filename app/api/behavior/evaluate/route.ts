import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { runPipeline } from "@/lib/server/pipeline";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

// The core analysis endpoint: classifies + contextualizes + scores this
// customer's transaction history and returns eligible rewards with reasons.
// Read-mostly (reward eligibility state is persisted, but no new events are
// emitted) — this is "analyze," not "simulate an action."
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;

  try {
    const snapshot = runPipeline(customerId, { emitEvents: false });
    return NextResponse.json({
      profile: { status: snapshot.plan.status },
      plan: snapshot.plan,
      dimensions: snapshot.status.dimensions,
      protectedExpenses: snapshot.protectedExpenses,
      excludedTransfers: snapshot.excludedTransfers,
      eligibleRewards: snapshot.rewards
        .filter((r) => r.status === "unlocked")
        .map((r) => ({
          id: r.id,
          merchant: r.merchant,
          title: r.title,
          why: snapshot.rewardDetails.find((d) => d.id === r.id)?.why ?? [],
        })),
      trace: snapshot.trace,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 404 }
    );
  }
}

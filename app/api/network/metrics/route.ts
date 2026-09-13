import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

// Simulated ecosystem-scale figures for the Architecture/Federation demo.
// Explicitly labeled everywhere it's rendered as simulated, not live.
export async function GET() {
  return NextResponse.json({
    participatingBanks: 4,
    participatingUsers: 120000,
    behavioralCredentialsIssued: 96000,
    rewardPartners: 30,
    avgVerifiedTenureMonths: 14,
  });
}

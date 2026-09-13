import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { readBankSnapshot } from "@/lib/server/bank-snapshot";

export const runtime = "nodejs";
export const dynamic = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true" ? undefined : "force-dynamic";

// Portfolio-level figures are simulated baselines (clearly labeled as such
// in the UI) — the live engagement feed underneath them is real, read from
// the event store rather than mutated directly by the client.
export async function GET() {
  return NextResponse.json(readBankSnapshot(getDb()));
}

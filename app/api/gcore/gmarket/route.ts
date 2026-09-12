import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { listGMarketItems } from "@/lib/server/gcore-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const items = listGMarketItems(db);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

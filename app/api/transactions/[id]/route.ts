import { NextRequest, NextResponse } from "next/server";
import { getDb, DEFAULT_CUSTOMER_ID } from "@/lib/server/db";
import { CATEGORY_CLASSIFICATION } from "@/lib/server/classification-engine";
import type { Category } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Human correction of an automated category — confidence goes to 1.0 since
// it's now verified by the customer, and classification is re-derived from
// the corrected category rather than left to the original guess.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const customerId = body.customerId ?? DEFAULT_CUSTOMER_ID;
  const category = body.category as Category | undefined;
  if (!category || !(category in CATEGORY_CLASSIFICATION)) {
    return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
  }

  const db = getDb();
  const classification = CATEGORY_CLASSIFICATION[category];
  const result = db
    .prepare(
      `UPDATE transactions SET category = ?, classification = ?, confirmed = 1, confidence = 1.0
       WHERE id = ? AND customer_id = ?`
    )
    .run(category, classification, params.id, customerId);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }
  return NextResponse.json({ id: params.id, category, classification, confirmed: true });
}

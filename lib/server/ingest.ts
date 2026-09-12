import { randomUUID } from "crypto";
import type Database from "better-sqlite3";
import { classifyTransaction } from "./classification-engine";

export interface IngestInput {
  id?: string;
  merchant: string;
  amount: number;
  date?: string;
  mcc?: string;
  protectedFlag?: boolean;
  confirmed?: boolean;
}

/**
 * Normalizes + classifies a raw incoming transaction and writes it. This is
 * the "ingestion" stage of the pipeline — in production this is where a
 * bank webhook or open-banking feed would land; tonight it's called by the
 * simulation endpoints with the same contract.
 */
export function ingestTransaction(
  db: Database.Database,
  customerId: string,
  input: IngestInput
) {
  const { category, classification, confidence, alternates } = classifyTransaction({
    merchant: input.merchant,
    mcc: input.mcc,
  });

  const id = input.id ?? randomUUID();
  const date = input.date ?? new Date().toISOString().slice(0, 10);

  db.prepare(
    `INSERT INTO transactions
      (id, customer_id, date, merchant, amount, category, classification, confidence, alternates_json, confirmed, protected, exclude_reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    customerId,
    date,
    input.merchant,
    input.amount,
    category,
    classification,
    confidence,
    JSON.stringify(alternates),
    input.confirmed === false ? 0 : 1,
    input.protectedFlag ? 1 : 0,
    null,
    new Date().toISOString()
  );

  return { id, category, classification, confidence };
}

export function transactionExists(db: Database.Database, id: string): boolean {
  const row = db.prepare(`SELECT 1 FROM transactions WHERE id = ?`).get(id);
  return !!row;
}

import type Database from "better-sqlite3";
import { randomUUID } from "crypto";

export type MeritEventType =
  | "monthly_target_achieved"
  | "reward_unlocked"
  | "reward_redeemed"
  | "emergency_expense_detected"
  | "internal_transfer_excluded"
  | "discretionary_range_exceeded"
  | "bank_feed_seed";

export interface EngagementFeedRow {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
}

function pseudoCustomerNumber(customerId: string): number {
  let hash = 0;
  for (let i = 0; i < customerId.length; i++) {
    hash = (hash * 31 + customerId.charCodeAt(i)) >>> 0;
  }
  return 20000 + (hash % 79999);
}

export function writeEvent(
  db: Database.Database,
  customerId: string,
  type: MeritEventType,
  payload: Record<string, unknown>
) {
  db.prepare(
    `INSERT INTO events (id, customer_id, type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)`
  ).run(randomUUID(), customerId, type, JSON.stringify(payload), new Date().toISOString());
}

function formatEvent(row: {
  customer_id: string;
  type: MeritEventType;
  payload_json: string;
  created_at: string;
}): EngagementFeedRow | null {
  const payload = JSON.parse(row.payload_json) as Record<string, unknown>;
  const ts = new Date(row.created_at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const num = pseudoCustomerNumber(row.customer_id);

  switch (row.type) {
    case "bank_feed_seed":
      return {
        id: row.customer_id + row.created_at,
        label: String(payload.label),
        detail: String(payload.detail),
        timestamp: ts,
      };
    case "monthly_target_achieved":
      return {
        id: row.customer_id + row.created_at,
        label: "Monthly target achieved",
        detail: `Customer #${num} · ${payload.streak}-month streak · Adidas reward unlocked`,
        timestamp: ts,
      };
    case "reward_unlocked":
      return {
        id: row.customer_id + row.created_at,
        label: "Behavioral reward unlocked",
        detail: `Customer #${num} · ${payload.merchant} ${payload.title}`,
        timestamp: ts,
      };
    case "emergency_expense_detected":
      return {
        id: row.customer_id + row.created_at,
        label: "Protected expense detected",
        detail: `Customer #${num} · Healthcare · excluded from evaluation`,
        timestamp: ts,
      };
    case "internal_transfer_excluded":
      return {
        id: row.customer_id + row.created_at,
        label: "Internal transfer excluded",
        detail: `Customer #${num} · anti-gaming check · excluded from behavioral progress`,
        timestamp: ts,
      };
    case "discretionary_range_exceeded":
      return {
        id: row.customer_id + row.created_at,
        label: "Discretionary range exceeded",
        detail: `Customer #${num} · reward progress paused, not penalized`,
        timestamp: ts,
      };
    default:
      return null;
  }
}

export function readEngagementFeed(db: Database.Database, limit = 6): EngagementFeedRow[] {
  const rows = db
    .prepare(
      `SELECT customer_id, type, payload_json, created_at FROM events ORDER BY created_at DESC LIMIT ?`
    )
    .all(limit * 3) as {
    customer_id: string;
    type: MeritEventType;
    payload_json: string;
    created_at: string;
  }[];

  const formatted = rows
    .map(formatEvent)
    .filter((r): r is EngagementFeedRow => r !== null)
    .slice(0, limit);

  return formatted;
}

export function countEventsByType(db: Database.Database, type: MeritEventType): number {
  const row = db
    .prepare(`SELECT COUNT(*) as c FROM events WHERE type = ?`)
    .get(type) as { c: number };
  return row.c;
}

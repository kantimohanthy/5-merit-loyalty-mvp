import { createHash, randomUUID } from "crypto";
import type Database from "better-sqlite3";
import { runPipeline, type PipelineSnapshot } from "./pipeline";
import { readBankSnapshot } from "./bank-snapshot";

// Privacy boundary notice:
// G-Core only processes pseudonymous G-Pass identity and GP point deltas.
// Raw transaction data (merchant, amount, transaction category) NEVER leaves the bank.

export type GCoreTierLabel = "Member" | "Silver" | "Gold" | "Platinum" | "Diamond";

export interface GCoreAccount {
  gPass: string;
  tierIndex: number; // 0-4
  tierLabel: GCoreTierLabel; // "Member" | "Silver" | "Gold" | "Platinum" | "Diamond"
  gpBalance: number;
  gpLifetime: number;
  nextTierAt: number | null; // months of verified history needed for next tier, null if already Diamond
}

export interface GCoreLedgerEntry {
  id: string;
  gpDelta: number;
  reason: string;
  kind: "goal_completed" | "tenure_advanced" | "gmarket_claim";
  createdAt: string;
}

export interface GMarketItem {
  id: string;
  title: string;
  category: "experience" | "access" | "privilege"; // G-Market reward classification, unrelated to bank transaction category
  description: string;
  gpCost: number;
  minTierIndex: number;
  scarcityTotal: number;
  scarcityClaimed: number;
  scarcityRemaining: number;
}

export type ClaimFailureReason = "insufficient_gp" | "tier_too_low" | "sold_out" | "not_found";

export const GP_PER_GOAL = 50;
export const GP_PER_TENURE_TIER = 200;
export const TIER_LABELS: GCoreTierLabel[] = ["Member", "Silver", "Gold", "Platinum", "Diamond"];

interface GCoreAccountRow {
  customer_id: string;
  g_pass: string;
  tier_index: number;
  gp_balance: number;
  gp_lifetime: number;
  last_tenure_tier_synced: number;
  created_at: string;
}

export function getOrCreateGCoreAccount(
  db: Database.Database,
  customerId: string
): GCoreAccountRow {
  let row = db
    .prepare(`SELECT * FROM gcore_accounts WHERE customer_id = ?`)
    .get(customerId) as GCoreAccountRow | undefined;

  if (!row) {
    // Generate g_pass deterministically as G-HEXSHA256(customerId + salt)[0..10]
    // Privacy boundary: SHA-256 hash ensures raw customer ID and account details never leave the bank.
    const hash = createHash("sha256")
      .update(`${customerId}:merit-gcore-salt`)
      .digest("hex")
      .slice(0, 10)
      .toUpperCase();
    const gPass = `G-${hash}`;
    const now = new Date().toISOString();

    const stateRow = db
      .prepare(`SELECT verified_history_months FROM customer_state WHERE customer_id = ?`)
      .get(customerId) as { verified_history_months: number } | undefined;

    const verifiedMonths = stateRow?.verified_history_months ?? 0;
    const initialTierIndex = Math.min(4, Math.floor(verifiedMonths / 6));

    let initialGp = 0;
    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO gcore_accounts (customer_id, g_pass, tier_index, gp_balance, gp_lifetime, last_tenure_tier_synced, created_at)
        VALUES (?, ?, ?, 0, 0, ?, ?)
      `).run(customerId, gPass, initialTierIndex, initialTierIndex, now);

      for (let t = 1; t <= initialTierIndex; t++) {
        const ledgerId = `gleg-tenure-init-${t}-${randomUUID().slice(0, 6)}`;
        db.prepare(`
          INSERT INTO gcore_ledger (id, customer_id, gp_delta, reason, kind, created_at)
          VALUES (?, ?, ?, '6-month tenure milestone reached', 'tenure_advanced', ?)
        `).run(ledgerId, customerId, GP_PER_TENURE_TIER, now);
        initialGp += GP_PER_TENURE_TIER;
      }

      if (initialGp > 0) {
        db.prepare(`
          UPDATE gcore_accounts
          SET gp_balance = ?, gp_lifetime = ?
          WHERE customer_id = ?
        `).run(initialGp, initialGp, customerId);
      }
    });

    tx();

    row = db
      .prepare(`SELECT * FROM gcore_accounts WHERE customer_id = ?`)
      .get(customerId) as GCoreAccountRow;
  }

  return row;
}

export function syncGCoreForPipelineRun(
  db: Database.Database,
  customerId: string,
  opts: {
    newlyUnlockedRewardIds: string[];
    verifiedHistoryMonths: number;
    emitLedger: boolean;
  }
) {
  const accountRow = getOrCreateGCoreAccount(db, customerId);

  if (!opts.emitLedger) {
    return;
  }

  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    let balanceDelta = 0;
    let lifetimeDelta = 0;

    // 1. Goal completion GP awards (generic reason, no merchant name or reward title passed)
    for (let i = 0; i < opts.newlyUnlockedRewardIds.length; i++) {
      const ledgerId = `gleg-goal-${Date.now()}-${randomUUID().slice(0, 6)}`;
      db.prepare(`
        INSERT INTO gcore_ledger (id, customer_id, gp_delta, reason, kind, created_at)
        VALUES (?, ?, ?, 'Behavioral goal completed', 'goal_completed', ?)
      `).run(ledgerId, customerId, GP_PER_GOAL, now);
      balanceDelta += GP_PER_GOAL;
      lifetimeDelta += GP_PER_GOAL;
    }

    // 2. Tenure milestone GP awards
    const targetTierIndex = Math.min(4, Math.floor(opts.verifiedHistoryMonths / 6));
    let currentTenureSynced = accountRow.last_tenure_tier_synced;
    let newTierIndex = accountRow.tier_index;

    if (targetTierIndex > currentTenureSynced) {
      for (let t = currentTenureSynced + 1; t <= targetTierIndex; t++) {
        const ledgerId = `gleg-tenure-${Date.now()}-${t}-${randomUUID().slice(0, 6)}`;
        db.prepare(`
          INSERT INTO gcore_ledger (id, customer_id, gp_delta, reason, kind, created_at)
          VALUES (?, ?, ?, '6-month tenure milestone reached', 'tenure_advanced', ?)
        `).run(ledgerId, customerId, GP_PER_TENURE_TIER, now);
        balanceDelta += GP_PER_TENURE_TIER;
        lifetimeDelta += GP_PER_TENURE_TIER;
      }
      currentTenureSynced = targetTierIndex;
      newTierIndex = targetTierIndex;
    }

    if (balanceDelta > 0 || currentTenureSynced > accountRow.last_tenure_tier_synced) {
      db.prepare(`
        UPDATE gcore_accounts
        SET gp_balance = gp_balance + ?,
            gp_lifetime = gp_lifetime + ?,
            tier_index = ?,
            last_tenure_tier_synced = ?
        WHERE customer_id = ?
      `).run(balanceDelta, lifetimeDelta, newTierIndex, currentTenureSynced, customerId);
    }
  });

  tx();
}

export function readGCoreAccount(
  db: Database.Database,
  customerId: string
): GCoreAccount {
  const row = getOrCreateGCoreAccount(db, customerId);
  const tierIndex = Math.min(4, Math.max(0, row.tier_index));
  const tierLabel = TIER_LABELS[tierIndex];
  const nextTierAt = tierIndex < 4 ? (tierIndex + 1) * 6 : null;

  return {
    gPass: row.g_pass,
    tierIndex,
    tierLabel,
    gpBalance: row.gp_balance,
    gpLifetime: row.gp_lifetime,
    nextTierAt,
  };
}

export function listGCoreLedger(
  db: Database.Database,
  customerId: string,
  limit = 10
): GCoreLedgerEntry[] {
  getOrCreateGCoreAccount(db, customerId);
  const rows = db
    .prepare(
      `SELECT * FROM gcore_ledger WHERE customer_id = ? ORDER BY created_at DESC, rowid DESC LIMIT ?`
    )
    .all(customerId, limit) as {
    id: string;
    gp_delta: number;
    reason: string;
    kind: "goal_completed" | "tenure_advanced" | "gmarket_claim";
    created_at: string;
  }[];

  return rows.map((r) => ({
    id: r.id,
    gpDelta: r.gp_delta,
    reason: r.reason,
    kind: r.kind,
    createdAt: r.created_at,
  }));
}

export function listGMarketItems(db: Database.Database): GMarketItem[] {
  const rows = db
    .prepare(`SELECT * FROM gmarket_items ORDER BY min_tier_index ASC, gp_cost ASC`)
    .all() as {
    id: string;
    title: string;
    category: "experience" | "access" | "privilege"; // G-Market reward item classification
    description: string;
    gp_cost: number;
    min_tier_index: number;
    scarcity_total: number;
    scarcity_claimed: number;
  }[];

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category, // G-Market item category
    description: r.description,
    gpCost: r.gp_cost,
    minTierIndex: r.min_tier_index,
    scarcityTotal: r.scarcity_total,
    scarcityClaimed: r.scarcity_claimed,
    scarcityRemaining: Math.max(0, r.scarcity_total - r.scarcity_claimed),
  }));
}

export function claimGMarketItem(
  db: Database.Database,
  customerId: string,
  itemId: string
):
  | { success: true; account: GCoreAccount; ledger: GCoreLedgerEntry[] }
  | { success: false; reason: ClaimFailureReason } {
  const accountRow = getOrCreateGCoreAccount(db, customerId);

  const item = db
    .prepare(`SELECT * FROM gmarket_items WHERE id = ?`)
    .get(itemId) as
    | {
        id: string;
        title: string;
        category: string; // G-Market item category
        description: string;
        gp_cost: number;
        min_tier_index: number;
        scarcity_total: number;
        scarcity_claimed: number;
      }
    | undefined;

  if (!item) {
    return { success: false, reason: "not_found" };
  }

  const scarcityRemaining = item.scarcity_total - item.scarcity_claimed;
  if (scarcityRemaining <= 0) {
    return { success: false, reason: "sold_out" };
  }

  if (accountRow.tier_index < item.min_tier_index) {
    return { success: false, reason: "tier_too_low" };
  }

  if (accountRow.gp_balance < item.gp_cost) {
    return { success: false, reason: "insufficient_gp" };
  }

  const now = new Date().toISOString();
  const claimId = `claim-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const ledgerId = `gleg-claim-${Date.now()}-${randomUUID().slice(0, 6)}`;

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO gmarket_claims (id, customer_id, item_id, claimed_at)
      VALUES (?, ?, ?, ?)
    `).run(claimId, customerId, itemId, now);

    db.prepare(`
      UPDATE gmarket_items
      SET scarcity_claimed = scarcity_claimed + 1
      WHERE id = ?
    `).run(itemId);

    db.prepare(`
      UPDATE gcore_accounts
      SET gp_balance = gp_balance - ?
      WHERE customer_id = ?
    `).run(item.gp_cost, customerId);

    db.prepare(`
      INSERT INTO gcore_ledger (id, customer_id, gp_delta, reason, kind, created_at)
      VALUES (?, ?, ?, ?, 'gmarket_claim', ?)
    `).run(ledgerId, customerId, -item.gp_cost, `Claimed: ${item.title}`, now);
  });

  tx();

  const account = readGCoreAccount(db, customerId);
  const ledger = listGCoreLedger(db, customerId);

  return {
    success: true,
    account,
    ledger,
  };
}

export function simulateSwitchBank(
  db: Database.Database,
  customerId: string
): {
  snapshot: PipelineSnapshot;
  bank: ReturnType<typeof readBankSnapshot>;
  gcore: {
    account: GCoreAccount;
    ledger: GCoreLedgerEntry[];
  };
} {
  // Resets only bank-local fields on customer_state (tier = 'START', points = 0, streak = 0)
  // Privacy boundary: verified_history_months, transactions, and G-Core ledger remain untouched.
  db.prepare(`
    UPDATE customer_state
    SET tier = 'START', points = 0, streak = 0
    WHERE customer_id = ?
  `).run(customerId);

  const snapshot = runPipeline(customerId, { emitEvents: false });
  const bank = readBankSnapshot(db);
  const account = readGCoreAccount(db, customerId);
  const ledger = listGCoreLedger(db, customerId);

  return {
    snapshot,
    bank,
    gcore: {
      account,
      ledger,
    },
  };
}

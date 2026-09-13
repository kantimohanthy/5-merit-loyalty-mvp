import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Single SQLite file backing the whole backend. Using a global singleton so
// Next.js dev-mode hot-reload doesn't reopen (and re-seed) the DB on every
// edit — this is the standard pattern for a stateful driver in route handlers.

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "merit.db");

declare global {
  // eslint-disable-next-line no-var
  var __meritDb: Database.Database | undefined;
}

function createSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      profile TEXT NOT NULL,
      member_since TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customer_state (
      customer_id TEXT PRIMARY KEY REFERENCES customers(id),
      income REAL NOT NULL,
      fixed_obligations REAL NOT NULL,
      discretionary_target REAL NOT NULL,
      savings_target REAL NOT NULL,
      savings_saved REAL NOT NULL,
      tier TEXT NOT NULL,
      points INTEGER NOT NULL,
      streak INTEGER NOT NULL,
      verified_history_months INTEGER NOT NULL,
      budget_score REAL NOT NULL,
      savings_score REAL NOT NULL,
      payment_score REAL NOT NULL,
      liquidity_score REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      date TEXT NOT NULL,
      merchant TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      classification TEXT NOT NULL,
      confidence REAL NOT NULL,
      alternates_json TEXT NOT NULL,
      confirmed INTEGER NOT NULL,
      protected INTEGER NOT NULL DEFAULT 0,
      exclude_reason TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT NOT NULL,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      merchant TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT,
      requirement TEXT,
      progress REAL,
      PRIMARY KEY (id, customer_id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gcore_accounts (
      customer_id TEXT PRIMARY KEY REFERENCES customers(id),
      g_pass TEXT NOT NULL UNIQUE,
      tier_index INTEGER NOT NULL DEFAULT 0,
      gp_balance INTEGER NOT NULL DEFAULT 0,
      gp_lifetime INTEGER NOT NULL DEFAULT 0,
      last_tenure_tier_synced INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gcore_ledger (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      gp_delta INTEGER NOT NULL,
      reason TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gmarket_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      gp_cost INTEGER NOT NULL,
      min_tier_index INTEGER NOT NULL,
      scarcity_total INTEGER NOT NULL,
      scarcity_claimed INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gmarket_claims (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      item_id TEXT NOT NULL REFERENCES gmarket_items(id),
      claimed_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
    CREATE INDEX IF NOT EXISTS idx_events_customer ON events(customer_id);
    CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
    CREATE INDEX IF NOT EXISTS idx_gcore_ledger_customer ON gcore_ledger(customer_id);
    CREATE INDEX IF NOT EXISTS idx_gmarket_claims_customer ON gmarket_claims(customer_id);
  `);
}

const SEED_TRANSACTIONS = [
  { id: "t1", date: "2026-09-01", merchant: "Novi Grad Apartments", amount: -500, category: "Rent", classification: "essential", confidence: 0.96, alternates: [{ category: "Rent", confidence: 0.96 }, { category: "Other", confidence: 0.04 }], confirmed: true },
  { id: "t2", date: "2026-09-02", merchant: "Konzum Grocery", amount: -42, category: "Groceries", classification: "essential", confidence: 0.93, alternates: [{ category: "Groceries", confidence: 0.93 }, { category: "Shopping", confidence: 0.07 }], confirmed: true },
  { id: "t3", date: "2026-09-03", merchant: "Sarajevo Metro", amount: -25, category: "Transport", classification: "essential", confidence: 0.98, alternates: [{ category: "Transport", confidence: 0.98 }], confirmed: true },
  { id: "t4", date: "2026-09-04", merchant: "University Bookshop", amount: -38, category: "Education", classification: "essential", confidence: 0.91, alternates: [{ category: "Education", confidence: 0.91 }, { category: "Shopping", confidence: 0.09 }], confirmed: true },
  { id: "t5", date: "2026-09-05", merchant: "Zrno Coffee", amount: -6, category: "Entertainment", classification: "discretionary", confidence: 0.88, alternates: [{ category: "Entertainment", confidence: 0.88 }, { category: "Groceries", confidence: 0.12 }], confirmed: true },
  { id: "t6", date: "2026-09-06", merchant: "Adidas Baščaršija", amount: -59, category: "Shopping", classification: "discretionary", confidence: 0.9, alternates: [{ category: "Shopping", confidence: 0.9 }, { category: "Entertainment", confidence: 0.1 }], confirmed: true },
  { id: "t7", date: "2026-09-07", merchant: "Netflix", amount: -12, category: "Subscriptions", classification: "discretionary", confidence: 0.99, alternates: [{ category: "Subscriptions", confidence: 0.99 }], confirmed: true },
  { id: "t8", date: "2026-09-07", merchant: "Family transfer / Rent", amount: -700, category: "Rent", classification: "essential", confidence: 0.91, alternates: [{ category: "Rent", confidence: 0.91 }, { category: "Other", confidence: 0.05 }, { category: "Education", confidence: 0.04 }], confirmed: false },
  { id: "t9", date: "2026-09-08", merchant: "Savings Transfer", amount: 90, category: "Savings", classification: "savings", confidence: 1, alternates: [{ category: "Savings", confidence: 1 }], confirmed: true },
] as const;

function seedGMarket(db: Database.Database) {
  const count = db
    .prepare("SELECT COUNT(*) as c FROM gmarket_items")
    .get() as { c: number };
  if (count.c > 0) return;

  const insertItem = db.prepare(`
    INSERT INTO gmarket_items (id, title, category, description, gp_cost, min_tier_index, scarcity_total, scarcity_claimed)
    VALUES (@id, @title, @category, @description, @gpCost, @minTierIndex, @scarcityTotal, 0)
  `);

  const items = [
    {
      id: "gm1",
      title: "Early Access: New Product Line",
      category: "access",
      description: "Exclusive first access to upcoming innovative product line rollouts.",
      gpCost: 200,
      minTierIndex: 1,
      scarcityTotal: 50,
    },
    {
      id: "gm2",
      title: "Priority Wealth Advisor Session",
      category: "access",
      description: "1-on-1 priority consultation with a senior network wealth advisor.",
      gpCost: 300,
      minTierIndex: 1,
      scarcityTotal: 10,
    },
    {
      id: "gm3",
      title: "Airport Lounge Pass (1 use)",
      category: "privilege",
      description: "Single-use global airport lounge access for participating network hubs.",
      gpCost: 500,
      minTierIndex: 2,
      scarcityTotal: 20,
    },
    {
      id: "gm4",
      title: "Investor Breakfast Invitation",
      category: "experience",
      description: "Exclusive invitation to an intimate executive & investor roundtable.",
      gpCost: 800,
      minTierIndex: 2,
      scarcityTotal: 5,
    },
    {
      id: "gm5",
      title: "Diamond Concierge Line",
      category: "privilege",
      description: "24/7 dedicated personal concierge service line across network partners.",
      gpCost: 1500,
      minTierIndex: 4,
      scarcityTotal: 3,
    },
    {
      id: "gm6",
      title: "Annual FinTech & Loyalty Summit Pass",
      category: "experience",
      description: "Exclusive invitation & VIP access to the Annual European FinTech & Loyalty Summit.",
      gpCost: 500,
      minTierIndex: 2,
      scarcityTotal: 5,
    },
  ];

  for (const item of items) {
    insertItem.run(item);
  }
}

function seed(db: Database.Database) {
  seedGMarket(db);
  const count = db
    .prepare("SELECT COUNT(*) as c FROM customers")
    .get() as { c: number };
  if (count.c > 0) return;

  const insertCustomer = db.prepare(
    `INSERT INTO customers (id, name, age, profile, member_since) VALUES (@id, @name, @age, @profile, @memberSince)`
  );
  const insertState = db.prepare(`
    INSERT INTO customer_state
      (customer_id, income, fixed_obligations, discretionary_target, savings_target, savings_saved,
       tier, points, streak, verified_history_months, budget_score, savings_score, payment_score, liquidity_score)
    VALUES
      (@customerId, @income, @fixedObligations, @discretionaryTarget, @savingsTarget, @savingsSaved,
       @tier, @points, @streak, @verifiedHistoryMonths, @budgetScore, @savingsScore, @paymentScore, @liquidityScore)
  `);
  const insertTxn = db.prepare(`
    INSERT INTO transactions
      (id, customer_id, date, merchant, amount, category, classification, confidence, alternates_json, confirmed, protected, exclude_reason, created_at)
    VALUES
      (@id, @customerId, @date, @merchant, @amount, @category, @classification, @confidence, @alternatesJson, @confirmed, @protectedFlag, @excludeReason, @createdAt)
  `);
  const insertReward = db.prepare(`
    INSERT INTO rewards (id, customer_id, merchant, title, category, status, reason, requirement, progress)
    VALUES (@id, @customerId, @merchant, @title, @category, @status, @reason, @requirement, @progress)
  `);
  const insertEvent = db.prepare(`
    INSERT INTO events (id, customer_id, type, payload_json, created_at)
    VALUES (@id, @customerId, @type, @payloadJson, @createdAt)
  `);

  const customerId = "alex-001";

  const tx = db.transaction(() => {
    insertCustomer.run({
      id: customerId,
      name: "Alex Morgan",
      age: 22,
      profile: "University student / part-time worker",
      memberSince: "Mar 2025",
    });

    insertState.run({
      customerId,
      income: 1000,
      fixedObligations: 500,
      discretionaryTarget: 360,
      savingsTarget: 140,
      savingsSaved: 90,
      tier: "PLUS",
      points: 2500,
      streak: 5,
      verifiedHistoryMonths: 18,
      budgetScore: 0.88,
      savingsScore: 0.82,
      paymentScore: 0.94,
      liquidityScore: 0.6,
    });

    for (const t of SEED_TRANSACTIONS) {
      insertTxn.run({
        id: t.id,
        customerId,
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        classification: t.classification,
        confidence: t.confidence,
        alternatesJson: JSON.stringify(t.alternates),
        confirmed: t.confirmed ? 1 : 0,
        protectedFlag: 0,
        excludeReason: null,
        createdAt: new Date(t.date).toISOString(),
      });
    }

    const seedRewards = [
      { id: "r1", merchant: "Adidas", title: "20% OFF", category: "Shopping", status: "locked", reason: null, requirement: "Reach your monthly target to unlock", progress: 0.72 },
      { id: "r2", merchant: "Wanderlust Travel", title: "€40 travel credit", category: "Travel", status: "locked", reason: null, requirement: "3-month streak + savings goal met", progress: 0.4 },
      { id: "r3", merchant: "Ćevabdžinica Petica", title: "Free side with any meal", category: "Entertainment", status: "locked", reason: null, requirement: "Stay within discretionary target", progress: 0.72 },
      { id: "r4", merchant: "Zrno Coffee", title: "Buy 4, get 1 free", category: "Entertainment", status: "unlocked", reason: "Unlocked last month for consistent budget tracking.", requirement: null, progress: null },
    ];
    for (const r of seedRewards) {
      insertReward.run({ ...r, customerId });
    }

    // --- Demo 1 (Behavioral Intelligence) sample customer ---
    // A separate seeded customer so the "Analyze Behavior" walkthrough is a
    // real backend call with a deterministic, always-eligible outcome — it
    // runs first in the pitch sequence, before Simulate Month has touched
    // the live dashboard customer above.
    const demoCustomerId = "demo-001";
    insertCustomer.run({
      id: demoCustomerId,
      name: "Alex Morgan",
      age: 22,
      profile: "University student / part-time worker",
      memberSince: "Mar 2025",
    });
    insertState.run({
      customerId: demoCustomerId,
      income: 1500,
      fixedObligations: 910,
      discretionaryTarget: 350,
      savingsTarget: 150,
      savingsSaved: 150,
      tier: "PLUS",
      points: 2250,
      streak: 4,
      verifiedHistoryMonths: 14,
      budgetScore: 0.9,
      savingsScore: 0.86,
      paymentScore: 0.95,
      liquidityScore: 0.72,
    });
    const demoTransactions = [
      { id: "d1", date: "2026-09-01", merchant: "Novi Grad Apartments", amount: -650, category: "Rent", classification: "essential", confidence: 0.96, alternates: [{ category: "Rent", confidence: 0.96 }] },
      { id: "d2", date: "2026-09-02", merchant: "Konzum Grocery", amount: -180, category: "Groceries", classification: "essential", confidence: 0.93, alternates: [{ category: "Groceries", confidence: 0.93 }] },
      { id: "d3", date: "2026-09-03", merchant: "Sarajevo Metro", amount: -80, category: "Transport", classification: "essential", confidence: 0.97, alternates: [{ category: "Transport", confidence: 0.97 }] },
      { id: "d4", date: "2026-09-05", merchant: "Zrno Coffee", amount: -100, category: "Entertainment", classification: "discretionary", confidence: 0.87, alternates: [{ category: "Entertainment", confidence: 0.87 }] },
      { id: "d5", date: "2026-09-06", merchant: "Adidas Baščaršija", amount: -120, category: "Shopping", classification: "discretionary", confidence: 0.9, alternates: [{ category: "Shopping", confidence: 0.9 }] },
      { id: "d6", date: "2026-09-06", merchant: "Ćevabdžinica Petica", amount: -90, category: "Entertainment", classification: "discretionary", confidence: 0.85, alternates: [{ category: "Entertainment", confidence: 0.85 }] },
      { id: "d7", date: "2026-09-07", merchant: "University Bookshop", amount: -80, category: "Education", classification: "essential", confidence: 0.88, alternates: [{ category: "Education", confidence: 0.88 }] },
      { id: "d8", date: "2026-09-08", merchant: "Savings Transfer", amount: 150, category: "Savings", classification: "savings", confidence: 1, alternates: [{ category: "Savings", confidence: 1 }] },
    ];
    for (const t of demoTransactions) {
      insertTxn.run({
        id: t.id,
        customerId: demoCustomerId,
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        classification: t.classification,
        confidence: t.confidence,
        alternatesJson: JSON.stringify(t.alternates),
        confirmed: 1,
        protectedFlag: 0,
        excludeReason: null,
        createdAt: new Date(t.date).toISOString(),
      });
    }
    insertReward.run({
      id: "r1",
      customerId: demoCustomerId,
      merchant: "Adidas",
      title: "20% OFF",
      category: "Shopping",
      status: "locked",
      reason: null,
      requirement: "Reach your monthly target to unlock",
      progress: 0.72,
    });

    const baseline = [
      { label: "Segment cohort refreshed", detail: "18–25 segment · students & first-job professionals", minsAgo: 46 },
      { label: "Behavioral reward redeemed", detail: "Customer #58213 · Adidas 20% off", minsAgo: 58 },
      { label: "Monthly target achieved", detail: "Customer #41090 · 4-month streak", minsAgo: 73 },
    ];
    const now = Date.now();
    baseline.forEach((b, i) => {
      insertEvent.run({
        id: `seed-${i}`,
        customerId: "network",
        type: "bank_feed_seed",
        payloadJson: JSON.stringify(b),
        createdAt: new Date(now - b.minsAgo * 60_000).toISOString(),
      });
    });
  });

  tx();
}

const SEED_TRANSACTION_IDS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];

/** Restores one customer to their initial seeded state — used by the demo
 * "reset" control so the live pitch can be rerun cleanly without restarting
 * the server or wiping the whole database. */
export function resetCustomer(db: Database.Database, customerId: string) {
  const restoreSeedTxn = db.prepare(
    `UPDATE transactions SET
       category = @category, classification = @classification, confidence = @confidence,
       alternates_json = @alternatesJson, confirmed = @confirmed, protected = 0, exclude_reason = NULL
     WHERE id = @id AND customer_id = @customerId`
  );
  const tx = db.transaction(() => {
    db.prepare(
      `DELETE FROM transactions WHERE customer_id = ? AND id NOT IN (${SEED_TRANSACTION_IDS.map(() => "?").join(",")})`
    ).run(customerId, ...SEED_TRANSACTION_IDS);
    for (const t of SEED_TRANSACTIONS) {
      restoreSeedTxn.run({
        id: t.id,
        customerId,
        category: t.category,
        classification: t.classification,
        confidence: t.confidence,
        alternatesJson: JSON.stringify(t.alternates),
        confirmed: t.confirmed ? 1 : 0,
      });
    }
    db.prepare(`DELETE FROM events WHERE customer_id = ?`).run(customerId);
    db.prepare(
      `UPDATE customer_state SET
         savings_saved = 90, tier = 'PLUS', points = 2500, streak = 5,
         verified_history_months = 18, budget_score = 0.88, savings_score = 0.82,
         payment_score = 0.94, liquidity_score = 0.6
       WHERE customer_id = ?`
    ).run(customerId);
    db.prepare(
      `UPDATE rewards SET status = 'locked', reason = NULL, progress = 0.72 WHERE id = 'r1' AND customer_id = ?`
    ).run(customerId);
    db.prepare(
      `UPDATE rewards SET status = 'locked', reason = NULL, progress = 0.4 WHERE id = 'r2' AND customer_id = ?`
    ).run(customerId);
    db.prepare(
      `UPDATE rewards SET status = 'locked', reason = NULL, progress = 0.72 WHERE id = 'r3' AND customer_id = ?`
    ).run(customerId);
    db.prepare(`DELETE FROM gcore_ledger WHERE customer_id = ?`).run(customerId);
    const claims = db
      .prepare(`SELECT item_id FROM gmarket_claims WHERE customer_id = ?`)
      .all(customerId) as { item_id: string }[];
    for (const claim of claims) {
      db.prepare(
        `UPDATE gmarket_items SET scarcity_claimed = MAX(0, scarcity_claimed - 1) WHERE id = ?`
      ).run(claim.item_id);
    }
    db.prepare(`DELETE FROM gmarket_claims WHERE customer_id = ?`).run(customerId);
    db.prepare(`DELETE FROM gcore_accounts WHERE customer_id = ?`).run(customerId);
  });
  tx();
}

export function getDb(): Database.Database {
  if (global.__meritDb) return global.__meritDb;

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  createSchema(db);
  seed(db);

  global.__meritDb = db;
  return db;
}

export const DEFAULT_CUSTOMER_ID = "alex-001";

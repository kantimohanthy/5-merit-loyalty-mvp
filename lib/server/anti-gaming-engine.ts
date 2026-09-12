export interface EngineTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

export interface AntiGamingResult {
  excludedIds: Set<string>;
  detections: { transactionId: string; pairedWithId: string; reason: string }[];
}

const TRANSFER_WINDOW_MS = 24 * 60 * 60 * 1000; // same-day pairing is enough for a monthly demo cycle
const TRANSFER_HINT = /internal transfer|account transfer/i;

/**
 * Detects same-customer internal account transfers — an outflow and an
 * inflow of matching magnitude, close together in time — and excludes both
 * legs from behavioral progress (savings/discretionary counting). Without
 * this, moving money between your own accounts could be gamed to look like
 * "savings behavior."
 */
export function detectInternalTransfers(
  transactions: EngineTransaction[]
): AntiGamingResult {
  const excludedIds = new Set<string>();
  const detections: AntiGamingResult["detections"] = [];

  const candidates = transactions.filter(
    (t) => TRANSFER_HINT.test(t.merchant) || t.category === "Savings"
  );

  for (let i = 0; i < candidates.length; i++) {
    const a = candidates[i];
    if (excludedIds.has(a.id)) continue;
    for (let j = i + 1; j < candidates.length; j++) {
      const b = candidates[j];
      if (excludedIds.has(b.id)) continue;
      const sameMagnitude = Math.abs(Math.abs(a.amount) - Math.abs(b.amount)) < 0.01;
      const oppositeDirection = Math.sign(a.amount) !== Math.sign(b.amount);
      const closeInTime =
        Math.abs(new Date(a.date).getTime() - new Date(b.date).getTime()) <=
        TRANSFER_WINDOW_MS;
      const looksLikeTransfer =
        TRANSFER_HINT.test(a.merchant) || TRANSFER_HINT.test(b.merchant);

      if (sameMagnitude && oppositeDirection && closeInTime && looksLikeTransfer) {
        excludedIds.add(a.id);
        excludedIds.add(b.id);
        detections.push({
          transactionId: a.id,
          pairedWithId: b.id,
          reason: "Internal transfer detected — excluded from behavioral progress.",
        });
        // `a` is now paired — stop scanning for further matches for it, or a
        // second candidate could steal `a` again and leave that candidate's
        // real partner unmatched when more than one transfer pair exists.
        break;
      }
    }
  }

  return { excludedIds, detections };
}

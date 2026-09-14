import type { Category, Classification } from "@/lib/types";

export const CATEGORY_CLASSIFICATION: Record<Category, Classification> = {
  Rent: "essential",
  Healthcare: "essential",
  Education: "essential",
  Groceries: "essential",
  Transport: "essential",
  Shopping: "discretionary",
  Entertainment: "discretionary",
  Subscriptions: "discretionary",
  Travel: "discretionary",
  Savings: "savings",
  Other: "discretionary",
};

export interface ClassificationResult {
  category: Category;
  classification: Classification;
  confidence: number;
  alternates: { category: Category; confidence: number }[];
  reasonCode?: "UNKNOWN_CATEGORY_FALLBACK" | "MERCHANT_RULE_MATCH" | "MCC_RULE_MATCH";
}

// Rules-based classification — explainable, no LLM/ML required for the MVP.
// Ordered merchant-keyword rules first (highest signal), MCC second, default last.
const MERCHANT_RULES: { test: RegExp; category: Category; confidence: number }[] = [
  { test: /university|bookshop|tuition|school/i, category: "Education", confidence: 0.91 },
  { test: /adidas|nike|puma|shop|store|baščaršija/i, category: "Shopping", confidence: 0.9 },
  { test: /netflix|spotify|subscription/i, category: "Subscriptions", confidence: 0.99 },
  { test: /rent|apartments|stan/i, category: "Rent", confidence: 0.95 },
  { test: /metro|transport|bus|taxi|uber|bolt/i, category: "Transport", confidence: 0.97 },
  { test: /clinical|hospital|clinic|pharmacy|health/i, category: "Healthcare", confidence: 0.97 },
  { test: /coffee|restaurant|ćevab|cafe|bar\b/i, category: "Entertainment", confidence: 0.87 },
  { test: /grocery|market|konzum|bingo/i, category: "Groceries", confidence: 0.93 },
  { test: /getaway|travel|hotel|flight|airbnb/i, category: "Travel", confidence: 0.92 },
  { test: /automatic savings|savings contribution|savings goal/i, category: "Savings", confidence: 0.96 }, // genuine own-savings deposit — high confidence
  { test: /savings transfer|internal transfer/i, category: "Savings", confidence: 0.5 }, // low confidence: anti-gaming layer decides the real treatment
];

const MCC_RULES: Record<string, Category> = {
  "5411": "Groceries",
  "5912": "Healthcare",
  "5651": "Shopping",
  "4111": "Transport",
  "6012": "Savings",
  "7011": "Travel",
};

function secondBestCategory(primary: Category): Category {
  const order: Category[] = [
    "Shopping",
    "Entertainment",
    "Other",
    "Groceries",
    "Subscriptions",
  ];
  return order.find((c) => c !== primary) ?? "Other";
}

export function classifyTransaction(input: {
  merchant?: string;
  mcc?: string;
}): ClassificationResult {
  let category: Category | null = null;
  let confidence = 0.55;
  let reasonCode: ClassificationResult["reasonCode"] = undefined;

  const merchantStr = input.merchant ?? "";

  for (const rule of MERCHANT_RULES) {
    if (merchantStr && rule.test.test(merchantStr)) {
      category = rule.category;
      confidence = rule.confidence;
      reasonCode = "MERCHANT_RULE_MATCH";
      break;
    }
  }

  if (!category && input.mcc && MCC_RULES[input.mcc]) {
    category = MCC_RULES[input.mcc];
    confidence = 0.8;
    reasonCode = "MCC_RULE_MATCH";
  }

  if (!category) {
    category = "Other";
    confidence = 0.55;
    reasonCode = "UNKNOWN_CATEGORY_FALLBACK";
  }

  const classification = CATEGORY_CLASSIFICATION[category] ?? "discretionary";
  const alt = secondBestCategory(category);
  const altConfidence = Math.round((1 - confidence) * 100) / 100;

  return {
    category,
    classification,
    confidence,
    reasonCode,
    alternates: [
      { category, confidence },
      ...(altConfidence > 0.005 ? [{ category: alt, confidence: altConfidence }] : []),
    ],
  };
}

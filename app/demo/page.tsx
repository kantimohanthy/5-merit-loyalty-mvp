"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Loader2,
  Megaphone,
  Sparkles,
  Tag,
} from "lucide-react";
import { Card, Pill, SectionLabel } from "@/components/ui";
import { formatEuroPlain } from "@/lib/utils";

const DEMO_CUSTOMER_ID = "demo-001";

interface EvaluateResponse {
  plan: { income: number };
  eligibleRewards: { id: string; merchant: string; title: string; why: string[] }[];
  trace: string[];
}

interface TransactionSummary {
  merchant: string;
  amount: number;
}

type Stage = "idle" | "analyzing" | "done";

export default function BehavioralIntelligenceDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load this sample customer's real transactions from the backend so the
  // left-hand panel isn't hardcoded either.
  useEffect(() => {
    fetch(`/api/transactions?customerId=${DEMO_CUSTOMER_ID}`)
      .then((r) => r.json())
      .then((data) => {
        const rows = (data.transactions ?? []) as { merchant: string; amount: number }[];
        setTransactions(rows.map((t) => ({ merchant: t.merchant, amount: t.amount })));
      })
      .catch(() => setTransactions([]));
  }, []);

  useEffect(() => {
    if (stage !== "analyzing" || !result) return;
    if (visibleSteps >= result.trace.length) {
      const t = setTimeout(() => setStage("done"), 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleSteps((v) => v + 1), 550);
    return () => clearTimeout(t);
  }, [stage, visibleSteps, result]);

  async function handleAnalyze() {
    setError(null);
    setVisibleSteps(0);
    setStage("analyzing");
    try {
      const res = await fetch("/api/behavior/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: DEMO_CUSTOMER_ID }),
      });
      if (!res.ok) throw new Error(`evaluate failed: ${res.status}`);
      const data: EvaluateResponse = await res.json();
      setResult(data);
    } catch {
      setError(
        "Couldn't reach the backend — run `npm run dev` locally to see the live pipeline (the published preview link is static-only)."
      );
      setStage("idle");
    }
  }

  const income = result?.plan.income ?? 1500;
  const adidas = result?.eligibleRewards.find((r) => r.merchant === "Adidas");

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
              M
            </span>
            <span className="font-display text-lg text-ink">Merit</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-cream"
            >
              <ArrowLeft size={14} />
              Back to overview
            </Link>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-navy-800 sm:flex"
            >
              Customer app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <SectionLabel>Demo 1 — Behavioral Intelligence</SectionLabel>
        <h1 className="mt-2 max-w-2xl font-display text-3xl text-ink lg:text-4xl">
          From generic campaign to personalized reward.
        </h1>
        <p className="mt-3 max-w-2xl text-navy-600">
          The same month of transactions, read two ways. On the left, what a
          mass campaign looks like. On the right, what MERIT&rsquo;s
          explainable behavior engine finds when the backend actually
          processes this customer&rsquo;s spending pattern — a real{" "}
          <code className="rounded bg-cream px-1 py-0.5 text-[13px]">
            POST /api/behavior/evaluate
          </code>{" "}
          call, not a scripted animation.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit p-5">
            <SectionLabel>Sample customer</SectionLabel>
            <div className="mt-1.5 font-display text-lg text-ink">
              Alex Morgan
            </div>
            <div className="mt-0.5 text-sm text-navy-500">
              Monthly income {formatEuroPlain(income)}
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              {transactions.map((t) => (
                <div
                  key={t.merchant}
                  className={`flex items-center justify-between text-sm ${
                    t.merchant.includes("Adidas") ? "font-semibold text-ink" : "text-navy-600"
                  }`}
                >
                  <span>{t.merchant}</span>
                  <span>{formatEuroPlain(Math.abs(t.amount))}</span>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-navy-500">
                    <Megaphone size={16} />
                  </div>
                  <SectionLabel>Generic campaign</SectionLabel>
                </div>
                <div
                  className={`mt-4 rounded-xl border border-line bg-cream/50 p-4 transition-opacity ${
                    stage === "done" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <div
                    className={`font-display text-lg text-ink ${
                      stage === "done" ? "line-through decoration-2" : ""
                    }`}
                  >
                    10% off at a national retailer
                  </div>
                  <p className="mt-1.5 text-sm text-navy-600">
                    Sent to every enrolled customer, regardless of what they
                    actually spend on.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-white">
                    <Brain size={16} />
                  </div>
                  <SectionLabel>MERIT-personalized</SectionLabel>
                </div>

                {stage !== "done" || !adidas ? (
                  <div className="mt-4 flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line p-4 text-center">
                    <Sparkles size={18} className="text-navy-400" />
                    <p className="text-sm text-navy-500">
                      Run the behavior engine to see the personalized match.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Pill tone="amber">
                        <Tag size={11} className="mr-1" />
                        Sportswear
                      </Pill>
                    </div>
                    <div className="mt-2 font-display text-lg text-ink">
                      {adidas.merchant} — {adidas.title} unlocked
                    </div>
                    <p className="mt-1.5 text-sm text-navy-600">
                      {adidas.why.join(" + ")}
                    </p>
                  </motion.div>
                )}
              </Card>
            </div>

            <Card className="mt-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionLabel>Behavior engine</SectionLabel>
                {stage === "idle" && (
                  <button
                    onClick={handleAnalyze}
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                  >
                    <Brain size={15} />
                    Analyze Behavior
                  </button>
                )}
                {stage === "analyzing" && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-navy-600">
                    <Loader2 size={15} className="animate-spin" />
                    Analyzing...
                  </span>
                )}
                {stage === "done" && (
                  <button
                    onClick={handleAnalyze}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 hover:border-navy-500/40"
                  >
                    Run again
                  </button>
                )}
              </div>

              {error && <p className="mt-3 text-sm text-amber-600">{error}</p>}

              {stage !== "idle" && result && (
                <div className="mt-4 space-y-2 border-t border-line pt-4">
                  <AnimatePresence>
                    {result.trace
                      .slice(0, stage === "done" ? result.trace.length : visibleSteps)
                      .map((step) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-sm text-navy-700"
                        >
                          <CheckCircle2 size={14} className="shrink-0 text-positive-600" />
                          {step}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              )}

              <p className="mt-4 text-xs leading-relaxed text-navy-500">
                Every match is explainable and rules-based — driven by this
                customer&rsquo;s own transaction history, never a black-box
                prediction.
              </p>
            </Card>

            {stage === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Continue to Customer Wallet <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

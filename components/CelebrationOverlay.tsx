"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-context";
import { INITIAL_REWARDS } from "@/lib/mock-data";

export function CelebrationOverlay() {
  const { celebration, clearCelebration, rewards } = useDemo();

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => clearCelebration(), 5200);
    return () => clearTimeout(timer);
  }, [celebration, clearCelebration]);

  const unlockedReward = celebration
    ? rewards.find((r) => r.id === celebration.unlockedRewardId) ??
      INITIAL_REWARDS.find((r) => r.id === celebration.unlockedRewardId)
    : null;

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/55 backdrop-blur-sm px-4"
          onClick={clearCelebration}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-xl2 border border-line bg-white p-8 text-center shadow-pop"
          >
            <button
              onClick={clearCelebration}
              className="absolute right-4 top-4 text-navy-400 hover:text-navy-700"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-positive-50 text-positive-600 pulse-ring">
              <PartyPopper size={26} />
            </div>

            <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-positive-600">
              Monthly Target Achieved
            </div>
            <h3 className="mt-2 font-display text-2xl text-ink">
              Nice work staying on track.
            </h3>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 flex items-center justify-center gap-2 font-display text-4xl text-navy-900"
            >
              <Sparkles size={22} className="text-amber-500" />
              +{celebration.pointsAwarded} points
            </motion.div>

            <div className="mt-3 text-sm text-navy-500">
              Streak is now{" "}
              <span className="font-semibold text-navy-800">
                {celebration.newStreak} months
              </span>
            </div>

            {unlockedReward && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-left"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                  Reward unlocked
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="font-display text-lg text-ink">
                    {unlockedReward.merchant}
                  </div>
                  <div className="font-display text-lg text-amber-600">
                    {unlockedReward.title}
                  </div>
                </div>
                <p className="mt-1 text-sm text-navy-600">
                  {unlockedReward.reason}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-context";

export function EmergencyBanner() {
  const { emergencyActive, clearEmergencyBanner } = useDemo();

  useEffect(() => {
    if (!emergencyActive) return;
    const timer = setTimeout(() => clearEmergencyBanner(), 7000);
    return () => clearTimeout(timer);
  }, [emergencyActive, clearEmergencyBanner]);

  return (
    <AnimatePresence>
      {emergencyActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mx-6 mt-4 flex items-start gap-3 rounded-xl border border-positive-100 bg-positive-50 px-4 py-3 lg:mx-8">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-positive-600"
            />
            <div className="flex-1 text-sm">
              <div className="font-semibold text-positive-600">
                Protected expense detected — €450, Healthcare.
              </div>
              <div className="mt-0.5 text-navy-600">
                This transaction is excluded from discretionary-behavior
                evaluation. Your MERIT Status and streak are unaffected.
              </div>
            </div>
            <button
              onClick={clearEmergencyBanner}
              className="text-positive-600/60 hover:text-positive-600"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

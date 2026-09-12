"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-context";

export function TransferBanner() {
  const { transferBannerActive, clearTransferBanner } = useDemo();

  useEffect(() => {
    if (!transferBannerActive) return;
    const timer = setTimeout(() => clearTransferBanner(), 7000);
    return () => clearTimeout(timer);
  }, [transferBannerActive, clearTransferBanner]);

  return (
    <AnimatePresence>
      {transferBannerActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mx-6 mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 lg:mx-8">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="flex-1 text-sm">
              <div className="font-semibold text-amber-600">
                Internal transfer detected — €500 between your own accounts.
              </div>
              <div className="mt-0.5 text-navy-600">
                Excluded from behavioral progress. Moving money between your
                own accounts doesn&rsquo;t count as savings behavior.
              </div>
            </div>
            <button
              onClick={clearTransferBanner}
              className="text-amber-600/60 hover:text-amber-600"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

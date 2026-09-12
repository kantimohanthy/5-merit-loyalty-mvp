"use client";

import { useDemo } from "@/lib/demo-context";
import { Pill } from "@/components/ui";

/**
 * Small, honest signal for exactly the question a technical judge will ask:
 * "is this actually hitting your backend right now, or am I looking at
 * fallback data?" Backed by state the pipeline already returns — this just
 * renders it.
 */
export function ConnectionStatus({ dark = false }: { dark?: boolean }) {
  const { loading, hydrated } = useDemo();

  if (loading) return null;

  if (hydrated) {
    return (
      <Pill tone="positive" className={dark ? "border-white/10 bg-white/10 text-positive-400" : ""}>
        <span className="h-1.5 w-1.5 rounded-full bg-positive-500" />
        Live pipeline
      </Pill>
    );
  }

  return (
    <Pill tone="amber" className={dark ? "border-white/10 bg-white/10 text-amber-400" : ""}>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Demo fallback active
    </Pill>
  );
}

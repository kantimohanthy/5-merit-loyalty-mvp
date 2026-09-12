"use client";

import { PlayCircle, HeartPulse, RotateCcw } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Button } from "./ui";

export function DemoControls({ compact = false }: { compact?: boolean }) {
  const { simulateMonth, simulateEmergency, reset, monthSimulated } =
    useDemo();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={simulateMonth} variant="primary" className={compact ? "px-4 py-2" : ""}>
        <PlayCircle size={16} />
        Simulate Month
      </Button>
      <Button onClick={simulateEmergency} variant="secondary" className={compact ? "px-4 py-2" : ""}>
        <HeartPulse size={16} />
        Simulate Emergency Expense
      </Button>
      {monthSimulated && (
        <button
          onClick={reset}
          title="Reset demo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-cream hover:text-navy-700"
        >
          <RotateCcw size={15} />
        </button>
      )}
    </div>
  );
}

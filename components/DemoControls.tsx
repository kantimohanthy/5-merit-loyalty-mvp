"use client";

import { useState } from "react";
import { PlayCircle, HeartPulse, RotateCcw, Loader2 } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { Button } from "./ui";

export function DemoControls({ compact = false }: { compact?: boolean }) {
  const { simulateMonth, simulateEmergency, reset, monthSimulated } =
    useDemo();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSimulateMonth = async () => {
    setLoadingAction("month");
    try {
      await simulateMonth();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSimulateEmergency = async () => {
    setLoadingAction("emergency");
    try {
      await simulateEmergency();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReset = async () => {
    setLoadingAction("reset");
    try {
      await reset();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={handleSimulateMonth}
        disabled={loadingAction !== null}
        variant="primary"
        className={compact ? "px-4 py-2" : ""}
      >
        {loadingAction === "month" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <PlayCircle size={16} />
        )}
        Simulate Month
      </Button>
      <Button
        onClick={handleSimulateEmergency}
        disabled={loadingAction !== null}
        variant="secondary"
        className={compact ? "px-4 py-2" : ""}
      >
        {loadingAction === "emergency" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <HeartPulse size={16} />
        )}
        Simulate Emergency Expense
      </Button>
      {monthSimulated && (
        <button
          onClick={handleReset}
          disabled={loadingAction !== null}
          title="Reset demo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-cream hover:text-navy-700 disabled:opacity-50"
        >
          <RotateCcw size={15} className={loadingAction === "reset" ? "animate-spin" : ""} />
        </button>
      )}
    </div>
  );
}


import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-line bg-white/90 shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-500/70">
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "amber" | "navy";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-cream text-navy-700 border-line",
    positive: "bg-positive-50 text-positive-600 border-positive-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    navy: "bg-navy-900 text-white border-navy-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "navy",
  className,
  trackClassName,
}: {
  value: number; // 0-1
  tone?: "navy" | "positive" | "amber";
  className?: string;
  trackClassName?: string;
}) {
  const tones: Record<string, string> = {
    navy: "bg-navy-800",
    positive: "bg-positive-500",
    amber: "bg-amber-500",
  };
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-line/70",
        trackClassName
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          tones[tone],
          className
        )}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

export function StatBlock({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-1.5 font-display text-3xl text-ink">{value}</div>
      {sub && <div className="mt-1 text-sm text-navy-500">{sub}</div>}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "amber";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-navy-900 text-white hover:bg-navy-800 shadow-card disabled:opacity-50",
    secondary:
      "bg-white text-navy-900 border border-line hover:border-navy-500/40 hover:bg-cream",
    ghost: "bg-transparent text-navy-700 hover:bg-cream",
    amber:
      "bg-amber-500 text-white hover:bg-amber-600 shadow-card disabled:opacity-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

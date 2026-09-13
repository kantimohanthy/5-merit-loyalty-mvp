"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Receipt,
  Gift,
  Award,
  Sparkles,
  RotateCcw,
  Landmark,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { useGCore } from "@/lib/gcore-context";
import { cn } from "@/lib/utils";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { TransferBanner } from "@/components/TransferBanner";
import { DemoControls } from "@/components/DemoControls";
import { Pill } from "@/components/ui";

const ECOSYSTEM_TABS = [
  { href: "/ecosystem", label: "Overview", icon: LayoutDashboard },
  { href: "/ecosystem/goals", label: "Goals", icon: Target },
  { href: "/ecosystem/activity", label: "Activity", icon: Receipt },
  { href: "/ecosystem/rewards", label: "Rewards", icon: Gift },
  { href: "/ecosystem/passport", label: "G-Pass", icon: Award },
];

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { celebration, clearCelebration, emergencyActive, transferBannerActive, reset } = useDemo();
  const { account } = useGCore();

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Celebration Overlay */}
      <CelebrationOverlay />

      {/* Top Header */}
      <header className="border-b border-line bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
                M
              </span>
              <span className="font-display text-base sm:text-lg text-ink font-bold tracking-tight">Merit &bull; G-Core</span>
            </Link>
            {account && (
              <Pill tone="navy" className="py-0.5 text-[10px] sm:text-[11px] shrink-0">
                <Sparkles size={11} className="mr-1 text-amber-400" />
                {account.tierLabel}
              </Pill>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
            <DemoControls compact />
            <Link
              href="/bank"
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-cream shrink-0"
            >
              <Landmark size={13} />
              <span>XYZ Bank</span>
            </Link>
          </div>
        </div>

        {/* 5-Tab Navigation Bar (Horizontally Scrollable on Mobile) */}
        <div className="border-t border-line/60 bg-paper/80 backdrop-blur-xs overflow-hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-start gap-1 px-3 sm:px-6 overflow-x-auto whitespace-nowrap scrollbar-none flex-nowrap py-0.5">
            {ECOSYSTEM_TABS.map((tab) => {
              const active =
                tab.href === "/ecosystem"
                  ? pathname === "/ecosystem"
                  : pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 border-b-2 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold transition-colors shrink-0 flex-none",
                    active
                      ? "border-navy-900 text-navy-900 bg-white/70"
                      : "border-transparent text-navy-600 hover:text-navy-900 hover:bg-cream/40"
                  )}
                >
                  <Icon size={15} strokeWidth={2} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        {emergencyActive && <EmergencyBanner />}
        {transferBannerActive && <TransferBanner />}
        {children}
      </main>
    </div>
  );
}

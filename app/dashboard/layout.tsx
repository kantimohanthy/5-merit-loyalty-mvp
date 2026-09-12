"use client";

import { SidebarNav } from "@/components/SidebarNav";
import { MobileNav } from "@/components/MobileNav";
import { DemoControls } from "@/components/DemoControls";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { TransferBanner } from "@/components/TransferBanner";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useDemo } from "@/lib/demo-context";
import { Pill } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer, status } = useDemo();

  return (
    <div className="flex min-h-screen bg-paper">
      <SidebarNav />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileNav />
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white/70 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 font-display text-sm text-navy-900" style={{ backgroundColor: "#e9e4d8" }}>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="text-sm font-semibold text-ink leading-tight">
                {customer.name}
              </div>
              <div className="text-xs text-navy-500 leading-tight">
                {customer.profile}
              </div>
            </div>
            <Pill tone="navy" className="ml-2">
              {status.tier}
            </Pill>
            <ConnectionStatus />
          </div>
          <DemoControls />
        </header>
        <EmergencyBanner />
        <TransferBanner />
        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
      <CelebrationOverlay />
    </div>
  );
}

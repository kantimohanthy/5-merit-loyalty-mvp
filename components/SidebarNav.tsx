"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Receipt,
  Gift,
  ShieldCheck,
  Landmark,
  ArrowLeft,
  Brain,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/plan", label: "My Plan", icon: Target },
  { href: "/dashboard/activity", label: "Activity", icon: Receipt },
  { href: "/dashboard/rewards", label: "Rewards", icon: Gift },
  { href: "/dashboard/status", label: "Status", icon: ShieldCheck },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper px-4 py-6 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
          M
        </span>
        <span className="font-display text-lg text-ink">Merit</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-900 text-white"
                  : "text-navy-700 hover:bg-cream"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 h-px bg-line" />

        <Link
          href="/demo"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-cream"
        >
          <Brain size={17} strokeWidth={2} />
          Intelligence
        </Link>
        <Link
          href="/bank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-cream"
        >
          <Landmark size={17} strokeWidth={2} />
          Bank Demo
        </Link>
        <Link
          href="/ecosystem"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-cream"
        >
          <Globe2 size={17} strokeWidth={2} />
          G-Core Ecosystem
        </Link>
      </nav>

      <Link
        href="/"
        className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-navy-500 hover:text-navy-800"
      >
        <ArrowLeft size={14} />
        Back to overview site
      </Link>
    </aside>
  );
}

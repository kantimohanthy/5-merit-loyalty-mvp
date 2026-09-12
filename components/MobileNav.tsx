"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/plan", label: "My Plan" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/rewards", label: "Rewards" },
  { href: "/dashboard/status", label: "Status" },
  { href: "/bank", label: "Bank Demo" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-line bg-paper px-4 py-2 lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-navy-900 text-white"
                : "bg-cream text-navy-600"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

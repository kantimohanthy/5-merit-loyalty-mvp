"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Receipt,
  Grid,
  Menu,
  X,
  LogOut,
  MapPin,
  HelpCircle,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";

function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface BankSidebarProps {
  onNavigateToTransactions?: () => void;
}

export function BankSidebar({ onNavigateToTransactions }: BankSidebarProps) {
  const router = useRouter();
  const { customer, reset } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const greeting = getGreetingTime();
  const customerName = customer?.name || "Customer";
  const customerInitials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleSignOut = () => {
    if (reset) {
      reset();
    }
    router.push("/");
  };

  const navItems = [
    { label: "Products", icon: CreditCard, href: "#accounts" },
    {
      label: "Transactions",
      icon: Receipt,
      href: "#transactions",
      onClick: onNavigateToTransactions,
    },
    { label: "Applications", icon: Grid, href: "#applications" },
    { label: "Full Menu", icon: Menu, href: "#menu" },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="flex items-center justify-between border-b border-xyz-border bg-xyz-sidebar-bg px-4 py-3 sm:hidden text-xyz-sidebar-ink z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-xyz-accent font-bold text-white text-xs">
            XYZ
          </div>
          <span className="font-bold text-base text-white tracking-tight">XYZ Bank</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded p-1.5 text-xyz-sidebar-ink hover:bg-xyz-primary-dark"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-xyz-ink/60 backdrop-blur-xs sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-xyz-sidebar-bg text-xyz-sidebar-ink transition-transform duration-200 ease-in-out sm:sticky sm:top-0 sm:h-screen sm:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* XYZ Bank Brand Header */}
        <div className="flex items-center gap-3 border-b border-xyz-primary/40 px-6 py-5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-xyz-accent font-bold text-white text-sm shadow-xs">
            XYZ
          </div>
          <div>
            <div className="font-bold text-lg text-white tracking-tight leading-none">
              XYZ Bank
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-xyz-sidebar-ink/70">
              <ShieldCheck size={11} className="text-emerald-400" /> Secure Online Banking
            </div>
          </div>
        </div>

        {/* User Block at Top */}
        <div className="border-b border-xyz-primary/30 bg-xyz-primary-dark/40 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-xyz-accent/20 border border-xyz-accent/40 font-bold text-white text-sm">
              {customerInitials || <User size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider text-xyz-sidebar-ink/60 font-medium truncate">
                {greeting}
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {customerName}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List & Account Summary */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-xyz-sidebar-ink/90 hover:bg-xyz-primary-dark hover:text-white transition-colors"
                >
                  <Icon size={18} className="text-xyz-accent shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}

            {/* G-Core Network Shortcut */}
            <div className="pt-2">
              <Link
                href="/ecosystem"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg border border-xyz-accent/30 bg-xyz-primary/40 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-xyz-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-400 animate-pulse" />
                  G-Core Ecosystem
                </span>
                <span className="rounded bg-xyz-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  New
                </span>
              </Link>
            </div>
          </nav>

          {/* Account Summary Mini-Card */}
          <div className="rounded-xl border border-xyz-primary/30 bg-xyz-primary-dark/50 p-3.5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-xyz-sidebar-ink/60">
              Account Summary
            </div>
            <div className="text-xs font-medium text-white/90">
              Member since {customer?.memberSince || "Mar 2025"}
            </div>
            <div className="text-[11px] text-xyz-sidebar-ink/70">
              1 active checking account
            </div>
          </div>
        </div>

        {/* Sidebar Footer Block (Pinned at Bottom) */}
        <div className="mt-auto border-t border-xyz-primary/30 p-4 space-y-1 shrink-0">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-xyz-sidebar-ink/80 hover:bg-xyz-primary-dark hover:text-white transition-colors"
          >
            <LogOut size={16} className="text-rose-400 shrink-0" />
            <span>Sign Out</span>
          </button>
          <a
            href="#branch"
            onClick={(e) => e.preventDefault()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-xyz-sidebar-ink/70 hover:bg-xyz-primary-dark hover:text-white transition-colors"
          >
            <MapPin size={16} className="text-xyz-sidebar-ink/50 shrink-0" />
            <span>Nearest Branch</span>
          </a>
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-xyz-sidebar-ink/70 hover:bg-xyz-primary-dark hover:text-white transition-colors"
          >
            <HelpCircle size={16} className="text-xyz-sidebar-ink/50 shrink-0" />
            <span>Help &amp; Support</span>
          </a>

          {/* Cosmetic Divider & Version Footer */}
          <div className="mt-3 pt-3 border-t border-xyz-primary/20 flex items-center justify-between text-[10px] text-xyz-sidebar-ink/50 font-medium">
            <span>XYZ Bank Online</span>
            <span>v2026</span>
          </div>
        </div>
      </aside>
    </>
  );
}

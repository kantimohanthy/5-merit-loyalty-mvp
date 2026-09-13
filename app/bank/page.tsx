"use client";
// XYZ Bank Mobile Dashboard Page - Updated 2026-09-13T11:02:00Z

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Send,
  Receipt,
  Shield,
  HelpCircle,
  Building2,
  ArrowRightLeft,
  Repeat,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { formatEuro } from "@/lib/utils";
import { BankSidebar } from "@/components/bank/BankSidebar";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const CAROUSEL_OFFERS = [
  {
    title: "XYZ High-Yield Savings Account",
    desc: "Earn up to 3.85% APY with no monthly maintenance fees or minimum balance requirements.",
    badge: "Special Savings Rate",
    cta: "Explore Savings Options",
  },
  {
    title: "Personal Fixed-Rate Loan",
    desc: "Borrow up to €15,000 with flexible payback terms and rate discounts for automated payments.",
    badge: "Low Rates Available",
    cta: "Calculate Monthly Rate",
  },
  {
    title: "XYZ World Elite Platinum",
    desc: "Enjoy zero foreign transaction fees, complimentary airport lounge passes, and 24/7 concierge.",
    badge: "Premium Banking",
    cta: "View Card Eligibility",
  },
];

export default function PlainXYZBankDashboard() {
  const router = useRouter();
  const { customer, plan, transactions, status } = useDemo();
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const txnSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const popupDismissed = sessionStorage.getItem("gcore_popup_seen");
    if (!popupDismissed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("gcore_popup_seen", "true");
  };

  const handleActivateGCore = () => {
    sessionStorage.setItem("gcore_popup_seen", "true");
    router.push("/ecosystem");
  };

  const scrollToTransactions = () => {
    txnSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_OFFERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_OFFERS.length) % CAROUSEL_OFFERS.length);
  };

  // Derive plain banking balance from monthly plan
  const currentBalance = plan.income - plan.fixedObligations;
  const availableBalance = currentBalance - plan.discretionarySpent;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-xyz-surface text-xyz-ink w-full max-w-full overflow-x-hidden">
      {/* Sidebar Component (Includes Compact Top Header on < lg, Hidden Sidebar Drawer on < lg when closed, Sticky Sidebar on >= lg) */}
      <BankSidebar onNavigateToTransactions={scrollToTransactions} />

      {/* Main Content Area: 100% width on mobile, zero left margin or padding offsets */}
      <div className="flex min-h-screen flex-1 flex-col min-w-0 w-full max-w-full">
        {/* Desktop Top Header / Search Row (HIDDEN ON MOBILE < lg) */}
        <header className="hidden lg:block border-b border-xyz-border bg-white px-6 py-3.5 shadow-2xs">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xyz-ink-soft/50"
              />
              <input
                type="text"
                readOnly
                placeholder="Search XYZ Bank Online..."
                className="w-full rounded-lg border border-xyz-border bg-xyz-surface pl-10 pr-4 py-2 text-xs text-xyz-ink placeholder:text-xyz-ink-soft/60 focus:outline-none focus:border-xyz-accent cursor-pointer"
              />
            </div>

            {/* Account Tier Badge & G-Core Quick Link */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-xyz-border bg-xyz-surface px-3 py-1 text-xs font-medium text-xyz-ink-soft">
                <Shield size={13} className="text-xyz-accent" />
                <span>
                  Tier: <strong className="text-xyz-ink font-semibold">{status.tier} Member</strong>
                </span>
              </div>

              <Link
                href="/ecosystem"
                className="inline-flex items-center gap-1.5 rounded-full border border-xyz-accent/30 bg-xyz-accent-soft px-3.5 py-1.5 text-xs font-semibold text-xyz-primary hover:bg-xyz-accent/15 transition-colors shadow-2xs"
              >
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
                <span>G-Core</span>
                <span className="rounded bg-xyz-primary px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                  New
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-xyz-ink-soft font-semibold">
                Online Banking &bull; Personal Account
              </div>
              <h1 className="mt-1 text-xl sm:text-2xl font-bold text-xyz-ink">
                {greeting()}, {customer.name.split(" ")[0]}.
              </h1>
            </div>
            <div className="text-[11px] sm:text-xs text-xyz-ink-soft font-medium flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-600 shrink-0" />
              <span>Last login: Today, 09:42 AM</span>
            </div>
          </div>

          {/* Accounts & Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* My Accounts Card (FULL WIDTH ON MOBILE) */}
            <div id="accounts" className="w-full max-w-none rounded-xl border border-xyz-border bg-xyz-card p-4 sm:p-6 shadow-2xs">
              <div className="border-b border-xyz-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-xyz-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-xyz-primary border border-xyz-accent/20">
                    Checking Account
                  </span>
                  <span className="text-xs font-mono text-xyz-ink-soft font-semibold">
                    *4821
                  </span>
                </div>

                <div className="mt-3 font-display text-3xl font-bold text-xyz-ink tracking-tight">
                  {formatEuro(availableBalance)}
                </div>
                <div className="mt-1 text-xs text-xyz-ink-soft font-medium">
                  Total ledger balance: <span className="font-semibold text-xyz-ink">{formatEuro(currentBalance)}</span>
                </div>

                {/* Account Action Buttons: Horizontal Grid [ All Accounts ] [ Account Activity ] on Mobile */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center gap-1 rounded-lg border border-xyz-border bg-xyz-surface px-3 py-2 text-xs font-semibold text-xyz-ink hover:bg-xyz-accent-soft hover:text-xyz-primary transition-colors"
                  >
                    All Accounts
                  </button>
                  <button
                    onClick={scrollToTransactions}
                    className="flex items-center justify-center gap-1 rounded-lg bg-xyz-primary px-3 py-2 text-xs font-semibold text-white hover:bg-xyz-primary-dark transition-colors shadow-2xs"
                  >
                    Account Activity
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div ref={txnSectionRef} id="transactions" className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                    Recent Transactions
                  </span>
                  <span className="text-xs text-xyz-ink-soft/70">Showing last 5</span>
                </div>

                <div className="divide-y divide-xyz-border/60 border-t border-b border-xyz-border">
                  {recentTransactions.map((txn) => {
                    const isInflow = txn.amount > 0;
                    return (
                      <div
                        key={txn.id}
                        className="flex items-start justify-between gap-4 py-3 px-1 text-sm hover:bg-xyz-surface transition-colors"
                      >
                        <div className="min-w-0 flex-1 break-words">
                          <div className="font-medium text-xyz-ink truncate">{txn.merchant}</div>
                          <div className="text-xs text-xyz-ink-soft">
                            {new Date(txn.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div
                          className={`shrink-0 text-right font-semibold font-mono text-sm ${
                            isInflow ? "text-emerald-600" : "text-xyz-ink"
                          }`}
                        >
                          {isInflow ? `+${formatEuro(txn.amount)}` : formatEuro(txn.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* My Credit Cards Card (FULL WIDTH ON MOBILE) */}
            <div id="cards" className="w-full max-w-none flex flex-col justify-between rounded-xl border border-xyz-border bg-xyz-card p-4 sm:p-6 shadow-2xs">
              <div>
                <div className="flex items-center justify-between border-b border-xyz-border pb-4">
                  <h2 className="font-bold text-lg text-xyz-ink">My Credit Cards</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    Standard Offers
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-xyz-ink-soft leading-relaxed">
                    Boost your purchasing power with an XYZ Bank Credit Card. Enjoy competitive APRs, flexible repayment schedules, and worldwide acceptance.
                  </p>

                  {/* Decorative Card Graphic */}
                  <div className="mt-5 relative overflow-hidden rounded-xl bg-gradient-to-br from-xyz-primary-dark via-xyz-primary to-xyz-accent p-5 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider">
                        XYZ Bank Platinum
                      </span>
                      <CreditCard size={20} className="text-xyz-accent-soft" />
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-6 w-8 rounded bg-amber-400/80 border border-amber-300" />
                      <div className="h-4 w-4 rounded-full bg-white/20" />
                    </div>

                    <div className="mt-4 font-mono text-sm tracking-widest text-white/90">
                      •••• •••• •••• 8912
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-xyz-accent-soft">
                      <span>VALTHRU 12/28</span>
                      <span className="font-semibold uppercase tracking-wider">VISA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-xyz-accent bg-xyz-accent-soft py-2.5 text-xs font-semibold text-xyz-primary hover:bg-xyz-accent hover:text-white transition-colors"
                >
                  Apply for a Card <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Shortcuts Row */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
              Quick Shortcuts
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 md:grid-cols-5">
              {[
                { label: "My Assets", icon: Building2 },
                { label: "Recent Transactions", icon: Receipt, action: scrollToTransactions },
                { label: "Money Transfer", icon: Send },
                { label: "Between My Accounts", icon: Repeat },
                { label: "Registered Transactions", icon: CheckSquare },
              ].map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.label}
                    onClick={shortcut.action || (() => {})}
                    className="flex flex-col items-center justify-center rounded-xl border border-xyz-border bg-xyz-card p-3.5 sm:p-4 text-center hover:border-xyz-accent hover:bg-xyz-accent-soft/50 transition-all shadow-2xs group"
                  >
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-xyz-surface text-xyz-primary group-hover:bg-xyz-primary group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-xyz-ink group-hover:text-xyz-primary transition-colors">
                      {shortcut.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Promo Carousel */}
          <div className="rounded-xl border border-xyz-border bg-xyz-card p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                Featured Bank Offers
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="rounded-lg border border-xyz-border p-1.5 text-xyz-ink-soft hover:bg-xyz-surface hover:text-xyz-ink"
                  aria-label="Previous Offer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="rounded-lg border border-xyz-border p-1.5 text-xyz-ink-soft hover:bg-xyz-surface hover:text-xyz-ink"
                  aria-label="Next Offer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative min-h-[100px] rounded-lg border border-xyz-border bg-xyz-surface p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-xyz-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {CAROUSEL_OFFERS[currentSlide].badge}
                </span>
                <span className="text-xs text-xyz-ink-soft/70">
                  Offer {currentSlide + 1} of {CAROUSEL_OFFERS.length}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-base text-xyz-ink">
                  {CAROUSEL_OFFERS[currentSlide].title}
                </h3>
                <p className="mt-1 text-xs text-xyz-ink-soft max-w-3xl">
                  {CAROUSEL_OFFERS[currentSlide].desc}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {}}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-xyz-primary hover:text-xyz-primary-dark"
                >
                  {CAROUSEL_OFFERS[currentSlide].cta} <ArrowRight size={13} />
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1.5">
                  {CAROUSEL_OFFERS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? "w-6 bg-xyz-primary" : "w-2 bg-xyz-border"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-xyz-border bg-white px-6 py-4 text-center text-xs text-xyz-ink-soft/70">
          &copy; 2026 XYZ Financial Corporation. Member FDIC. Equal Housing Lender.
        </footer>
      </div>

      {/* Campaign Popup Modal (Appears after ~4.5s) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-xyz-ink/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-xyz-border bg-white p-7 shadow-2xl">
            {/* Top Decorative Ambient Accent Glow */}
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400/30 to-xyz-accent/20 blur-xl pointer-events-none" />

            <button
              onClick={handleDismissPopup}
              className="absolute right-4 top-4 rounded-full p-1.5 text-xyz-ink-soft/60 hover:bg-xyz-surface hover:text-xyz-ink transition-colors z-10"
              aria-label="Dismiss Popup"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-xyz-primary text-white shadow-md">
              <Sparkles size={24} className="text-amber-400 animate-pulse" />
            </div>

            <div className="mt-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-xyz-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-xyz-primary border border-xyz-accent/30">
                <Sparkles size={11} className="text-amber-500" />
                Network Partner Opportunity
              </div>
              <h2 className="mt-3 text-xl font-bold text-xyz-ink tracking-tight leading-snug">
                Turn financial habits into portable network rewards.
              </h2>
              <p className="mt-2 text-xs text-xyz-ink-soft leading-relaxed">
                Connect your XYZ Bank account to G-Core to build your portable financial status and unlock exclusive cross-bank rewards.
              </p>
            </div>

            {/* Value Proposition Highlights */}
            <div className="mt-4 space-y-2 border-t border-b border-xyz-border py-3.5 text-xs text-xyz-ink font-medium">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Pseudonymous G-Pass ID &bull; Zero transaction details leave the bank</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-xyz-accent" />
                <span>Earn status from healthy habits, not just high balances</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleActivateGCore}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-xyz-primary py-3 text-xs font-bold text-white shadow-md hover:bg-xyz-primary-dark transition-colors"
              >
                Activate G-Core <ArrowRight size={14} />
              </button>
              <button
                onClick={handleDismissPopup}
                className="rounded-xl border border-xyz-border bg-white px-4 py-3 text-xs font-semibold text-xyz-ink-soft hover:bg-xyz-surface transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

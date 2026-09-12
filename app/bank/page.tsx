"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Send,
  Receipt,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { formatEuro } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function PlainXYZBankDashboard() {
  const router = useRouter();
  const { customer, plan, transactions, status } = useDemo();
  const [showPopup, setShowPopup] = useState(false);

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

  // Derive plain banking balance from monthly plan
  const currentBalance = plan.income - plan.fixedObligations;
  const availableBalance = currentBalance - plan.discretionarySpent;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* XYZ Bank Persistent Customer Top Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/bank" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 font-bold text-white text-base">
                XYZ
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">XYZ Bank</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/bank" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5">
                Overview
              </Link>
              <a href="#accounts" className="hover:text-slate-900 transition-colors">
                Accounts
              </a>
              <a href="#cards" className="hover:text-slate-900 transition-colors">
                Cards
              </a>
              <a href="#payments" className="hover:text-slate-900 transition-colors">
                Payments
              </a>
              <a href="#offers" className="hover:text-slate-900 transition-colors">
                Offers
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* G-Core Highlighted Nav Item */}
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors shadow-sm"
            >
              <Sparkles size={13} className="text-blue-600 animate-pulse" />
              G-Core
              <span className="rounded-full bg-blue-700 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase tracking-wider">
                New
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Online Banking &bull; Personal Account
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {greeting()}, {customer.name.split(" ")[0]}.
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-500 font-medium shadow-sm">
            <Shield size={14} className="text-slate-400" />
            <span>Account Tier: <strong className="text-slate-700 font-semibold">{status.tier} Member</strong></span>
          </div>
        </div>

        {/* Account Balance Card */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-medium text-slate-500">Everyday Checking (*4821)</div>
                <div className="mt-1 text-3xl font-bold text-slate-900">
                  {formatEuro(availableBalance)}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Total ledger balance: {formatEuro(currentBalance)}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <Send size={13} /> Transfer
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <Receipt size={13} /> Pay Bill
                </button>
              </div>
            </div>

            {/* Plain Unexplained Transaction Feed */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Transactions
                </span>
                <span className="text-xs text-slate-400">Showing last 5</span>
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {recentTransactions.map((txn) => {
                  const isInflow = txn.amount > 0;
                  return (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between py-3 px-1 text-sm hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{txn.merchant}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(txn.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div
                        className={`font-semibold font-mono text-sm ${
                          isInflow ? "text-emerald-600" : "text-slate-900"
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

          {/* Sidebar Quick Services */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Quick Actions
              </div>
              <div className="space-y-2 text-xs">
                <a href="#statements" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium">
                  <span>Download E-Statement</span>
                  <ArrowRight size={14} className="text-slate-400" />
                </a>
                <a href="#cards" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium">
                  <span>Manage Debit Card</span>
                  <CreditCard size={14} className="text-slate-400" />
                </a>
                <a href="#support" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium">
                  <span>Help &amp; Support</span>
                  <HelpCircle size={14} className="text-slate-400" />
                </a>
              </div>
            </div>

            {/* G-Core Network Promotion Card */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                <Sparkles size={14} className="text-blue-600" />
                G-Core Behavioral Loyalty
              </div>
              <h3 className="mt-2 font-bold text-sm text-slate-900">
                Turn healthy habits into network status.
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Connect your XYZ Bank account to G-Core to earn cross-bank rewards and portable status.
              </p>
              <button
                onClick={handleActivateGCore}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 py-2 text-xs font-semibold text-white shadow hover:bg-blue-800 transition-colors"
              >
                Explore G-Core Ecosystem <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Campaign Popup Modal (Appears after ~4.5s) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={handleDismissPopup}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Sparkles size={24} />
            </div>

            <div className="mt-4">
              <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
                New Network Partner Feature
              </span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Turn your financial habits into rewards.
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Set personalized goals, build your G-Status and unlock benefits based on how you manage your money &mdash; not simply how much you spend.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleActivateGCore}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-800 transition-colors"
              >
                Activate G-Core <ArrowRight size={14} />
              </button>
              <button
                onClick={handleDismissPopup}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
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

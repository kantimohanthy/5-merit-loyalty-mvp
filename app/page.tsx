"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, ShieldCheck, Lock, ArrowRight, CreditCard, Tag } from "lucide-react";

export default function XYZBankLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("alex.morgan@email.com");
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/bank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      {/* XYZ Bank Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-bold text-white text-lg">
              XYZ
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">XYZ Bank</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Lock size={12} className="text-emerald-600" /> 256-Bit Encrypted
            </span>
            <span>Customer Service: 1-800-555-0199</span>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Centered Login Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <Landmark size={24} />
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-1 text-xs text-slate-500">Sign in to your XYZ Online Banking account</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  User ID / Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter User ID"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter Password"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  Remember User ID
                </label>
                <a href="#forgot" className="text-blue-700 hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800 transition-colors"
              >
                Sign In <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>XYZ Bank Online Banking &bull; Official Portal</span>
            </div>
          </div>

          {/* Generic Bank Promotional Banners */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CreditCard size={14} className="text-blue-600" />
                Personal Loan Offer
              </div>
              <p className="mt-1 text-slate-500">Up to €10,000 with low fixed rates. Apply in 5 minutes online.</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Tag size={14} className="text-emerald-600" />
                5% Dining Cashback
              </div>
              <p className="mt-1 text-slate-500">Earn 5% cashback on restaurant purchases this quarter with XYZ Platinum.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">
        &copy; 2026 XYZ Financial Corporation. Member FDIC. Equal Housing Lender.
      </footer>
    </div>
  );
}

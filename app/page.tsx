"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  PhoneCall,
  Globe,
  CheckCircle2,
} from "lucide-react";

const APP_PROMOS = [
  {
    title: "Take XYZ Bank with you",
    subtitle: "Get the XYZ Mobile App for iOS and Android.",
    tag: "Mobile Banking",
  },
  {
    title: "Instant Push Alerts",
    subtitle: "Stay notified on every account transaction in real time.",
    tag: "Security Features",
  },
  {
    title: "Seamless Biometric Login",
    subtitle: "Access your accounts securely with Face ID or fingerprint.",
    tag: "Fast Access",
  },
];

export default function XYZBankLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");
  const [customerId, setCustomerId] = useState("alex.morgan@email.com");
  const [password, setPassword] = useState("••••••••••••");
  const [mobileVerification, setMobileVerification] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/bank");
  };

  const nextPromo = () => {
    setPromoIndex((prev) => (prev + 1) % APP_PROMOS.length);
  };

  const prevPromo = () => {
    setPromoIndex((prev) => (prev - 1 + APP_PROMOS.length) % APP_PROMOS.length);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-xyz-ink">
      {/* Top Thin White Bar */}
      <div className="border-b border-xyz-border bg-white px-6 py-1.5 text-xs text-xyz-ink-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-emerald-600" />
            <span className="font-medium">XYZ Bank Official Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 text-xyz-ink-soft/80">
              <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-xyz-primary">
                Security
              </a>
              <a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-xyz-primary">
                Help
              </a>
              <a href="#faq" onClick={(e) => e.preventDefault()} className="hover:text-xyz-primary">
                FAQ
              </a>
              <span className="flex items-center gap-1">
                <Globe size={12} /> English
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-xyz-ink">
              <PhoneCall size={12} className="text-xyz-accent" />
              <span>1-800-555-0199</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Row Below Top Bar */}
      <header className="border-b border-xyz-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-xyz-primary font-bold text-white text-lg shadow-xs">
              XYZ
            </div>
            <div>
              <span className="font-bold text-xl text-xyz-ink tracking-tight">XYZ Bank</span>
              <span className="block text-[11px] text-xyz-ink-soft font-medium">Online Banking</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-lg bg-xyz-surface px-3 py-1.5 text-xs text-xyz-ink-soft border border-xyz-border">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>256-Bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-110px)]">
        {/* Left Column (Solid --xyz-primary #0B3D91 Background, White Text) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-xyz-primary text-white p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Welcome to Online Banking
            </h1>
            <p className="mt-2 text-xs text-xyz-sidebar-ink/80 leading-relaxed">
              Access your personal accounts, make secure transfers, and manage your finances anytime, anywhere.
            </p>

            {/* Personal / Business Tabs */}
            <div className="mt-6 flex rounded-lg bg-xyz-primary-dark/60 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                  activeTab === "personal"
                    ? "bg-white text-xyz-primary shadow-xs"
                    : "text-xyz-sidebar-ink/80 hover:text-white"
                }`}
              >
                Personal Banking
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("business")}
                className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                  activeTab === "business"
                    ? "bg-white text-xyz-primary shadow-xs"
                    : "text-xyz-sidebar-ink/80 hover:text-white"
                }`}
              >
                Business Banking
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-xyz-sidebar-ink/90">
                  Customer ID / Username
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-xyz-accent"
                  placeholder="Enter your Customer ID"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-xyz-sidebar-ink/90">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-xyz-accent"
                  placeholder="Enter Password"
                />
              </div>

              {/* Mobile Verification Toggle */}
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xyz-sidebar-ink/90">
                  <input
                    type="checkbox"
                    checked={mobileVerification}
                    onChange={(e) => setMobileVerification(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-xyz-accent focus:ring-xyz-accent"
                  />
                  <span>Sign in with mobile verification</span>
                </label>
              </div>

              {/* Decorative CAPTCHA Block */}
              <div className="rounded-lg border border-white/15 bg-white/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-xyz-sidebar-ink/80 uppercase tracking-wider">
                    Security Verification
                  </span>
                  <span className="text-[10px] text-white/50">Cosmetic CAPTCHA</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Decorative Captcha Image Box */}
                  <div className="flex h-10 w-32 items-center justify-center rounded bg-xyz-primary-dark font-mono text-lg font-bold tracking-widest text-amber-300 select-none border border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                    <span className="relative z-10 rotate-[-3deg] skew-x-6">7 X K 9 P</span>
                  </div>
                  <input
                    type="text"
                    value={captchaCode}
                    onChange={(e) => setCaptchaCode(e.target.value)}
                    placeholder="Security code"
                    className="flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-xyz-accent"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-xyz-accent py-3 text-sm font-bold text-white shadow-md hover:bg-xyz-accent/90 transition-colors"
              >
                Continue <ArrowRight size={16} />
              </button>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs text-xyz-sidebar-ink/80 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-xyz-accent"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="hover:underline text-white font-medium">
                  Forgot password?
                </a>
              </div>
            </form>
          </div>

          {/* New to Digital Banking Card at Bottom */}
          <div className="mt-8 rounded-xl border border-white/15 bg-xyz-primary-dark/60 p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">New to digital banking?</div>
              <div className="text-[11px] text-xyz-sidebar-ink/70">Open an account online in 5 minutes.</div>
            </div>
            <button
              onClick={() => {}}
              className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors shrink-0"
            >
              Apply now
            </button>
          </div>
        </div>

        {/* Right Column (--xyz-surface #F4F6F9 Background) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-xyz-surface p-8 lg:p-12 flex flex-col justify-between">
          <div className="max-w-2xl mx-auto w-full space-y-8">
            {/* Mobile App Promo Card */}
            <div className="rounded-2xl border border-xyz-border bg-xyz-card p-6 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-xyz-accent-soft px-3 py-1 text-xs font-bold text-xyz-primary">
                  {APP_PROMOS[promoIndex].tag}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevPromo}
                    className="rounded p-1 text-xyz-ink-soft hover:bg-xyz-surface"
                    aria-label="Previous Promo"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextPromo}
                    className="rounded p-1 text-xyz-ink-soft hover:bg-xyz-surface"
                    aria-label="Next Promo"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-7">
                  <h3 className="font-bold text-xl text-xyz-ink">
                    {APP_PROMOS[promoIndex].title}
                  </h3>
                  <p className="mt-2 text-xs text-xyz-ink-soft leading-relaxed">
                    {APP_PROMOS[promoIndex].subtitle}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => {}}
                      className="rounded-lg bg-xyz-primary px-4 py-2 text-xs font-semibold text-white hover:bg-xyz-primary-dark transition-colors shadow-2xs"
                    >
                      Download App
                    </button>
                    <span className="text-[11px] text-xyz-ink-soft font-medium">iOS • Android</span>
                  </div>
                </div>

                {/* SVG Phone Illustration Shape */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="w-28 h-48 rounded-2xl border-4 border-xyz-sidebar-bg bg-xyz-primary-dark p-2 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                    {/* Screen Header Bar */}
                    <div className="flex justify-between items-center text-[8px] text-xyz-accent-soft">
                      <span>9:41</span>
                      <div className="w-8 h-1 rounded-full bg-white/30" />
                    </div>
                    {/* Screen Body Content */}
                    <div className="my-auto space-y-2 text-center">
                      <div className="mx-auto w-8 h-8 rounded-full bg-xyz-accent/30 flex items-center justify-center text-xyz-accent-soft">
                        <Smartphone size={16} />
                      </div>
                      <div className="text-[9px] font-bold text-white">XYZ Mobile</div>
                      <div className="text-[7px] text-xyz-accent-soft">Bank on the go</div>
                    </div>
                    {/* Home Indicator */}
                    <div className="mx-auto w-10 h-1 rounded-full bg-white/40 mb-0.5" />
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="mt-4 flex justify-center gap-1.5">
                {APP_PROMOS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromoIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      promoIndex === idx ? "w-5 bg-xyz-primary" : "w-1.5 bg-xyz-border"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Security Tip Rows */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-xyz-ink-soft">
                Security &amp; Protection Guidance
              </div>

              <div className="rounded-xl border border-xyz-border bg-xyz-card p-4 flex items-start gap-3 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                  <Lock size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-xyz-ink">Verify Official URL</div>
                  <p className="mt-0.5 text-xs text-xyz-ink-soft leading-relaxed">
                    Always check that your browser address bar shows the official URL before entering credentials.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-xyz-border bg-xyz-card p-4 flex items-start gap-3 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-xyz-accent-soft text-xyz-primary mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-xyz-ink">Privacy Protection</div>
                  <p className="mt-0.5 text-xs text-xyz-ink-soft leading-relaxed">
                    XYZ Bank staff will never ask for your password, PIN, or one-time verification codes via email, call, or SMS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-8 flex items-center justify-between text-xs text-xyz-ink-soft border-t border-xyz-border pt-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span className="font-semibold text-xyz-ink">Secured Connection</span>
            </div>
            <span>&copy; 2026 XYZ Financial Corporation</span>
          </div>
        </div>
      </main>
    </div>
  );
}

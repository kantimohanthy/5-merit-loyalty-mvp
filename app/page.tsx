import Link from "next/link";
import {
  ArrowRight,
  Users,
  Landmark,
  Store,
  Brain,
  Compass,
  Gift,
  Repeat2,
  Flame,
  Sparkles,
  ShieldCheck,
  Network,
} from "lucide-react";
import { Pill } from "@/components/ui";

const ACTORS = [
  {
    icon: Users,
    title: "Customer",
    body: "Build healthier financial behavior and unlock rewards that actually fit their life.",
  },
  {
    icon: Landmark,
    title: "Bank",
    body: "Build deeper relationships — stronger engagement, retention, and long-term customer value.",
  },
  {
    icon: Store,
    title: "Merchant",
    body: "Reach customers with greater relevance, at the moment a reward actually matters.",
  },
];

const STEPS = [
  {
    icon: Brain,
    title: "Understand",
    body: "Analyze financial behavior contextually, over months not moments.",
  },
  {
    icon: Compass,
    title: "Guide",
    body: "Create personalized goals based on the customer's own situation.",
  },
  {
    icon: Gift,
    title: "Reward",
    body: "Unlock points and relevant merchant benefits — never at random.",
  },
  {
    icon: Repeat2,
    title: "Retain",
    body: "Turn a single good month into a long-term banking relationship.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
              M
            </span>
            <span className="font-display text-lg text-ink">Merit</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy-700 sm:flex">
            <a href="#how" className="hover:text-ink">
              How it works
            </a>
            <Link href="/demo" className="hover:text-ink">
              Intelligence
            </Link>
            <Link href="/architecture" className="hover:text-ink">
              Architecture
            </Link>
            <Link href="/ecosystem" className="hover:text-ink">
              G-Core Network
            </Link>
            <Link href="/bank" className="hover:text-ink">
              Bank demo
            </Link>
          </nav>
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Experience the Demo <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="grain relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-fade-up">
            <Pill tone="navy">Behavioral banking loyalty infrastructure</Pill>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              Turn transactions into relationships.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-navy-600">
              MERIT transforms everyday financial behavior into personalized
              goals, relevant rewards, and long-term banking relationships.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Experience the Demo <ArrowRight size={15} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy-800 hover:border-navy-500/40"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="animate-fade-up rounded-xl2 border border-line bg-white p-5 shadow-pop">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-500/70">
                  Monthly plan
                </div>
                <div className="mt-1 font-display text-lg text-ink">
                  Alex Morgan
                </div>
              </div>
              <Pill tone="positive">On track</Pill>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-navy-500">
                  <span>Discretionary</span>
                  <span>€190 / €360</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line/70">
                  <div className="h-full w-[53%] rounded-full bg-navy-800" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-navy-500">
                  <span>Savings</span>
                  <span>€90 / €140</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line/70">
                  <div className="h-full w-[64%] rounded-full bg-positive-500" />
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-line bg-cream/60 p-3 text-center">
                <Flame size={14} className="mx-auto text-amber-500" />
                <div className="mt-1 font-display text-lg text-ink">5mo</div>
                <div className="text-[11px] text-navy-500">Streak</div>
              </div>
              <div className="rounded-lg border border-line bg-cream/60 p-3 text-center">
                <Sparkles size={14} className="mx-auto text-navy-700" />
                <div className="mt-1 font-display text-lg text-ink">2,500</div>
                <div className="text-[11px] text-navy-500">Points</div>
              </div>
              <div className="rounded-lg border border-line bg-cream/60 p-3 text-center">
                <ShieldCheck size={14} className="mx-auto text-navy-700" />
                <div className="mt-1 font-display text-lg text-ink">PLUS</div>
                <div className="text-[11px] text-navy-500">Tier</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ACTORS.map((a) => (
              <div
                key={a.title}
                className="rounded-xl2 border border-line bg-paper p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
                  <a.icon size={18} />
                </div>
                <div className="mt-4 font-display text-xl text-ink">
                  {a.title}
                </div>
                <p className="mt-1.5 text-sm text-navy-600">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <Pill>How it works</Pill>
          <h2 className="mt-4 font-display text-3xl text-ink lg:text-4xl">
            Transactions banks already have, turned into a relationship.
          </h2>
          <p className="mt-4 text-navy-600">
            Banks know what customers spend, but most loyalty systems still
            reward transactions rather than responsible financial behavior.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-xl2 border border-line bg-white p-6"
            >
              <div className="text-xs font-semibold text-navy-400">
                0{i + 1}
              </div>
              <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-navy-800">
                <s.icon size={18} />
              </div>
              <div className="mt-4 font-display text-lg text-ink">
                {s.title}
              </div>
              <p className="mt-1.5 text-sm text-navy-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-navy-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white">
                <Network size={12} />
                Network Effect
              </span>
              <h2 className="mt-4 font-display text-3xl lg:text-4xl">
                A flywheel between customers, banks and merchants.
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                One bank already gets standalone value. As more institutions
                participate, a customer&rsquo;s verified behavioral history
                becomes portable — a trust signal, not a transaction feed.
                Every additional bank makes the reward network more relevant
                for every existing customer.
              </p>
              <Link
                href="/architecture"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-white/90"
              >
                See the architecture <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ACTORS.map((a) => (
                <div
                  key={a.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <a.icon size={18} className="mx-auto text-white/80" />
                  <div className="mt-2 text-sm font-semibold">{a.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-display text-2xl leading-relaxed text-ink lg:text-3xl">
          &ldquo;We turn each customer&rsquo;s own financial patterns into
          personalized goals, meaningful rewards and a long-term
          financial-consistency status.&rdquo;
        </p>
        <p className="mt-6 text-navy-600">
          Banks gain stronger engagement and retention, customers build
          healthier financial habits, and merchants reach customers with
          rewards they actually value.
        </p>
        <p className="mt-4 font-display text-lg text-navy-800">
          From loyalty layer to behavioral financial infrastructure.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Experience the Demo <ArrowRight size={15} />
          </Link>
          <Link
            href="/bank"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy-800 hover:border-navy-500/40"
          >
            View Bank Dashboard
          </Link>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-navy-400">
        Merit — behavioral banking loyalty infrastructure. Built for Adria
        Hack Sarajevo. Demo data is simulated.
      </footer>
    </div>
  );
}

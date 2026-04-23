import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Flame,
  Skull,
  CheckCircle2,
  Terminal,
  Zap,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Lock,
  Sparkles,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Send,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { TermsPage, PrivacyPage, RefundPage, ContactPage } from "./LegalPages";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;
const API = `${BACKEND_URL}/api`;

// ============ UI PRIMITIVES ============
const BrutalButton = ({ children, variant = "primary", className = "", ...props }) => {
  const base =
    "uppercase font-bold tracking-wider px-6 py-3 transition-all duration-150 inline-flex items-center gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-[#0f0f0f] text-[#ff4500] border-2 border-[#ff4500] shadow-[4px_4px_0px_0px_#ff4500] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#ff4500] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#ff4500]"
      : variant === "solid"
      ? "bg-[#ff4500] text-black border-2 border-[#ff4500] shadow-[4px_4px_0px_0px_#f3f4f6] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#f3f4f6]"
      : "bg-[#18181b] text-white border-2 border-[#3f3f46] shadow-[4px_4px_0px_0px_#3f3f46] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#ff4500] hover:border-[#ff4500]";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

const BrutalInput = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`bg-[#0f0f0f] text-white border-2 border-[#3f3f46] p-4 font-mono focus:border-[#ff4500] focus:ring-0 focus:outline-none placeholder:text-[#52525b] w-full ${className}`}
    {...props}
  />
));

const BrutalTextarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`bg-[#0f0f0f] text-white border-2 border-[#3f3f46] p-4 font-mono focus:border-[#ff4500] focus:ring-0 focus:outline-none placeholder:text-[#52525b] w-full ${className}`}
    {...props}
  />
));

const SectionLabel = ({ num, children }) => (
  <div className="flex items-center gap-3 mb-6" data-testid={`section-label-${num}`}>
    <span className="bg-[#ff4500] text-black px-2 py-1 text-xs font-bold tracking-widest">
      {num}
    </span>
    <span className="text-[#a1a1aa] text-xs uppercase tracking-[0.3em]">{children}</span>
    <div className="flex-1 h-[2px] bg-[#3f3f46]" />
  </div>
);

// ============ NAV ============
const Nav = () => (
  <nav className="relative z-20 px-6 md:px-12 py-5 flex items-center justify-between border-b-2 border-[#3f3f46]">
    <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
      <div className="w-8 h-8 bg-[#ff4500] flex items-center justify-center">
        <Flame size={18} className="text-black" />
      </div>
      <span className="font-bold uppercase tracking-tight text-lg">
        Portfolio<span className="text-[#ff4500]">Roast</span>.ai
      </span>
    </Link>
    <div className="hidden md:flex items-center gap-6 text-sm text-[#a1a1aa] uppercase">
      <a href="#how" className="hover:text-white" data-testid="nav-how">How</a>
      <a href="#pricing" className="hover:text-white" data-testid="nav-pricing">Pricing</a>
      <a href="#faq" className="hover:text-white" data-testid="nav-faq">FAQ</a>
    </div>
    <a href="#roast" data-testid="nav-cta">
      <BrutalButton variant="primary" className="text-sm px-4 py-2">
        <Zap size={14} /> Roast Me
      </BrutalButton>
    </a>
  </nav>
);

// ============ HERO ============
const Hero = () => (
  <section className="relative overflow-hidden px-6 md:px-12 pt-16 md:pt-24 pb-20 border-b-2 border-[#3f3f46]">
    <div className="absolute inset-0 grid-bg opacity-70" />
    <div
      className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(255,69,0,0.18), transparent 70%)" }}
    />
    <div className="relative max-w-6xl mx-auto">
      <div className="inline-flex items-center gap-2 border-2 border-[#3f3f46] bg-[#18181b] px-3 py-1 text-xs uppercase tracking-widest text-[#a1a1aa] mb-8 rise rise-1">
        <span className="w-2 h-2 rounded-full bg-[#ff4500] animate-pulse" />
        No sugar. No mercy. Just code review.
      </div>
      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.95] tracking-tighter rise rise-1"
        data-testid="hero-headline"
      >
        Get your portfolio
        <br />
        <span className="text-[#ff4500]">brutally roasted</span>
        <br />
        by AI.
      </h1>
      <p className="mt-8 text-lg md:text-xl text-[#a1a1aa] max-w-2xl rise rise-2">
        FAANG engineers won't tell you the truth. Recruiters are polite.
        <br />
        Your AI code-reviewer from hell will say the quiet part loud.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4 rise rise-3">
        <a href="#roast" data-testid="hero-primary-cta">
          <BrutalButton variant="primary">
            ROAST ME NOW <ArrowRight size={16} />
          </BrutalButton>
        </a>
        <a href="#how" data-testid="hero-secondary-cta">
          <BrutalButton variant="secondary">HOW IT WORKS</BrutalButton>
        </a>
        <div className="text-xs text-[#a1a1aa] uppercase tracking-widest">
          <span className="text-[#10b981]">●</span> 1 free roast · ₹29 after
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-[#3f3f46] rise rise-4">
        {[
          { k: "₹29", v: "Per roast" },
          { k: "10s", v: "Avg time to tears" },
          { k: "5+5", v: "Callouts + fixes" },
          { k: "∞", v: "Evergreen market" },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`p-6 ${i < 3 ? "border-b-2 md:border-b-0 md:border-r-2 border-[#3f3f46]" : ""} ${
              i === 2 ? "border-r-0 md:border-r-2" : ""
            } ${i < 2 ? "border-r-2 md:border-r-2" : ""}`}
            data-testid={`stat-${i}`}
          >
            <div className="text-3xl md:text-4xl font-black text-[#ff4500] tracking-tighter">{s.k}</div>
            <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mt-1">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============ MARQUEE ============
const Marquee = () => {
  const words = [
    "★ ZERO GENERIC ADVICE",
    "★ SAVAGE & SPECIFIC",
    "★ 1 FREE ROAST",
    "★ SHAREABLE MEME CARD",
    "★ GEMINI POWERED",
    "★ MADE IN INDIA",
    "★ ₹29 PER BURN",
    "★ YOUR RECRUITERS WON'T",
  ];
  const row = [...words, ...words];
  return (
    <div className="border-b-2 border-[#3f3f46] bg-[#ff4500] text-black overflow-hidden">
      <div className="flex whitespace-nowrap marquee-track py-3">
        {row.map((w, i) => (
          <span key={i} className="mx-8 text-sm font-bold uppercase tracking-widest">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============ ROAST FORM ============
const RoastForm = ({ onDone }) => {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | paying | generating | done | error
  const [error, setError] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const navigate = useNavigate();

  const loadingLines = [
    "> connecting to roast engine...",
    "> scraping portfolio...",
    "> counting empty READMEs...",
    "> detecting stolen Tailwind...",
    "> calibrating severity...",
    "> summoning FAANG reviewer...",
    "> dispatching pain...",
  ];

  useEffect(() => {
    if (status !== "generating") return;
    const t = setInterval(() => setLoadingLine((x) => (x + 1) % loadingLines.length), 900);
    return () => clearInterval(t);
  }, [status]);

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email so we know who to disappoint.");
      return false;
    }
    if (!url && notes.trim().length < 40) {
      setError("Paste a portfolio URL — or at least 40 chars of text — to roast.");
      return false;
    }
    if (url) {
      try {
        new URL(url);
      } catch {
        setError("That URL doesn't look real. Try https://yoursite.com");
        return false;
      }
    }
    setError("");
    return true;
  };

  const generateRoast = async (payment_id = null) => {
    setStatus("generating");
    try {
      const res = await axios.post(`${API}/roast/generate`, {
        email,
        portfolio_url: url || null,
        portfolio_text: notes || null,
        payment_id,
      });
      setStatus("done");
      onDone?.(res.data);
      navigate(`/roast/${res.data.id}`);
    } catch (e) {
      const msg = e?.response?.data?.detail || "The roaster short-circuited. Try again.";
      setError(msg);
      setStatus("error");
    }
  };

  const payAndRoast = async () => {
    setStatus("paying");
    try {
      const orderRes = await axios.post(`${API}/payment/create-order`, { email });
      const { order_id, amount, currency, key_id } = orderRes.data;

      if (!window.Razorpay) {
        setError("Razorpay script not loaded. Refresh and retry.");
        setStatus("error");
        return;
      }

      const rzp = new window.Razorpay({
        key: key_id || RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id,
        name: "PortfolioRoast.ai",
        description: "One brutal AI roast of your portfolio",
        theme: { color: "#ff4500" },
        prefill: { email },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setError("Payment cancelled. Come back when you're ready to level up.");
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email,
            });
            if (verifyRes.data.verified) {
              await generateRoast(response.razorpay_payment_id);
            } else {
              setError("Payment verification failed. Contact support.");
              setStatus("error");
            }
          } catch (e) {
            setError(e?.response?.data?.detail || "Verification failed.");
            setStatus("error");
          }
        },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. Try again or use another method.");
        setStatus("error");
      });
      rzp.open();
    } catch (e) {
      setError(e?.response?.data?.detail || "Could not create order.");
      setStatus("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("checking");
    try {
      const elig = await axios.post(`${API}/roast/eligibility`, { email });
      if (elig.data.free_roast_available) {
        await generateRoast(null);
      } else {
        await payAndRoast();
      }
    } catch (e) {
      setError(e?.response?.data?.detail || "Could not check eligibility.");
      setStatus("error");
    }
  };

  const isLoading = ["checking", "paying", "generating"].includes(status);

  return (
    <section id="roast" className="relative px-6 md:px-12 py-20 border-b-2 border-[#3f3f46]">
      <div className="max-w-4xl mx-auto">
        <SectionLabel num="01">// THE TERMINAL</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
          Paste. Submit. <span className="text-[#ff4500]">Suffer.</span>
        </h2>
        <p className="text-[#a1a1aa] mb-10 max-w-2xl">
          One free roast per email. After that, ₹29 per burn. No subscriptions, no upsells, no emails begging you to come back.
        </p>

        {/* Terminal window */}
        <div className="border-2 border-[#3f3f46] shadow-[8px_8px_0px_0px_#ff4500] bg-[#0f0f0f]">
          <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#3f3f46] bg-[#18181b]">
            <span className="w-3 h-3 bg-[#ef4444] border border-black" />
            <span className="w-3 h-3 bg-[#f59e0b] border border-black" />
            <span className="w-3 h-3 bg-[#10b981] border border-black" />
            <div className="flex-1 text-center text-xs uppercase tracking-widest text-[#a1a1aa]">
              roast@portfolioroast ~ %
            </div>
            <Terminal size={14} className="text-[#a1a1aa]" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#a1a1aa] block mb-2">
                <span className="text-[#ff4500]">&gt;</span> your email
              </label>
              <BrutalInput
                type="email"
                placeholder="you@youll-regret-this.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[#a1a1aa] block mb-2">
                <span className="text-[#ff4500]">&gt;</span> portfolio url (optional)
              </label>
              <BrutalInput
                type="url"
                placeholder="https://yourportfolio.dev"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-url"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[#a1a1aa] block mb-2">
                <span className="text-[#ff4500]">&gt;</span> paste resume / bio / readme (optional if URL above)
              </label>
              <BrutalTextarea
                rows={6}
                placeholder="Paste your resume text, LinkedIn about section, or the dodgy README you wrote at 2am..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="input-notes"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div
                className="flex items-start gap-2 border-2 border-[#ef4444] bg-[#ef4444]/10 p-3 text-sm text-[#fca5a5]"
                data-testid="form-error"
              >
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <BrutalButton
                type="submit"
                variant="solid"
                disabled={isLoading}
                data-testid="submit-roast-button"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Flame size={16} />}
                {status === "checking" && "CHECKING ELIGIBILITY..."}
                {status === "paying" && "OPENING RAZORPAY..."}
                {status === "generating" && "ROASTING..."}
                {(status === "idle" || status === "error" || status === "done") && "ROAST ME"}
              </BrutalButton>
              <span className="text-xs text-[#a1a1aa] uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} /> First roast is free · Then ₹29 via Razorpay
              </span>
            </div>

            {status === "generating" && (
              <div
                className="mt-4 border-2 border-[#3f3f46] bg-[#0a0a0a] p-4 font-mono text-sm text-[#10b981]"
                data-testid="loading-terminal"
              >
                {loadingLines.slice(0, loadingLine + 1).map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
                <div className="text-[#ff4500] cursor-blink">_</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

// ============ HOW IT WORKS ============
const HowItWorks = () => {
  const steps = [
    {
      n: "01",
      t: "Paste",
      d: "Drop a portfolio URL or paste your resume text. No login. No 12-field onboarding.",
    },
    {
      n: "02",
      t: "We analyze",
      d: "Our AI scrapes the visible content, then channels a tired Staff Engineer who has seen 10,000 resumes.",
    },
    {
      n: "03",
      t: "You cry",
      d: "Score out of 10 + 5 brutally specific callouts + 5 exact fixes + a one-liner verdict you'll want to screenshot.",
    },
    {
      n: "04",
      t: "Share it",
      d: "The result looks like a meme card. Post it on Twitter. Pretend you're in on the joke.",
    },
  ];
  return (
    <section id="how" className="relative px-6 md:px-12 py-20 border-b-2 border-[#3f3f46]">
      <div className="max-w-6xl mx-auto">
        <SectionLabel num="02">// HOW IT WORKS</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12">
          Four steps.
          <br />
          Zero <span className="text-[#ff4500]">participation trophies</span>.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-[#3f3f46]">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`p-6 md:p-8 ${i < 3 ? "border-b-2 md:border-b-0 md:border-r-2 border-[#3f3f46]" : ""}`}
              data-testid={`step-${s.n}`}
            >
              <div className="text-[#ff4500] text-sm font-bold tracking-widest">{s.n}</div>
              <div className="text-2xl font-black uppercase mt-2 mb-3">{s.t}</div>
              <p className="text-[#a1a1aa] leading-relaxed text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ SAMPLE ROAST ============
const SampleRoast = () => (
  <section className="relative px-6 md:px-12 py-20 border-b-2 border-[#3f3f46]">
    <div className="absolute inset-0 grid-bg opacity-30" />
    <div className="relative max-w-5xl mx-auto">
      <SectionLabel num="03">// SAMPLE BURN</SectionLabel>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">
        What a <span className="text-[#ff4500]">real roast</span> looks like.
      </h2>
      <div className="relative bg-[#0f0f0f] border-4 border-[#ff4500] p-8 md:p-12 shadow-[10px_10px_0px_0px_#ff4500]/50 overflow-hidden">
        <div className="absolute -right-10 -top-6 text-[#ff4500]/10 text-[180px] font-black uppercase select-none pointer-events-none">
          ROASTED
        </div>
        <div className="relative grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-2">PORTFOLIO SCORE</div>
            <div className="text-8xl md:text-9xl font-black text-[#ff4500] leading-none">3<span className="text-white">/10</span></div>
            <div className="text-sm text-[#a1a1aa] mt-3 italic">"Ambitious title. Empty repo."</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 border-2 border-[#ef4444] p-3">
              <Skull size={16} className="text-[#ef4444] mt-1 shrink-0" />
              <span className="text-sm">"47 repos, 0 READMEs. You don't care about humans reading your code."</span>
            </div>
            <div className="flex items-start gap-2 border-2 border-[#10b981] p-3">
              <CheckCircle2 size={16} className="text-[#10b981] mt-1 shrink-0" />
              <span className="text-sm">Write a 6-line README for your top 3 repos. What it does, why, how to run.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ============ PRICING ============
const Pricing = () => (
  <section id="pricing" className="relative px-6 md:px-12 py-20 border-b-2 border-[#3f3f46]">
    <div className="max-w-5xl mx-auto">
      <SectionLabel num="04">// PRICING</SectionLabel>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
        No subscriptions.
        <br />
        <span className="text-[#ff4500]">No bullsh*t.</span>
      </h2>
      <p className="text-[#a1a1aa] mb-12 max-w-2xl">
        Pay only when you want another round of pain. Server bills aren't a meme.
      </p>

      <div className="grid md:grid-cols-2 gap-0 border-2 border-[#3f3f46]">
        <div className="p-8 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-[#3f3f46]" data-testid="price-free">
          <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-3">01 / THE TASTE</div>
          <div className="text-5xl font-black mb-2">FREE</div>
          <div className="text-sm text-[#a1a1aa] mb-8">Your first roast, on the house.</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#10b981]" /> 1 full roast per email</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#10b981]" /> Score + 5 callouts + 5 fixes</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#10b981]" /> Shareable meme card</li>
          </ul>
        </div>
        <div className="p-8 md:p-10 bg-[#0f0f0f] relative" data-testid="price-paid">
          <div className="absolute top-4 right-4 text-xs uppercase tracking-widest bg-[#ff4500] text-black px-2 py-1">
            PAY PER BURN
          </div>
          <div className="text-xs uppercase tracking-widest text-[#ff4500] mb-3">02 / KEEP GOING</div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-black text-[#ff4500]">₹29</span>
            <span className="text-sm text-[#a1a1aa] uppercase">/ roast</span>
          </div>
          <div className="text-sm text-[#a1a1aa] mb-8">Powered by Razorpay. UPI / Cards / Netbanking.</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Flame size={14} className="text-[#ff4500]" /> Unlimited separate purchases</li>
            <li className="flex items-center gap-2"><Flame size={14} className="text-[#ff4500]" /> Re-roast as you improve</li>
            <li className="flex items-center gap-2"><Flame size={14} className="text-[#ff4500]" /> Secure Razorpay checkout</li>
          </ul>
          <div className="mt-8">
            <a href="#roast" data-testid="pricing-cta">
              <BrutalButton variant="solid">BRING THE PAIN <ArrowRight size={16} /></BrutalButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ============ FAQ ============
const FAQ = () => {
  const items = [
    {
      q: "Is the roast actually useful or is it just mean?",
      a: "It's mean WITH receipts. Every callout references something specific in your portfolio, and every fix is a concrete action. No 'add more projects' nonsense.",
    },
    {
      q: "What does my data do?",
      a: "We store your email + the roast so you can share it via /roast/<id>. We don't spam, don't sell, and don't DM you on LinkedIn.",
    },
    {
      q: "How does payment work?",
      a: "First roast is free per email. For more, you pay ₹29 via Razorpay (UPI / cards / netbanking / wallets). One payment = one roast.",
    },
    {
      q: "What if the URL scraping fails?",
      a: "Paste your resume or bio text in the notes box — we'll roast that instead.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative px-6 md:px-12 py-20 border-b-2 border-[#3f3f46]">
      <div className="max-w-3xl mx-auto">
        <SectionLabel num="05">// FAQ</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">
          Questions before <span className="text-[#ff4500]">the pain</span>.
        </h2>
        <div className="border-2 border-[#3f3f46]">
          {items.map((it, i) => (
            <div key={i} className={`${i > 0 ? "border-t-2 border-[#3f3f46]" : ""}`}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between text-left p-5 hover:bg-[#18181b] transition"
                data-testid={`faq-q-${i}`}
              >
                <span className="font-bold uppercase tracking-tight">{it.q}</span>
                <span className="text-[#ff4500] text-xl font-black">{open === i ? "–" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-6 text-[#a1a1aa] text-sm leading-relaxed" data-testid={`faq-a-${i}`}>
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ FOOTER ============
const Footer = () => (
  <footer className="px-6 md:px-12 py-10 text-sm text-[#a1a1aa] border-t-2 border-[#3f3f46]">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2" data-testid="footer-brand">
        <div className="w-6 h-6 bg-[#ff4500] flex items-center justify-center">
          <Flame size={12} className="text-black" />
        </div>
        <span className="uppercase font-bold">PortfolioRoast.ai</span>
        <span className="text-[#52525b]">· Built with scars by XenithHQ</span>
      </div>
      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-widest">
        <Link to="/terms" className="hover:text-white" data-testid="footer-terms">Terms &amp; Conditions</Link>
        <span className="text-[#52525b]">·</span>
        <Link to="/privacy" className="hover:text-white" data-testid="footer-privacy">Privacy Policy</Link>
        <span className="text-[#52525b]">·</span>
        <Link to="/refund" className="hover:text-white" data-testid="footer-refund">Cancellation &amp; Refund</Link>
        <span className="text-[#52525b]">·</span>
        <Link to="/contact" className="hover:text-white" data-testid="footer-contact">Contact Us</Link>
      </div>
    </div>
  </footer>
);

// ============ LANDING ============
const Landing = () => {
  return (
    <div className="relative">
      <Nav />
      <Hero />
      <Marquee />
      <RoastForm />
      <HowItWorks />
      <SampleRoast />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

// ============ SHARE GRID ============
const ShareGrid = ({ shareLinks, shareUrl, shareText }) => {
  const [copied, setCopied] = useState(false);
  const [nativeAvailable, setNativeAvailable] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) setNativeAvailable(true);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
      document.body.removeChild(ta);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "PortfolioRoast.ai", text: shareText, url: shareUrl });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" data-testid="share-grid">
      {shareLinks.map(({ key, label, icon: Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-[#3f3f46] bg-[#0f0f0f] p-3 flex items-center gap-2 text-sm uppercase tracking-widest hover:border-[#ff4500] hover:text-[#ff4500] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#ff4500] transition-all"
          data-testid={`share-${key}`}
        >
          <Icon size={16} />
          <span className="truncate">{label}</span>
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className={`border-2 p-3 flex items-center gap-2 text-sm uppercase tracking-widest hover:-translate-y-[2px] transition-all ${
          copied
            ? "border-[#10b981] text-[#10b981] shadow-[4px_4px_0px_0px_#10b981]"
            : "border-[#3f3f46] bg-[#0f0f0f] hover:border-[#ff4500] hover:text-[#ff4500] hover:shadow-[4px_4px_0px_0px_#ff4500]"
        }`}
        data-testid="share-copy"
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        <span className="truncate">{copied ? "Link copied!" : "Copy link"}</span>
      </button>
      {nativeAvailable && (
        <button
          type="button"
          onClick={nativeShare}
          className="border-2 border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500] p-3 flex items-center gap-2 text-sm uppercase tracking-widest hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#ff4500] transition-all"
          data-testid="share-native"
        >
          <Send size={16} />
          <span className="truncate">More...</span>
        </button>
      )}
    </div>
  );
};

// ============ ROAST RESULT PAGE ============
const RoastPage = () => {
  const { id } = useParams();
  const [roast, setRoast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/roast/${id}`);
        setRoast(res.data);
      } catch (e) {
        setError(e?.response?.data?.detail || "Roast not found.");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <Nav />
        <div className="border-2 border-[#ef4444] p-6 text-center mt-20" data-testid="roast-error">
          <AlertTriangle className="mx-auto text-[#ef4444] mb-3" />
          <div className="uppercase font-bold tracking-widest">{error}</div>
          <Link to="/" className="block mt-4">
            <BrutalButton variant="primary">Back to safety</BrutalButton>
          </Link>
        </div>
      </div>
    );
  }

  if (!roast) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="flex flex-col items-center justify-center py-40 text-[#a1a1aa] uppercase tracking-widest text-sm">
          <Loader2 size={20} className="animate-spin mb-3 text-[#ff4500]" />
          Loading the damage...
        </div>
      </div>
    );
  }

  const shareText = `I got my portfolio roasted by AI and scored ${roast.score}/10 🔥\n\n"${roast.one_liner}"\n\nGet yours →`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://portfolioroast.ai/roast/${roast.id}`;
  const enc = encodeURIComponent;
  const shareLinks = [
    {
      key: "x",
      label: "X / Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(shareUrl)}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${enc(shareText + " " + shareUrl)}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}&quote=${enc(shareText)}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(shareText)}`,
    },
    {
      key: "reddit",
      label: "Reddit",
      icon: MessageCircle,
      href: `https://www.reddit.com/submit?url=${enc(shareUrl)}&title=${enc(`My portfolio got roasted — ${roast.score}/10`)}`,
    },
  ];

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="relative px-4 md:px-12 py-10 md:py-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-5xl mx-auto">
          {/* Meme card */}
          <div
            className="relative bg-[#0f0f0f] border-4 border-[#ff4500] p-6 md:p-12 shadow-[10px_10px_0px_0px_#ff4500] overflow-hidden"
            data-testid="roast-card"
          >
            <div className="absolute -right-6 -top-8 md:-top-4 text-[#ff4500]/10 text-[120px] md:text-[220px] font-black uppercase select-none pointer-events-none leading-none">
              ROASTED
            </div>

            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#ff4500] flex items-center justify-center">
                    <Flame size={18} className="text-black" />
                  </div>
                  <span className="font-bold uppercase tracking-tight">
                    Portfolio<span className="text-[#ff4500]">Roast</span>.ai
                  </span>
                </div>
                <div className="text-xs uppercase tracking-widest text-[#a1a1aa]">
                  {new Date(roast.created_at).toLocaleDateString()} · ID {roast.id.slice(0, 8)}
                </div>
              </div>

              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-start">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-2">YOUR SCORE</div>
                  <div
                    className="text-8xl md:text-[10rem] font-black text-[#ff4500] leading-none tracking-tighter"
                    data-testid="roast-score"
                  >
                    {roast.score}
                    <span className="text-white">/10</span>
                  </div>
                  {roast.portfolio_url && (
                    <div className="mt-3 text-xs text-[#a1a1aa] break-all">
                      <span className="uppercase tracking-widest text-[#52525b]">target:</span>{" "}
                      {roast.portfolio_url}
                    </div>
                  )}
                </div>
                <div className="bg-[#18181b] border-2 border-[#3f3f46] p-5 md:p-6">
                  <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-2">THE VERDICT</div>
                  <div
                    className="text-xl md:text-2xl font-bold italic leading-snug"
                    data-testid="roast-oneliner"
                  >
                    "{roast.one_liner}"
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Skull size={18} className="text-[#ef4444]" />
                    <span className="text-sm uppercase tracking-widest font-bold">5 Brutal Callouts</span>
                  </div>
                  <div className="space-y-3">
                    {roast.callouts.map((c, i) => (
                      <div
                        key={i}
                        className="border-2 border-[#ef4444] p-3 text-sm flex items-start gap-2"
                        data-testid={`callout-${i}`}
                      >
                        <span className="text-[#ef4444] font-black">0{i + 1}</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={18} className="text-[#10b981]" />
                    <span className="text-sm uppercase tracking-widest font-bold">5 Exact Fixes</span>
                  </div>
                  <div className="space-y-3">
                    {roast.fixes.map((f, i) => (
                      <div
                        key={i}
                        className="border-2 border-[#10b981] p-3 text-sm flex items-start gap-2"
                        data-testid={`fix-${i}`}
                      >
                        <span className="text-[#10b981] font-black">0{i + 1}</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t-2 border-[#3f3f46] pt-8">
                <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-4">
                  Share the damage. Let the internet join in.
                </div>
                <ShareGrid shareLinks={shareLinks} shareUrl={shareUrl} shareText={shareText} />
                <div className="mt-8 flex flex-wrap gap-3 justify-between items-center">
                  <Link to="/#roast" data-testid="roast-again">
                    <BrutalButton variant="primary">
                      <Sparkles size={16} /> ROAST AGAIN (₹29)
                    </BrutalButton>
                  </Link>
                  <div className="text-xs uppercase tracking-widest text-[#52525b]">
                    ID {roast.id.slice(0, 8)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-xs uppercase tracking-widest text-[#a1a1aa]">
            Hate it? <span className="text-[#ff4500]">Good.</span> Now ship the fixes.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// ============ APP ============
function App() {
  // Ping backend on load (health)
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/roast/:id" element={<RoastPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

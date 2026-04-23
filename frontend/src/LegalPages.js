import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowLeft, Mail, Phone } from "lucide-react";

export const LegalShell = ({ title, subtitle, children }) => (
  <div className="min-h-screen">
    {/* Nav */}
    <nav className="relative z-20 px-6 md:px-12 py-5 flex items-center justify-between border-b-2 border-[#3f3f46]">
      <Link to="/" className="flex items-center gap-2 group" data-testid="legal-nav-logo">
        <div className="w-8 h-8 bg-[#ff4500] flex items-center justify-center">
          <Flame size={18} className="text-black" />
        </div>
        <span className="font-bold uppercase tracking-tight text-lg">
          Portfolio<span className="text-[#ff4500]">Roast</span>.ai
        </span>
      </Link>
      <Link to="/" className="text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-white inline-flex items-center gap-2" data-testid="legal-back">
        <ArrowLeft size={14} /> Back to roasts
      </Link>
    </nav>

    {/* Header */}
    <section className="relative px-6 md:px-12 py-16 border-b-2 border-[#3f3f46] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#ff4500] text-black px-2 py-1 text-xs font-bold tracking-widest">LEGAL</span>
          <div className="flex-1 h-[2px] bg-[#3f3f46]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{title}</h1>
        {subtitle && <p className="mt-4 text-[#a1a1aa] max-w-2xl">{subtitle}</p>}
      </div>
    </section>

    {/* Content */}
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto space-y-8 text-[#d4d4d8] leading-relaxed text-[15px]">{children}</div>
    </section>

    {/* Mini footer */}
    <footer className="px-6 md:px-12 py-10 text-xs text-[#a1a1aa] border-t-2 border-[#3f3f46]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="uppercase tracking-widest">© {new Date().getFullYear()} PortfolioRoast.ai · Built with scars by XenithHQ</div>
        <div className="flex items-center gap-4 uppercase tracking-widest">
          <Link to="/terms" className="hover:text-white">T&amp;C</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/refund" className="hover:text-white">Refunds</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  </div>
);

const H2 = ({ children }) => (
  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mt-10 mb-3 border-l-4 border-[#ff4500] pl-3">
    {children}
  </h2>
);

const P = ({ children }) => <p className="text-[#a1a1aa]">{children}</p>;

const UL = ({ items }) => (
  <ul className="list-none space-y-2 text-[#a1a1aa]">
    {items.map((it, i) => (
      <li key={i} className="flex gap-3">
        <span className="text-[#ff4500] font-bold shrink-0">›</span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const EFFECTIVE = "Effective Date: 23 April 2026";

// ============ TERMS ============
export const TermsPage = () => (
  <LegalShell
    title="Terms & Conditions"
    subtitle="The rules of the roast. Read before you ignite."
  >
    <P>{EFFECTIVE}</P>
    <P>
      Welcome to PortfolioRoast.ai (&quot;Service&quot;), operated by <strong className="text-white">XenithHQ</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
      By accessing or using the Service you agree to these Terms. If you do not agree, please do not use the Service.
    </P>

    <H2>1. Nature of the Service</H2>
    <P>
      PortfolioRoast.ai provides AI-generated, opinionated feedback on developer portfolios, resumes, and related content.
      All output is satirical / critical in tone and intended for self-improvement — it is not professional career counselling,
      legal advice, or a guarantee of employment outcomes.
    </P>

    <H2>2. User Eligibility</H2>
    <UL items={[
      "You must be 16 years or older, or use the service under the supervision of a parent/guardian.",
      "You must provide a valid email address. One (1) free roast is granted per unique email.",
      "You may not submit content that is unlawful, infringing, sexually explicit, or personally identifying someone other than yourself without consent.",
    ]} />

    <H2>3. Payments</H2>
    <UL items={[
      "Paid roasts cost ₹29 (INR) per roast, processed securely by Razorpay.",
      "Each successful payment entitles you to exactly one (1) AI-generated roast.",
      "Prices may change at our discretion; prevailing price is shown at checkout.",
    ]} />

    <H2>4. Acceptable Use</H2>
    <UL items={[
      "Do not attempt to scrape, reverse-engineer, or overload the Service.",
      "Do not use the Service to generate harassing content targeting specific individuals.",
      "We reserve the right to rate-limit, suspend, or refuse service for abusive behaviour.",
    ]} />

    <H2>5. Intellectual Property</H2>
    <P>
      You retain ownership of any portfolio / resume content you submit. You grant us a limited licence to process that content
      solely to generate your roast. The AI-generated roast output is licensed to you for personal, non-commercial use (including
      sharing on social media with attribution to PortfolioRoast.ai).
    </P>

    <H2>6. Disclaimers</H2>
    <P>
      The Service is provided &quot;as is&quot; without warranties of any kind. Roast content is generated by a language model and may
      contain inaccuracies or opinions that do not reflect objective truth. Act on the feedback at your own discretion.
    </P>

    <H2>7. Limitation of Liability</H2>
    <P>
      To the maximum extent permitted by law, XenithHQ shall not be liable for any indirect, incidental, or consequential damages
      arising out of your use of the Service. Our aggregate liability shall not exceed the amount you paid us in the 30 days
      preceding the claim.
    </P>

    <H2>8. Changes</H2>
    <P>We may update these Terms from time to time. Material changes will be reflected by updating the &quot;Effective Date&quot;.</P>

    <H2>9. Governing Law</H2>
    <P>These Terms are governed by the laws of India. Courts of Jaipur, Rajasthan shall have exclusive jurisdiction.</P>

    <H2>10. Contact</H2>
    <P>
      Questions? Email <a className="text-[#ff4500] hover:underline" href="mailto:contact@pixelbond.in">contact@pixelbond.in</a>{" "}
      or see our <Link to="/contact" className="text-[#ff4500] hover:underline">Contact page</Link>.
    </P>
  </LegalShell>
);

// ============ PRIVACY ============
export const PrivacyPage = () => (
  <LegalShell
    title="Privacy Policy"
    subtitle="Short version: we store your email and your roast. We do not sell your data."
  >
    <P>{EFFECTIVE}</P>
    <P>
      This Privacy Policy explains how <strong className="text-white">XenithHQ</strong> (&quot;we&quot;) collects, uses, and protects
      information when you use PortfolioRoast.ai.
    </P>

    <H2>1. Information we collect</H2>
    <UL items={[
      "Email address (to gate the free roast and deliver receipts).",
      "Portfolio URL and/or text content you submit for roasting.",
      "Payment metadata from Razorpay (order ID, payment ID, signature). We do NOT store card numbers, CVVs, or UPI PINs.",
      "Basic technical logs (IP, user-agent, timestamps) for abuse prevention.",
    ]} />

    <H2>2. How we use your data</H2>
    <UL items={[
      "To generate and display your personalised roast.",
      "To prevent abuse of the one-free-roast-per-email rule.",
      "To reconcile and verify payments with Razorpay.",
      "To improve the Service (aggregated, non-identifying analytics only).",
    ]} />

    <H2>3. Third-party processors</H2>
    <UL items={[
      "Razorpay — payment processing (see razorpay.com/privacy).",
      "Google Gemini API — AI inference on your portfolio content.",
      "Cloud hosting & MongoDB providers for storage.",
    ]} />

    <H2>4. Data retention</H2>
    <P>
      Roasts and the associated email are retained so your shareable <code>/roast/:id</code> link continues to work. You can request
      deletion at any time by emailing <a className="text-[#ff4500] hover:underline" href="mailto:contact@pixelbond.in">contact@pixelbond.in</a>.
    </P>

    <H2>5. Your rights</H2>
    <UL items={[
      "Access — request a copy of the data we hold about you.",
      "Deletion — request removal of your email, roasts, and payment records.",
      "Correction — ask us to fix inaccurate data.",
    ]} />

    <H2>6. Security</H2>
    <P>
      We use industry-standard HTTPS, signature verification for payments, and do not expose secret keys client-side. No system is
      100% secure; do not paste private credentials, tokens, or sensitive PII into the roast input.
    </P>

    <H2>7. Children</H2>
    <P>The Service is not intended for users under 16.</P>

    <H2>8. Changes</H2>
    <P>If we make material changes to this policy, we&apos;ll update the Effective Date above.</P>

    <H2>9. Contact</H2>
    <P>
      Privacy questions: <a className="text-[#ff4500] hover:underline" href="mailto:contact@pixelbond.in">contact@pixelbond.in</a>.
    </P>
  </LegalShell>
);

// ============ REFUND ============
export const RefundPage = () => (
  <LegalShell
    title="Cancellation & Refund Policy"
    subtitle="The rules for getting your ₹29 back. Short and honest."
  >
    <P>{EFFECTIVE}</P>

    <H2>1. Cancellations</H2>
    <P>
      Because each roast is delivered instantly after payment, there is no subscription to cancel. Every ₹29 payment is a
      one-time transaction for one roast. You can simply stop using the Service at any time.
    </P>

    <H2>2. Eligibility for refunds</H2>
    <P>You may request a refund of ₹29 per roast in the following cases:</P>
    <UL items={[
      "You were charged but no roast was generated (technical failure on our side).",
      "You were charged more than once for the same order due to a gateway error.",
      "The roast returned is completely empty or unintelligible (e.g., blank callouts/fixes).",
    ]} />
    <P>Refunds are <strong className="text-white">not</strong> provided simply because you disagree with the roast&apos;s opinion — the
      product is intentionally harsh, and that is clearly disclosed.
    </P>

    <H2>3. How to request a refund</H2>
    <P>
      Email <a className="text-[#ff4500] hover:underline" href="mailto:contact@pixelbond.in">contact@pixelbond.in</a> within{" "}
      <strong className="text-white">7 days</strong> of the payment with:
    </P>
    <UL items={[
      "Your registered email address",
      "Razorpay Payment ID (looks like pay_XXXXXXXX)",
      "A brief description of the issue",
    ]} />

    <H2>4. Refund processing</H2>
    <UL items={[
      "Approved refunds are processed via Razorpay back to the original payment method.",
      "Processing time is typically 5–7 business days, depending on your bank / UPI provider.",
      "You will receive an email confirmation once the refund is initiated.",
    ]} />

    <H2>5. Disputes</H2>
    <P>
      If a refund request is declined and you disagree, please reply to the same email thread with additional details. We review
      each disputed case personally.
    </P>

    <H2>6. Contact</H2>
    <P>
      For all refund queries: <a className="text-[#ff4500] hover:underline" href="mailto:contact@pixelbond.in">contact@pixelbond.in</a>.
    </P>
  </LegalShell>
);

// ============ CONTACT ============
export const ContactPage = () => (
  <LegalShell
    title="Contact Us"
    subtitle="Real humans at XenithHQ. We reply faster than your recruiter."
  >
    <P>
      Questions, feature requests, partnerships, refunds, angry emails about your roast score — we read all of them. Pick the
      channel that suits you.
    </P>

    <div className="grid md:grid-cols-2 gap-0 border-2 border-[#3f3f46] mt-4">
      <a
        href="mailto:contact@pixelbond.in"
        className="p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#3f3f46] hover:bg-[#18181b] transition group block"
        data-testid="contact-email-primary"
      >
        <Mail size={22} className="text-[#ff4500] mb-3" />
        <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-1">Primary email</div>
        <div className="text-lg md:text-xl font-bold text-white break-all group-hover:text-[#ff4500] transition">
          contact@pixelbond.in
        </div>
        <div className="text-xs text-[#a1a1aa] mt-2 uppercase tracking-widest">General / support / refunds</div>
      </a>

      <a
        href="mailto:xenithfounders@gmail.com"
        className="p-6 md:p-8 hover:bg-[#18181b] transition group block"
        data-testid="contact-email-founders"
      >
        <Mail size={22} className="text-[#ff4500] mb-3" />
        <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-1">Founders</div>
        <div className="text-lg md:text-xl font-bold text-white break-all group-hover:text-[#ff4500] transition">
          xenithfounders@gmail.com
        </div>
        <div className="text-xs text-[#a1a1aa] mt-2 uppercase tracking-widest">Partnerships / press / investors</div>
      </a>

      <a
        href="tel:+919350015443"
        className="p-6 md:p-8 border-t-2 md:col-span-2 border-[#3f3f46] hover:bg-[#18181b] transition group block"
        data-testid="contact-phone"
      >
        <Phone size={22} className="text-[#ff4500] mb-3" />
        <div className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-1">Phone / WhatsApp</div>
        <div className="text-lg md:text-xl font-bold text-white group-hover:text-[#ff4500] transition">
          +91 93500 15443
        </div>
        <div className="text-xs text-[#a1a1aa] mt-2 uppercase tracking-widest">Mon–Sat · 10:00–19:00 IST</div>
      </a>
    </div>

    <H2>Business Details</H2>
    <div className="border-2 border-[#3f3f46] p-5 md:p-6 text-[#a1a1aa] text-sm space-y-1">
      <div><span className="text-white font-bold uppercase tracking-widest">Operated by:</span> XenithHQ</div>
      <div><span className="text-white font-bold uppercase tracking-widest">Product:</span> PortfolioRoast.ai</div>
      <div><span className="text-white font-bold uppercase tracking-widest">Country:</span> India</div>
    </div>

    <P className="pt-2">
      Prefer async? Email is always the fastest route. Please include your registered email + Razorpay Payment ID for any
      payment-related query so we can reply instantly.
    </P>
  </LegalShell>
);

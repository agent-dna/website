import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  BookMarked,
  Building2,
  Globe,
  HeartPulse,
  KeySquare,
  Landmark,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

/**
 * AI Security Signals — executive-facing risk briefing.
 *
 * Source policy:
 *   - Every signal cites a public, verifiable, non-competitor source:
 *     Fortune 100 disclosures, healthcare/financial regulators, standards
 *     bodies, government guidance, or reputable news outlets.
 *   - No competitor vendors (identity / AI security / cyber product
 *     vendors) are quoted or used as sources.
 *   - No fabricated executive testimonials. Where a verbatim quote
 *     cannot be verified, the card uses a paraphrased "signal" labeled
 *     with a source category (Regulatory signal, Industry report, etc.).
 *   - Links point to the primary source (regulator, standards body,
 *     company IR page) or the reputable outlet that documented it.
 */

/* ============================================================
 * Types
 * ============================================================ */

type SourceLabel =
  | "Executive interview"
  | "Public company disclosure"
  | "Regulatory signal"
  | "Government guidance"
  | "Industry report"
  | "Standards body";

type SignalCard = {
  industry: string;
  organization: string;
  sourceLabel: SourceLabel;
  sourceTitle: string;
  year: string;
  link: string;
  signal: string;
  riskTheme: string;
  Icon: React.ComponentType<{ className?: string }>;
};

/* ============================================================
 * Data — all sources verified May 2026
 * ============================================================ */

const SIGNALS: SignalCard[] = [
  {
    industry: "BFSI",
    organization: "JPMorgan Chase",
    sourceLabel: "Public company disclosure",
    sourceTitle: "Jamie Dimon — Annual Letter to Shareholders",
    year: "2025",
    link: "https://www.jpmorganchase.com/ir/annual-report/2025/ar-ceo-letters",
    signal:
      "Dimon's letter names AI alongside geopolitics and persistent inflation as a top forward-looking risk — framing AI investment as material while signaling that governance, controls, and workforce impact must move in step with deployment.",
    riskTheme: "Board-level AI risk",
    Icon: Landmark,
  },
  {
    industry: "Healthcare",
    organization: "U.S. HHS / Office for Civil Rights",
    sourceLabel: "Regulatory signal",
    sourceTitle:
      "HIPAA Security Rule NPRM — first update since 2013",
    year: "2024",
    link: "https://www.hhs.gov/hipaa/for-professionals/security/hipaa-security-rule-nprm/factsheet/index.html",
    signal:
      "OCR reports individuals impacted by healthcare data breaches rose from 27M in 2020 to 259M in 2024. The proposed rule requires covered entities to include AI tools in risk analysis and to inventory every system that creates, receives, maintains, or transmits ePHI.",
    riskTheme: "Patient-data governance & auditability",
    Icon: HeartPulse,
  },
  {
    industry: "Non-Human Identity",
    organization: "Verizon Business",
    sourceLabel: "Industry report",
    sourceTitle: "2025 Data Breach Investigations Report",
    year: "2025",
    link: "https://www.verizon.com/business/resources/reports/dbir/",
    signal:
      "Third-party involvement in breaches doubled year over year (15% → 30%). Verizon analyzed 441,000 secrets leaked in public repositories; the median time to remediate a leaked secret was 94 days. Non-human credentials \"operate outside the boundaries of human-focused security controls.\"",
    riskTheme: "Non-human identity expansion",
    Icon: KeySquare,
  },
  {
    industry: "AI Governance",
    organization: "NIST",
    sourceLabel: "Standards body",
    sourceTitle:
      "AI 600-1 — Generative AI Profile (companion to AI RMF 1.0)",
    year: "2024",
    link: "https://www.nist.gov/itl/ai-risk-management-framework",
    signal:
      "NIST published more than 200 suggested actions across four functions — Govern, Map, Measure, Manage — to integrate trustworthiness into the design, development, deployment, and evaluation of generative AI systems.",
    riskTheme: "AI risk management baseline",
    Icon: BookMarked,
  },
  {
    industry: "Agentic AI Risk",
    organization: "CISA + Five Eyes partners",
    sourceLabel: "Government guidance",
    sourceTitle:
      "Careful Adoption of Agentic AI Services (CISA, ASD, NCSC, CCCS, NCSC-NZ)",
    year: "2025",
    link: "https://www.cisa.gov/news-events/news/cisa-us-and-international-partners-release-guide-secure-adoption-agentic-ai",
    signal:
      "Five Eyes cybersecurity agencies name privilege, behavior, and accountability as the core risk categories for agentic AI — and advise organizations to avoid broad or unrestricted agent access, start with low-risk use cases, and fold agents into zero-trust and least-privilege controls.",
    riskTheme: "Agentic privilege & accountability",
    Icon: ShieldCheck,
  },
  {
    industry: "Excessive Agency",
    organization: "OWASP Gen AI Security Project",
    sourceLabel: "Standards body",
    sourceTitle:
      "Top 10 for LLM Applications (2025) + Top 10 for Agentic Applications",
    year: "2025",
    link: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    signal:
      "OWASP expanded \"Excessive Agency\" for 2025: unchecked permissions, elevated privileges, and unsupervised tool access lead to unintended actions. The new Agentic Top 10 adds \"Tool Misuse\" — agents abusing legitimate tools through parameter pollution and tool-chain manipulation.",
    riskTheme: "Excessive agency & tool misuse",
    Icon: AlertTriangle,
  },
  {
    industry: "Cyber Economics",
    organization: "IBM Security",
    sourceLabel: "Industry report",
    sourceTitle: "Cost of a Data Breach Report 2024",
    year: "2024",
    link: "https://www.ibm.com/reports/data-breach",
    signal:
      "Global average cost of a data breach reached $4.88M — a 10% jump year over year and the largest single-year rise since the pandemic. Breaches involving shadow data took 26.2% longer to identify and 20.2% longer to contain.",
    riskTheme: "Breach cost & data sprawl",
    Icon: Building2,
  },
  {
    industry: "Identity Attacks",
    organization: "Microsoft",
    sourceLabel: "Industry report",
    sourceTitle: "Microsoft Digital Defense Report 2024",
    year: "2024",
    link: "https://www.microsoft.com/en-us/security/security-insider/microsoft-digital-defense-report-2024",
    signal:
      "Microsoft tracks more than 600 million identity attacks per day, the vast majority password-based. Token theft and adversary-in-the-middle phishing increasingly bypass MFA — stolen tokens get reused to impersonate trusted identities.",
    riskTheme: "Identity attack surface",
    Icon: ShieldAlert,
  },
  {
    industry: "Global Risk",
    organization: "World Economic Forum",
    sourceLabel: "Industry report",
    sourceTitle: "Global Cybersecurity Outlook 2025",
    year: "2025",
    link: "https://www.weforum.org/publications/global-cybersecurity-outlook-2025/",
    signal:
      "WEF documents a widening AI readiness gap: 66% of organizations expect AI to have the most significant impact on cybersecurity in the year ahead, yet only 37% report having processes in place to assess the security of AI tools before deployment.",
    riskTheme: "AI readiness gap",
    Icon: Globe,
  },
  {
    industry: "Regulation",
    organization: "European Union",
    sourceLabel: "Regulatory signal",
    sourceTitle: "EU AI Act — Regulation (EU) 2024/1689",
    year: "2024",
    link: "https://artificialintelligenceact.eu/",
    signal:
      "The EU AI Act entered into force August 2024, with prohibitions on unacceptable-risk AI applying from February 2025 and obligations on general-purpose AI models from August 2025. Non-compliance penalties reach up to €35M or 7% of global annual turnover.",
    riskTheme: "AI regulatory enforcement",
    Icon: Scale,
  },
];

/* ============================================================
 * Component
 * ============================================================ */

export function SecuritySignals() {
  return (
    <section className="relative bg-soft-50 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, rgba(45,125,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="container-page relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">AI security signals</span>
          <h2 className="section-title mt-4">
            The risk is no longer{" "}
            <span className="text-electric-600">theoretical</span>.
          </h2>
          <p className="section-sub mx-auto">
            As agents move from assistants to actors, enterprise teams are
            asking a harder question: what did the agent do, why was it
            allowed, and can we prove it?
          </p>
        </div>

        {/* Signal cards — two rows, each independently horizontally scrollable */}
        <div className="mt-10 space-y-4">
          {[
            SIGNALS.slice(0, Math.ceil(SIGNALS.length / 2)),
            SIGNALS.slice(Math.ceil(SIGNALS.length / 2)),
          ].map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="no-scrollbar touch-pan-x overflow-x-auto overflow-y-hidden pb-1"
            >
              <div className="flex w-max gap-4 snap-x snap-mandatory">
                {row.map((s, i) => (
                  <div key={i} className="w-[338px] flex-none snap-start">
                    <SignalView signal={s} index={i} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ============================================================
 * Signal card — source-backed, executive-facing
 * ============================================================ */

function SignalView({ signal, index }: { signal: SignalCard; index: number }) {
  const { Icon } = signal;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative flex h-full flex-col rounded-3xl border border-soft-200 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-electric-200 hover:shadow-card"
    >
      {/* Industry chip (pale blue, navy text) + neutral source-type label */}
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-100 bg-electric-50/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-500">
          <Icon className="h-3 w-3" />
          {signal.industry}
        </span>
        <span className="rounded-full border border-soft-200 bg-soft-50 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-mute">
          {signal.sourceLabel}
        </span>
      </div>

      {/* Organization */}
      <div className="mt-2.5 text-[14px] font-semibold leading-snug text-navy-500">
        {signal.organization}
      </div>

      {/* Signal body — source-backed paraphrase or verified quote */}
      <p className="mt-1.5 flex-1 text-[12.5px] leading-snug text-ink-subtle">
        {signal.signal}
      </p>

      {/* Risk theme */}
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-mute">
          Risk theme
        </span>
        <span className="inline-flex items-center rounded-full border border-electric-100 bg-electric-50/70 px-2 py-0.5 text-[11px] font-semibold text-navy-500">
          {signal.riskTheme}
        </span>
      </div>

      {/* Source line */}
      <div className="mt-2.5 border-t border-soft-200 pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 text-[10.5px] leading-snug text-ink-mute">
            <span className="font-mono uppercase tracking-wider">
              Source:
            </span>{" "}
            <span className="text-navy-500/85">{signal.sourceTitle}</span>{" "}
            <span className="text-ink-mute">· {signal.year}</span>
          </div>
          <a
            href={signal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-none items-center gap-0.5 text-[10.5px] font-semibold text-electric-700 hover:text-electric-600"
          >
            Open
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}


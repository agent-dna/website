import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  FileSignature,
  HeartPulse,
  KeySquare,
  Landmark,
  ScrollText,
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

type IncidentCard = {
  title: string;
  industry: string;
  source: string;
  year: string;
  link: string;
  takeaway: string;
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
];

const INCIDENTS: IncidentCard[] = [
  {
    title:
      "AI coding agent destroyed production data during a designated code freeze",
    industry: "Software / DevOps",
    source: "Fortune, Tom's Hardware",
    year: "2025",
    link: "https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/",
    takeaway:
      "An agent with production access ran destructive commands during a code freeze and then misreported the outcome — broad permissions outpaced human review.",
  },
  {
    title:
      "Largest U.S. healthcare breach affected ~190M individuals",
    industry: "Healthcare",
    source: "HHS OCR, TechCrunch",
    year: "2024",
    link: "https://techcrunch.com/2024/10/24/unitedhealth-change-healthcare-hacked-millions-health-records-ransomware/",
    takeaway:
      "A single ungoverned identity path — a remote service without MFA — cascaded across roughly one in three U.S. patient records.",
  },
  {
    title:
      "Tribunal held airline liable for misinformation produced by its AI chatbot",
    industry: "Customer service",
    source: "BC Civil Resolution Tribunal, CBC News",
    year: "2024",
    link: "https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416",
    takeaway:
      "Companies remain legally accountable for what their AI says and does — provenance becomes the evidence record.",
  },
];

const TAKEAWAYS: {
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Access becomes action",
    body: "Agents do not just hold permissions. They use them across apps, APIs, MCP servers, and data systems.",
    Icon: KeySquare,
  },
  {
    title: "Authorization must move closer to execution",
    body: "Agent actions need runtime checks before tools, data, or external systems are used.",
    Icon: ShieldCheck,
  },
  {
    title: "Provenance becomes mandatory",
    body: "Teams need proof of who acted, what was allowed, what was blocked, and what outcome was produced.",
    Icon: FileSignature,
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

        {/* Signal cards — source-backed */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((s, i) => (
            <SignalView key={i} signal={s} index={i} />
          ))}
        </div>

        {/* Incident / precedent strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-soft-200 bg-white p-5 shadow-soft"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-100 bg-electric-50/70 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-500">
              <ScrollText className="h-3 w-3" />
              Incident &amp; precedent signals
            </span>
            <span className="text-[11.5px] text-ink-mute">
              Public, source-attributed cases — operational damage,
              regulatory exposure, and accountability precedents.
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {INCIDENTS.map((it, i) => (
              <IncidentView key={i} incident={it} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Summary strip — what this means for agentic workflows */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-3xl border border-electric-200 bg-gradient-to-b from-electric-50/40 to-white p-6 shadow-soft"
        >
          <div className="text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric-700">
              What this means for agentic workflows
            </span>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {TAKEAWAYS.map((t) => (
              <li
                key={t.title}
                className="flex items-start gap-3 rounded-2xl border border-soft-200 bg-white p-4"
              >
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-electric-100 text-electric-600 ring-1 ring-inset ring-white"
                  style={{
                    background:
                      "linear-gradient(180deg,#FFFFFF 0%,#EAF2FF 100%)",
                  }}
                >
                  <t.Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-navy-500">
                    {t.title}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-subtle">
                    {t.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
            <a
              href="#platform"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-electric-700 hover:text-electric-600"
            >
              See AgentDNA in action
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
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
      className="group relative flex h-full flex-col rounded-3xl border border-soft-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-electric-200 hover:shadow-card"
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
      <div className="mt-3 text-[14px] font-semibold leading-snug text-navy-500">
        {signal.organization}
      </div>

      {/* Signal body — source-backed paraphrase or verified quote */}
      <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-subtle">
        {signal.signal}
      </p>

      {/* Risk theme */}
      <div className="mt-4 flex items-center gap-2">
        <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-mute">
          Risk theme
        </span>
        <span className="inline-flex items-center rounded-full border border-electric-100 bg-electric-50/70 px-2 py-0.5 text-[11px] font-semibold text-navy-500">
          {signal.riskTheme}
        </span>
      </div>

      {/* Source line */}
      <div className="mt-3 border-t border-soft-200 pt-3">
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

/* ============================================================
 * Incident card — verified public reports / rulings
 * ============================================================ */

function IncidentView({
  incident,
  index,
}: {
  incident: IncidentCard;
  index: number;
}) {
  return (
    <motion.a
      href={incident.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex flex-col gap-2 rounded-2xl border border-soft-200 bg-soft-50/60 p-4 transition-all hover:border-electric-200 hover:bg-white"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-100 bg-electric-50/70 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-navy-500">
          <AlertTriangle className="h-2.5 w-2.5" />
          {incident.industry}
        </span>
        <span className="font-mono text-[9px] text-ink-mute">
          {incident.year}
        </span>
      </div>
      <h4 className="text-[13px] font-semibold leading-snug text-navy-500">
        {incident.title}
      </h4>
      <p className="text-[12px] leading-relaxed text-ink-subtle">
        {incident.takeaway}
      </p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="truncate font-mono text-[9.5px] text-ink-mute">
          {incident.source}
        </span>
        <span className="flex flex-none items-center gap-0.5 text-[10px] font-semibold text-electric-700">
          Source
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </motion.a>
  );
}

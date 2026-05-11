import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { FileSignature, Hash } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { AgentDNACharacter } from "./AgentDNACharacter";

/**
 * AgentsStory — cinematic threat-surface section.
 *
 *   Phase 1  (intro)     slow type: "Agents are not humans."
 *   Phase 2  (intro2)    fast: "They act faster than you can follow." + support
 *   Phase 3  (terminal)  command-center terminal streaming agent logs
 *   Phase 4  (chaos)     same enterprise DAG, now tangled & risky
 *   Phase 5  (transform) headline overlay: "AgentDNA turns agent sprawl…"
 *   Phase 6  (governed)  clean governed DAG matching the hero visual language
 *
 * The DAG uses the *same node positions* in both chaos and governed states —
 * only edges, labels, and overlays change — so the user reads "same system,
 * now controlled."
 */

type Phase =
  | "intro"
  | "intro2"
  | "terminal"
  | "chaos"
  | "transform"
  | "governed";

const PHASE_AT_MS: Record<Phase, number> = {
  intro:     0,
  intro2:    2800,
  terminal:  4200,
  chaos:     9000,
  transform: 12500,
  governed:  14000,
};

/* ============================================================
 * Main component
 * ============================================================ */

export function AgentsStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: true });

  const [phase, setPhase] = useState<Phase>("intro");
  const [typed1, setTyped1] = useState("");
  const [showLine2, setShowLine2] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    if (!inView) return;

    /* Slow type of line 1 — ~120 ms per character */
    const target = "Agents are not humans.";
    let i = 0;
    const typeId = window.setInterval(() => {
      i++;
      setTyped1(target.slice(0, i));
      if (i >= target.length) window.clearInterval(typeId);
    }, 120);

    /* Phase transitions */
    const timeouts: number[] = [];
    timeouts.push(window.setTimeout(() => setPhase("intro2"), PHASE_AT_MS.intro2));
    timeouts.push(window.setTimeout(() => setShowLine2(true), PHASE_AT_MS.intro2));
    timeouts.push(window.setTimeout(() => setShowSupport(true), PHASE_AT_MS.intro2 + 900));
    timeouts.push(window.setTimeout(() => setPhase("terminal"), PHASE_AT_MS.terminal));
    timeouts.push(window.setTimeout(() => setPhase("chaos"), PHASE_AT_MS.chaos));
    timeouts.push(window.setTimeout(() => setPhase("transform"), PHASE_AT_MS.transform));
    timeouts.push(window.setTimeout(() => setPhase("governed"), PHASE_AT_MS.governed));

    return () => {
      window.clearInterval(typeId);
      timeouts.forEach(window.clearTimeout);
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-radial py-24 text-white"
    >
      {/* faint grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 90%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 90%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.05] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/[0.03] to-transparent" />

      <div className="container-page relative">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-electric-200">
            The new threat surface
          </span>

          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-4xl lg:text-[44px]">
            <span>{typed1}</span>
            <span className="ml-1 inline-block h-[0.95em] w-[3px] -translate-y-[0.1em] bg-electric-300 align-middle animate-caret" />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={
              showLine2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
            }
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-3 text-[18px] font-medium text-white/85 sm:text-[22px]"
          >
            They act faster than you can follow.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={showSupport ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-4 max-w-3xl text-[13.5px] leading-relaxed text-white/55"
          >
            One unchecked action can turn trusted access into uncontrolled
            execution — spreading across tools, MCP servers, service accounts,
            and sensitive data before your enterprise can detect, contain, or
            prove what happened.
          </motion.p>
        </div>

        {/* Main stage — swaps content per phase */}
        <div className="relative mt-10 h-[460px] sm:h-[520px] lg:h-[580px]">
          <AnimatePresence mode="wait">
            {(phase === "intro" || phase === "intro2") && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <IdleHint />
              </motion.div>
            )}

            {phase === "terminal" && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <LiveActionTerminal />
              </motion.div>
            )}

            {(phase === "chaos" ||
              phase === "transform" ||
              phase === "governed") && (
              <motion.div
                key="dag"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <ThreatDAG phase={phase} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Final support line */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={
            phase === "governed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
          }
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-8 max-w-3xl text-center text-[13.5px] leading-relaxed text-white/60"
        >
          From fast-moving agent sprawl to governed execution and verifiable
          provenance.
        </motion.p>
      </div>
    </section>
  );
}

/* ============================================================
 * Idle hint (intro / intro2) — subtle prompt indicator
 * ============================================================ */

function IdleHint() {
  return (
    <div className="flex flex-col items-center gap-3 text-white/40">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-electric-400 opacity-60" />
        <span className="relative inline-block h-2 w-2 rounded-full bg-electric-400" />
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]">
        capturing agent activity…
      </span>
    </div>
  );
}

/* ============================================================
 * Live action terminal
 * ============================================================ */

type LogTone = "info" | "ok" | "warn" | "deny" | "system";

type LogLine = {
  tag: string;
  message: string;
  tone: LogTone;
};

const LOGS: LogLine[] = [
  { tag: "user",   message: "CFO request received",                          tone: "info" },
  { tag: "auth",   message: "user verified via Okta · MFA chain",            tone: "ok" },
  { tag: "agent",  message: "Finance Agent spawned",                          tone: "info" },
  { tag: "agent",  message: "Reporting Agent delegated",                      tone: "info" },
  { tag: "nhi",    message: "service account requested · svc-finance-q4",     tone: "ok" },
  { tag: "system", message: "context package attached · scope=Q4",            tone: "system" },
  { tag: "tool",   message: "MCP server invoked · browser",                    tone: "info" },
  { tag: "api",    message: "Salesforce API called · tickets.read",           tone: "ok" },
  { tag: "db",     message: "Snowflake query started · q4_revenue",           tone: "ok" },
  { tag: "agent",  message: "delegation chain updated · 3 hops",              tone: "system" },
  { tag: "tool",   message: "Browser tool invoked · approved",                 tone: "ok" },
  { tag: "api",    message: "external API requested · review.svc",            tone: "warn" },
  { tag: "data",   message: "revenue data retrieved · 28,402 rows",           tone: "ok" },
  { tag: "data",   message: "support ticket data compared · 14,116 rows",     tone: "ok" },
  { tag: "policy", message: "export request evaluated · scope=Q4",            tone: "system" },
  { tag: "risk",   message: "suspicious path detected · raw PII export",      tone: "warn" },
  { tag: "control",message: "raw customer export blocked · pii=deny",         tone: "deny" },
  { tag: "agent",  message: "unknown service account detected · svc-7af2",    tone: "warn" },
  { tag: "tool",   message: "MCP connection opened · code-interp",            tone: "info" },
  { tag: "system", message: "workflow branch spawned · summary",              tone: "system" },
  { tag: "api",    message: "external call retried · 1/3",                    tone: "warn" },
  { tag: "policy", message: "sensitive field access denied · ssn,dob",        tone: "deny" },
  { tag: "agent",  message: "approval required · K8s rollback",               tone: "warn" },
  { tag: "data",   message: "vector lookup · pinecone.embeddings",            tone: "info" },
  { tag: "output", message: "board summary generated · 12 sections",          tone: "ok" },
  { tag: "prov",   message: "audit record created · 0x4f1a…b8c2",             tone: "ok" },
  { tag: "prov",   message: "provenance hash committed · datadog",            tone: "ok" },
  { tag: "system", message: "execution chain finalized",                       tone: "ok" },
  { tag: "agent",  message: "Reporting Agent terminated",                      tone: "system" },
  { tag: "agent",  message: "Finance Agent terminated",                        tone: "system" },
];

const LOG_STAGGER_MS = 120;

function LiveActionTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(i + 1, LOGS.length);
      setVisibleCount(i);
      if (i >= LOGS.length) window.clearInterval(id);
    }, LOG_STAGGER_MS);
    return () => window.clearInterval(id);
  }, []);

  /* Auto-scroll so the newest line stays in view */
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [visibleCount]);

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#040C18]/95 shadow-card backdrop-blur">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">
            agent.execution.stream
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/45">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono">{visibleCount} / {LOGS.length} events</span>
        </div>
      </div>

      {/* Log scroller */}
      <div
        ref={scrollerRef}
        className="h-[calc(100%-40px)] overflow-hidden px-4 py-3 font-mono text-[12px] leading-[1.55]"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <ul className="space-y-[3px]">
          {LOGS.slice(0, visibleCount).map((l, i) => (
            <LogRow key={i} log={l} index={i} />
          ))}
          {visibleCount < LOGS.length && (
            <li className="flex items-center gap-2 text-white/40">
              <span className="font-mono">▍</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

const TONE_STYLES: Record<LogTone, { tag: string; msg: string; tagBg: string }> = {
  info:   { tag: "text-electric-200", msg: "text-white/80", tagBg: "bg-electric-500/15" },
  ok:     { tag: "text-emerald-300",  msg: "text-white/85", tagBg: "bg-emerald-500/15" },
  warn:   { tag: "text-amber-300",    msg: "text-amber-100/85", tagBg: "bg-amber-500/15" },
  deny:   { tag: "text-rose-300",     msg: "text-rose-100/85",  tagBg: "bg-rose-500/15" },
  system: { tag: "text-white/55",     msg: "text-white/55", tagBg: "bg-white/10" },
};

function LogRow({ log, index }: { log: LogLine; index: number }) {
  const t = TONE_STYLES[log.tone];
  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.005, 0.05) }}
      className="flex items-baseline gap-2"
    >
      <span className="select-none font-mono text-[10px] text-white/30">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`flex-none rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider ${t.tag} ${t.tagBg}`}
      >
        {log.tag}
      </span>
      <span className={`truncate ${t.msg}`}>{log.message}</span>
    </motion.li>
  );
}

/* ============================================================
 * Threat DAG — chaos and governed states share node positions
 * ============================================================ */

const DAG_VB_W = 1080;
const DAG_VB_H = 560;

type DagNode = {
  id: string;
  slug: string;
  label: string;
  x: number;
  y: number;
  /** Activates (electric blue card) during governed phase. */
  active: boolean;
  /** Deny target — rendered with a dashed red border in governed. */
  denied?: boolean;
};

const DAG_NODES: DagNode[] = [
  /* Identity (left) */
  { id: "u",     slug: "user",             label: "User",          x: 60,   y: 90,  active: true },
  { id: "okta",  slug: "okta",             label: "Okta",          x: 60,   y: 170, active: true },
  { id: "gws",   slug: "google-workspace", label: "Workspace",     x: 60,   y: 250, active: false },

  /* NHI */
  { id: "svc",   slug: "service",          label: "Service Acct",  x: 60,   y: 330, active: true },
  { id: "wkl",   slug: "service",          label: "Workload Id",   x: 60,   y: 410, active: false },

  /* Agents */
  { id: "ag_f",  slug: "agent",            label: "Finance Agt",   x: 220,  y: 130, active: true },
  { id: "ag_r",  slug: "agent",            label: "Reporting Agt", x: 220,  y: 230, active: true },
  { id: "ag_u",  slug: "agent",            label: "Unknown Agt",   x: 220,  y: 340, active: false },

  /* MCP / Tools */
  { id: "mcp",   slug: "mcp",              label: "MCP Server",    x: 400,  y: 170, active: true },
  { id: "browser",slug: "tools",           label: "Browser",       x: 400,  y: 260, active: false },
  { id: "code",  slug: "tools",            label: "Code Interp",   x: 400,  y: 350, active: true },

  /* Apps */
  { id: "sf",    slug: "salesforce",       label: "Salesforce",    x: 580,  y: 110, active: true },
  { id: "jira",  slug: "jira",             label: "Jira",          x: 580,  y: 200, active: false },
  { id: "slack", slug: "slack",            label: "Slack",         x: 580,  y: 290, active: true },
  { id: "wd",    slug: "workday",          label: "Workday",       x: 580,  y: 380, active: false },

  /* Cloud */
  { id: "aws",   slug: "aws",              label: "AWS",           x: 760,  y: 200, active: true },
  { id: "azure", slug: "azure",            label: "Azure",         x: 760,  y: 290, active: false },

  /* Data */
  { id: "snow",  slug: "snowflake",        label: "Snowflake",     x: 760,  y: 90,  active: true },
  { id: "pg",    slug: "postgresql",       label: "Postgres",      x: 760,  y: 380, active: false },
  { id: "pine",  slug: "pinecone",         label: "Pinecone",      x: 760,  y: 470, active: false },

  /* External (deny target) */
  { id: "deny",  slug: "tools",            label: "External Email",x: 940,  y: 100, active: false, denied: true },

  /* Output + Provenance */
  { id: "out",   slug: "tools",            label: "Board Summary", x: 940,  y: 230, active: true },
  { id: "prov",  slug: "service",          label: "Provenance",    x: 940,  y: 380, active: true },
];

type DagEdge = {
  id: string;
  from: string;
  to: string;
  kind: "active" | "deny" | "provenance" | "bg";
  atgc?: ("A" | "T" | "G" | "C")[];
};

const ACTIVE_EDGES: DagEdge[] = [
  { id: "a1",  from: "u",     to: "okta",  kind: "active",     atgc: ["A","T"] },
  { id: "a2",  from: "okta",  to: "ag_f",  kind: "active",     atgc: ["A","T","G"] },
  { id: "a3",  from: "okta",  to: "ag_r",  kind: "active",     atgc: ["A","T","G"] },
  { id: "a4",  from: "ag_f",  to: "svc",   kind: "active",     atgc: ["A","T","G","C"] },
  { id: "a5",  from: "ag_f",  to: "sf",    kind: "active",     atgc: ["G","C"] },
  { id: "a6",  from: "svc",   to: "snow",  kind: "active",     atgc: ["A","T","G","C"] },
  { id: "a7",  from: "ag_r",  to: "mcp",   kind: "active",     atgc: ["A","T","G"] },
  { id: "a8",  from: "mcp",   to: "code",  kind: "active",     atgc: ["T","G","C"] },
  { id: "a9",  from: "ag_r",  to: "out",   kind: "active",     atgc: ["T","G","C"] },
  { id: "a10", from: "out",   to: "slack", kind: "active",     atgc: ["G","C"] },
  { id: "a11", from: "ag_f",  to: "aws",   kind: "active",     atgc: ["G","C"] },
  { id: "d1",  from: "ag_f",  to: "deny",  kind: "deny",       atgc: ["G","C"] },
  { id: "p1",  from: "snow",  to: "prov",  kind: "provenance" },
  { id: "p2",  from: "sf",    to: "prov",  kind: "provenance" },
  { id: "p3",  from: "out",   to: "prov",  kind: "provenance" },
  { id: "p4",  from: "aws",   to: "prov",  kind: "provenance" },
];

/** Faint grey background edges — show in both chaos and governed. */
const BG_EDGES: { from: string; to: string }[] = [
  { from: "okta", to: "gws" },
  { from: "gws", to: "wkl" },
  { from: "wkl", to: "browser" },
  { from: "browser", to: "jira" },
  { from: "jira", to: "wd" },
  { from: "azure", to: "pg" },
  { from: "pine", to: "pg" },
  { from: "ag_u", to: "browser" },
  { from: "ag_u", to: "code" },
  { from: "pg", to: "prov" },
];

/* Extra chaos edges — only visible during chaos phase. Procedurally chosen
 * between random node pairs to create overlap and complexity. */
const CHAOS_EDGES: { from: string; to: string; risky?: boolean }[] = [
  { from: "ag_u", to: "deny", risky: true },
  { from: "svc",  to: "ag_u" },
  { from: "ag_u", to: "wd" },
  { from: "ag_u", to: "pg" },
  { from: "ag_r", to: "jira" },
  { from: "ag_f", to: "code" },
  { from: "ag_f", to: "wd" },
  { from: "browser", to: "deny", risky: true },
  { from: "code", to: "azure" },
  { from: "code", to: "pine" },
  { from: "mcp", to: "browser" },
  { from: "mcp", to: "sf" },
  { from: "mcp", to: "jira" },
  { from: "sf",  to: "wd" },
  { from: "slack", to: "wd" },
  { from: "ag_r", to: "pine" },
  { from: "ag_r", to: "browser" },
  { from: "aws", to: "pg" },
  { from: "snow", to: "azure" },
  { from: "snow", to: "pine" },
  { from: "okta", to: "mcp" },
  { from: "okta", to: "browser" },
  { from: "u",   to: "ag_u" },
  { from: "wkl", to: "code" },
  { from: "wkl", to: "deny", risky: true },
  { from: "ag_u", to: "snow" },
  { from: "ag_u", to: "azure" },
  { from: "browser", to: "pine" },
  { from: "code", to: "out" },
  { from: "mcp",  to: "code" },
  { from: "okta", to: "ag_u" },
  { from: "ag_f", to: "ag_u" },
  { from: "browser", to: "code" },
  { from: "browser", to: "wd" },
  { from: "ag_r", to: "wd" },
  { from: "svc",  to: "wd" },
  { from: "svc",  to: "browser" },
  { from: "ag_u", to: "out", risky: true },
  { from: "ag_u", to: "slack" },
];

/* Warning labels scattered across the chaos canvas */
const CHAOS_LABELS: { text: string; x: number; y: number; warn?: boolean }[] = [
  { text: "Unknown Agent",       x: 220, y: 380, warn: true },
  { text: "Service Account",     x: 60,  y: 460 },
  { text: "API Key",             x: 760, y: 530 },
  { text: "MCP Server",          x: 400, y: 410 },
  { text: "Tool Call",           x: 400, y: 110 },
  { text: "External API",        x: 940, y: 50,  warn: true },
  { text: "Shadow Workflow",     x: 280, y: 50,  warn: true },
  { text: "Over-Privileged",     x: 540, y: 50,  warn: true },
  { text: "Unclear Owner",       x: 320, y: 470, warn: true },
  { text: "No Provenance",       x: 660, y: 460, warn: true },
  { text: "Raw Data Path",       x: 840, y: 530, warn: true },
  { text: "Unverified Delegation", x: 140, y: 50, warn: true },
];

/* AgentDNA Protected sample paths visible inside chaos — coherent
 * governed islands inside the sprawl. */
const PROTECTED_CHAOS: { from: string; to: string; atgc: ("A"|"T"|"G"|"C")[] }[] = [
  { from: "u",    to: "okta", atgc: ["A","T"] },
  { from: "okta", to: "ag_f", atgc: ["A","T","G"] },
  { from: "ag_f", to: "svc",  atgc: ["A","T","G","C"] },
];

/* ============================================================
 * Curve helper
 * ============================================================ */

function curve(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const c1x = a.x + dx * 0.45;
  const c1y = a.y + dy * 0.08;
  const c2x = b.x - dx * 0.45;
  const c2y = b.y - dy * 0.08;
  return `M ${a.x} ${a.y} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${b.x} ${b.y}`;
}

/* ============================================================
 * ThreatDAG — renders chaos or governed based on phase
 * ============================================================ */

function ThreatDAG({ phase }: { phase: Phase }) {
  const nodeMap = useMemo(() => {
    const m = new Map<string, DagNode>();
    DAG_NODES.forEach((n) => m.set(n.id, n));
    return m;
  }, []);

  const isChaos = phase === "chaos" || phase === "transform";
  const isGoverned = phase === "governed";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-card">
      {/* depth wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(45,125,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* Phase chip */}
      <div className="absolute left-3 top-3 z-10 rounded-full border border-soft-200 bg-white/95 px-2.5 py-1 text-[10.5px] font-medium text-navy-500 backdrop-blur">
        <span
          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
            isGoverned ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        <span className="font-mono uppercase tracking-wider">
          {isGoverned ? "Governed" : "Chaotic"}
        </span>
        <span className="mx-1.5 text-ink-mute">·</span>
        <span className="font-mono">
          {isGoverned ? "16 active · 1 blocked" : "Same system · sprawl"}
        </span>
      </div>

      {/* Same-system caption (only during chaos) */}
      <AnimatePresence>
        {phase === "chaos" && (
          <motion.div
            key="same-cap"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="absolute right-3 top-3 z-10 rounded-full border border-amber-300/40 bg-amber-500/15 px-2.5 py-1 text-[10.5px] font-medium text-amber-700 backdrop-blur"
          >
            <span className="font-mono uppercase tracking-wider">
              Same DAG · too many interactions to follow
            </span>
          </motion.div>
        )}
        {phase === "governed" && (
          <motion.div
            key="gov-cap"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="absolute right-3 top-3 z-10 rounded-full border border-electric-300/50 bg-electric-50 px-2.5 py-1 text-[10.5px] font-medium text-electric-700 backdrop-blur"
          >
            <span className="font-mono uppercase tracking-wider">
              Governed · ATGC controls applied
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transformation message overlay during transform phase */}
      <AnimatePresence>
        {phase === "transform" && (
          <motion.div
            key="transform-msg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 rounded-2xl border border-electric-300/60 bg-white/95 px-5 py-4 text-center shadow-card backdrop-blur"
          >
            <p className="font-display text-[16px] font-semibold leading-snug text-navy-500 sm:text-[20px]">
              AgentDNA turns agent sprawl into{" "}
              <span className="text-electric-700">
                clear, controlled, and provable
              </span>{" "}
              execution.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox={`0 0 ${DAG_VB_W} ${DAG_VB_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="td-active" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D7DFF" />
            <stop offset="100%" stopColor="#6E9DFF" />
          </linearGradient>
          <radialGradient id="td-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2D7DFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2D7DFF" stopOpacity="0" />
          </radialGradient>
          <filter id="td-protect-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Background edges (always faint) */}
        <g>
          {BG_EDGES.map((e, i) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            return (
              <path
                key={i}
                d={curve(a, b)}
                fill="none"
                stroke="rgba(10,34,64,0.14)"
                strokeWidth={1}
                strokeDasharray="3 4"
              />
            );
          })}
        </g>

        {/* Chaos edges — only during chaos / transform */}
        <AnimatePresence>
          {isChaos && (
            <motion.g
              key="chaos-edges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {CHAOS_EDGES.map((e, i) => {
                const a = nodeMap.get(e.from);
                const b = nodeMap.get(e.to);
                if (!a || !b) return null;
                return (
                  <path
                    key={i}
                    d={curve(a, b)}
                    fill="none"
                    stroke={
                      e.risky
                        ? "rgba(239,68,68,0.55)"
                        : "rgba(10,34,64,0.22)"
                    }
                    strokeWidth={e.risky ? 1.1 : 0.9}
                    strokeDasharray={e.risky ? undefined : i % 2 === 0 ? "3 4" : undefined}
                  />
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Protected chaos islands — visible during chaos */}
        <AnimatePresence>
          {isChaos && (
            <motion.g
              key="protected-chaos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {PROTECTED_CHAOS.map((p, i) => {
                const a = nodeMap.get(p.from);
                const b = nodeMap.get(p.to);
                if (!a || !b) return null;
                const path = curve(a, b);
                return (
                  <g key={i}>
                    <path d={path} fill="none" stroke="#2D7DFF" strokeWidth={3.6} opacity={0.28} filter="url(#td-protect-glow)" />
                    <path d={path} fill="none" stroke="url(#td-active)" strokeWidth={1.5} />
                    <ATGCPill x={(a.x + b.x) / 2} y={(a.y + b.y) / 2} letters={p.atgc} />
                  </g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Warning labels — only during chaos */}
        <AnimatePresence>
          {isChaos && (
            <motion.g
              key="chaos-labels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {CHAOS_LABELS.map((l, i) => (
                <g key={i}>
                  <rect
                    x={l.x - 60}
                    y={l.y - 9}
                    width={120}
                    height={17}
                    rx={8.5}
                    fill={l.warn ? "rgba(220,38,38,0.12)" : "rgba(10,34,64,0.05)"}
                    stroke={l.warn ? "rgba(239,68,68,0.55)" : "rgba(10,34,64,0.22)"}
                    strokeWidth={0.8}
                  />
                  <text
                    x={l.x}
                    y={l.y + 3.5}
                    fontFamily="JetBrains Mono, ui-monospace, monospace"
                    fontSize={9.5}
                    fontWeight={700}
                    fill={l.warn ? "#B91C1C" : "#475569"}
                    textAnchor="middle"
                  >
                    {l.text}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Active workflow edges — only during governed */}
        <AnimatePresence>
          {isGoverned && (
            <motion.g key="active-edges">
              {ACTIVE_EDGES.filter((e) => e.kind === "active").map((e, i) => {
                const a = nodeMap.get(e.from)!;
                const b = nodeMap.get(e.to)!;
                return (
                  <motion.path
                    key={e.id}
                    d={curve(a, b)}
                    fill="none"
                    stroke="url(#td-active)"
                    strokeWidth={1.5}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: i * 0.06 }}
                  />
                );
              })}

              {/* Provenance edges */}
              {ACTIVE_EDGES.filter((e) => e.kind === "provenance").map((e, i) => {
                const a = nodeMap.get(e.from)!;
                const b = nodeMap.get(e.to)!;
                return (
                  <motion.path
                    key={e.id}
                    d={curve(a, b)}
                    fill="none"
                    stroke="rgba(110,157,255,0.55)"
                    strokeWidth={0.9}
                    strokeDasharray="1 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.9 + i * 0.06 }}
                  />
                );
              })}

              {/* Deny edge */}
              {ACTIVE_EDGES.filter((e) => e.kind === "deny").map((e) => {
                const a = nodeMap.get(e.from)!;
                const b = nodeMap.get(e.to)!;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const px = b.x - dx * 0.18;
                const py = b.y - dy * 0.18;
                return (
                  <g key={e.id}>
                    <motion.path
                      d={curve(a, b)}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth={1.4}
                      strokeDasharray="5 4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    />
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    >
                      <circle cx={px} cy={py} r={9} fill="#EF4444" opacity={0.22}>
                        <animate attributeName="r" values="7;13;7" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={px} cy={py} r={5} fill="#EF4444" />
                      <line x1={px - 2.4} y1={py - 2.4} x2={px + 2.4} y2={py + 2.4} stroke="white" strokeWidth={1.4} />
                      <line x1={px + 2.4} y1={py - 2.4} x2={px - 2.4} y2={py + 2.4} stroke="white" strokeWidth={1.4} />
                    </motion.g>
                  </g>
                );
              })}

              {/* ATGC pills at active edge midpoints */}
              {ACTIVE_EDGES.filter((e) => e.atgc?.length).map((e, i) => {
                const a = nodeMap.get(e.from)!;
                const b = nodeMap.get(e.to)!;
                return (
                  <ATGCPill
                    key={`pill-${e.id}`}
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2}
                    letters={e.atgc!}
                    denyTone={e.kind === "deny"}
                    delay={0.5 + i * 0.06}
                    animateIn
                  />
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Nodes — always rendered, but visual state depends on phase */}
        <g>
          {DAG_NODES.map((n) => (
            <NodeCard key={n.id} node={n} isGoverned={isGoverned} />
          ))}
        </g>

        {/* Character — bottom-right corner. Emits pulses during chaos. */}
        <foreignObject x={DAG_VB_W - 110} y={DAG_VB_H - 110} width={108} height={108}>
          <div className="relative flex h-full w-full items-end justify-end">
            {(isChaos || isGoverned) && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-2 rounded-full border"
                    style={{ borderColor: "rgba(45,125,255,0.5)", width: 40, height: 40 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 2.4], opacity: [0.6, 0] }}
                    transition={{
                      duration: 3.4,
                      delay: i * 1.1,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
            <AgentDNACharacter
              size={56}
              variant="subtle"
              mood={isGoverned ? "protect" : "guide"}
              float
            />
          </div>
        </foreignObject>
      </svg>

      {/* Provenance Record overlay during governed */}
      <AnimatePresence>
        {isGoverned && (
          <motion.div
            key="prov"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="absolute bottom-3 left-3 w-[240px] rounded-2xl border border-electric-200 bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-soft-200 px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <FileSignature className="h-3.5 w-3.5 text-electric-600" />
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-500">
                  Provenance Record
                </span>
              </div>
              <span className="flex items-center gap-1 font-mono text-[8.5px] text-ink-mute">
                <Hash className="h-2.5 w-2.5" />
                0x4f1a…b8c2
              </span>
            </div>
            <ul className="px-2.5 py-1.5">
              {[
                "User verified · Okta MFA",
                "Agents bound · Finance · Reporting",
                "Service account · scope=Q4",
                "Policy enforced · pii=deny",
                "Output recorded · slack.deliver",
                "Blocked path noted · external email",
              ].map((row, i) => (
                <motion.li
                  key={row}
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.6 + i * 0.07 }}
                  className="flex items-center gap-1.5 py-[2px]"
                >
                  <span
                    className={`h-1.5 w-1.5 flex-none rounded-full ${
                      row.startsWith("Blocked") ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-mono text-[9.5px] text-navy-500">
                    {row}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
 * Node card (matches hero visual style)
 * ============================================================ */

function NodeCard({
  node,
  isGoverned,
}: {
  node: DagNode;
  isGoverned: boolean;
}) {
  const w = 116;
  const h = 28;
  const showActive = isGoverned && node.active;
  const isDenied = !!node.denied;

  return (
    <motion.g
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {showActive && (
        <circle cx={node.x} cy={node.y} r={20} fill="url(#td-glow)" opacity={0.45} />
      )}
      <foreignObject x={node.x - w / 2} y={node.y - h / 2} width={w} height={h}>
        <div
          className="flex h-full w-full items-center gap-1 rounded-md bg-white px-1.5"
          style={{
            border: isDenied
              ? "1px dashed rgba(239,68,68,0.55)"
              : showActive
                ? "1px solid #9EBEFF"
                : "1px solid rgba(10,34,64,0.14)",
            boxShadow: showActive
              ? "0 3px 10px rgba(45,125,255,0.18)"
              : "0 1px 2px rgba(10,34,64,0.04)",
            opacity: showActive ? 1 : 0.58,
            filter: showActive ? "none" : "saturate(0.3)",
            transition:
              "border-color 700ms ease, box-shadow 700ms ease, opacity 700ms ease, filter 700ms ease",
          }}
        >
          <span className="flex h-4 w-4 flex-none items-center justify-center">
            <BrandLogo slug={node.slug} size={12} bare title={node.label} />
          </span>
          <span
            className="truncate text-[9.5px] font-semibold leading-none"
            style={{ color: showActive ? "#0A2240" : "#64748B" }}
          >
            {node.label}
          </span>
          {isDenied ? (
            <span className="ml-auto rounded-sm bg-rose-50 px-1 font-mono text-[7.5px] font-bold uppercase text-rose-600">
              deny
            </span>
          ) : (
            <span
              className="ml-auto inline-block h-1 w-1 flex-none rounded-full"
              style={{ background: showActive ? "#2D7DFF" : "#CBD5E1" }}
            />
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}

/* ============================================================
 * ATGC pill (grouped badge)
 * ============================================================ */

function ATGCPill({
  x,
  y,
  letters,
  delay = 0,
  animateIn = false,
  denyTone = false,
}: {
  x: number;
  y: number;
  letters: ("A" | "T" | "G" | "C")[];
  delay?: number;
  animateIn?: boolean;
  denyTone?: boolean;
}) {
  const padX = 3;
  const cellW = 11;
  const cellGap = 1.5;
  const innerW = letters.length * cellW + (letters.length - 1) * cellGap;
  const totalW = innerW + padX * 2;
  const totalH = 14;

  const cellColor = denyTone ? "#EF4444" : "#2D7DFF";
  const pillStroke = denyTone ? "#EF4444" : "#2D7DFF";

  return (
    <motion.g
      initial={animateIn ? { opacity: 0, scale: 0.92 } : { opacity: 1 }}
      animate={animateIn ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.35, delay }}
      transform={`translate(${x - totalW / 2} ${y - totalH / 2})`}
    >
      <rect
        width={totalW}
        height={totalH}
        rx={7}
        fill="#FFFFFF"
        stroke={pillStroke}
        strokeWidth={0.9}
      />
      {letters.map((letter, i) => {
        const cx = padX + i * (cellW + cellGap);
        return (
          <g key={`${letter}-${i}`}>
            <rect x={cx} y={2} width={cellW} height={totalH - 4} rx={2.4} fill={cellColor} />
            <text
              x={cx + cellW / 2}
              y={totalH / 2 + 2.6}
              textAnchor="middle"
              fontFamily="JetBrains Mono, ui-monospace, monospace"
              fontSize={8}
              fontWeight={800}
              fill="#FFFFFF"
            >
              {letter}
            </text>
          </g>
        );
      })}
    </motion.g>
  );
}

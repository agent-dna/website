import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Fingerprint,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { AgentDNACharacter, type Mood } from "./AgentDNACharacter";

/**
 * Capabilities — character-led explainer for COCA / CBAC / IP.
 *
 *   Left column (lg col-5):
 *     - Large AgentDNA character (mood gestures toward the active concept)
 *     - Active concept's mini-DAG visual cross-fades below
 *
 *   Right column (lg col-7):
 *     - Three stacked, interactive concept cards (COCA, CBAC, IP)
 *     - Hover or click activates a card; the other two quiet down
 *
 *   Below:
 *     - "How they work together" strip
 *     - Final supporting line
 *
 * Auto-cycles through the three concepts every 6.5 s; user interaction
 * pauses auto for 8 s, then resumes.
 */

type ConceptId = "coca" | "cbac" | "ip";

type Concept = {
  id: ConceptId;
  short: string;
  fullName: string;
  headline: string;
  description: string;
  bullets: string[];
  simpleLine: string;
  question: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** AgentDNA character mood when this concept is active. */
  mood: Mood;
  Visual: () => ReactElement;
};

const CONCEPTS: Concept[] = [
  {
    id: "coca",
    short: "COCA",
    fullName: "Chain-of-Custody Authentication",
    headline: "Keep identity intact across every handoff.",
    description:
      "COCA cryptographically binds every step of a workflow to the user, agent, service account, MCP, tool, API, and system involved. Identity does not disappear as work moves across autonomous systems.",
    bullets: [
      "Verifies users, agents, service accounts, and workload identities",
      "Preserves delegation lineage across multi-agent workflows",
      "Separates direct user actions from delegated agent actions",
      "Prevents identity ambiguity across handoffs",
    ],
    simpleLine: "COCA proves the actor.",
    question: "Who or what actually acted?",
    Icon: Fingerprint,
    mood: "guide",
    Visual: COCAVisual,
  },
  {
    id: "cbac",
    short: "CBAC",
    fullName: "Context-Based Authorization",
    headline: "Authorize each action based on intent, scope, and runtime context.",
    description:
      "CBAC decides whether an action is allowed for this user, this agent, this task, this tool, this data, and this moment. It keeps agent access bounded to the approved workflow.",
    bullets: [
      "Evaluates identity, intent, task, data sensitivity, and system state",
      "Enforces least privilege at runtime",
      "Limits what agents can access, invoke, export, or modify",
      "Blocks scope drift, privilege misuse, and unsafe delegation",
    ],
    simpleLine: "CBAC controls the action.",
    question: "Was this action allowed in this context?",
    Icon: ShieldCheck,
    mood: "protect",
    Visual: CBACVisual,
  },
  {
    id: "ip",
    short: "IP",
    fullName: "Immutable Provenance",
    headline: "Turn every action into verifiable evidence.",
    description:
      "IP records agent actions, delegations, policy decisions, data access, blocked paths, and outputs as tamper-evident evidence — a trusted execution history for audit, compliance, debugging, and forensics.",
    bullets: [
      "Captures full execution lineage from prompt to outcome",
      "Records allowed, limited, and blocked decisions",
      "Creates audit-ready evidence across systems",
      "Supports fast forensic reconstruction",
    ],
    simpleLine: "IP proves the outcome.",
    question: "Can we prove what happened later?",
    Icon: Lock,
    mood: "guide",
    Visual: IPVisual,
  },
];

const CYCLE_MS = 6500;
const PAUSE_MS = 8000;

export function Capabilities() {
  const [activeId, setActiveId] = useState<ConceptId>("coca");
  const [auto, setAuto] = useState(true);
  const resumeRef = useRef<number | undefined>(undefined);

  /* Auto-cycle */
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => {
      setActiveId((cur) => {
        const idx = CONCEPTS.findIndex((c) => c.id === cur);
        return CONCEPTS[(idx + 1) % CONCEPTS.length].id;
      });
    }, CYCLE_MS);
    return () => window.clearInterval(t);
  }, [auto]);

  function nudge(id: ConceptId) {
    setActiveId(id);
    setAuto(false);
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setAuto(true), PAUSE_MS);
  }

  const active = CONCEPTS.find((c) => c.id === activeId)!;

  return (
    <section id="capabilities" className="relative bg-white py-24">
      {/* faint blue wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(45,125,255,0.05) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="container-page relative">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Core Capabilities</span>
          <h2 className="section-title mt-4">
            <span className="text-electric-600">Authenticate</span> the chain.{" "}
            <span className="text-electric-600">Authorize</span> the action.{" "}
            <span className="text-electric-600">Observe</span> the outcome.
          </h2>
          <p className="section-sub mx-auto">
            AgentDNA gives every workflow identity continuity, context-aware
            authorization, and verifiable provenance — from prompt to outcome.
          </p>
        </div>

        {/* Main grid: character stage (left) + concept cards (right) */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left — character stage */}
          <div className="lg:col-span-5">
            <CharacterStage active={active} />
          </div>

          {/* Right — three stacked cards */}
          <div className="lg:col-span-7">
            <ul className="flex flex-col gap-3">
              {CONCEPTS.map((c) => (
                <ConceptCard
                  key={c.id}
                  concept={c}
                  isActive={c.id === activeId}
                  onActivate={() => nudge(c.id)}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* How they work together */}
        <FlowStrip activeId={activeId} />
      </div>
    </section>
  );
}

/* ============================================================
 * Character stage (left column)
 * ============================================================ */

function CharacterStage({ active }: { active: Concept }) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-soft-200 bg-white p-5 shadow-soft"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 0%, rgba(45,125,255,0.06) 0%, rgba(255,255,255,0) 60%), white",
      }}
    >
      {/* Character */}
      <div className="relative flex h-[180px] flex-none items-center justify-center">
        {/* faint orbital backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            className="block rounded-full"
            style={{
              width: 240,
              height: 240,
              background:
                "radial-gradient(closest-side, rgba(45,125,255,0.10), rgba(45,125,255,0) 70%)",
              filter: "blur(8px)",
            }}
          />
        </div>
        <AgentDNACharacter
          size={130}
          variant="default"
          mood={active.mood}
          float
        />
      </div>

      {/* Active acronym + buyer question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="mt-1 text-center"
        >
          <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-electric-700">
            {active.short}
          </span>
          <p className="mt-0.5 text-[12.5px] italic text-ink-subtle">
            “{active.question}”
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Active mini-DAG visual */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-soft-200 bg-gradient-to-b from-soft-50 to-white p-3">
        <div className="h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <active.Visual />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Concept card (right column row)
 * ============================================================ */

function ConceptCard({
  concept,
  isActive,
  onActivate,
}: {
  concept: Concept;
  isActive: boolean;
  onActivate: () => void;
}) {
  const { Icon } = concept;
  return (
    <li>
      <motion.article
        onMouseEnter={onActivate}
        onClick={onActivate}
        animate={{
          opacity: isActive ? 1 : 0.55,
          scale: isActive ? 1 : 0.99,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-5 transition-colors ${
          isActive
            ? "border-electric-300 bg-electric-50/30 shadow-card"
            : "border-soft-200 bg-white shadow-soft hover:border-electric-200"
        }`}
      >
        {/* electric left rail when active */}
        {isActive && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] rounded-l-3xl bg-electric-500"
          />
        )}

        <div className="flex items-start gap-3.5">
          {/* icon tile */}
          <div
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-electric-100 text-electric-600 ring-1 ring-inset ring-white"
            style={{
              background: "linear-gradient(180deg,#FFFFFF 0%,#EAF2FF 100%)",
            }}
          >
            <Icon className="h-4 w-4" />
          </div>

          {/* head */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-electric-700">
                {concept.short}
              </span>
              <span className="text-[11.5px] text-ink-mute">
                · {concept.fullName}
              </span>
            </div>
            <h3 className="mt-1 font-display text-[16.5px] font-semibold leading-snug text-navy-500">
              {concept.headline}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-subtle">
              {concept.description}
            </p>
          </div>
        </div>

        {/* bullets — only on active */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 grid grid-cols-1 gap-1 overflow-hidden pl-12 sm:grid-cols-2"
            >
              {concept.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-1.5 text-[12.5px] text-ink-subtle"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-electric-500" />
                  <span>{b}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* footer simple line */}
        <div className="mt-3 border-t border-soft-200 pt-3 pl-12">
          <span
            className={`text-[13px] font-semibold ${
              isActive ? "text-electric-700" : "text-ink-mute"
            }`}
          >
            {concept.simpleLine}
          </span>
        </div>
      </motion.article>
    </li>
  );
}

/* ============================================================
 * Mini-DAG visuals
 * ============================================================ */

function COCAVisual() {
  const nodes: { slug: string; label: string }[] = [
    { slug: "user",       label: "User" },
    { slug: "agent",      label: "Agent" },
    { slug: "service",    label: "Service" },
    { slug: "mcp",        label: "MCP" },
    { slug: "api",        label: "API" },
    { slug: "tools",      label: "Output" },
  ];
  const VB_W = 360;
  const VB_H = 130;
  const stepX = (VB_W - 36) / (nodes.length - 1);
  const cy = 56;
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cocav-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9EBEFF" />
          <stop offset="100%" stopColor="#2D7DFF" />
        </linearGradient>
      </defs>

      <line
        x1={18}
        y1={cy}
        x2={VB_W - 18}
        y2={cy}
        stroke="url(#cocav-line)"
        strokeWidth={1.5}
      />

      {/* travelling pulse */}
      <circle r={2.4} fill="#2D7DFF" opacity={0.85}>
        <animate
          attributeName="cx"
          values={`18;${VB_W - 18}`}
          dur="4.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.95;0.95;0"
          keyTimes="0;0.05;0.85;1"
          dur="4.2s"
          repeatCount="indefinite"
        />
      </circle>

      {nodes.map((n, i) => {
        const cx = 18 + i * stepX;
        return (
          <g key={n.slug}>
            <circle cx={cx} cy={cy} r={15} fill="white" stroke="#9EBEFF" strokeWidth={1.2} />
            <foreignObject x={cx - 11} y={cy - 11} width={22} height={22}>
              <div className="flex h-full w-full items-center justify-center">
                <BrandLogo slug={n.slug} size={14} bare title={n.label} />
              </div>
            </foreignObject>
            {/* verified tick */}
            <circle cx={cx + 11} cy={cy - 11} r={5.5} fill="#10B981" />
            <path
              d={`M ${cx + 8.6} ${cy - 11} l 1.7 1.7 l 3.0 -3.0`}
              fill="none"
              stroke="white"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={cx}
              y={cy + 30}
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={10}
              fontWeight={600}
              fill="#475569"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CBACVisual() {
  const VB_W = 360;
  const VB_H = 130;
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Agent (left) */}
      <g transform="translate(36, 65)">
        <rect x={-26} y={-15} width={52} height={30} rx={7} fill="white" stroke="#9EBEFF" />
        <text textAnchor="middle" dy="3.5" fontFamily="Inter, system-ui, sans-serif" fontSize={10} fontWeight={700} fill="#0A2240">
          Agent
        </text>
      </g>

      {/* connector to checkpoint */}
      <line x1={62} y1={65} x2={148} y2={65} stroke="#9EBEFF" strokeWidth={1.5} />

      {/* Decision diamond */}
      <g transform="translate(170, 65)">
        <polygon
          points="0,-20 20,0 0,20 -20,0"
          fill="#FFFFFF"
          stroke="#1D5FD9"
          strokeWidth={1.4}
        />
        <text
          textAnchor="middle"
          dy="3.4"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={9}
          fontWeight={700}
          fill="#1D5FD9"
        >
          ATGC
        </text>
      </g>

      {/* travelling pulse arriving at diamond */}
      <circle r={2.4} fill="#2D7DFF">
        <animate attributeName="cx" values="62;148" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="65;65" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.1;0.85;1" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* three branches */}
      {(
        [
          { y: 25, label: "Allow", fg: "#1D5FD9", bg: "#EAF2FF", border: "#9EBEFF", stroke: "#2D7DFF" },
          { y: 65, label: "Limit", fg: "#92400E", bg: "#FFFBEB", border: "#FCD34D", stroke: "#F59E0B" },
          { y: 105, label: "Block", fg: "#9F1239", bg: "#FFF1F2", border: "#FDA4AF", stroke: "#EF4444" },
        ] as const
      ).map((b) => (
        <g key={b.label}>
          <line
            x1={190}
            y1={65}
            x2={262}
            y2={b.y}
            stroke={b.stroke}
            strokeWidth={1.4}
            strokeDasharray={b.label === "Block" ? "4 3" : undefined}
          />
          <g transform={`translate(310, ${b.y})`}>
            <rect
              x={-46}
              y={-12}
              width={92}
              height={24}
              rx={12}
              fill={b.bg}
              stroke={b.border}
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              dy="3.5"
              fontFamily="JetBrains Mono, ui-monospace, monospace"
              fontSize={10}
              fontWeight={700}
              fill={b.fg}
            >
              {b.label.toUpperCase()}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

function IPVisual() {
  const VB_W = 360;
  const VB_H = 130;
  const cy = 28;
  const stepX = 44;
  const startX = 22;
  const nodes: { slug: string; label: string }[] = [
    { slug: "user", label: "User" },
    { slug: "agent", label: "Agent" },
    { slug: "tools", label: "Tool" },
    { slug: "salesforce", label: "Data" },
    { slug: "tools", label: "Output" },
  ];
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="ipv-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9EBEFF" />
          <stop offset="100%" stopColor="#2D7DFF" />
        </linearGradient>
      </defs>

      <line
        x1={startX}
        y1={cy}
        x2={startX + stepX * (nodes.length - 1)}
        y2={cy}
        stroke="url(#ipv-line)"
        strokeWidth={1.4}
      />

      {nodes.map((n, i) => {
        const cx = startX + i * stepX;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={11} fill="white" stroke="#9EBEFF" strokeWidth={1.2} />
            <foreignObject x={cx - 7} y={cy - 7} width={14} height={14}>
              <div className="flex h-full w-full items-center justify-center">
                <BrandLogo slug={n.slug} size={10} bare />
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* dashed drop into provenance card */}
      <line
        x1={startX + stepX * (nodes.length - 1)}
        y1={cy + 11}
        x2={startX + stepX * (nodes.length - 1)}
        y2={62}
        stroke="#9EBEFF"
        strokeWidth={1.2}
        strokeDasharray="2 3"
      />

      {/* Provenance Record card */}
      <g transform="translate(70, 60)">
        <rect
          x={0}
          y={0}
          width={230}
          height={62}
          rx={7}
          fill="#FFFFFF"
          stroke="#2D7DFF"
          strokeWidth={1.3}
        />
        <text
          x={10}
          y={13}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={8.5}
          fontWeight={800}
          fill="#0A2240"
          letterSpacing="0.6"
        >
          PROVENANCE RECORD
        </text>
        <text
          x={220}
          y={13}
          textAnchor="end"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={7.5}
          fill="#64748B"
        >
          0x4f1a…b8c2
        </text>
        {(
          [
            { x: 10,  text: "User verified",      row: 0 },
            { x: 90,  text: "Policy enforced",    row: 0 },
            { x: 10,  text: "Data accessed",      row: 1 },
            { x: 90,  text: "Output generated",   row: 1 },
            { x: 10,  text: "Blocked path noted", row: 2 },
            { x: 90,  text: "Recorded",           row: 2 },
          ] as { x: number; text: string; row: number }[]
        ).map((it, i) => (
          <g key={i} transform={`translate(${it.x}, ${24 + it.row * 13})`}>
            <circle cx={4.5} cy={3} r={3.4} fill="#10B981" />
            <path
              d="M 2.7 3.2 l 1.5 1.5 l 2.6 -2.7"
              fill="none"
              stroke="white"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={12}
              y={6}
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={8}
              fontWeight={500}
              fill="#475569"
            >
              {it.text}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ============================================================
 * How they work together strip
 * ============================================================ */

function FlowStrip({ activeId }: { activeId: ConceptId }) {
  const items: { id: ConceptId; tag: string; sub: string }[] = [
    { id: "coca", tag: "COCA", sub: "Identity continuity" },
    { id: "cbac", tag: "CBAC", sub: "Bounded authorization" },
    { id: "ip",   tag: "IP",   sub: "Verifiable provenance" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-3xl border border-soft-200 bg-gradient-to-b from-electric-50/40 to-white p-6 shadow-soft"
    >
      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric-700">
          How they work together
        </span>
        <p className="mx-auto mt-2 max-w-2xl text-[14.5px] leading-relaxed text-navy-500">
          <span className="font-semibold">COCA</span> proves who acted.{" "}
          <span className="font-semibold">CBAC</span> decides what is allowed.{" "}
          <span className="font-semibold">IP</span> proves what happened.
        </p>
        <p className="mx-auto mt-1 max-w-2xl text-[12px] text-ink-mute">
          Connected platform capabilities — not rigid one-time steps.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {items
          .map<React.ReactNode>((it) => (
            <FlowCell
              key={it.id}
              tag={it.tag}
              sub={it.sub}
              isActive={it.id === activeId}
            />
          ))
          .reduce<React.ReactNode[]>((acc, cell, i, arr) => {
            acc.push(cell);
            if (i < arr.length - 1) {
              acc.push(
                <div
                  key={`a-${i}`}
                  className="hidden items-center justify-center md:flex"
                >
                  <ArrowRight className="h-4 w-4 text-electric-500" />
                </div>,
              );
            }
            return acc;
          }, [])}
      </div>
    </motion.div>
  );
}

function FlowCell({
  tag,
  sub,
  isActive,
}: {
  tag: string;
  sub: string;
  isActive: boolean;
}) {
  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0.7,
        scale: isActive ? 1 : 0.99,
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border-2 bg-white p-3.5 text-center transition-colors ${
        isActive
          ? "border-navy-500 shadow-[0_0_0_1px_rgba(10,34,64,0.12)]"
          : "border-navy-500/40"
      }`}
    >
      <span
        className={`font-mono text-[13px] font-extrabold tracking-[0.18em] ${
          isActive ? "text-navy-500" : "text-navy-500/60"
        }`}
      >
        {tag}
      </span>
      <p className={`mt-0.5 text-[13px] font-semibold ${isActive ? "text-navy-500" : "text-navy-500/60"}`}>{sub}</p>
    </motion.div>
  );
}

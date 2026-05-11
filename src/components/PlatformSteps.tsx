import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cog,
  FileSignature,
  GitBranch,
  Hash,
  Layers,
  Network,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { AgentDNACharacter } from "./AgentDNACharacter";

/**
 * Connect / Protect / Observe — interactive product walkthrough.
 *
 *   - 3 tabs across the top
 *   - left column: 4 steps for the active tab (numbered, clickable)
 *   - right column: dashboard mockup that swaps per (tab, step)
 *   - auto-advances steps every ~6s within a tab; advances to next tab
 *     when the last step is reached; pauses when the user hovers or clicks
 */

type TabId = "connect" | "protect" | "observe";

type TabStep = {
  title: string;
  description: string;
};

type Tab = {
  id: TabId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  headline: string;
  description: string;
  steps: TabStep[];
};

const TABS: Tab[] = [
  {
    id: "connect",
    label: "Connect",
    Icon: Network,
    headline: "Map every identity, agent, tool, and system.",
    description:
      "Connect AgentDNA to the systems where agents act, delegate, call tools, access data, and generate outputs.",
    steps: [
      {
        title: "Connect identity providers",
        description:
          "Link users, groups, service accounts, workload identities, and non-human identities from Okta, Microsoft Entra, Google Workspace, and internal stores.",
      },
      {
        title: "Register agents and MCP servers",
        description:
          "Add AI agents, MCP servers, local tools, hosted tools, workflow agents, and orchestration frameworks into the execution graph.",
      },
      {
        title: "Connect apps, APIs, and data systems",
        description:
          "Connect SaaS apps, internal APIs, databases, vector stores, cloud resources, and enterprise systems agents may interact with.",
      },
      {
        title: "Discover execution paths",
        description:
          "AgentDNA builds a live map of how users, agents, tools, service accounts, APIs, and data systems relate.",
      },
    ],
  },
  {
    id: "protect",
    label: "Protect",
    Icon: ShieldCheck,
    headline: "Set policies, access controls, and skill boundaries.",
    description:
      "Define what agents can do, which tools they can use, where skill files live, what data they can access, and when actions require approval.",
    steps: [
      {
        title: "Define policy zones",
        description:
          "Create zones for teams, workflows, agents, environments, data classes, and external actions.",
      },
      {
        title: "Set agent and tool permissions",
        description:
          "Control which agents can use which tools, MCP servers, APIs, service accounts, skills, and data systems.",
      },
      {
        title: "Govern skills and instruction files",
        description:
          "Track agent.md, skills.md, MCP configs, and tool manifests. Control which agents can read, modify, or invoke them.",
      },
      {
        title: "Enforce controls at runtime",
        description:
          "Apply Auth, Trust, Governance, and Control before agents access tools, call APIs, export data, or trigger high-risk actions.",
      },
    ],
  },
  {
    id: "observe",
    label: "Observe",
    Icon: Activity,
    headline: "See every action, decision, and provenance trail.",
    description:
      "Monitor how agents behave, which systems they touch, what policies were applied, and how each output was produced.",
    steps: [
      {
        title: "View execution lineage",
        description:
          "Trace the full path from user prompt to agent delegation, tool calls, API requests, data access, outputs, and provenance records.",
      },
      {
        title: "Monitor policy decisions",
        description:
          "See which actions were allowed, limited, blocked, or required approval — and why.",
      },
      {
        title: "Review behavior and risk",
        description:
          "Detect unusual delegation paths, tool misuse, shadow agents, risky exports, and excessive access.",
      },
      {
        title: "Export audit-ready provenance",
        description:
          "Generate evidence records that show who acted, what was allowed, what was blocked, which data was used, and how the output was produced.",
      },
    ],
  },
];

/* Keep this in sync with the `stepProgress` keyframe duration in
 * tailwind.config.js (5500ms) so the progress bar lines up with the timer. */
const STEP_DURATION_MS = 5500;

export function PlatformSteps() {
  const [activeTab, setActiveTab] = useState<TabId>("connect");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  /** Bumped on every manual interaction so the auto-advance timer + the
   *  CSS progress bar both restart from zero. */
  const [resetKey, setResetKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const tab = TABS.find((t) => t.id === activeTab)!;

  /* Auto-advance step within tab, then spill over to next tab. Looping
   * Connect → Protect → Observe → Connect. Skipped while the user is
   * hovering the section. Restarts cleanly when `resetKey` is bumped. */
  useEffect(() => {
    if (isHovering) return;
    const id = window.setInterval(() => {
      setActiveStep((cur) => {
        const last = tab.steps.length - 1;
        if (cur < last) return cur + 1;
        const nextIdx =
          (TABS.findIndex((t) => t.id === activeTab) + 1) % TABS.length;
        setActiveTab(TABS[nextIdx].id);
        return 0;
      });
    }, STEP_DURATION_MS);
    return () => window.clearInterval(id);
  }, [activeTab, tab.steps.length, isHovering, resetKey]);

  function selectTab(id: TabId) {
    if (id === activeTab && activeStep === 0) {
      // Clicking the same tab while on step 0 just restarts the timer.
      setResetKey((k) => k + 1);
      return;
    }
    setActiveTab(id);
    setActiveStep(0);
    setResetKey((k) => k + 1);
  }

  function selectStep(i: number) {
    if (i === activeStep) {
      setResetKey((k) => k + 1);
      return;
    }
    setActiveStep(i);
    setResetKey((k) => k + 1);
  }

  /* Stable key for the active step's progress bar — re-mounting it on
   * any of these changes restarts the CSS animation from 0. */
  const progressKey = `${activeTab}-${activeStep}-${resetKey}`;

  return (
    <section
      id="platform"
      ref={sectionRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative bg-soft-50 py-24"
    >
      <div className="container-page">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Platform</span>
          <h2 className="section-title mt-4">
            <span className="text-electric-600">Connect.</span>{" "}
            <span className="text-electric-600">Protect.</span>{" "}
            <span className="text-electric-600">Observe.</span>
          </h2>
          <p className="section-sub mx-auto">
            One control plane to onboard agentic systems, enforce runtime
            controls, and trace every action from prompt to outcome.
          </p>
        </div>

        {/* Tab bar */}
        <div className="mt-10">
          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            onSelect={selectTab}
            stepCount={tab.steps.length}
            activeStep={activeStep}
          />
        </div>

        {/* Two-column body */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left — tab heading + step list */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-soft-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-electric-100 text-electric-600 ring-1 ring-inset ring-white"
                  style={{ background: "linear-gradient(180deg,#FFFFFF,#EAF2FF)" }}>
                  <tab.Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-electric-700">
                    {tab.label}
                  </div>
                  <h3 className="font-display text-[18px] font-semibold leading-snug text-navy-500">
                    {tab.headline}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-subtle">
                {tab.description}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {tab.steps.map((s, i) => (
                  <StepRow
                    key={s.title}
                    index={i}
                    step={s}
                    isActive={i === activeStep}
                    isDone={i < activeStep}
                    isPaused={isHovering}
                    progressKey={progressKey}
                    onClick={() => selectStep(i)}
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[460px] overflow-hidden rounded-3xl border border-soft-200 bg-white shadow-card">
              {/* dashboard chrome */}
              <div className="flex items-center justify-between border-b border-soft-200 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-3 font-mono text-[11px] uppercase tracking-wider text-ink-mute">
                    agentdna.console — {tab.label.toLowerCase()}
                  </span>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <AgentDNACharacter
                    size={18}
                    variant="subtle"
                    float={false}
                    mood={
                      activeTab === "protect"
                        ? "protect"
                        : activeTab === "observe"
                          ? "guide"
                          : "guide"
                    }
                  />
                  <span className="rounded-full bg-electric-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric-700">
                    Live
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="p-5"
                >
                  <Dashboard tab={activeTab} step={activeStep} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Section footer */}
        <div className="mt-10 flex justify-center">
          <a href="#demo" className="btn-secondary">
            View Product Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Tab bar — 3 large pill tabs with progress indicators
 * ============================================================ */

function TabBar({
  tabs,
  activeTab,
  onSelect,
  stepCount,
  activeStep,
}: {
  tabs: Tab[];
  activeTab: TabId;
  onSelect: (id: TabId) => void;
  stepCount: number;
  activeStep: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl border border-soft-200 bg-white p-1.5 shadow-soft sm:grid-cols-3">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.Icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            aria-pressed={isActive}
            className={`group relative flex flex-col overflow-hidden rounded-xl px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 ${
              isActive
                ? "bg-navy-500 text-white shadow-[0_8px_20px_rgba(10,34,64,0.18)]"
                : "bg-white text-navy-500 hover:bg-soft-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-electric-500 text-white"
                    : "border border-electric-100 bg-electric-50 text-electric-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isActive ? "text-electric-200" : "text-electric-700"
                }`}>
                  {t.label}
                </span>
                <span className={`block text-[13px] font-semibold leading-tight ${
                  isActive ? "text-white" : "text-navy-500"
                }`}>
                  {t.headline.split(/[,.]/)[0]}
                </span>
              </span>
            </span>

            {/* step progress dots — only on the active tab */}
            {isActive && (
              <span className="mt-2 flex items-center gap-1.5">
                {Array.from({ length: stepCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === activeStep
                        ? "w-6 bg-electric-300"
                        : i < activeStep
                          ? "w-3 bg-electric-300/70"
                          : "w-3 bg-white/20"
                    }`}
                  />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Step row (left column)
 * ============================================================ */

function StepRow({
  index,
  step,
  isActive,
  isDone,
  isPaused,
  progressKey,
  onClick,
}: {
  index: number;
  step: TabStep;
  isActive: boolean;
  isDone: boolean;
  isPaused: boolean;
  progressKey: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 ${
          isActive
            ? "border-electric-200 bg-electric-50/40 shadow-[0_0_0_1px_rgba(45,125,255,0.18)]"
            : "border-soft-200 bg-white hover:border-electric-200 hover:bg-soft-50"
        }`}
      >
        <span
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg font-mono text-[11px] font-bold transition-colors ${
            isActive
              ? "bg-electric-500 text-white"
              : isDone
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                : "bg-soft-50 text-ink-mute ring-1 ring-soft-200"
          }`}
        >
          {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : `0${index + 1}`}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={`text-[13.5px] font-semibold ${
              isActive ? "text-navy-500" : "text-navy-500/80"
            }`}
          >
            {step.title}
          </div>
          <AnimatePresence initial={false}>
            {isActive && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-1 overflow-hidden text-[12.5px] leading-relaxed text-ink-subtle"
              >
                {step.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {isActive && (
          <span className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-electric-500" />
        )}
        {/* Progress bar — re-mounts on `progressKey` change so the CSS
            animation restarts from 0. `animation-play-state: paused` while
            the user is hovering the section. */}
        {isActive && (
          <span
            key={progressKey}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left animate-stepProgress bg-electric-400"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          />
        )}
      </button>
    </li>
  );
}

/* ============================================================
 * Dashboard router
 * ============================================================ */

function Dashboard({ tab, step }: { tab: TabId; step: number }) {
  if (tab === "connect") {
    return [
      <ConnectIdP />,
      <ConnectAgents />,
      <ConnectApps />,
      <ConnectDiscovery />,
    ][step];
  }
  if (tab === "protect") {
    return [
      <ProtectZones />,
      <ProtectMatrix />,
      <ProtectSkills />,
      <ProtectRuntime />,
    ][step];
  }
  return [
    <ObserveLineage />,
    <ObserveDecisions />,
    <ObserveRisk />,
    <ObserveProvenance />,
  ][step];
}

/* ============================================================
 * CONNECT dashboards
 * ============================================================ */

function ConnectIdP() {
  const idps: { slug: string; name: string; users: string; status: "linked" | "syncing" }[] = [
    { slug: "okta",             name: "Okta",              users: "2,481 users · 38 groups", status: "linked" },
    { slug: "entra",            name: "Microsoft Entra",   users: "1,917 users · 22 groups", status: "linked" },
    { slug: "google-workspace", name: "Google Workspace",  users: "412 users · service accts", status: "linked" },
    { slug: "auth0",            name: "Auth0",             users: "B2B partner identities",   status: "syncing" },
  ];
  return (
    <DashboardSection
      title="Identity providers"
      subtitle="Users · groups · service accounts · workload identities · NHIs"
      counters={[
        { label: "IdPs", value: 4 },
        { label: "Identities", value: "5,162" },
        { label: "Service accts", value: 87 },
      ]}
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {idps.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-2.5 rounded-xl border border-soft-200 bg-white px-3 py-2.5"
          >
            <BrandLogo slug={p.slug} size={18} bare />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-navy-500">{p.name}</div>
              <div className="truncate font-mono text-[10px] text-ink-mute">{p.users}</div>
            </div>
            <span
              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase ${
                p.status === "linked"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {p.status === "linked" ? (
                <CheckCircle2 className="h-2.5 w-2.5" />
              ) : (
                <Clock className="h-2.5 w-2.5" />
              )}
              {p.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </DashboardSection>
  );
}

function ConnectAgents() {
  const agents: { label: string; sub: string; tools: number }[] = [
    { label: "Finance Agent",    sub: "claude-sonnet · openai-gpt", tools: 4 },
    { label: "Reporting Agent",  sub: "claude-sonnet",              tools: 6 },
    { label: "Incident Agent",   sub: "openai-gpt",                 tools: 5 },
    { label: "Access Agent",     sub: "anthropic · langchain",      tools: 7 },
  ];
  const mcps: { label: string; tools: string }[] = [
    { label: "MCP · Browser",       tools: "fetch · click · screenshot" },
    { label: "MCP · File",          tools: "read · write · search" },
    { label: "MCP · Code Interp",   tools: "exec · plot · pandas" },
    { label: "MCP · Workflow",      tools: "invoke · approve · branch" },
  ];
  return (
    <DashboardSection
      title="Agents & MCP servers"
      subtitle="Registered agents, models, and MCP servers"
      counters={[
        { label: "Agents", value: 11 },
        { label: "MCPs", value: 6 },
        { label: "Tools", value: 38 },
      ]}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
            Agents
          </div>
          <ul className="space-y-1.5">
            {agents.map((a, i) => (
              <motion.li
                key={a.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 rounded-lg border border-soft-200 bg-white px-2.5 py-1.5"
              >
                <BrandLogo slug="agent" size={14} bare />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11.5px] font-semibold text-navy-500">{a.label}</div>
                  <div className="truncate font-mono text-[9.5px] text-ink-mute">{a.sub}</div>
                </div>
                <span className="rounded-full border border-soft-200 px-1.5 py-0.5 text-[9.5px] text-ink-subtle">
                  {a.tools} tools
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
            MCP servers
          </div>
          <ul className="space-y-1.5">
            {mcps.map((m, i) => (
              <motion.li
                key={m.label}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.1 }}
                className="flex items-center gap-2 rounded-lg border border-soft-200 bg-white px-2.5 py-1.5"
              >
                <BrandLogo slug="mcp" size={14} bare />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11.5px] font-semibold text-navy-500">{m.label}</div>
                  <div className="truncate font-mono text-[9.5px] text-ink-mute">{m.tools}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardSection>
  );
}

function ConnectApps() {
  const apps: { slug: string; name: string }[] = [
    { slug: "slack",      name: "Slack" },
    { slug: "salesforce", name: "Salesforce" },
    { slug: "github",     name: "GitHub" },
    { slug: "jira",       name: "Jira" },
    { slug: "snowflake",  name: "Snowflake" },
    { slug: "postgresql", name: "Postgres" },
    { slug: "mongodb",    name: "Mongo" },
    { slug: "pinecone",   name: "Pinecone" },
    { slug: "aws",        name: "AWS" },
    { slug: "azure",      name: "Azure" },
    { slug: "gcp",        name: "GCP" },
    { slug: "datadog",    name: "Datadog" },
  ];
  return (
    <DashboardSection
      title="Apps · APIs · data systems"
      subtitle="SaaS · internal APIs · databases · vector stores · cloud"
      counters={[
        { label: "SaaS", value: 28 },
        { label: "APIs", value: 64 },
        { label: "Data", value: 19 },
      ]}
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {apps.map((a, i) => (
          <motion.div
            key={a.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-soft-200 bg-white px-2 py-2"
          >
            <BrandLogo slug={a.slug} size={18} bare />
            <span className="truncate text-[9.5px] font-medium text-navy-500">{a.name}</span>
          </motion.div>
        ))}
      </div>
    </DashboardSection>
  );
}

function ConnectDiscovery() {
  // 9-node mini DAG: User → Agent → MCP/Tool → API → Data → Output
  const VB_W = 560;
  const VB_H = 200;
  type N = { id: string; slug: string; label: string; x: number; y: number };
  const nodes: N[] = [
    { id: "u",  slug: "user",       label: "User",     x: 36,  y: 100 },
    { id: "id", slug: "okta",       label: "Okta",     x: 110, y: 60  },
    { id: "ag", slug: "agent",      label: "Agent",    x: 196, y: 100 },
    { id: "mc", slug: "mcp",        label: "MCP",      x: 282, y: 56  },
    { id: "tl", slug: "tools",      label: "Tools",    x: 282, y: 144 },
    { id: "ap", slug: "api",        label: "APIs",     x: 364, y: 100 },
    { id: "db", slug: "snowflake",  label: "Data",     x: 444, y: 60  },
    { id: "op", slug: "tools",      label: "Output",   x: 444, y: 144 },
    { id: "pr", slug: "service",    label: "Provenance", x: 524, y: 100 },
  ];
  const edges: [string, string][] = [
    ["u","id"], ["u","ag"], ["id","ag"], ["ag","mc"], ["ag","tl"],
    ["mc","ap"], ["tl","ap"], ["ap","db"], ["ap","op"], ["db","pr"], ["op","pr"],
  ];
  const map = new Map(nodes.map((n) => [n.id, n]));
  return (
    <DashboardSection
      title="Discovered execution paths"
      subtitle="AgentDNA maps how identities, agents, tools, and data systems relate"
      counters={[
        { label: "Paths", value: 132 },
        { label: "Verified", value: 124 },
        { label: "Unknown", value: 8 },
      ]}
    >
      <div className="rounded-2xl border border-soft-200 bg-soft-50/50 p-2.5">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-[200px] w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="cd-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9EBEFF" />
              <stop offset="100%" stopColor="#2D7DFF" />
            </linearGradient>
          </defs>
          {edges.map(([a, b], i) => {
            const A = map.get(a)!;
            const B = map.get(b)!;
            return (
              <g key={i}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="url(#cd-line)" strokeWidth={1.2} />
                <circle r={1.8} fill="#2D7DFF" opacity={0.85}>
                  <animate attributeName="cx" from={A.x} to={B.x} dur="3.4s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" from={A.y} to={B.y} dur="3.4s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.05;0.85;1" dur="3.4s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={11} fill="white" stroke="#9EBEFF" />
              <foreignObject x={n.x - 7} y={n.y - 7} width={14} height={14}>
                <div className="flex h-full w-full items-center justify-center">
                  <BrandLogo slug={n.slug} size={10} bare />
                </div>
              </foreignObject>
              <text x={n.x} y={n.y + 22} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={8.5} fontWeight={600} fill="#475569">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DashboardSection>
  );
}

/* ============================================================
 * PROTECT dashboards
 * ============================================================ */

function ProtectZones() {
  const zones: { name: string; agents: number; apps: number; tone: "blue" | "violet" | "teal" | "amber" | "rose" }[] = [
    { name: "Finance",          agents: 3, apps: 9,  tone: "blue" },
    { name: "DevOps",           agents: 4, apps: 12, tone: "violet" },
    { name: "HR / IT",          agents: 2, apps: 7,  tone: "teal" },
    { name: "Security",         agents: 3, apps: 8,  tone: "amber" },
    { name: "Production data",  agents: 5, apps: 6,  tone: "rose" },
    { name: "External actions", agents: 2, apps: 4,  tone: "rose" },
  ];
  const TONE: Record<typeof zones[number]["tone"], { bg: string; ring: string; text: string }> = {
    blue:   { bg: "#EAF2FF", ring: "#9EBEFF", text: "#1D5FD9" },
    violet: { bg: "#F5F3FF", ring: "#C4B5FD", text: "#6D28D9" },
    teal:   { bg: "#ECFEFF", ring: "#67E8F9", text: "#0E7490" },
    amber:  { bg: "#FFFBEB", ring: "#FCD34D", text: "#92400E" },
    rose:   { bg: "#FFF1F2", ring: "#FDA4AF", text: "#9F1239" },
  };
  return (
    <DashboardSection
      title="Policy zones"
      subtitle="Group agents, apps, and data classes by team and risk tier"
      counters={[
        { label: "Zones", value: 6 },
        { label: "Policies", value: 41 },
        { label: "Agents", value: 19 },
      ]}
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((z, i) => {
          const t = TONE[z.tone];
          return (
            <motion.li
              key={z.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border px-3 py-2.5"
              style={{ borderColor: t.ring, background: t.bg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold" style={{ color: t.text }}>
                  {z.name}
                </span>
                <Layers className="h-3.5 w-3.5" style={{ color: t.text }} />
              </div>
              <div className="mt-0.5 font-mono text-[9.5px]" style={{ color: t.text, opacity: 0.85 }}>
                {z.agents} agents · {z.apps} apps
              </div>
            </motion.li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}

function ProtectMatrix() {
  type Cell = "allow" | "limit" | "approve" | "block";
  const rows: { agent: string; cells: { col: string; cell: Cell; note?: string }[] }[] = [
    {
      agent: "Finance Agent",
      cells: [
        { col: "Snowflake",     cell: "limit",  note: "read · scope=Q4" },
        { col: "Salesforce",    cell: "allow" },
        { col: "PII Export",    cell: "block" },
        { col: "Slack",         cell: "allow" },
      ],
    },
    {
      agent: "DevOps Agent",
      cells: [
        { col: "GitHub",        cell: "allow" },
        { col: "K8s Rollback",  cell: "approve", note: "human approval" },
        { col: "AWS Logs",      cell: "limit", note: "service · time-bound" },
        { col: "Slack",         cell: "allow" },
      ],
    },
    {
      agent: "Access Agent",
      cells: [
        { col: "M365",          cell: "allow" },
        { col: "Workspace",     cell: "allow" },
        { col: "GitHub Admin",  cell: "block" },
        { col: "Workday",       cell: "limit", note: "role-based" },
      ],
    },
    {
      agent: "Security Agent",
      cells: [
        { col: "Splunk",        cell: "allow" },
        { col: "Cloudflare",    cell: "allow" },
        { col: "API Gateway",   cell: "limit", note: "investigate" },
        { col: "Sensitive DB",  cell: "block" },
      ],
    },
  ];
  const TONE: Record<Cell, { bg: string; text: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
    allow:   { bg: "#EAF2FF", text: "#1D5FD9", Icon: CheckCircle2, label: "Allow" },
    limit:   { bg: "#F0F9FF", text: "#0369A1", Icon: ScanLine,     label: "Limit" },
    approve: { bg: "#FFFBEB", text: "#92400E", Icon: Clock,        label: "Approve" },
    block:   { bg: "#FFF1F2", text: "#9F1239", Icon: XCircle,      label: "Block" },
  };
  return (
    <DashboardSection
      title="Access matrix"
      subtitle="Per-agent, per-system controls — Allow · Limit · Approve · Block"
      counters={[
        { label: "Rules", value: 192 },
        { label: "Allow", value: 134 },
        { label: "Block", value: 23 },
      ]}
    >
      <div className="overflow-hidden rounded-xl border border-soft-200">
        <table className="w-full text-left text-[11.5px]">
          <thead className="bg-soft-50">
            <tr className="text-[10px] uppercase tracking-wider text-ink-mute">
              <th className="px-2.5 py-2 font-semibold">Agent</th>
              <th className="px-2.5 py-2 font-semibold">System</th>
              <th className="px-2.5 py-2 font-semibold">Decision</th>
              <th className="px-2.5 py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.flatMap((r, ri) =>
              r.cells.map((c, ci) => {
                const t = TONE[c.cell];
                return (
                  <motion.tr
                    key={`${ri}-${ci}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (ri * 4 + ci) * 0.025 }}
                    className="border-t border-soft-200"
                  >
                    {ci === 0 ? (
                      <td className="px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-navy-500" rowSpan={r.cells.length}>
                        {r.agent}
                      </td>
                    ) : null}
                    <td className="px-2.5 py-1.5 font-mono text-[10.5px] text-ink-subtle">
                      {c.col}
                    </td>
                    <td className="px-2.5 py-1.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase"
                        style={{ background: t.bg, color: t.text }}
                      >
                        <t.Icon className="h-2.5 w-2.5" />
                        {t.label}
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5 font-mono text-[9.5px] text-ink-mute">
                      {c.note ?? "—"}
                    </td>
                  </motion.tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}

function ProtectSkills() {
  const files: { name: string; owner: string; agents: string; status: "verified" | "pinned" | "warning"; hash: string }[] = [
    { name: "agent.md",          owner: "Finance",  agents: "Finance Agt · Reporting Agt", status: "verified", hash: "0xa9c1…77b3" },
    { name: "skills.md",         owner: "Finance",  agents: "Finance Agt",                  status: "pinned",   hash: "0xb302…8f1d" },
    { name: "mcp/browser.json",  owner: "Platform", agents: "all",                          status: "verified", hash: "0xc4ee…21a2" },
    { name: "mcp/code.json",     owner: "Platform", agents: "Reporting · Incident",        status: "verified", hash: "0xd0a1…99e7" },
    { name: "tools/manifest.json", owner: "DevOps",  agents: "DevOps Agt",                  status: "warning",  hash: "0xe71b…c4d8" },
    { name: "prompts/board.md",  owner: "Finance",  agents: "Reporting Agt",                status: "verified", hash: "0xf293…a01c" },
  ];
  const STATUS: Record<typeof files[number]["status"], { bg: string; fg: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
    verified: { bg: "#EAF2FF", fg: "#1D5FD9", Icon: CheckCircle2, label: "verified" },
    pinned:   { bg: "#ECFDF5", fg: "#047857", Icon: Hash,         label: "pinned" },
    warning:  { bg: "#FFFBEB", fg: "#92400E", Icon: AlertTriangle, label: "review" },
  };
  return (
    <DashboardSection
      title="Skills & instruction registry"
      subtitle="Track agent.md, skills.md, MCP configs, and tool manifests"
      counters={[
        { label: "Files", value: 84 },
        { label: "Verified", value: 79 },
        { label: "Review", value: 5 },
      ]}
    >
      <div className="overflow-hidden rounded-xl border border-soft-200">
        <table className="w-full text-left text-[11.5px]">
          <thead className="bg-soft-50">
            <tr className="text-[10px] uppercase tracking-wider text-ink-mute">
              <th className="px-2.5 py-2 font-semibold">File</th>
              <th className="px-2.5 py-2 font-semibold">Owner</th>
              <th className="px-2.5 py-2 font-semibold">Allowed agents</th>
              <th className="px-2.5 py-2 font-semibold">Hash</th>
              <th className="px-2.5 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => {
              const s = STATUS[f.status];
              return (
                <motion.tr
                  key={f.name}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t border-soft-200"
                >
                  <td className="px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-navy-500">
                    {f.name}
                  </td>
                  <td className="px-2.5 py-1.5 text-[10.5px] text-ink-subtle">{f.owner}</td>
                  <td className="px-2.5 py-1.5 truncate text-[10.5px] text-ink-subtle">{f.agents}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[9.5px] text-ink-mute">{f.hash}</td>
                  <td className="px-2.5 py-1.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      <s.Icon className="h-2.5 w-2.5" />
                      {s.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}

function ProtectRuntime() {
  const events: { time: string; actor: string; actorSlug: string; action: string; targetSlug: string; atgc: string[]; outcome: "allowed" | "limited" | "blocked" | "approval" }[] = [
    { time: "12:04:21", actor: "Finance Agt",   actorSlug: "agent", action: "snowflake.q4_revenue.read",     targetSlug: "snowflake",  atgc: ["A","T","G","C"], outcome: "allowed" },
    { time: "12:04:23", actor: "Finance Agt",   actorSlug: "agent", action: "salesforce.tickets.read",        targetSlug: "salesforce", atgc: ["G","C"],         outcome: "limited" },
    { time: "12:04:24", actor: "Finance Agt",   actorSlug: "agent", action: "external.email.export.pii",      targetSlug: "tools",      atgc: ["G","C"],         outcome: "blocked" },
    { time: "12:04:27", actor: "DevOps Agt",    actorSlug: "agent", action: "k8s.production.rollback",        targetSlug: "kubernetes", atgc: ["G","C"],         outcome: "approval" },
    { time: "12:04:29", actor: "Reporting Agt", actorSlug: "agent", action: "drive.summary.write",            targetSlug: "google-workspace", atgc: ["T","G","C"], outcome: "allowed" },
  ];
  const OUT: Record<typeof events[number]["outcome"], { bg: string; fg: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
    allowed:  { bg: "#EAF2FF", fg: "#1D5FD9", Icon: CheckCircle2, label: "Allowed" },
    limited:  { bg: "#F0F9FF", fg: "#0369A1", Icon: ScanLine,     label: "Limited" },
    blocked:  { bg: "#FFF1F2", fg: "#9F1239", Icon: XCircle,      label: "Blocked" },
    approval: { bg: "#FFFBEB", fg: "#92400E", Icon: Clock,        label: "Approval" },
  };
  return (
    <DashboardSection
      title="Runtime decision log"
      subtitle="ATGC controls applied at every action"
      counters={[
        { label: "Allowed", value: "12,402" },
        { label: "Limited", value: "612" },
        { label: "Blocked", value: "184" },
      ]}
    >
      <ul className="space-y-1.5">
        {events.map((e, i) => {
          const t = OUT[e.outcome];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2 rounded-xl border border-soft-200 bg-white px-2.5 py-2"
            >
              <span className="font-mono text-[9.5px] text-ink-mute">{e.time}</span>
              <BrandLogo slug={e.actorSlug} size={14} bare />
              <span className="text-[11px] font-semibold text-navy-500">{e.actor}</span>
              <span className="text-ink-mute">→</span>
              <BrandLogo slug={e.targetSlug} size={14} bare />
              <span className="truncate font-mono text-[10.5px] text-ink-subtle">{e.action}</span>
              <span className="ml-auto flex flex-none items-center gap-0.5">
                {e.atgc.map((l) => (
                  <span key={l} className="flex h-3.5 w-3.5 items-center justify-center rounded bg-navy-500 font-mono text-[8.5px] font-bold text-white">
                    {l}
                  </span>
                ))}
              </span>
              <span
                className="inline-flex flex-none items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase"
                style={{ background: t.bg, color: t.fg }}
              >
                <t.Icon className="h-2.5 w-2.5" />
                {t.label}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}

/* ============================================================
 * OBSERVE dashboards
 * ============================================================ */

function ObserveLineage() {
  const VB_W = 560;
  const VB_H = 200;
  type N = { id: string; slug: string; label: string; x: number; y: number; status?: "ok" | "deny" };
  const nodes: N[] = [
    { id: "u",  slug: "user",       label: "alice (CFO)",    x: 40,  y: 100 },
    { id: "id", slug: "okta",       label: "Okta",           x: 130, y: 100 },
    { id: "ag", slug: "agent",      label: "Finance Agt",    x: 220, y: 60  },
    { id: "ag2",slug: "agent",      label: "Reporting Agt",  x: 220, y: 150 },
    { id: "tl", slug: "mcp",        label: "MCP",            x: 310, y: 100 },
    { id: "ap", slug: "snowflake",  label: "Snowflake",      x: 400, y: 60  },
    { id: "x",  slug: "tools",      label: "PII Export",     x: 400, y: 150, status: "deny" },
    { id: "op", slug: "tools",      label: "Board Summary",  x: 480, y: 100 },
    { id: "pr", slug: "service",    label: "Provenance",     x: 540, y: 100 },
  ];
  const edges: [string, string, "ok" | "deny"][] = [
    ["u","id","ok"], ["id","ag","ok"], ["id","ag2","ok"], ["ag","tl","ok"],
    ["ag","ap","ok"], ["ag","x","deny"], ["tl","op","ok"], ["ap","op","ok"],
    ["op","pr","ok"], ["ap","pr","ok"],
  ];
  const map = new Map(nodes.map((n) => [n.id, n]));
  return (
    <DashboardSection
      title="Lineage explorer"
      subtitle="Trace prompt → delegation → tool calls → data → output → provenance"
      counters={[
        { label: "Nodes", value: 9 },
        { label: "Hops", value: 10 },
        { label: "Blocked", value: 1 },
      ]}
    >
      <div className="rounded-2xl border border-soft-200 bg-soft-50/50 p-2.5">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-[200px] w-full" preserveAspectRatio="xMidYMid meet">
          {edges.map(([a, b, s], i) => {
            const A = map.get(a)!;
            const B = map.get(b)!;
            return (
              <line
                key={i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke={s === "deny" ? "#EF4444" : "#2D7DFF"}
                strokeWidth={1.4}
                strokeDasharray={s === "deny" ? "4 3" : undefined}
                opacity={s === "deny" ? 0.8 : 0.7}
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={11} fill={n.status === "deny" ? "#FFF1F2" : "white"} stroke={n.status === "deny" ? "#EF4444" : "#9EBEFF"} />
              <foreignObject x={n.x - 7} y={n.y - 7} width={14} height={14}>
                <div className="flex h-full w-full items-center justify-center">
                  <BrandLogo slug={n.slug} size={10} bare />
                </div>
              </foreignObject>
              <text x={n.x} y={n.y + 22} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={8.5} fontWeight={600} fill={n.status === "deny" ? "#9F1239" : "#475569"}>
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DashboardSection>
  );
}

function ObserveDecisions() {
  const rows: { time: string; actor: string; action: string; target: string; atgc: string; decision: "Allowed" | "Limited" | "Blocked" | "Approval"; reason: string }[] = [
    { time: "12:04:21", actor: "alice@acme",      action: "delegated → Finance Agt",      target: "Okta",        atgc: "A·T",     decision: "Allowed", reason: "session trusted · MFA chain" },
    { time: "12:04:22", actor: "Finance Agt",     action: "snowflake.q4_revenue.read",    target: "Snowflake",   atgc: "A·T·G·C", decision: "Allowed", reason: "scope=Q4 · row-level limit" },
    { time: "12:04:23", actor: "Finance Agt",     action: "external.email.export.pii",    target: "Email",       atgc: "G·C",     decision: "Blocked", reason: "out-of-scope · pii=deny" },
    { time: "12:04:25", actor: "Reporting Agt",   action: "drive.summary.write",          target: "Drive",       atgc: "T·G·C",   decision: "Allowed", reason: "approved folder" },
    { time: "12:04:27", actor: "DevOps Agt",      action: "k8s.production.rollback",      target: "Kubernetes",  atgc: "G·C",     decision: "Approval",reason: "human approval required" },
  ];
  const OUT: Record<typeof rows[number]["decision"], { bg: string; fg: string }> = {
    Allowed: { bg: "#EAF2FF", fg: "#1D5FD9" },
    Limited: { bg: "#F0F9FF", fg: "#0369A1" },
    Blocked: { bg: "#FFF1F2", fg: "#9F1239" },
    Approval:{ bg: "#FFFBEB", fg: "#92400E" },
  };
  return (
    <DashboardSection
      title="Policy decision timeline"
      subtitle="Every action evaluated at runtime — decision + reason"
      counters={[
        { label: "Today", value: "13,212" },
        { label: "Blocked", value: 184 },
        { label: "Approvals", value: 27 },
      ]}
    >
      <div className="overflow-hidden rounded-xl border border-soft-200">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-soft-50">
            <tr className="text-[9.5px] uppercase tracking-wider text-ink-mute">
              <th className="px-2.5 py-2 font-semibold">Time</th>
              <th className="px-2.5 py-2 font-semibold">Actor</th>
              <th className="px-2.5 py-2 font-semibold">Action</th>
              <th className="px-2.5 py-2 font-semibold">ATGC</th>
              <th className="px-2.5 py-2 font-semibold">Decision</th>
              <th className="px-2.5 py-2 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const t = OUT[r.decision];
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="border-t border-soft-200"
                >
                  <td className="px-2.5 py-1.5 font-mono text-[9.5px] text-ink-mute">{r.time}</td>
                  <td className="px-2.5 py-1.5 text-[10.5px] font-semibold text-navy-500">{r.actor}</td>
                  <td className="px-2.5 py-1.5 truncate font-mono text-[9.5px] text-ink-subtle">{r.action}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[9.5px] font-bold text-electric-700">{r.atgc}</td>
                  <td className="px-2.5 py-1.5">
                    <span className="rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase" style={{ background: t.bg, color: t.fg }}>
                      {r.decision}
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5 truncate font-mono text-[9.5px] text-ink-mute">{r.reason}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}

function ObserveRisk() {
  const cards: { kind: string; tone: "amber" | "rose"; metric: string; sub: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { kind: "Unusual delegation",     tone: "amber", metric: "3 events",   sub: "agent → unknown sub-agent",      Icon: GitBranch },
    { kind: "Unknown service acct",   tone: "rose",  metric: "1 event",    sub: "svc-prod-7af2 · no lineage",     Icon: Users },
    { kind: "Risky export",           tone: "rose",  metric: "0 events",   sub: "blocked · raw PII outbound",     Icon: AlertTriangle },
    { kind: "High-risk tool call",    tone: "amber", metric: "8 events",   sub: "code interpreter · approved",    Icon: Cog },
    { kind: "New MCP connection",     tone: "amber", metric: "2 events",   sub: "MCP/community · review pending", Icon: Network },
    { kind: "Policy drift",           tone: "amber", metric: "4 changes",  sub: "skills.md · last 24h",           Icon: ScanLine },
  ];
  const TONE: Record<typeof cards[number]["tone"], { ring: string; bg: string; fg: string }> = {
    amber: { ring: "#FCD34D", bg: "#FFFBEB", fg: "#92400E" },
    rose:  { ring: "#FDA4AF", bg: "#FFF1F2", fg: "#9F1239" },
  };
  return (
    <DashboardSection
      title="Behavior & risk"
      subtitle="Unusual delegation · unknown identities · drift · risky tool use"
      counters={[
        { label: "Open", value: 14 },
        { label: "Blocked", value: 9 },
        { label: "Reviewed", value: 41 },
      ]}
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          const t = TONE[c.tone];
          const Icon = c.Icon;
          return (
            <motion.li
              key={c.kind}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border bg-white px-3 py-2.5"
              style={{ borderColor: t.ring }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-navy-500">{c.kind}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md" style={{ background: t.bg, color: t.fg }}>
                  <Icon className="h-3 w-3" />
                </span>
              </div>
              <div className="mt-0.5 text-[11px] font-bold" style={{ color: t.fg }}>{c.metric}</div>
              <div className="font-mono text-[9.5px] text-ink-mute">{c.sub}</div>
            </motion.li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}

function ObserveProvenance() {
  const lines: { label: string; value: string }[] = [
    { label: "Prompt hash",      value: "0x4f1a…b8c2" },
    { label: "User identity",    value: "alice (CFO) · Okta MFA" },
    { label: "Agent identity",   value: "Finance Agt · Reporting Agt" },
    { label: "Service account",  value: "svc-finance-q4-prod" },
    { label: "Tools used",       value: "MCP/Browser · MCP/Code · Snowflake" },
    { label: "Policies applied", value: "scope=Q4 · pii=deny · approval=auto" },
    { label: "Blocked paths",    value: "external email export (PII)" },
    { label: "Data sources",     value: "snowflake.q4_revenue · sf.tickets" },
    { label: "Output hash",      value: "0xa2c1…e08f" },
  ];
  return (
    <DashboardSection
      title="Provenance record"
      subtitle="Audit-ready evidence — actors, decisions, data, blocked paths, output"
      counters={[
        { label: "Records", value: "13,239" },
        { label: "Today", value: 482 },
        { label: "Verified", value: "100%" },
      ]}
    >
      <div className="rounded-2xl border border-electric-200 bg-white">
        <div className="flex items-center justify-between border-b border-soft-200 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <FileSignature className="h-3.5 w-3.5 text-electric-600" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-navy-500">
              Provenance Record · 0x4f1a…b8c2
            </span>
          </div>
          <button type="button" className="rounded-full border border-electric-200 bg-electric-50 px-2 py-0.5 text-[10px] font-semibold text-electric-700 hover:bg-electric-100">
            Export
          </button>
        </div>
        <ul className="divide-y divide-soft-100">
          {lines.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-3 py-1.5"
            >
              <CheckCircle2 className="h-3 w-3 flex-none text-emerald-500" />
              <span className="flex-none text-[10.5px] font-semibold text-navy-500">{l.label}</span>
              <span className="ml-auto truncate font-mono text-[9.5px] text-ink-mute">{l.value}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </DashboardSection>
  );
}

/* ============================================================
 * Shared dashboard section wrapper
 * ============================================================ */

function DashboardSection({
  title,
  subtitle,
  counters,
  children,
}: {
  title: string;
  subtitle: string;
  counters: { label: string; value: string | number }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-electric-700">
            <Sparkles className="h-3 w-3" />
            {title}
          </div>
          <h4 className="mt-0.5 font-display text-[14.5px] font-semibold text-navy-500">
            {subtitle}
          </h4>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          {counters.map((c) => (
            <div key={c.label} className="text-right">
              <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-mute">
                {c.label}
              </div>
              <div className="font-display text-[14px] font-semibold text-navy-500">
                {c.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileSignature,
  GitBranch,
  Hash,
  Network,
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

type TabId = "connect" | "govern" | "observe";

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
    headline: "Add AgentDNA to your agent workflow.",
    description:
      "Connect users, agents, tools, and enterprise systems by adding AgentDNA into the agent execution layer.",
    steps: [
      {
        title: "Install the AgentDNA package",
        description: "Add the AgentDNA package into your agent code.",
      },
      {
        title: "Create identities for users and agents",
        description:
          "Assign unique identities to users, agents, service accounts, and non-human actors.",
      },
      {
        title: "Enable the AgentDNA security layer",
        description:
          "Enable AgentDNA across agent-to-agent, agent-to-tool, and agent-to-application interactions.",
      },
      {
        title: "Record interactions on-chain",
        description: "Write verified interaction records to the chain.",
      },
    ],
  },
  {
    id: "govern",
    label: "Govern",
    Icon: ShieldCheck,
    headline: "Define what agents can access, modify, and execute.",
    description:
      "Govern agent permissions, enterprise SaaS access, skills, tools, policies, and instruction files before actions are allowed.",
    steps: [
      {
        title: "Approve access",
        description: "Approve which agents can connect to your apps.",
      },
      {
        title: "Govern agent skills and tools",
        description:
          "Control which skills, tools, MCP servers, and instruction files each agent can use. Track skills.md, agent.md, MCP configs, tool manifests, CrewAI, LangGraph, and AutoGen definitions.",
      },
      {
        title: "View history of policy and skill edits",
        description:
          "Track every policy, skill, instruction, and tool configuration change with editor identity, timestamp, version, approval status, and provenance.",
      },
    ],
  },
  {
    id: "observe",
    label: "Observe",
    Icon: Activity,
    headline: "See agent activity from every level.",
    description:
      "Observe agentic workflows from admin, user, and agent-level views.",
    steps: [
      {
        title: "Admin-level workflow view",
        description:
          "Give administrators a unified view of workflows, identities, policies, and provenance.",
      },
      {
        title: "User-level interaction view",
        description:
          "Show each user the agent interactions that happened on their behalf — delegated agents, tools used, data accessed, decisions made, and outcomes.",
      },
      {
        title: "Agent-level execution view",
        description:
          "Inspect an individual agent's behavior, permissions, tool calls, MCP connections, policy decisions, and provenance trail.",
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
            <span className="text-electric-600">Govern.</span>{" "}
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
                    mood={activeTab === "govern" ? "protect" : "guide"}
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

        {/* Section summary + CTA */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-[14px] leading-relaxed text-ink-subtle">
          <span className="font-semibold text-navy-500">
            Connect AgentDNA to the workflow.
          </span>{" "}
          <span className="font-semibold text-navy-500">
            Govern agent access and skills.
          </span>{" "}
          <span className="font-semibold text-navy-500">
            Observe every action with provenance.
          </span>
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="https://dashboard.agentdna.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
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
      <ConnectInstall />,
      <ConnectIdentities />,
      <ConnectEnable />,
      <ConnectOnChain />,
    ][step];
  }
  if (tab === "govern") {
    return [
      <GovernAccess />,
      <GovernSkills />,
      <GovernHistory />,
    ][step];
  }
  return [
    <ObserveAdmin />,
    <ObserveUser />,
    <ObserveAgent />,
  ][step];
}

/* ============================================================
 * CONNECT dashboards
 * ============================================================ */

function ConnectInstall() {
  return (
    <DashboardSection
      title="Install"
      subtitle="Add the AgentDNA SDK and enable the runtime hook"
   
    >
      <div className="flex flex-col gap-2.5">
        <CodePanel
          tone="dark"
          label="bash"
          lines={[
            { prefix: "$", text: "pip install agentdna", color: "muted" },
            { text: "Collecting agentdna...", color: "muted" },
            { text: "Successfully installed agentdna-1.2.0", color: "success" },
          ]}
        />
        <CodePanel
          tone="light"
          label="agent.py"
          lines={[
            { text: "from agentdna import AgentDNA", color: "code" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusChip icon={CheckCircle2} tone="emerald" label="SDK installed" />
          <StatusChip icon={Activity} tone="electric" label="Runtime hook enabled" />
          <StatusChip icon={Sparkles} tone="electric" label="Package connected" />
        </div>
      </div>
    </DashboardSection>
  );
}

function ConnectIdentities() {
  return (
    <DashboardSection
      title="Identities"
      subtitle="Assign unique identities to users, agents, and non-human actors"
  
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
              USER IDENTITY
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="h-2.5 w-2.5" />
              verified
            </span>
          </div>
          <CodePanel
            tone="light"
            label="register_user.py"
            lines={[
              { text: "# agentdna create user identity", color: "comment" },
              { text: "dna = AgentDNA(", color: "code" },
              { text: '    alias="JohnDoe",', color: "code" },
              { text: '    api_key="<API Key for AgentDNA>"', color: "code" },
              { text: ")", color: "code" },
            ]}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
              AGENT IDENTITY
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="h-2.5 w-2.5" />
              verified
            </span>
          </div>
          <CodePanel
            tone="light"
            label="register_agent.py"
            lines={[
              { text: "# agentdna create agent identity", color: "comment" },
              { text: "dna = AgentDNA(", color: "code" },
              { text: '    alias="FinanceAgent",', color: "code" },
              { text: '    api_key="<API Key for AgentDNA>"', color: "code" },
              { text: ")", color: "code" },
            ]}
          />
        </div>
      </div>
    </DashboardSection>
  );
}

function ConnectEnable() {
  return (
    <DashboardSection
      title="Security layer"
      subtitle="Enable AgentDNA across agent-to-agent, agent-to-tool, and agent-to-app calls"
   
    >
      <div className="flex flex-col gap-2.5">
        <CodePanel
          tone="light"
          label="agent_handler.py"
          lines={[
            { text: "# outbound: sign and attach context", color: "comment" },
            { text: "outbound = dna.build(", color: "code" },
            { text: '    original_message="user prompt",', color: "code" },
            { text: '    state={"task_id": tid, "context_id": cid}', color: "code" },
            { text: ")", color: "code" },
            { text: "", color: "code" },
            { text: "# inbound: verify, authorize, record", color: "comment" },
            { text: "result = await self.dna.handle(", color: "code" },
            { text: "    resp_parts=resp_parts,", color: "code" },
            { text: "    original_task=task,", color: "code" },
            { text: "    remote_name=agent_name,", color: "code" },
            { text: ")", color: "code" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusChip icon={CheckCircle2} tone="emerald" label="Outbound signed" />
          <StatusChip icon={ShieldCheck} tone="electric" label="Inbound verified" />
          <StatusChip icon={FileSignature} tone="electric" label="Policy attached" />
        </div>
      </div>
    </DashboardSection>
  );
}

function ConnectOnChain() {
  type Status = "signed" | "recorded" | "confirmed";
  const records: { time: string; label: string; hash: string; status: Status; Icon: React.ComponentType<{ className?: string }> }[] = [
    { time: "12:04:21", label: "Interaction signed",       hash: "0x4f1a…b8c2",      status: "signed",    Icon: FileSignature },
    { time: "12:04:22", label: "Policy decision attached", hash: "0x4f1a…b8c2",      status: "signed",    Icon: FileSignature },
    { time: "12:04:23", label: "Provenance hash generated",hash: "0xa2c1…e08f",      status: "recorded",  Icon: Hash },
    { time: "12:04:24", label: "Transaction recorded",     hash: "tx 0x9b22…77b1",   status: "recorded",  Icon: Hash },
  ];
  const TONE: Record<Status, { tile: string; chip: string }> = {
    signed:    { tile: "bg-electric-50 text-electric-600", chip: "bg-electric-50 text-electric-700 border-electric-200" },
    recorded:  { tile: "bg-emerald-50 text-emerald-600",   chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    confirmed: { tile: "bg-emerald-50 text-emerald-600",   chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };
  return (
    <DashboardSection
      title="On-chain records"
      subtitle="Interaction signed · provenance recorded · on-chain evidence created"
    
    >
      <ul className="space-y-1.5">
        {records.map((r, i) => {
          const t = TONE[r.status];
          const Icon = r.Icon;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 rounded-xl border border-soft-200 bg-white px-2.5 py-2"
            >
              <span className="font-mono text-[9.5px] text-ink-mute">{r.time}</span>
              <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-md ${t.tile}`}>
                <Icon className="h-3 w-3" />
              </span>
              <span className="flex-1 truncate text-[11.5px] font-semibold text-navy-500">{r.label}</span>
              <span className="flex-none truncate font-mono text-[9.5px] text-ink-mute">{r.hash}</span>
              <span className={`inline-flex flex-none items-center rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${t.chip}`}>
                {r.status}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}

/* ============================================================
 * GOVERN dashboards
 * ============================================================ */

function GovernAccess() {
  type Status = "approved" | "approval" | "blocked";
  const rows: { agent: string; appSlug: string; appName: string; note: string; status: Status; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { agent: "Finance Agent",  appSlug: "salesforce", appName: "Salesforce", note: "scope=read · time-bound",     status: "approved", Icon: CheckCircle2, label: "Approved" },
    { agent: "Support Agent",  appSlug: "zendesk",    appName: "Zendesk",    note: "auto · ticket triage",         status: "approved", Icon: CheckCircle2, label: "Approved" },
    { agent: "DevOps Agent",   appSlug: "github",     appName: "GitHub",     note: "human approval · prod",        status: "approval", Icon: Clock,        label: "Require approval" },
    { agent: "Unknown Agent",  appSlug: "snowflake",  appName: "Snowflake",  note: "unknown identity · no lineage", status: "blocked",  Icon: XCircle,      label: "Blocked" },
  ];
  const TONE: Record<Status, string> = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    approval: "border-amber-200 bg-amber-50 text-amber-700",
    blocked:  "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <DashboardSection
      title="SaaS access approvals"
      subtitle="Approve which agents can connect to your apps"
     
    >
      <ul className="space-y-1.5">
        {rows.map((r, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-2 rounded-xl border border-soft-200 bg-white px-2.5 py-2"
          >
            <BrandLogo slug="agent" size={14} bare />
            <span className="text-[11.5px] font-semibold text-navy-500">{r.agent}</span>
            <ArrowRight className="h-3 w-3 text-ink-mute" />
            <BrandLogo slug={r.appSlug} size={14} bare />
            <span className="text-[11.5px] font-semibold text-navy-500">{r.appName}</span>
            <span className="flex-1 truncate font-mono text-[9.5px] text-ink-mute">{r.note}</span>
            <span className={`inline-flex flex-none items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${TONE[r.status]}`}>
              <r.Icon className="h-2.5 w-2.5" />
              {r.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </DashboardSection>
  );
}

function GovernSkills() {
  const files: { name: string; owner: string; version: string; hash: string; modified: string }[] = [
    { name: "skills.md",            owner: "Finance",  version: "v3", hash: "0xa9c1…77b3", modified: "12 min ago" },
    { name: "agent.md",             owner: "Finance",  version: "v2", hash: "0xb302…8f1d", modified: "1 hr ago" },
    { name: "mcp.config.json",      owner: "Platform", version: "v1", hash: "0xc4ee…21a2", modified: "2 hr ago" },
    { name: "tools.yaml",           owner: "DevOps",   version: "v4", hash: "0xd0a1…99e7", modified: "4 hr ago" },
    { name: "crewai_tools.py",      owner: "Platform", version: "v2", hash: "0xe71b…c4d8", modified: "yesterday" },
    { name: "langgraph_tools.ts",   owner: "Platform", version: "v1", hash: "0xf293…a01c", modified: "2 days ago" },
    { name: "autogen_config.json",  owner: "R&D",      version: "v1", hash: "0x1a44…7720", modified: "3 days ago" },
    { name: "policy.yaml",          owner: "Security", version: "v8", hash: "0x88dc…ffa3", modified: "5 days ago" },
  ];
  return (
    <DashboardSection
      title="Skills & tool registry"
      subtitle="skills.md · agent.md · MCP configs · CrewAI · LangGraph · AutoGen · policy"
    >
      <div className="overflow-hidden rounded-xl border border-soft-200">
        <table className="w-full text-left text-[11.5px]">
          <thead className="bg-soft-50">
            <tr className="text-[10px] uppercase tracking-wider text-ink-mute">
              <th className="px-2.5 py-2 font-semibold">File</th>
              <th className="px-2.5 py-2 font-semibold">Owner</th>
              <th className="px-2.5 py-2 font-semibold">Version</th>
              <th className="px-2.5 py-2 font-semibold">Checksum</th>
              <th className="px-2.5 py-2 font-semibold">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => (
              <motion.tr
                key={f.name}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-t border-soft-200"
              >
                <td className="px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-navy-500">
                  {f.name}
                </td>
                <td className="px-2.5 py-1.5 text-[10.5px] text-ink-subtle">{f.owner}</td>
                <td className="px-2.5 py-1.5 font-mono text-[10.5px] text-electric-700">{f.version}</td>
                <td className="px-2.5 py-1.5 font-mono text-[9.5px] text-ink-mute">{f.hash}</td>
                <td className="px-2.5 py-1.5 text-[9.5px] text-ink-mute">{f.modified}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}

function GovernHistory() {
  type Status = "approved" | "pending" | "limited";
  const events: { label: string; editor: string; time: string; hash: string; status: Status }[] = [
    { label: "skills.md updated",              editor: "alice@acme", time: "12 min ago", hash: "0xa9c1…77b3", status: "approved" },
    { label: "policy.yaml changed",            editor: "john@acme",  time: "1 hr ago",   hash: "0x88dc…ffa3", status: "approved" },
    { label: "MCP config approved",            editor: "jamie@acme", time: "2 hr ago",   hash: "0xc4ee…21a2", status: "approved" },
    { label: "GitHub tool access limited",     editor: "alice@acme", time: "4 hr ago",   hash: "0xd0a1…99e7", status: "limited" },
    { label: "prompt template version updated",editor: "john@acme",  time: "yesterday",  hash: "0xb302…8f1d", status: "pending" },
  ];
  const TONE: Record<Status, string> = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending:  "border-amber-200 bg-amber-50 text-amber-700",
    limited:  "border-sky-200 bg-sky-50 text-sky-700",
  };
  return (
    <DashboardSection
      title="Audit history"
      subtitle="Every policy, skill, instruction, and tool change — with provenance"
    
    >
      <ol className="relative ml-2 space-y-3 border-l border-soft-200 pl-4">
        {events.map((e, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative"
          >
            <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-white ring-2 ring-electric-300" />
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-bold text-navy-500">{e.label}</span>
              <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${TONE[e.status]}`}>
                {e.status}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[9.5px] text-ink-mute">
              <span>{e.editor}</span>
              <span>·</span>
              <span>{e.time}</span>
              <span>·</span>
              <span>{e.hash}</span>
              <span>·</span>
              <a href="#" className="text-electric-700 hover:underline">provenance</a>
            </div>
          </motion.li>
        ))}
      </ol>
    </DashboardSection>
  );
}

/* ============================================================
 * OBSERVE dashboards
 * ============================================================ */

function ObserveAdmin() {
  type Tone = "warn" | "good" | "default";
  const stats: { label: string; value: string | number; tone: Tone }[] = [
    { label: "Total agents",        value: 19,        tone: "default" },
    { label: "Active workflows",    value: 132,       tone: "default" },
    { label: "Connected SaaS apps", value: 28,        tone: "default" },
    { label: "Blocked actions",     value: 184,       tone: "warn" },
    { label: "Policy decisions",    value: "13,212",  tone: "default" },
    { label: "Provenance records",  value: "13,239",  tone: "good" },
    { label: "Chain activity",      value: "+482",    tone: "good" },
  ];
  const TONE: Record<Tone, string> = {
    warn: "text-rose-600",
    good: "text-emerald-600",
    default: "text-navy-500",
  };
  type N = { id: string; slug: string; label: string; x: number; y: number };
  const nodes: N[] = [
    { id: "u",   slug: "user",       label: "Users",      x: 30,  y: 65  },
    { id: "ag",  slug: "agent",      label: "Agents",     x: 130, y: 30  },
    { id: "ag2", slug: "agent",      label: "Sub-agents", x: 130, y: 100 },
    { id: "mc",  slug: "mcp",        label: "MCP",        x: 240, y: 65  },
    { id: "ap",  slug: "salesforce", label: "SaaS",       x: 340, y: 30  },
    { id: "db",  slug: "snowflake",  label: "Data",       x: 340, y: 100 },
    { id: "op",  slug: "tools",      label: "Output",     x: 450, y: 65  },
    { id: "pr",  slug: "service",    label: "Provenance", x: 540, y: 65  },
  ];
  const edges: [string, string][] = [
    ["u","ag"], ["u","ag2"], ["ag","mc"], ["ag2","mc"],
    ["mc","ap"], ["mc","db"], ["ap","op"], ["db","op"], ["op","pr"],
  ];
  const map = new Map(nodes.map((n) => [n.id, n]));
  return (
    <DashboardSection
      title="Admin · workflow control plane"
      subtitle="Identities, workflows, policies, and provenance — unified"
    
    >
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-soft-200 bg-white px-2 py-1.5"
            >
              <div className="font-mono text-[8.5px] uppercase tracking-wider text-ink-mute">
                {s.label}
              </div>
              <div className={`font-display text-[14px] font-bold ${TONE[s.tone]}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-soft-200 bg-soft-50/50 p-2.5">
          <svg viewBox="0 0 560 130" className="h-[130px] w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="oa-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9EBEFF" />
                <stop offset="100%" stopColor="#2D7DFF" />
              </linearGradient>
            </defs>
            {edges.map(([a, b], i) => {
              const A = map.get(a)!;
              const B = map.get(b)!;
              return (
                <g key={i}>
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="url(#oa-line)" strokeWidth={1.2} />
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
      </div>
    </DashboardSection>
  );
}

function ObserveUser() {
  type Kind = "user" | "delegated" | "approved" | "blocked" | "output";
  const events: { time: string; kind: Kind; label: string; sub: string }[] = [
    { time: "12:04:21", kind: "user",      label: "Prompt submitted",     sub: "alice (CFO) → AgentDNA" },
    { time: "12:04:22", kind: "delegated", label: "Agent assigned",       sub: "Finance Agent · ag-7f2a" },
    { time: "12:04:23", kind: "approved",  label: "Tool called",          sub: "MCP/Browser · search" },
    { time: "12:04:24", kind: "approved",  label: "SaaS accessed",        sub: "Snowflake · q4_revenue.read" },
    { time: "12:04:25", kind: "blocked",   label: "Export blocked",       sub: "PII outbound · email" },
    { time: "12:04:27", kind: "output",    label: "Output generated",     sub: "Board Summary · summary.md" },
    { time: "12:04:28", kind: "approved",  label: "Provenance recorded",  sub: "0x4f1a…b8c2 · sealed" },
  ];
  const KIND: Record<Kind, { ring: string; chip: string; chipText: string; Icon: React.ComponentType<{ className?: string }>; chipLabel: string }> = {
    user:      { ring: "ring-electric-300",   chip: "border-electric-200 bg-electric-50 text-electric-700",                  chipText: "text-electric-700", Icon: Users,        chipLabel: "Acting on behalf of user" },
    delegated: { ring: "ring-[#C4B5FD]",      chip: "border-[#C4B5FD] bg-[#F5F3FF] text-[#6D28D9]",                          chipText: "text-[#6D28D9]",     Icon: GitBranch,    chipLabel: "Delegated to agent" },
    approved:  { ring: "ring-emerald-300",    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",                     chipText: "text-emerald-700",   Icon: CheckCircle2, chipLabel: "Approved action" },
    blocked:   { ring: "ring-rose-300",       chip: "border-rose-200 bg-rose-50 text-rose-700",                              chipText: "text-rose-700",      Icon: XCircle,      chipLabel: "Blocked action" },
    output:    { ring: "ring-electric-300",   chip: "border-electric-200 bg-electric-50 text-electric-700",                  chipText: "text-electric-700", Icon: Sparkles,     chipLabel: "Final output" },
  };
  return (
    <DashboardSection
      title="User · activity timeline"
      subtitle="Every agent action taken on alice's behalf"
     
    >
      <ol className="relative ml-2 space-y-3 border-l border-soft-200 pl-4">
        {events.map((e, i) => {
          const k = KIND[e.kind];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative"
            >
              <span className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-white ring-2 ${k.ring}`} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9.5px] text-ink-mute">{e.time}</span>
                <span className="text-[11.5px] font-bold text-navy-500">{e.label}</span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${k.chip}`}>
                  <k.Icon className="h-2.5 w-2.5" />
                  {k.chipLabel}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[9.5px] text-ink-mute">{e.sub}</div>
            </motion.li>
          );
        })}
      </ol>
    </DashboardSection>
  );
}

function ObserveAgent() {
  type Outcome = "allowed" | "limited" | "blocked";
  const interactions: { time: string; action: string; outcome: Outcome }[] = [
    { time: "12:04:22", action: "snowflake.q4_revenue.read",  outcome: "allowed" },
    { time: "12:04:23", action: "salesforce.tickets.read",    outcome: "limited" },
    { time: "12:04:24", action: "external.email.export.pii",  outcome: "blocked" },
    { time: "12:04:27", action: "slack.post(channel=#fin)",   outcome: "allowed" },
  ];
  const OUT: Record<Outcome, string> = {
    allowed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    limited: "border-sky-200 bg-sky-50 text-sky-700",
    blocked: "border-rose-200 bg-rose-50 text-rose-700",
  };
  const skills = ["skills.md", "agent.md", "policy.yaml"];
  const tools: { slug: string; name: string }[] = [
    { slug: "snowflake",  name: "snowflake" },
    { slug: "salesforce", name: "salesforce" },
    { slug: "slack",      name: "slack" },
    { slug: "mcp",        name: "mcp" },
  ];
  return (
    <DashboardSection
      title="Agent · execution profile"
      subtitle="Identity, skills, allowed tools, decisions, and provenance"
     
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-electric-200 bg-electric-50/40 p-3">
          <div className="flex items-center gap-2">
            <BrandLogo slug="agent" size={22} bare />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-navy-500">Finance Agent</div>
              <div className="font-mono text-[9.5px] text-ink-mute">ag-7f2a · claude-sonnet</div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="h-2.5 w-2.5" />
              verified
            </span>
          </div>
          <div className="mt-3">
            <div className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
              ASSIGNED SKILLS
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s} className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] text-electric-700 ring-1 ring-electric-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
              ALLOWED TOOLS / SAAS
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {tools.map((t) => (
                <span key={t.slug} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] text-navy-500 ring-1 ring-soft-200">
                  <BrandLogo slug={t.slug} size={12} bare />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-ink-mute">
            Recent interactions
          </div>
          <ul className="space-y-1.5">
            {interactions.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 rounded-xl border border-soft-200 bg-white px-2.5 py-1.5"
              >
                <span className="font-mono text-[9.5px] text-ink-mute">{r.time}</span>
                <span className="flex-1 truncate font-mono text-[10px] text-ink-subtle">{r.action}</span>
                <span className={`inline-flex flex-none items-center rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${OUT[r.outcome]}`}>
                  {r.outcome}
                </span>
              </motion.li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 rounded-xl border border-electric-200 bg-electric-50/40 px-2 py-1.5">
            <FileSignature className="h-3 w-3 flex-none text-electric-600" />
            <span className="font-mono text-[9.5px] text-ink-subtle">0x4f1a…b8c2 · 9 verified entries · sealed</span>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}

/* ============================================================
 * Shared helpers
 * ============================================================ */

type LineColor = "muted" | "code" | "success" | "comment";

function CodePanel({ tone, label, lines }: {
  tone: "light" | "dark";
  label: string;
  lines: { prefix?: string; text: string; color: LineColor }[];
}) {
  const COLOR: Record<LineColor, string> = {
    muted:   tone === "dark" ? "text-slate-400" : "text-ink-mute",
    code:    tone === "dark" ? "text-slate-100" : "text-navy-500",
    success: "text-emerald-500",
    comment: tone === "dark" ? "text-slate-500" : "text-ink-mute",
  };
  return (
    <div className={`overflow-hidden rounded-xl border ${tone === "dark" ? "border-slate-700 bg-slate-900" : "border-soft-200 bg-white"}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 ${tone === "dark" ? "border-b border-slate-700/60 text-slate-300" : "border-b border-soft-200 text-ink-mute"}`}>
        <span className="font-mono text-[9.5px] uppercase tracking-wider">{label}</span>
        <span className="flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-slate-500" : "bg-soft-200"}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-slate-500" : "bg-soft-200"}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-slate-500" : "bg-soft-200"}`} />
        </span>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[10.5px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={COLOR[l.color]}>
            {l.prefix && <span className="select-none text-emerald-400">{l.prefix} </span>}
            {l.text || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}

function StatusChip({ icon: Icon, tone, label }: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "electric";
  label: string;
}) {
  const styles = tone === "emerald"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-electric-200 bg-electric-50/70 text-electric-700";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ============================================================
 * Shared dashboard section wrapper
 * ============================================================ */

function DashboardSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
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
       
      </div>
      {children}
    </>
  );
}

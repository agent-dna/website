/**
 * Hero execution graph — stage-driven workflow definitions.
 *
 * AgentDNA does not run ATGC as a sequence. ATGC is a *control layer* applied
 * at every meaningful hop in a workflow:
 *
 *   A — Auth        verifies the actor (user, agent, NHI, service acct, API
 *                   key, MCP server, tool identity)
 *   T — Trust       evaluates delegation, system relationships, and execution
 *                   path trust
 *   G — Governance  enforces policy, scope, least-privilege, and approvals
 *   C — Control     determines and enforces the outcome — allow / limit /
 *                   block / require approval / record provenance
 *
 * Each stage of a workflow may apply one dimension, a subset, or the full
 * set, depending on risk, identity, delegation, data sensitivity, and action
 * type. The graph and the side panel are both driven by the same stage list,
 * so the visual flow and the explanation are always in sync.
 */

export type ATGC = "A" | "T" | "G" | "C";

/** Step is now a derived display label used by the AgentDNA character mood
 *  and the step callout. Stages are the truth source for animation. */
export type Step = "idle" | "A" | "C" | "G" | "T" | "expand";

export type GraphCluster =
  | "identity"
  | "nhi"
  | "agent"
  | "tool"
  | "saas"
  | "cloud"
  | "data"
  | "security"
  | "output";

export type GraphNode = {
  id: string;
  slug: string;
  label?: string;
  x: number;
  y: number;
  cluster: GraphCluster;
};

export type EdgeStatus =
  | "approve"
  | "deny"
  | "pending"
  | "provenance"
  | "automation";

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  status: EdgeStatus;
  /** Stage during which this edge animates. */
  stageId?: string;
  /** ATGC subset applied at this hop — shown as a grouped badge on the edge. */
  atgc?: ATGC[];
  /** Stagger order within the stage (lower = animates earlier). */
  order?: number;
};

export type Outcome =
  | "allowed"
  | "limited"
  | "conditional"
  | "blocked"
  | "recorded"
  | "risk-confirmed";

export type WorkflowStage = {
  id: string;
  /** Short stage title shown in the side panel and step callout. */
  title: string;
  /** 1-2 sentence workflow-specific explanation. */
  description: string;
  /** ATGC subset that applies at this hop. */
  atgc: ATGC[];
  /** Outcome at this stage. */
  outcome: Outcome;
  /** Nodes that activate (turn electric blue) at this stage. */
  activeNodeIds: string[];
  /** Stage duration in seconds. */
  duration: number;
};

/* ============================================================
 * Static graph (50 nodes)
 * ============================================================ */

export const HERO_NODES: GraphNode[] = [
  /* Identity */
  { id: "n_user",   slug: "user",             label: "User",          x: 60,   y: 70,  cluster: "identity" },
  { id: "n_admin",  slug: "user",             label: "Admin",         x: 60,   y: 180, cluster: "identity" },
  { id: "n_okta",   slug: "okta",             x: 180,  y: 100, cluster: "identity" },
  { id: "n_entra",  slug: "entra",            label: "Entra",         x: 200,  y: 195, cluster: "identity" },
  { id: "n_gws",    slug: "google-workspace", label: "Workspace",     x: 60,   y: 290, cluster: "identity" },

  /* Non-human identities */
  { id: "n_svc",      slug: "service", label: "Service Acct", x: 80,   y: 365, cluster: "nhi" },
  { id: "n_workload", slug: "service", label: "Workload Id",  x: 60,   y: 460, cluster: "nhi" },
  { id: "n_cicd",     slug: "service", label: "CI/CD Id",     x: 170,  y: 530, cluster: "nhi" },

  /* Generic agent slots (labels are overridden per workflow) */
  { id: "n_agent_a",  slug: "agent",     label: "Agent",        x: 320, y: 200, cluster: "agent" },
  { id: "n_agent_b",  slug: "agent",     label: "Sub-Agent",    x: 340, y: 300, cluster: "agent" },
  { id: "n_agent_c",  slug: "agent",     label: "Workflow Agt", x: 290, y: 105, cluster: "agent" },
  { id: "n_agent_d",  slug: "agent",     label: "Policy Agt",   x: 270, y: 400, cluster: "agent" },
  { id: "n_agent_e",  slug: "agent",     label: "Data Agt",     x: 350, y: 470, cluster: "agent" },

  /* AI providers */
  { id: "n_openai",  slug: "openai",    x: 470, y: 130, cluster: "agent" },
  { id: "n_claude",  slug: "anthropic", x: 480, y: 240, cluster: "agent" },

  /* Tools / MCP */
  { id: "n_mcp",      slug: "mcp",   label: "MCP Server", x: 610, y: 200, cluster: "tool" },
  { id: "n_browser",  slug: "tools", label: "Browser",    x: 700, y: 150, cluster: "tool" },
  { id: "n_file",     slug: "tools", label: "File Tool",  x: 700, y: 260, cluster: "tool" },
  { id: "n_code",     slug: "tools", label: "Code Interp",x: 770, y: 320, cluster: "tool" },
  { id: "n_workflow", slug: "tools", label: "Workflow",   x: 650, y: 410, cluster: "tool" },
  { id: "n_apigw",    slug: "tools", label: "API Gateway",x: 850, y: 250, cluster: "tool" },

  /* SaaS */
  { id: "n_slack",      slug: "slack",                                x: 900,  y: 380, cluster: "saas" },
  { id: "n_teams",      slug: "teams",            label: "Teams",     x: 920,  y: 80,  cluster: "saas" },
  { id: "n_sf",         slug: "salesforce",                           x: 910,  y: 175, cluster: "saas" },
  { id: "n_servicenow", slug: "servicenow",                           x: 1030, y: 110, cluster: "saas" },
  { id: "n_jira",       slug: "jira",                                 x: 1085, y: 200, cluster: "saas" },
  { id: "n_confluence", slug: "confluence",                           x: 1085, y: 285, cluster: "saas" },
  { id: "n_workday",    slug: "workday",                              x: 1110, y: 365, cluster: "saas" },
  { id: "n_github",     slug: "github",                               x: 840,  y: 430, cluster: "saas" },
  { id: "n_m365",       slug: "teams",            label: "M365",      x: 970,  y: 220, cluster: "saas" },
  { id: "n_zendesk",    slug: "service",          label: "Zendesk",   x: 720,  y: 470, cluster: "saas" },

  /* External / off-graph (deny target) */
  { id: "n_external", slug: "tools", label: "External", x: 1140, y: 280, cluster: "saas" },

  /* Cloud */
  { id: "n_aws",    slug: "aws",         x: 1000, y: 470, cluster: "cloud" },
  { id: "n_azure",  slug: "azure",       x: 1100, y: 540, cluster: "cloud" },
  { id: "n_gcp",    slug: "gcp",         x: 1115, y: 440, cluster: "cloud" },
  { id: "n_k8s",    slug: "kubernetes",  label: "K8s",     x: 1000, y: 595, cluster: "cloud" },
  { id: "n_docker", slug: "docker",      x: 905,  y: 595, cluster: "cloud" },
  { id: "n_lambda", slug: "lambda",      label: "Lambda",  x: 1045, y: 380, cluster: "cloud" },

  /* Data */
  { id: "n_snowflake", slug: "snowflake",                              x: 645, y: 530, cluster: "data" },
  { id: "n_postgres",  slug: "postgresql", label: "Postgres",          x: 525, y: 590, cluster: "data" },
  { id: "n_bq",        slug: "bigquery",   label: "BigQuery",          x: 395, y: 615, cluster: "data" },
  { id: "n_mongo",     slug: "mongodb",    label: "Mongo",             x: 290, y: 620, cluster: "data" },
  { id: "n_pinecone",  slug: "pinecone",                               x: 490, y: 470, cluster: "data" },
  { id: "n_drive",     slug: "google-workspace", label: "Drive",       x: 760, y: 380, cluster: "data" },

  /* Security / Observability */
  { id: "n_datadog",    slug: "datadog",        x: 95,  y: 580, cluster: "security" },
  { id: "n_splunk",     slug: "splunk",         x: 60,  y: 510, cluster: "security" },
  { id: "n_cloudflare", slug: "cloudflare",     label: "Cloudflare",  x: 250, y: 580, cluster: "security" },
  { id: "n_pagerduty",  slug: "pagerduty",      label: "PagerDuty",   x: 380, y: 545, cluster: "security" },
  { id: "n_gha",        slug: "github-actions", label: "GH Actions",  x: 440, y: 510, cluster: "security" },

  /* Workflow output (label varies per workflow) + provenance terminal */
  { id: "n_output",  slug: "tools",   label: "Output",            x: 530, y: 350, cluster: "output" },
  { id: "n_provrec", slug: "service", label: "Provenance Record", x: 220, y: 660, cluster: "output" },
];

/* Always-on automation edges (NHI driven) — render as faint grey scaffolding. */
export const HERO_AMBIENT_EDGES: GraphEdge[] = [
  { id: "e_amb1", from: "n_svc",      to: "n_github",       status: "automation" },
  { id: "e_amb2", from: "n_svc",      to: "n_aws",          status: "automation" },
  { id: "e_amb3", from: "n_workload", to: "n_lambda",       status: "automation" },
  { id: "e_amb4", from: "n_cicd",     to: "n_github",       status: "automation" },
  { id: "e_amb5", from: "n_cicd",     to: "n_aws",          status: "automation" },
  { id: "e_amb6", from: "n_github",   to: "n_gha",          status: "automation" },
  { id: "e_amb7", from: "n_gha",      to: "n_aws",          status: "automation" },
  { id: "e_amb8", from: "n_lambda",   to: "n_aws",          status: "automation" },
  { id: "e_amb9", from: "n_cloudflare", to: "n_aws",        status: "automation" },
  { id: "e_amb10", from: "n_pagerduty", to: "n_aws",        status: "provenance" },
];

/* ============================================================
 * Workflows
 * ============================================================ */

export type WorkflowDef = {
  id: string;
  label: string;
  prompt: string;
  /** Per-workflow node label override. */
  nodeLabels?: Record<string, string>;
  /** Stage-driven narrative. */
  stages: WorkflowStage[];
  /** Workflow-specific edges. Combined with HERO_AMBIENT_EDGES. */
  edges: GraphEdge[];
  provenance: {
    hash: string;
    lines: { label: string; value: string }[];
  };
};

/* ----- Workflow 1: Finance / Board Reporting ----- */
const finance: WorkflowDef = {
  id: "finance",
  label: "Finance",
  prompt:
    "Analyze Q4 revenue, compare it with support tickets, update the forecast, and prepare a board summary.",
  nodeLabels: {
    n_user:    "CFO · alice",
    n_agent_a: "Finance Agt",
    n_agent_b: "Reporting Agt",
    n_output:  "Board Summary",
    n_external: "External Email",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the CFO and checks whether this board-reporting request is permitted.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "Identity verified",
      description: "User identity is authenticated and the active session is trusted before delegation.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_okta"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Finance Agent delegated",
      description: "Agent is authenticated, bound to the CFO request, and checked against finance policy.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b"],
      duration: 2.0,
    },
    {
      id: "service-acct",
      title: "Service account requested",
      description: "Service account use is verified, trusted, governed by task scope, and controlled.",
      atgc: ["A", "T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_svc"],
      duration: 2.4,
    },
    {
      id: "salesforce",
      title: "Salesforce revenue accessed",
      description: "Revenue access matches Q4 reporting scope. Control limits to required records.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_sf"],
      duration: 1.8,
    },
    {
      id: "snowflake",
      title: "Snowflake analytics queried",
      description: "Sensitive analytics access requires full ATGC because it touches governed financial data.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_snowflake"],
      duration: 2.6,
    },
    {
      id: "zendesk",
      title: "Zendesk tickets compared",
      description: "Ticket data is allowed for aggregate comparison; sensitive fields are restricted.",
      atgc: ["G", "C"],
      outcome: "limited",
      activeNodeIds: ["n_zendesk"],
      duration: 2.0,
    },
    {
      id: "deny",
      title: "Raw PII export attempted",
      description: "Governance detects raw customer export outside the approved workflow. Control blocks it.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "summary",
      title: "Board summary generated",
      description: "Output is linked to trusted sources, governed transformations, and controlled generation.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output"],
      duration: 2.2,
    },
    {
      id: "deliver",
      title: "Saved + notified",
      description: "Report saved to approved Drive folder; Slack notification excludes sensitive data.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_drive", "n_slack"],
      duration: 2.0,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "User, agents, sources, decisions, blocked action, and final report are recorded as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "fE1",  from: "n_user",     to: "n_okta",       status: "approve",    stageId: "identity",     atgc: ["A","T"], order: 0 },
    { id: "fE2",  from: "n_okta",     to: "n_agent_a",    status: "approve",    stageId: "delegate",     atgc: ["A","T","G"], order: 0 },
    { id: "fE3",  from: "n_okta",     to: "n_agent_b",    status: "approve",    stageId: "delegate",     atgc: ["A","T","G"], order: 1 },
    { id: "fE4",  from: "n_agent_a",  to: "n_svc",        status: "approve",    stageId: "service-acct", atgc: ["A","T","G","C"], order: 0 },
    { id: "fE5",  from: "n_svc",      to: "n_sf",         status: "approve",    stageId: "salesforce",   atgc: ["G","C"], order: 0 },
    { id: "fE6",  from: "n_agent_a",  to: "n_snowflake",  status: "approve",    stageId: "snowflake",    atgc: ["A","T","G","C"], order: 0 },
    { id: "fE7",  from: "n_agent_a",  to: "n_zendesk",    status: "pending",    stageId: "zendesk",      atgc: ["G","C"], order: 0 },
    { id: "fE8",  from: "n_agent_a",  to: "n_external",   status: "deny",       stageId: "deny",         atgc: ["G","C"], order: 0 },
    { id: "fE9",  from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "summary",      atgc: ["T","G","C"], order: 0 },
    { id: "fE10", from: "n_output",   to: "n_drive",      status: "approve",    stageId: "deliver",      atgc: ["G","C"], order: 0 },
    { id: "fE11", from: "n_output",   to: "n_slack",      status: "approve",    stageId: "deliver",      atgc: ["G","C"], order: 1 },
    { id: "fE12", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance",   atgc: ["T","G","C"], order: 0 },
    { id: "fE13", from: "n_snowflake",to: "n_provrec",    status: "provenance", stageId: "provenance",                       order: 1 },
    { id: "fE14", from: "n_sf",       to: "n_provrec",    status: "provenance", stageId: "provenance",                       order: 2 },
  ],
  provenance: {
    hash: "0x4f1a…b8c2",
    lines: [
      { label: "User verified",       value: "alice (CFO) · Okta MFA" },
      { label: "Agents verified",     value: "Finance · Reporting" },
      { label: "Intent checked",      value: "Q4 board summary" },
      { label: "Policy enforced",     value: "scope=finance · pii=deny" },
      { label: "Data accessed",       value: "snowflake · sf · zendesk" },
      { label: "Output generated",    value: "drive.summary → slack" },
      { label: "Provenance recorded", value: "datadog/splunk" },
    ],
  },
};

/* ----- Workflow 2: DevOps / Incident Response ----- */
const devops: WorkflowDef = {
  id: "devops",
  label: "DevOps",
  prompt:
    "Investigate the production alert, check recent deploys, inspect logs, and draft an incident summary.",
  nodeLabels: {
    n_user:    "SRE · oncall",
    n_agent_a: "Incident Agt",
    n_agent_b: "Log Analysis Agt",
    n_output:  "Incident Summary",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the SRE and checks whether incident investigation is allowed for this role.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "On-call identity verified",
      description: "SRE identity is authenticated and the on-call relationship is trusted for this incident.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_entra"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Incident Agent delegated",
      description: "Agent is authenticated, bound to the SRE request, and governed by incident-response policy.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b"],
      duration: 2.0,
    },
    {
      id: "datadog",
      title: "Datadog alert reviewed",
      description: "Metrics and alert access are limited to the affected service and active incident window.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_datadog"],
      duration: 1.8,
    },
    {
      id: "github",
      title: "GitHub deploy history checked",
      description: "Access is authenticated and controlled to read-only deploy history for the affected service.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_github", "n_cicd"],
      duration: 2.2,
    },
    {
      id: "cicd",
      title: "CI/CD workflow inspected",
      description: "CI/CD path is checked for trusted relationship, policy scope, and read-only inspection.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_gha"],
      duration: 2.2,
    },
    {
      id: "k8s",
      title: "Kubernetes state inspected",
      description: "Production cluster access requires full ATGC because it touches high-risk infrastructure.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_aws", "n_lambda"],
      duration: 2.6,
    },
    {
      id: "deny",
      title: "Production rollback attempted",
      description: "Governance requires explicit human approval for rollback. Control stops the automated action.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "summary",
      title: "Incident summary generated",
      description: "Summary is connected to trusted evidence, governed by incident policy, and controlled for disclosure.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output"],
      duration: 2.2,
    },
    {
      id: "deliver",
      title: "Notify on-call channel",
      description: "Slack and PagerDuty receive the summary with sensitive context excluded.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_slack", "n_pagerduty"],
      duration: 2.0,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Alert, logs, deploys, agent actions, blocked rollback, and summary are recorded as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "dE1",  from: "n_user",     to: "n_entra",      status: "approve",    stageId: "identity", atgc: ["A","T"], order: 0 },
    { id: "dE2",  from: "n_entra",    to: "n_agent_a",    status: "approve",    stageId: "delegate", atgc: ["A","T","G"], order: 0 },
    { id: "dE3",  from: "n_entra",    to: "n_agent_b",    status: "approve",    stageId: "delegate", atgc: ["A","T","G"], order: 1 },
    { id: "dE4",  from: "n_agent_a",  to: "n_datadog",    status: "approve",    stageId: "datadog",  atgc: ["G","C"], order: 0 },
    { id: "dE5",  from: "n_agent_a",  to: "n_github",     status: "approve",    stageId: "github",   atgc: ["A","G","C"], order: 0 },
    { id: "dE6",  from: "n_cicd",     to: "n_github",     status: "approve",    stageId: "github",   atgc: ["A"], order: 1 },
    { id: "dE7",  from: "n_github",   to: "n_gha",        status: "approve",    stageId: "cicd",     atgc: ["T","G","C"], order: 0 },
    { id: "dE8",  from: "n_agent_b",  to: "n_aws",        status: "approve",    stageId: "k8s",      atgc: ["A","T","G","C"], order: 0 },
    { id: "dE9",  from: "n_aws",      to: "n_lambda",     status: "approve",    stageId: "k8s",      atgc: ["G"], order: 1 },
    { id: "dE10", from: "n_agent_a",  to: "n_k8s",        status: "deny",       stageId: "deny",     atgc: ["G","C"], order: 0 },
    { id: "dE11", from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "summary",  atgc: ["T","G","C"], order: 0 },
    { id: "dE12", from: "n_output",   to: "n_slack",      status: "approve",    stageId: "deliver",  atgc: ["G","C"], order: 0 },
    { id: "dE13", from: "n_output",   to: "n_pagerduty",  status: "approve",    stageId: "deliver",  atgc: ["G","C"], order: 1 },
    { id: "dE14", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "dE15", from: "n_datadog",  to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "dE16", from: "n_github",   to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0x9c3e…2a47",
    lines: [
      { label: "User verified",       value: "oncall@acme · Entra MFA" },
      { label: "Agents verified",     value: "Incident · Log Analysis" },
      { label: "Intent checked",      value: "prod-alert · service=api" },
      { label: "Policy enforced",     value: "read-only · rollback=deny" },
      { label: "Data accessed",       value: "datadog · github · aws" },
      { label: "Output generated",    value: "incident.summary → slack" },
      { label: "Provenance recorded", value: "pagerduty/splunk" },
    ],
  },
};

/* ----- Workflow 3: IT / Employee Onboarding ----- */
const it: WorkflowDef = {
  id: "it",
  label: "IT",
  prompt:
    "Prepare onboarding for a new employee, create required accounts, assign apps, and notify the manager.",
  nodeLabels: {
    n_admin:   "IT Admin",
    n_agent_a: "HR Agt",
    n_agent_b: "Access Agt",
    n_output:  "Manager Notify",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the IT admin and checks whether onboarding actions are permitted.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_admin"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "Admin identity verified",
      description: "Admin identity is authenticated and the session is trusted before provisioning begins.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_okta"],
      duration: 1.8,
    },
    {
      id: "delegate-hr",
      title: "HR Agent delegated",
      description: "HR Agent is authenticated, bound to the onboarding request, and governed by HR policy.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a"],
      duration: 2.0,
    },
    {
      id: "workday",
      title: "Workday record checked",
      description: "Role, department, start date, and manager assignment are checked before provisioning.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_workday"],
      duration: 1.8,
    },
    {
      id: "delegate-access",
      title: "Access Agent assigned",
      description: "Access Agent is authenticated, trusted via delegation, and governed by provisioning policy.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_b"],
      duration: 2.0,
    },
    {
      id: "provision",
      title: "Standard apps provisioned",
      description: "Apps assigned by role and department, with controlled access boundaries.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_m365", "n_gws", "n_jira"],
      duration: 2.4,
    },
    {
      id: "github",
      title: "GitHub developer access requested",
      description: "Code-system access requires full ATGC because it grants repo and workflow privileges.",
      atgc: ["A", "T", "G", "C"],
      outcome: "conditional",
      activeNodeIds: ["n_svc"],
      duration: 2.4,
    },
    {
      id: "deny",
      title: "GitHub admin role attempted",
      description: "Governance detects elevated privilege. Control blocks admin access without explicit approval.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "notify",
      title: "Manager notification sent",
      description: "Manager notification is allowed; credentials and tokens are excluded.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output", "n_slack"],
      duration: 2.0,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Accounts created, apps assigned, blocked admin access, and notification are recorded.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "iE1",  from: "n_admin",    to: "n_okta",       status: "approve",    stageId: "identity",        atgc: ["A","T"], order: 0 },
    { id: "iE2",  from: "n_okta",     to: "n_agent_a",    status: "approve",    stageId: "delegate-hr",     atgc: ["A","T","G"], order: 0 },
    { id: "iE3",  from: "n_agent_a",  to: "n_workday",    status: "approve",    stageId: "workday",         atgc: ["G","C"], order: 0 },
    { id: "iE4",  from: "n_agent_a",  to: "n_agent_b",    status: "approve",    stageId: "delegate-access", atgc: ["A","T","G"], order: 0 },
    { id: "iE5",  from: "n_agent_b",  to: "n_m365",       status: "approve",    stageId: "provision",       atgc: ["A","G","C"], order: 0 },
    { id: "iE6",  from: "n_agent_b",  to: "n_gws",        status: "approve",    stageId: "provision",       atgc: ["G"], order: 1 },
    { id: "iE7",  from: "n_agent_b",  to: "n_jira",       status: "approve",    stageId: "provision",       atgc: ["G"], order: 2 },
    { id: "iE8",  from: "n_agent_b",  to: "n_svc",        status: "pending",    stageId: "github",          atgc: ["A","T","G","C"], order: 0 },
    { id: "iE9",  from: "n_agent_b",  to: "n_github",     status: "deny",       stageId: "deny",            atgc: ["G","C"], order: 0 },
    { id: "iE10", from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "notify",          atgc: ["G","C"], order: 0 },
    { id: "iE11", from: "n_output",   to: "n_slack",      status: "approve",    stageId: "notify",          atgc: ["G","C"], order: 1 },
    { id: "iE12", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance",      atgc: ["T","G","C"], order: 0 },
    { id: "iE13", from: "n_workday",  to: "n_provrec",    status: "provenance", stageId: "provenance",                            order: 1 },
    { id: "iE14", from: "n_m365",     to: "n_provrec",    status: "provenance", stageId: "provenance",                            order: 2 },
  ],
  provenance: {
    hash: "0x71d4…eea3",
    lines: [
      { label: "User verified",       value: "it-admin@acme · Okta MFA" },
      { label: "Agents verified",     value: "HR · Access" },
      { label: "Intent checked",      value: "onboarding · role=engineer" },
      { label: "Policy enforced",     value: "least-privilege · admin=deny" },
      { label: "Accounts created",    value: "m365 · workspace · jira" },
      { label: "Output generated",    value: "manager.notify → slack" },
      { label: "Provenance recorded", value: "datadog/splunk" },
    ],
  },
};

/* ----- Workflow 4: Security / Suspicious API Activity ----- */
const security: WorkflowDef = {
  id: "security",
  label: "Security",
  prompt:
    "Review suspicious API activity, check user context, block risky access, and create an audit record.",
  nodeLabels: {
    n_user:    "Sec Analyst",
    n_agent_a: "Security Agt",
    n_agent_b: "Risk Scoring Agt",
    n_agent_d: "Policy Agt",
    n_output:  "Audit Record",
    n_external: "External API",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the analyst and checks the request is within security team authority.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "Analyst identity verified",
      description: "Analyst identity is authenticated and the session is trusted before investigation begins.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_okta"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Security Agent delegated",
      description: "Security Agent is authenticated, bound to the analyst request, and governed by investigation policy.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b", "n_agent_d"],
      duration: 2.0,
    },
    {
      id: "cloudflare",
      title: "Cloudflare event reviewed",
      description: "Access is controlled to the suspicious API event and related network context.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_cloudflare"],
      duration: 1.8,
    },
    {
      id: "splunk",
      title: "Splunk evidence queried",
      description: "Security logs require full ATGC because they contain sensitive evidence and user activity.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_splunk"],
      duration: 2.6,
    },
    {
      id: "apigw",
      title: "API Gateway activity inspected",
      description: "API identity and requested actions are checked against approved behavior and policy scope.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_apigw"],
      duration: 2.2,
    },
    {
      id: "risk",
      title: "Risk scoring performed",
      description: "AgentDNA evaluates trust signals, applies policy thresholds, and controls the next action.",
      atgc: ["T", "G", "C"],
      outcome: "risk-confirmed",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "deny",
      title: "Sensitive data access attempted",
      description: "External API request is outside approved scope. Control blocks sensitive data access.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "audit",
      title: "Audit record created",
      description: "Audit record is built from trusted evidence, policy decisions, and controlled investigation output.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_output", "n_aws"],
      duration: 2.4,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Investigation path, evidence sources, risk decision, blocked access, and audit record are recorded.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "sE1",  from: "n_user",     to: "n_okta",       status: "approve",    stageId: "identity",   atgc: ["A","T"], order: 0 },
    { id: "sE2",  from: "n_okta",     to: "n_agent_a",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 0 },
    { id: "sE3",  from: "n_okta",     to: "n_agent_b",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 1 },
    { id: "sE4",  from: "n_okta",     to: "n_agent_d",    status: "approve",    stageId: "delegate",   atgc: ["A"], order: 2 },
    { id: "sE5",  from: "n_agent_a",  to: "n_cloudflare", status: "approve",    stageId: "cloudflare", atgc: ["G","C"], order: 0 },
    { id: "sE6",  from: "n_agent_b",  to: "n_splunk",     status: "approve",    stageId: "splunk",     atgc: ["A","T","G","C"], order: 0 },
    { id: "sE7",  from: "n_agent_a",  to: "n_apigw",      status: "approve",    stageId: "apigw",      atgc: ["A","G","C"], order: 0 },
    { id: "sE8",  from: "n_apigw",    to: "n_agent_b",    status: "approve",    stageId: "risk",       atgc: ["T","G","C"], order: 0 },
    { id: "sE9",  from: "n_external", to: "n_aws",        status: "deny",       stageId: "deny",       atgc: ["G","C"], order: 0 },
    { id: "sE10", from: "n_agent_d",  to: "n_output",     status: "approve",    stageId: "audit",      atgc: ["T","G","C"], order: 0 },
    { id: "sE11", from: "n_output",   to: "n_aws",        status: "approve",    stageId: "audit",      atgc: ["G"], order: 1 },
    { id: "sE12", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "sE13", from: "n_splunk",   to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "sE14", from: "n_apigw",    to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0xa218…f60b",
    lines: [
      { label: "User verified",       value: "analyst@acme · Okta MFA" },
      { label: "Agents verified",     value: "Security · Risk · Policy" },
      { label: "Intent checked",      value: "incident review · risk=high" },
      { label: "Policy enforced",     value: "token=block · datastore=restrict" },
      { label: "Evidence captured",   value: "cloudflare · splunk · apigw" },
      { label: "Output generated",    value: "audit.record · slack.notify" },
      { label: "Provenance recorded", value: "splunk" },
    ],
  },
};

export const WORKFLOWS: WorkflowDef[] = [finance, devops, it, security];

/* ============================================================
 * Helpers
 * ============================================================ */

/** Whether `nodeId` is active at `stageIndex` (cumulative). */
export function isNodeActiveAtStage(
  w: WorkflowDef,
  nodeId: string,
  stageIndex: number,
): boolean {
  if (stageIndex < 0) return false;
  for (let i = 0; i <= stageIndex && i < w.stages.length; i++) {
    if (w.stages[i].activeNodeIds.includes(nodeId)) return true;
  }
  return false;
}

/** Whether `edge` is active (visible as activated) at `stageIndex`. */
export function isEdgeActiveAtStage(
  w: WorkflowDef,
  edge: GraphEdge,
  stageIndex: number,
): boolean {
  if (edge.status === "automation") return true;
  if (!edge.stageId) return false;
  const idx = w.stages.findIndex((s) => s.id === edge.stageId);
  return idx >= 0 && idx <= stageIndex;
}

/** Edges that fire (animate) during the current stage. */
export function edgesFiringAtStage(
  w: WorkflowDef,
  stageIndex: number,
): GraphEdge[] {
  if (stageIndex < 0 || stageIndex >= w.stages.length) return [];
  const stageId = w.stages[stageIndex].id;
  return w.edges.filter((e) => e.stageId === stageId);
}

/** Map stage index → AgentDNA character mood. */
export function stageMood(
  stageIndex: number,
  totalStages: number,
): "idle" | "guide" | "protect" {
  if (stageIndex < 0) return "idle";
  if (stageIndex < Math.floor(totalStages * 0.4)) return "guide";
  return "protect";
}

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
  /* Identity (varied per-workflow start authorities) */
  { id: "n_user",       slug: "user",             label: "User",            x: 60,   y: 70,  cluster: "identity" },
  { id: "n_admin",      slug: "user",             label: "Admin",           x: 60,   y: 180, cluster: "identity" },
  { id: "n_okta",       slug: "okta",                                       x: 180,  y: 100, cluster: "identity" },
  { id: "n_entra",      slug: "entra",            label: "Entra ID",        x: 200,  y: 195, cluster: "identity" },
  { id: "n_idp_gh",     slug: "github",           label: "GitHub SSO",      x: 200,  y: 40,  cluster: "identity" },
  { id: "n_idp_claims", slug: "service",          label: "Claims Platform", x: 200,  y: 260, cluster: "identity" },
  { id: "n_idp_ehr",    slug: "service",          label: "EHR Login",       x: 60,   y: 225, cluster: "identity" },
  { id: "n_gws",        slug: "google-workspace", label: "Workspace",       x: 60,   y: 290, cluster: "identity" },

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
  /** Short workflow-specific note rendered under the prompt input,
   *  describing what systems the request will expand into. */
  promptSupportLine: string;
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

/* ----- Workflow 1: Finance / Board Intelligence ----- */
const finance: WorkflowDef = {
  id: "finance",
  label: "Finance",
  prompt:
    "Build a board-ready view of Q4 performance. Pull revenue by segment, compare churn signals from support tickets, flag forecast risk, and draft the CFO summary.",
  promptSupportLine:
    "This request expands across revenue systems, support data, analytics warehouses, reporting agents, collaboration tools, and provenance.",
  nodeLabels: {
    n_user:     "CFO · alice",
    n_entra:    "Microsoft Entra ID",
    n_agent_a:  "Finance Agt",
    n_agent_b:  "Reporting Agt",
    n_agent_c:  "Forecast Agt",
    n_workday:  "Revenue Sys",
    n_pinecone: "Forecast Model",
    n_output:   "Board Summary",
    n_external: "External Email",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the CFO and checks whether a board-intelligence build is in scope for this role.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "CFO → Microsoft Entra ID",
      description: "Entra ID authenticates the CFO and asserts session trust before any finance agent is delegated.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_entra"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Finance + Reporting + Forecast agents delegated",
      description: "Three agents are bound to the CFO's request and governed by board-reporting policy for this fiscal close.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b", "n_agent_c"],
      duration: 2.0,
    },
    {
      id: "revenue",
      title: "Revenue + Salesforce branched",
      description: "Finance Agent pulls revenue-by-segment from the revenue system and reads scoped fields from Salesforce in parallel.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_workday", "n_sf"],
      duration: 2.2,
    },
    {
      id: "snowflake",
      title: "Analytics warehouse queried",
      description: "Snowflake holds governed financial data — full ATGC is enforced and the query is recorded as evidence.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_snowflake"],
      duration: 2.4,
    },
    {
      id: "support",
      title: "Zendesk churn signals branched",
      description: "Parallel branch: Zendesk ticket trends join as churn signals; customer-identifying fields are filtered out.",
      atgc: ["G", "C"],
      outcome: "limited",
      activeNodeIds: ["n_zendesk"],
      duration: 2.0,
    },
    {
      id: "deny",
      title: "Raw PII export blocked",
      description: "Forecast Agent attempted to send raw customer-level rows to an external mailbox. Raw customer-level data is outside the approved board-reporting scope — Governance and Control block the export.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "forecast",
      title: "Forecast risk generated",
      description: "Forecast Agent scores an approved risk model against the prepared series and emits a flagged forecast.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_pinecone"],
      duration: 2.2,
    },
    {
      id: "summary",
      title: "Board summary drafted + saved",
      description: "Reporting Agent composes the CFO summary, saves it to the approved Drive folder, and posts a sanitized Slack note.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output", "n_drive", "n_slack"],
      duration: 2.4,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "CFO identity, three agents, every data source, the blocked PII export, and the final summary are written as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "fE1",  from: "n_user",     to: "n_entra",      status: "approve",    stageId: "identity",   atgc: ["A","T"], order: 0 },
    { id: "fE2",  from: "n_entra",    to: "n_agent_a",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 0 },
    { id: "fE3",  from: "n_entra",    to: "n_agent_b",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 1 },
    { id: "fE4",  from: "n_entra",    to: "n_agent_c",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 2 },
    { id: "fE5",  from: "n_agent_a",  to: "n_workday",    status: "approve",    stageId: "revenue",    atgc: ["A","G","C"], order: 0 },
    { id: "fE6",  from: "n_agent_a",  to: "n_sf",         status: "approve",    stageId: "revenue",    atgc: ["G","C"], order: 1 },
    { id: "fE7",  from: "n_agent_a",  to: "n_snowflake",  status: "approve",    stageId: "snowflake",  atgc: ["A","T","G","C"], order: 0 },
    { id: "fE8",  from: "n_agent_a",  to: "n_zendesk",    status: "pending",    stageId: "support",    atgc: ["G","C"], order: 0 },
    { id: "fE9",  from: "n_agent_c",  to: "n_external",   status: "deny",       stageId: "deny",       atgc: ["G","C"], order: 0 },
    { id: "fE10", from: "n_agent_c",  to: "n_pinecone",   status: "approve",    stageId: "forecast",   atgc: ["T","G","C"], order: 0 },
    { id: "fE11", from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "summary",    atgc: ["T","G","C"], order: 0 },
    { id: "fE12", from: "n_output",   to: "n_drive",      status: "approve",    stageId: "summary",    atgc: ["G","C"], order: 1 },
    { id: "fE13", from: "n_output",   to: "n_slack",      status: "approve",    stageId: "summary",    atgc: ["G","C"], order: 2 },
    { id: "fE14", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "fE15", from: "n_snowflake",to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "fE16", from: "n_workday",  to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0x4f1a…b8c2",
    lines: [
      { label: "User verified",       value: "alice (CFO) · Okta MFA" },
      { label: "Agents verified",     value: "Finance · Reporting · Forecast" },
      { label: "Intent checked",      value: "Q4 board intelligence" },
      { label: "Policy enforced",     value: "scope=board · raw-pii=deny" },
      { label: "Data accessed",       value: "revenue · sf · snowflake · zendesk" },
      { label: "Output generated",    value: "drive.summary → slack" },
      { label: "Provenance recorded", value: "datadog/splunk" },
    ],
  },
};

/* ----- Workflow 2: DevOps / Live Incident Response ----- */
const devops: WorkflowDef = {
  id: "devops",
  label: "DevOps",
  prompt:
    "Production latency just spiked. Find the likely cause, compare the last deploy with current logs, notify the incident channel, and draft a timeline.",
  promptSupportLine:
    "This request expands across observability, CI/CD, Kubernetes, cloud logs, incident agents, collaboration channels, and provenance.",
  nodeLabels: {
    n_user:     "SRE · oncall",
    n_idp_gh:   "GitHub SSO",
    n_agent_a:  "Incident Agt",
    n_agent_b:  "Log Analysis Agt",
    n_output:   "Incident Timeline",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the on-call SRE and confirms incident-response actions are permitted for this role.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "SRE → GitHub SSO",
      description: "GitHub SSO authenticates the SRE; AgentDNA verifies the active on-call rotation owns this service.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_idp_gh"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Incident + Log Analysis agents delegated",
      description: "Both agents are bound to the SRE's incident and governed by incident-response policy for this service.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b"],
      duration: 2.0,
    },
    {
      id: "datadog",
      title: "Datadog alert reviewed",
      description: "The latency alert is scoped to the affected service and the active incident window only.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_datadog"],
      duration: 1.8,
    },
    {
      id: "deny",
      title: "Production rollback blocked",
      description: "Incident Agent's first move was an automated K8s rollback. Rollback requires explicit human approval before execution — Governance and Control hold the action while the investigation continues.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "github",
      title: "Last deploy diffed",
      description: "Read-only access to recent deploys for the affected service; CI/CD identity is checked against the GitHub repo.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_github", "n_cicd"],
      duration: 2.0,
    },
    {
      id: "gha",
      title: "GitHub Actions run inspected",
      description: "The deploy workflow run is pulled to compare timing, image tags, and env changes against the spike.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_gha"],
      duration: 2.0,
    },
    {
      id: "k8s",
      title: "Kubernetes state inspected",
      description: "Production cluster access touches high-risk infrastructure — full ATGC is enforced and reads are recorded.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_k8s"],
      duration: 2.4,
    },
    {
      id: "awslogs",
      title: "AWS logs queried",
      description: "Cloud logs around the spike are pulled; query scope is bounded to the affected service and time window.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_aws"],
      duration: 2.0,
    },
    {
      id: "notify",
      title: "Timeline drafted + ops notified",
      description: "Log Analysis Agent assembles an incident timeline, opens a PagerDuty record, and posts a Slack note for the on-call channel.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output", "n_pagerduty", "n_slack"],
      duration: 2.4,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Alert, blocked rollback, deploy diff, cluster reads, and timeline are written as evidence for incident review.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "dE1",  from: "n_user",     to: "n_idp_gh",     status: "approve",    stageId: "identity", atgc: ["A","T"], order: 0 },
    { id: "dE2",  from: "n_idp_gh",   to: "n_agent_a",    status: "approve",    stageId: "delegate", atgc: ["A","T","G"], order: 0 },
    { id: "dE3",  from: "n_idp_gh",   to: "n_agent_b",    status: "approve",    stageId: "delegate", atgc: ["A","T","G"], order: 1 },
    { id: "dE4",  from: "n_agent_a",  to: "n_datadog",    status: "approve",    stageId: "datadog",  atgc: ["G","C"], order: 0 },
    { id: "dE5",  from: "n_agent_a",  to: "n_k8s",        status: "deny",       stageId: "deny",     atgc: ["G","C"], order: 0 },
    { id: "dE6",  from: "n_agent_a",  to: "n_github",     status: "approve",    stageId: "github",   atgc: ["A","G","C"], order: 0 },
    { id: "dE7",  from: "n_cicd",     to: "n_github",     status: "approve",    stageId: "github",   atgc: ["A"], order: 1 },
    { id: "dE8",  from: "n_github",   to: "n_gha",        status: "approve",    stageId: "gha",      atgc: ["T","G","C"], order: 0 },
    { id: "dE9",  from: "n_agent_b",  to: "n_k8s",        status: "approve",    stageId: "k8s",      atgc: ["A","T","G","C"], order: 0 },
    { id: "dE10", from: "n_agent_b",  to: "n_aws",        status: "approve",    stageId: "awslogs",  atgc: ["G","C"], order: 0 },
    { id: "dE11", from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "notify",   atgc: ["T","G","C"], order: 0 },
    { id: "dE12", from: "n_output",   to: "n_pagerduty",  status: "approve",    stageId: "notify",   atgc: ["G","C"], order: 1 },
    { id: "dE13", from: "n_output",   to: "n_slack",      status: "approve",    stageId: "notify",   atgc: ["G","C"], order: 2 },
    { id: "dE14", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "dE15", from: "n_datadog",  to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "dE16", from: "n_github",   to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0x9c3e…2a47",
    lines: [
      { label: "User verified",       value: "oncall@acme · Entra MFA" },
      { label: "Agents verified",     value: "Incident · Log Analysis" },
      { label: "Intent checked",      value: "prod latency · service=api" },
      { label: "Policy enforced",     value: "read-only · rollback=deny" },
      { label: "Data accessed",       value: "datadog · github · k8s · aws" },
      { label: "Output generated",    value: "incident.timeline → pagerduty/slack" },
      { label: "Provenance recorded", value: "datadog/splunk" },
    ],
  },
};

/* ----- Workflow 3: Insurance / High-Value Claim Review ----- */
const insurance: WorkflowDef = {
  id: "insurance",
  label: "Insurance",
  prompt:
    "A high-value claim needs review. Validate coverage, inspect uploaded evidence, compare prior claim history, check fraud indicators, and recommend next action.",
  promptSupportLine:
    "This request expands across claims systems, policy records, document tools, fraud models, payment workflows, adjuster review, and provenance.",
  nodeLabels: {
    n_user:         "Claims Adjuster",
    n_idp_claims:   "Claims Platform ID",
    n_agent_a:      "Claims Agt",
    n_agent_b:      "Fraud Scoring Agt",
    n_agent_d:      "Recommendation Agt",
    n_servicenow:   "Policy System",
    n_confluence:   "Doc Review",
    n_pinecone:     "Fraud Models",
    n_snowflake:    "Claims DB",
    n_workflow:     "Adjuster Review",
    n_output:       "Claims Report",
    n_external:     "External AI Processor",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the adjuster and confirms a high-value claim review is in scope for this case.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "Adjuster → Claims Platform ID",
      description: "The Claims Platform identity authenticates the adjuster before any claim agent touches policy or evidence data.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_idp_claims"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Claims + Fraud + Recommendation agents delegated",
      description: "Three agents are bound to the case and governed by claim-handling policy for this line of business.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b", "n_agent_d"],
      duration: 2.0,
    },
    {
      id: "deny",
      title: "External AI processor blocked",
      description: "Claims Agent's first move was to send uploaded evidence to an external AI processor for triage. Claim evidence cannot be sent to an unapproved external model — Governance and Control block the submission immediately.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "policy",
      title: "Policy coverage validated",
      description: "Coverage, deductibles, and exclusions for this policy are read; access is scoped to fields needed for this claim.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_servicenow"],
      duration: 2.0,
    },
    {
      id: "evidence",
      title: "Evidence reviewed in approved tool",
      description: "After the external-AI attempt was blocked, Claims Agent routes the same evidence through the approved Doc Review tool only.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_confluence"],
      duration: 2.2,
    },
    {
      id: "history",
      title: "Prior claim history queried",
      description: "Claims history can contain sensitive customer and financial detail — full ATGC is enforced and the query is recorded.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_snowflake"],
      duration: 2.4,
    },
    {
      id: "fraud",
      title: "Fraud indicators evaluated",
      description: "Approved fraud models are scored against the claim's signature; thresholds and policy context shape the result.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_pinecone"],
      duration: 2.2,
    },
    {
      id: "recommend",
      title: "Recommendation generated + routed for review",
      description: "Recommendation Agent composes a next-action proposal tied to policy, evidence, history, and fraud signals, then queues it for adjuster sign-off.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output", "n_workflow"],
      duration: 2.4,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Adjuster, three agents, the blocked external-AI submission, policy + evidence + history + fraud reads, and the routed report are written as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "nE1",  from: "n_user",       to: "n_idp_claims", status: "approve",    stageId: "identity",  atgc: ["A","T"], order: 0 },
    { id: "nE2",  from: "n_idp_claims", to: "n_agent_a",    status: "approve",    stageId: "delegate",  atgc: ["A","T","G"], order: 0 },
    { id: "nE3",  from: "n_idp_claims", to: "n_agent_b",    status: "approve",    stageId: "delegate",  atgc: ["A","T","G"], order: 1 },
    { id: "nE4",  from: "n_idp_claims", to: "n_agent_d",    status: "approve",    stageId: "delegate",  atgc: ["A","T","G"], order: 2 },
    { id: "nE5",  from: "n_agent_a",    to: "n_external",   status: "deny",       stageId: "deny",      atgc: ["G","C"], order: 0 },
    { id: "nE6",  from: "n_agent_a",    to: "n_servicenow", status: "approve",    stageId: "policy",    atgc: ["G","C"], order: 0 },
    { id: "nE7",  from: "n_agent_a",    to: "n_confluence", status: "approve",    stageId: "evidence",  atgc: ["A","G","C"], order: 0 },
    { id: "nE8",  from: "n_agent_a",    to: "n_snowflake",  status: "approve",    stageId: "history",   atgc: ["A","T","G","C"], order: 0 },
    { id: "nE9",  from: "n_agent_b",    to: "n_pinecone",   status: "approve",    stageId: "fraud",     atgc: ["T","G","C"], order: 0 },
    { id: "nE10", from: "n_agent_d",    to: "n_output",     status: "approve",    stageId: "recommend", atgc: ["T","G","C"], order: 0 },
    { id: "nE11", from: "n_output",     to: "n_workflow",   status: "approve",    stageId: "recommend", atgc: ["G","C"], order: 1 },
    { id: "nE12", from: "n_output",     to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "nE13", from: "n_snowflake",  to: "n_provrec",    status: "provenance", stageId: "provenance",                       order: 1 },
    { id: "nE14", from: "n_servicenow", to: "n_provrec",    status: "provenance", stageId: "provenance",                       order: 2 },
  ],
  provenance: {
    hash: "0x3b27…d49a",
    lines: [
      { label: "User verified",       value: "claims-adj@acme · Okta MFA" },
      { label: "Agents verified",     value: "Claims · Fraud · Recommendation" },
      { label: "Intent checked",      value: "high-value claim review" },
      { label: "Policy enforced",     value: "auto-payout=deny · review=required" },
      { label: "Data accessed",       value: "policy · evidence · history · models" },
      { label: "Output generated",    value: "claims.report → adjuster review" },
      { label: "Provenance recorded", value: "audit/splunk" },
    ],
  },
};

/* ----- Workflow 4: Healthcare / Care Follow-Up ----- */
const healthcare: WorkflowDef = {
  id: "healthcare",
  label: "Healthcare",
  prompt:
    "Prepare a follow-up note for today's patient visit. Summarize the encounter, check lab results, reconcile medications, and route the message through the approved patient channel.",
  promptSupportLine:
    "This request expands across clinical agents, EHR records, labs, medication systems, secure messaging, care-team workflows, and provenance.",
  nodeLabels: {
    n_user:      "Clinician",
    n_idp_ehr:   "EHR Login",
    n_agent_a:   "Care Agt",
    n_agent_b:   "Care Coord Agt",
    n_sf:        "EHR System",
    n_bq:        "Lab System",
    n_postgres:  "Medication DB",
    n_output:    "Care Note",
    n_teams:     "Secure Msg",
    n_external:  "External Email",
  },
  stages: [
    {
      id: "prompt",
      title: "Prompt submitted",
      description: "AgentDNA verifies the clinician and confirms a care-follow-up note is in scope for this encounter.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user"],
      duration: 1.8,
    },
    {
      id: "identity",
      title: "Clinician → EHR Login",
      description: "The clinician authenticates through the EHR identity broker before any patient record is touched.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_idp_ehr"],
      duration: 1.8,
    },
    {
      id: "delegate",
      title: "Care Agent delegated",
      description: "Care and Care-Coordination agents are bound to the clinician's request and constrained to today's patient.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b"],
      duration: 2.0,
    },
    {
      id: "ehr",
      title: "Encounter pulled from EHR",
      description: "The patient record is read for visit context — PHI is in scope, so full ATGC is enforced and the access is recorded.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_sf"],
      duration: 2.4,
    },
    {
      id: "labs",
      title: "Lab results reviewed",
      description: "Only labs relevant to this visit are returned; out-of-scope panels are filtered out.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_bq"],
      duration: 1.8,
    },
    {
      id: "medication",
      title: "Medications reconciled",
      description: "Active prescriptions are compared against the encounter to flag interactions; access is governed by clinical context.",
      atgc: ["A", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_postgres"],
      duration: 2.2,
    },
    {
      id: "note",
      title: "Follow-up note drafted",
      description: "Care Coordination Agent composes a follow-up note grounded in EHR, labs, and meds — output generation is controlled.",
      atgc: ["T", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_output"],
      duration: 2.2,
    },
    {
      id: "deny",
      title: "External PHI email blocked",
      description: "Care Agent tried to email the note to a personal mailbox. Protected health information cannot be sent through an unapproved external channel — Governance and Control block it.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "secure-msg",
      title: "Routed via secure patient channel",
      description: "The follow-up is delivered through the approved secure messaging channel only.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_teams"],
      duration: 2.0,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Clinician, both agents, EHR + lab + medication reads, the blocked external email, and the secure delivery are written as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "hE1",  from: "n_user",     to: "n_idp_ehr",    status: "approve",    stageId: "identity",   atgc: ["A","T"], order: 0 },
    { id: "hE2",  from: "n_idp_ehr",  to: "n_agent_a",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 0 },
    { id: "hE3",  from: "n_idp_ehr",  to: "n_agent_b",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 1 },
    { id: "hE4",  from: "n_agent_a",  to: "n_sf",         status: "approve",    stageId: "ehr",        atgc: ["A","T","G","C"], order: 0 },
    { id: "hE5",  from: "n_agent_a",  to: "n_bq",         status: "approve",    stageId: "labs",       atgc: ["G","C"], order: 0 },
    { id: "hE6",  from: "n_agent_a",  to: "n_postgres",   status: "approve",    stageId: "medication", atgc: ["A","G","C"], order: 0 },
    { id: "hE7",  from: "n_agent_b",  to: "n_output",     status: "approve",    stageId: "note",       atgc: ["T","G","C"], order: 0 },
    { id: "hE8",  from: "n_agent_a",  to: "n_external",   status: "deny",       stageId: "deny",       atgc: ["G","C"], order: 0 },
    { id: "hE9",  from: "n_output",   to: "n_teams",      status: "approve",    stageId: "secure-msg", atgc: ["G","C"], order: 0 },
    { id: "hE10", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "hE11", from: "n_sf",       to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "hE12", from: "n_postgres", to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0x6e85…14fa",
    lines: [
      { label: "User verified",       value: "clinician@health · MFA" },
      { label: "Agents verified",     value: "Care · Care Coordination" },
      { label: "Intent checked",      value: "patient follow-up note" },
      { label: "Policy enforced",     value: "phi=channel-locked · ext-email=deny" },
      { label: "Data accessed",       value: "ehr · labs · medication" },
      { label: "Output generated",    value: "care.note → secure msg" },
      { label: "Provenance recorded", value: "audit/splunk" },
    ],
  },
};

/* ----- Workflow 5: Security / Access Containment ----- */
const security: WorkflowDef = {
  id: "security",
  label: "Security",
  prompt:
    "An API token is behaving strangely. Trace the actor, inspect recent calls, score the risk, block unsafe access, and create an audit record.",
  promptSupportLine:
    "This request expands across identity, API gateways, logs, risk scoring, policy agents, cloud systems, containment actions, and provenance.",
  nodeLabels: {
    n_user:     "Sec Analyst",
    n_okta:     "Priv. Session",
    n_apigw:    "API Gateway ID",
    n_agent_a:  "Security Agt",
    n_agent_b:  "Risk Scoring Agt",
    n_agent_d:  "Policy Agt",
    n_output:   "Audit Record",
    n_external: "External API Token",
  },
  stages: [
    {
      id: "prompt",
      title: "Suspicious token signal",
      description: "Analyst opens a containment investigation; the API Gateway is already surfacing anomalous calls from the token.",
      atgc: ["A", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_user", "n_apigw"],
      duration: 1.8,
    },
    {
      id: "analyst",
      title: "Analyst → Privileged Session",
      description: "Analyst authenticates into a privileged investigation session before the Security Agent acquires scope.",
      atgc: ["A", "T"],
      outcome: "allowed",
      activeNodeIds: ["n_okta"],
      duration: 1.8,
    },
    {
      id: "deny",
      title: "Sensitive data access blocked",
      description: "Suspicious API token attempted access outside its approved context. Gateway-enforced policy blocks the call before any sensitive data store is reached.",
      atgc: ["G", "C"],
      outcome: "blocked",
      activeNodeIds: [],
      duration: 2.4,
    },
    {
      id: "delegate",
      title: "Security + Risk + Policy agents delegated",
      description: "Three agents are bound to the analyst's session and governed by containment policy for further investigation.",
      atgc: ["A", "T", "G"],
      outcome: "allowed",
      activeNodeIds: ["n_agent_a", "n_agent_b", "n_agent_d"],
      duration: 2.0,
    },
    {
      id: "trace",
      title: "API call history traced",
      description: "Recent calls for the suspicious token are pulled — actor, target, and frequency are checked against approved behavior.",
      atgc: ["A", "G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_apigw"],
      duration: 2.2,
    },
    {
      id: "cloudflare",
      title: "Cloudflare edge events reviewed",
      description: "Network context for the token's traffic is inspected for geo, rate, and signature anomalies.",
      atgc: ["G", "C"],
      outcome: "allowed",
      activeNodeIds: ["n_cloudflare"],
      duration: 1.8,
    },
    {
      id: "splunk",
      title: "Splunk evidence queried",
      description: "Security logs contain sensitive identity and activity detail — full ATGC is enforced and the query is recorded.",
      atgc: ["A", "T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_splunk"],
      duration: 2.4,
    },
    {
      id: "risk",
      title: "Risk score generated",
      description: "Risk Scoring Agent combines gateway, edge, and log signals into a confirmed risk verdict for the Policy Agent.",
      atgc: ["T", "G", "C"],
      outcome: "risk-confirmed",
      activeNodeIds: [],
      duration: 2.2,
    },
    {
      id: "audit",
      title: "Audit record created",
      description: "Policy Agent writes a containment audit record tying actor, calls, risk verdict, and the blocked access together; the record is stored in AWS.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_output", "n_aws"],
      duration: 2.4,
    },
    {
      id: "provenance",
      title: "Provenance recorded",
      description: "Analyst session, three agents, gateway + edge + log evidence, the early block, risk verdict, and audit record are written as evidence.",
      atgc: ["T", "G", "C"],
      outcome: "recorded",
      activeNodeIds: ["n_provrec"],
      duration: 2.6,
    },
  ],
  edges: [
    { id: "sE1",  from: "n_user",     to: "n_okta",       status: "approve",    stageId: "analyst",    atgc: ["A","T"], order: 0 },
    { id: "sE2",  from: "n_external", to: "n_aws",        status: "deny",       stageId: "deny",       atgc: ["G","C"], order: 0 },
    { id: "sE3",  from: "n_okta",     to: "n_agent_a",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 0 },
    { id: "sE4",  from: "n_okta",     to: "n_agent_b",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 1 },
    { id: "sE5",  from: "n_okta",     to: "n_agent_d",    status: "approve",    stageId: "delegate",   atgc: ["A","T","G"], order: 2 },
    { id: "sE6",  from: "n_agent_a",  to: "n_apigw",      status: "approve",    stageId: "trace",      atgc: ["A","G","C"], order: 0 },
    { id: "sE7",  from: "n_agent_a",  to: "n_cloudflare", status: "approve",    stageId: "cloudflare", atgc: ["G","C"], order: 0 },
    { id: "sE8",  from: "n_agent_b",  to: "n_splunk",     status: "approve",    stageId: "splunk",     atgc: ["A","T","G","C"], order: 0 },
    { id: "sE9",  from: "n_apigw",    to: "n_agent_b",    status: "approve",    stageId: "risk",       atgc: ["T","G","C"], order: 0 },
    { id: "sE10", from: "n_agent_d",  to: "n_output",     status: "approve",    stageId: "audit",      atgc: ["T","G","C"], order: 0 },
    { id: "sE11", from: "n_output",   to: "n_aws",        status: "approve",    stageId: "audit",      atgc: ["G","C"], order: 1 },
    { id: "sE12", from: "n_output",   to: "n_provrec",    status: "provenance", stageId: "provenance", atgc: ["T","G","C"], order: 0 },
    { id: "sE13", from: "n_splunk",   to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 1 },
    { id: "sE14", from: "n_apigw",    to: "n_provrec",    status: "provenance", stageId: "provenance",                      order: 2 },
  ],
  provenance: {
    hash: "0xa218…f60b",
    lines: [
      { label: "User verified",       value: "analyst@acme · Okta MFA" },
      { label: "Agents verified",     value: "Security · Risk · Policy" },
      { label: "Intent checked",      value: "access containment · token=suspicious" },
      { label: "Policy enforced",     value: "token=block · datastore=deny" },
      { label: "Evidence captured",   value: "apigw · cloudflare · splunk" },
      { label: "Output generated",    value: "audit.record → aws" },
      { label: "Provenance recorded", value: "splunk" },
    ],
  },
};

export const WORKFLOWS: WorkflowDef[] = [finance, devops, insurance, healthcare, security];

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

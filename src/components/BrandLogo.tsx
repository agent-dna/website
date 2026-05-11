import type { ComponentType, SVGProps } from "react";
import {
  SiAirtable,
  SiAnthropic,
  SiAsana,
  SiAtlassian,
  SiAuth0,
  SiBitbucket,
  SiCircleci,
  SiCloudflare,
  SiConfluence,
  SiDatabricks,
  SiDatadog,
  SiDocker,
  SiFastly,
  SiGithub,
  SiGitlab,
  SiGoogle,
  SiGooglebigquery,
  SiGooglecloud,
  SiGoogledrive,
  SiHuggingface,
  SiJenkins,
  SiJira,
  SiKubernetes,
  SiLangchain,
  SiMistralai,
  SiMongodb,
  SiMysql,
  SiNotion,
  SiOkta,
  SiOpenai,
  SiPagerduty,
  SiPostgresql,
  SiRedis,
  SiSnowflake,
  SiSplunk,
  SiStripe,
  SiTerraform,
  SiVault,
  SiVercel,
  SiZapier,
  SiZendesk,
} from "react-icons/si";
import {
  FaAws,
  FaMicrosoft,
  FaSalesforce,
  FaSlack,
  FaWindows,
} from "react-icons/fa6";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

type BrandEntry = {
  /** display label */
  label: string;
  /** react-icons component, when available */
  icon?: IconComponent;
  /** brand-accurate hex color (no leading #) */
  color: string;
  /** mono fallback initials when no icon is present */
  initials?: string;
};

/**
 * Brand registry — slug → {icon, color, label}.
 * Slugs are lowercased, no spaces (matches simple-icons convention).
 */
export const BRANDS: Record<string, BrandEntry> = {
  // --- Identity ---
  okta:           { label: "Okta",              icon: SiOkta,        color: "007DC1" },
  entra:          { label: "Microsoft Entra",   icon: FaMicrosoft,   color: "0078D4" },
  "google-workspace": { label: "Google Workspace", icon: SiGoogle,   color: "4285F4" },
  auth0:          { label: "Auth0",             icon: SiAuth0,       color: "EB5424" },
  ping:           { label: "Ping Identity",     color: "C5004A",     initials: "PI" },
  onelogin:       { label: "OneLogin",          color: "1C1F2A",     initials: "1L" },
  jumpcloud:      { label: "JumpCloud",         color: "27B776",     initials: "JC" },

  // --- Cloud ---
  aws:            { label: "AWS",               icon: FaAws,         color: "FF9900" },
  azure:          { label: "Azure",             icon: FaMicrosoft,   color: "0078D4" },
  gcp:            { label: "GCP",               icon: SiGooglecloud, color: "4285F4" },
  cloudflare:     { label: "Cloudflare",        icon: SiCloudflare,  color: "F38020" },
  fastly:         { label: "Fastly",            icon: SiFastly,      color: "FF282D" },
  vercel:         { label: "Vercel",            icon: SiVercel,      color: "000000" },
  lambda:         { label: "AWS Lambda",        icon: FaAws,         color: "FF9900" },
  windows:        { label: "Windows",           icon: FaWindows,     color: "0078D6" },

  // --- SaaS ---
  slack:          { label: "Slack",             icon: FaSlack,       color: "4A154B" },
  teams:          { label: "Microsoft Teams",   icon: FaMicrosoft,   color: "5059C9" },
  salesforce:     { label: "Salesforce",        icon: FaSalesforce,  color: "00A1E0" },
  servicenow:     { label: "ServiceNow",        color: "62D84E",     initials: "SN" },
  workday:        { label: "Workday",           color: "F38B00",     initials: "WD" },
  zapier:         { label: "Zapier",            icon: SiZapier,      color: "FF4F00" },
  atlassian:      { label: "Atlassian",         icon: SiAtlassian,   color: "0052CC" },
  jira:           { label: "Jira",              icon: SiJira,        color: "0052CC" },
  confluence:     { label: "Confluence",        icon: SiConfluence,  color: "172B4D" },
  pagerduty:      { label: "PagerDuty",         icon: SiPagerduty,   color: "06AC38" },
  notion:         { label: "Notion",            icon: SiNotion,      color: "000000" },
  asana:          { label: "Asana",             icon: SiAsana,       color: "F06A6A" },

  // --- AI ---
  openai:         { label: "OpenAI",            icon: SiOpenai,      color: "412991" },
  anthropic:      { label: "Anthropic",         icon: SiAnthropic,   color: "D97757" },
  mistral:        { label: "Mistral AI",        icon: SiMistralai,   color: "FA520F" },
  huggingface:    { label: "Hugging Face",      icon: SiHuggingface, color: "FFD21E" },
  langchain:      { label: "LangChain",         icon: SiLangchain,   color: "1C3C3C" },
  llamaindex:     { label: "LlamaIndex",        color: "0F172A",     initials: "LI" },
  "vertex-ai":    { label: "Vertex AI",         icon: SiGooglecloud, color: "4285F4" },
  sagemaker:      { label: "SageMaker",         icon: FaAws,         color: "FF9900" },
  "azure-openai": { label: "Azure OpenAI",      icon: FaMicrosoft,   color: "0078D4" },

  // --- Developer ---
  github:         { label: "GitHub",            icon: SiGithub,      color: "181717" },
  gitlab:         { label: "GitLab",            icon: SiGitlab,      color: "FC6D26" },
  bitbucket:      { label: "Bitbucket",         icon: SiBitbucket,   color: "2684FF" },
  terraform:      { label: "Terraform",         icon: SiTerraform,   color: "844FBA" },
  docker:         { label: "Docker",            icon: SiDocker,      color: "2496ED" },
  kubernetes:     { label: "Kubernetes",        icon: SiKubernetes,  color: "326CE5" },
  "github-actions": { label: "GitHub Actions",  icon: SiGithub,      color: "2088FF" },
  circleci:       { label: "CircleCI",          icon: SiCircleci,    color: "343434" },
  jenkins:        { label: "Jenkins",           icon: SiJenkins,     color: "D24939" },

  // --- Data ---
  snowflake:      { label: "Snowflake",         icon: SiSnowflake,   color: "29B5E8" },
  bigquery:       { label: "BigQuery",          icon: SiGooglebigquery, color: "669DF6" },
  databricks:     { label: "Databricks",        icon: SiDatabricks,  color: "FF3621" },
  postgresql:     { label: "PostgreSQL",        icon: SiPostgresql,  color: "4169E1" },
  mysql:          { label: "MySQL",             icon: SiMysql,       color: "4479A1" },
  mongodb:        { label: "MongoDB",           icon: SiMongodb,     color: "47A248" },
  redis:          { label: "Redis",             icon: SiRedis,       color: "DC382D" },
  pinecone:       { label: "Pinecone",          color: "111111",     initials: "PC" },
  weaviate:       { label: "Weaviate",          color: "00B5AD",     initials: "WV" },
  chroma:         { label: "Chroma",            color: "FF5E1F",     initials: "CH" },
  oracle:         { label: "Oracle",            color: "C74634",     initials: "OR" },

  // --- Productivity / Misc SaaS ---
  "google-drive": { label: "Google Drive",      icon: SiGoogledrive, color: "4285F4" },
  m365:           { label: "Microsoft 365",     icon: FaMicrosoft,   color: "0078D4" },
  zendesk:        { label: "Zendesk",           icon: SiZendesk,     color: "03363D" },
  airtable:       { label: "Airtable",          icon: SiAirtable,    color: "18BFFF" },
  stripe:         { label: "Stripe",            icon: SiStripe,      color: "635BFF" },

  // --- Security / Observability ---
  datadog:        { label: "Datadog",           icon: SiDatadog,     color: "632CA6" },
  splunk:         { label: "Splunk",            icon: SiSplunk,      color: "000000" },
  crowdstrike:    { label: "CrowdStrike",       color: "FA0F00",     initials: "CS" },
  wiz:            { label: "Wiz",               color: "0084FF",     initials: "WZ" },
  vault:          { label: "HashiCorp Vault",   icon: SiVault,       color: "FFEC6E" },

  // --- Generic / Internal (used by HeroGraph) ---
  user:           { label: "User",              color: "0A2240",     initials: "U"  },
  service:        { label: "Service Account",   color: "475569",     initials: "SA" },
  api:            { label: "APIs",              color: "1D5FD9",     initials: "AP" },
  mcp:            { label: "MCP",               color: "0F172A",     initials: "M"  },
  tools:          { label: "Tools",             color: "0F172A",     initials: "T"  },
  database:       { label: "Database",          color: "475569",     initials: "DB" },
  agent:          { label: "Agent",             color: "2D7DFF",     initials: "AG" },
};

export type BrandSlug = keyof typeof BRANDS;

export function brand(slug: string): BrandEntry | undefined {
  return BRANDS[slug];
}

type BrandLogoProps = {
  /** Brand registry slug (e.g. "okta", "aws"). */
  slug: string;
  /** Size in pixels for the icon glyph. */
  size?: number;
  /** Render only the glyph without the rounded container background. */
  bare?: boolean;
  /** Force the icon to use the page's currentColor instead of the brand color. */
  mono?: boolean;
  className?: string;
  title?: string;
};

/**
 * BrandLogo — renders a real brand icon (via react-icons) for the given slug.
 * Falls back to a colored monogram tile if the brand isn't in the registry
 * or doesn't ship in any icon pack we depend on.
 */
export function BrandLogo({
  slug,
  size = 22,
  bare = false,
  mono = false,
  className,
  title,
}: BrandLogoProps) {
  const entry = BRANDS[slug];

  if (!entry) {
    return (
      <Fallback
        label={title ?? slug}
        initials={(slug[0] ?? "?").toUpperCase()}
        size={size}
        bare={bare}
        color="#0A2240"
      />
    );
  }

  const color = mono ? "currentColor" : `#${entry.color}`;
  const Icon = entry.icon;

  if (!Icon) {
    return (
      <Fallback
        label={title ?? entry.label}
        initials={entry.initials ?? entry.label.slice(0, 2).toUpperCase()}
        size={size}
        bare={bare}
        color={color}
      />
    );
  }

  if (bare) {
    return (
      <Icon
        aria-label={title ?? entry.label}
        role="img"
        width={size}
        height={size}
        style={{ color }}
        className={className}
      />
    );
  }

  // Box size scales with icon size; container is square + rounded.
  const box = Math.round(size * 1.7);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-white ring-1 ring-soft-200 ${className ?? ""}`}
      style={{ width: box, height: box }}
      title={title ?? entry.label}
    >
      <Icon
        aria-label={title ?? entry.label}
        role="img"
        width={size}
        height={size}
        style={{ color }}
      />
    </span>
  );
}

function Fallback({
  label,
  initials,
  size,
  bare,
  color,
}: {
  label: string;
  initials: string;
  size: number;
  bare: boolean;
  color: string;
}) {
  const box = Math.round(size * 1.7);
  if (bare) {
    return (
      <span
        aria-label={label}
        role="img"
        className="inline-flex items-center justify-center font-bold"
        style={{ width: size, height: size, color, fontSize: size * 0.55 }}
      >
        {initials}
      </span>
    );
  }
  return (
    <span
      title={label}
      role="img"
      aria-label={label}
      className="inline-flex items-center justify-center rounded-lg ring-1 ring-soft-200"
      style={{
        width: box,
        height: box,
        background: `${color}14`,
        color,
        fontWeight: 700,
        fontSize: Math.max(10, size * 0.5),
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </span>
  );
}

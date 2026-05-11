export type EcoItem = {
  /** Display name */
  name: string;
  /** BrandLogo registry slug — keep in sync with src/components/BrandLogo.tsx */
  slug: string;
};

/**
 * Integrations are rendered as two horizontal marquee rows moving in
 * opposite directions. The order within each row is the order shown as
 * the marquee scrolls — no categories, no filtering. ~20 items per row,
 * ~10 visible at a time on desktop.
 */

export const ECOSYSTEM_ROW_ONE: EcoItem[] = [
  { name: "Okta",              slug: "okta" },
  { name: "Microsoft Entra",   slug: "entra" },
  { name: "Google Workspace",  slug: "google-workspace" },
  { name: "AWS",               slug: "aws" },
  { name: "Azure",             slug: "azure" },
  { name: "Google Cloud",      slug: "gcp" },
  { name: "OpenAI",            slug: "openai" },
  { name: "Anthropic",         slug: "anthropic" },
  { name: "Mistral AI",        slug: "mistral" },
  { name: "Hugging Face",      slug: "huggingface" },
  { name: "LangChain",         slug: "langchain" },
  { name: "LlamaIndex",        slug: "llamaindex" },
  { name: "Slack",             slug: "slack" },
  { name: "Microsoft Teams",   slug: "teams" },
  { name: "Salesforce",        slug: "salesforce" },
  { name: "ServiceNow",        slug: "servicenow" },
  { name: "Workday",           slug: "workday" },
  { name: "Jira",              slug: "jira" },
  { name: "Confluence",        slug: "confluence" },
  { name: "GitHub",            slug: "github" },
];

export const ECOSYSTEM_ROW_TWO: EcoItem[] = [
  { name: "Snowflake",         slug: "snowflake" },
  { name: "PostgreSQL",        slug: "postgresql" },
  { name: "BigQuery",          slug: "bigquery" },
  { name: "MongoDB",           slug: "mongodb" },
  { name: "Redis",             slug: "redis" },
  { name: "Pinecone",          slug: "pinecone" },
  { name: "Weaviate",          slug: "weaviate" },
  { name: "GitLab",            slug: "gitlab" },
  { name: "Docker",            slug: "docker" },
  { name: "Kubernetes",        slug: "kubernetes" },
  { name: "Terraform",         slug: "terraform" },
  { name: "Databricks",        slug: "databricks" },
  { name: "Oracle",            slug: "oracle" },
  { name: "MySQL",             slug: "mysql" },
  { name: "Google Drive",      slug: "google-drive" },
  { name: "Microsoft 365",     slug: "m365" },
  { name: "Zendesk",           slug: "zendesk" },
  { name: "Notion",            slug: "notion" },
  { name: "Airtable",          slug: "airtable" },
  { name: "Stripe",            slug: "stripe" },
];

import { Logo } from "./Logo";

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2H21.5l-7.5 8.572L22.5 22h-6.875l-5.39-7.018L3.95 22H.69l8.04-9.187L1.5 2h7.04l4.873 6.43L18.244 2Zm-2.41 18h1.93L7.27 4H5.21l10.624 16Z" />
    </svg>
  );
}
function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
function IconGitHub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.97 10.97 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const cols = [
  {
    title: "Product",
    links: ["Overview", "Features", "Integrations", "Pricing"],
  },
  {
    title: "Solutions",
    links: ["By Use Case", "By Industry", "For Developers", "For Security Teams"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Blog", "Guides", "Webinars"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Partners", "Contact"],
  },
];

export function Footer() {
  return (
    <footer id="company" className="relative bg-navy-700 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-500/40 to-transparent"
      />

      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="white" height={64} />
            <p className="mt-5 max-w-md text-sm text-white/65">
              AgentDNA is the identity, authorization, and provenance layer for
              AI agent execution.
            </p>

            <div className="mt-6 flex flex-col gap-1.5 text-sm text-white/70">
              <a
                href="mailto:hello@agentdna.io"
                className="hover:text-electric-300"
              >
                hello@agentdna.io
              </a>
              <a href="https://agentdna.io" className="hover:text-electric-300">
                agentdna.io
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: IconX,        href: "https://x.com/Agent_DNA",                                    label: "AgentDNA on X" },
                { Icon: IconLinkedIn, href: "https://www.linkedin.com/company/agentdna/posts/?feedView=all", label: "AgentDNA on LinkedIn" },
                { Icon: IconGitHub,   href: "https://github.com/agent-dna",                                label: "AgentDNA on GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-electric-300 hover:text-electric-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-4">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-[14px] text-white/80 transition-colors hover:text-electric-300"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <div className="text-[12px] text-white/50">
            © 2026 AgentDNA. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-[12px] text-white/50">
            <a href="#" className="hover:text-electric-300">
              Privacy
            </a>
            <a href="#" className="hover:text-electric-300">
              Terms
            </a>
            <a href="#" className="hover:text-electric-300">
              Security
            </a>
            <a href="#" className="hover:text-electric-300">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

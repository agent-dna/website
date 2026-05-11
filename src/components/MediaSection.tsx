import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const items = [
  {
    category: "Blog",
    title: "Why Identity is the New Perimeter for AI Agents",
    description:
      "Traditional security was not built for autonomous execution. Here is what enterprises need to rethink.",
    paths: ["M0,80 C60,40 120,90 200,40 S320,80 400,30", "M0,120 C80,80 160,140 240,90 S360,140 420,80"],
  },
  {
    category: "Guide",
    title: "The Enterprise Guide to Agent Security",
    description:
      "A practical framework for securing agents across apps, APIs, tools, and enterprise workflows.",
    paths: ["M0,40 L80,40 L120,80 L200,80 L240,40 L320,40 L360,100 L420,100"],
  },
  {
    category: "Research",
    title: "Provenance at Scale: Lessons from the Field",
    description:
      "Real-world patterns for tracing, verifying, and governing autonomous systems.",
    paths: ["M0,100 C60,60 100,140 160,80 S280,140 360,60 S420,100 420,100"],
  },
];

export function MediaSection() {
  return (
    <section id="resources" className="relative bg-soft-50 py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Resources</span>
            <h2 className="section-title mt-4">Insights & Resources</h2>
            <p className="section-sub">
              Frameworks, research, and field-tested guidance for securing
              autonomous AI execution.
            </p>
          </div>
          <a
            href="#all-resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600 hover:text-electric-700"
          >
            View all resources <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.a
              key={it.title}
              href="#"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-soft-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-electric-200 hover:shadow-card"
            >
              {/* thumbnail */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-electric-50 via-white to-soft-50">
                <svg viewBox="0 0 420 160" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2D7DFF" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2D7DFF" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  {it.paths.map((d, j) => (
                    <path
                      key={j}
                      d={d}
                      fill="none"
                      stroke={`url(#grad-${i})`}
                      strokeWidth={1.6}
                    />
                  ))}
                </svg>
                <div className="absolute left-4 top-4 rounded-full border border-electric-100 bg-white/90 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-electric-700 backdrop-blur">
                  {it.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-lg font-semibold text-navy-500">
                  {it.title}
                </h3>
                <p className="text-sm text-ink-subtle">{it.description}</p>
                <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600 transition-colors group-hover:text-electric-700">
                  Read more <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

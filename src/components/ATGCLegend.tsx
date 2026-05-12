import { motion } from "framer-motion";

const ITEMS: {
  letter: "A" | "T" | "G" | "C";
  label: string;
  desc: string;
}[] = [
  { letter: "A", label: "Authentication", desc: "Verifies every identity at every hop" },
  { letter: "T", label: "Trust",          desc: "Evaluates delegation chains and trust paths" },
  { letter: "G", label: "Governance",     desc: "Enforces policy, scope and least-privilege" },
  { letter: "C", label: "Control",        desc: "Decides and enforces the outcome" },
];

export function ATGCLegend({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-stretch gap-2 rounded-2xl border border-soft-200 bg-white/95 shadow-soft backdrop-blur ${
        compact ? "p-1.5" : "p-2"
      }`}
    >
      {ITEMS.map((it) => (
        <motion.div
          key={it.letter}
          whileHover={{ y: -2, backgroundColor: "#EAF2FF", boxShadow: "0 8px 24px -6px rgba(45,125,255,0.15)" }}
          initial={{ backgroundColor: "#F4F6F8" }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="group flex flex-1 min-w-[130px] cursor-pointer items-start gap-2.5 rounded-xl border border-transparent px-3 py-2.5 hover:border-electric-200"
        >
          {/* Letter badge — navy across all */}
          <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-navy-500 font-mono text-[12px] font-black text-white shadow-sm">
            {it.letter}
          </span>

          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold leading-tight text-navy-500 transition-colors duration-150 group-hover:text-electric-600">
              {it.label}
            </div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-ink-subtle">
              {it.desc}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

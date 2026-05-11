import { motion } from "framer-motion";
import { CheckCircle2, FileSignature, Hash } from "lucide-react";

/**
 * Provenance record — materializes during the T (Trust) step. Lines and
 * hash come from the active workflow.
 */

type Line = { label: string; value?: string };

type Props = {
  visible: boolean;
  hash: string;
  lines: Line[];
  /** Re-key the staggered line-in animation when this changes. */
  cycleKey?: string | number;
};

export function ProvenanceRecordCard({ visible, hash, lines, cycleKey }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.45 }}
      aria-hidden={!visible}
      className="rounded-2xl border border-electric-200 bg-white shadow-card"
    >
      <div className="flex items-center justify-between gap-2 border-b border-soft-200 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <FileSignature className="h-3.5 w-3.5 text-electric-600" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-navy-500">
            Provenance Record
          </span>
        </div>
        <span className="flex items-center gap-1 font-mono text-[9.5px] text-ink-mute">
          <Hash className="h-3 w-3" />
          {hash}
        </span>
      </div>
      <ul key={`${cycleKey ?? "p"}-list`} className="divide-y divide-soft-100 px-3 py-1.5">
        {lines.map((l, i) => (
          <motion.li
            key={`${cycleKey ?? "p"}-${l.label}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: visible ? 1 : 0, x: 0 }}
            transition={{ duration: 0.3, delay: visible ? 0.15 + i * 0.11 : 0 }}
            className="flex items-center gap-2 py-1.5"
          >
            <CheckCircle2 className="h-3 w-3 flex-none text-emerald-500" />
            <span className="flex-none text-[11px] font-semibold text-navy-500">
              {l.label}
            </span>
            {l.value && (
              <span className="ml-auto truncate font-mono text-[9.5px] text-ink-mute">
                {l.value}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

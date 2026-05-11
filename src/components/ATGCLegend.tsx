/**
 * ATGC Legend — compact horizontal strip explaining the four control
 * dimensions. Sized to slot below the graph without dominating.
 *
 * Note: C = Control. Context can show up inside Governance or Control
 * descriptions, but the C in ATGC is Control.
 */

const ITEMS: { letter: "A" | "T" | "G" | "C"; label: string; sub: string }[] = [
  { letter: "A", label: "Auth",       sub: "User · agent · NHI · workload" },
  { letter: "T", label: "Trust",      sub: "Delegation · relationship · path" },
  { letter: "G", label: "Governance", sub: "Policy · least-privilege · scope" },
  { letter: "C", label: "Control",    sub: "Allow · limit · block · record" },
];

export function ATGCLegend({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-stretch gap-1.5 rounded-2xl border border-soft-200 bg-white/95 ${
        compact ? "p-1.5" : "p-2"
      } shadow-soft backdrop-blur`}
    >
      {ITEMS.map((it) => (
        <div
          key={it.letter}
          className="flex flex-1 min-w-[110px] items-center gap-2 rounded-lg bg-white px-2 py-1.5"
        >
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-navy-500 font-mono text-[11px] font-extrabold text-white">
            {it.letter}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold leading-tight text-navy-500">
              {it.label}
            </div>
            <div className="truncate font-mono text-[9.5px] text-ink-mute">
              {it.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

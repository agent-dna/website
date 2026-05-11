import { AgentDNACharacter } from "./AgentDNACharacter";

/**
 * Compact "AgentDNA Protected" badge — used in dashboard rows, table cells,
 * lineage entries, and anywhere a quick verification stamp is helpful.
 *
 * Tones:
 *   electric — primary brand pill, electric-blue background
 *   navy     — solid navy pill (used on lighter cards for contrast)
 *   subtle   — bordered transparent pill (default, blends into white cards)
 */

type Tone = "electric" | "navy" | "subtle";

type Props = {
  label?: string;
  tone?: Tone;
  className?: string;
  /** Override character size in px (default: 12). */
  iconSize?: number;
};

const TONE_STYLES: Record<Tone, string> = {
  electric:
    "border border-electric-200 bg-electric-50 text-electric-700",
  navy: "border border-electric-300/40 bg-navy-500 text-white",
  subtle:
    "border border-soft-200 bg-white text-navy-500",
};

export function AgentDNAProtectedBadge({
  label = "AgentDNA Protected",
  tone = "subtle",
  className = "",
  iconSize = 12,
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${TONE_STYLES[tone]} ${className}`}
    >
      <AgentDNACharacter
        variant="badge"
        size={iconSize}
        alt="AgentDNA"
      />
      <span>{label}</span>
    </span>
  );
}

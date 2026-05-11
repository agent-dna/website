import { AgentDNACharacter, type Mood } from "./AgentDNACharacter";

type Props = {
  size?: number;
  className?: string;
  /** Kept for backwards compatibility — the character always renders with its halo. */
  glow?: boolean;
  float?: boolean;
  /** Premium-feel mode — softer, smaller halo. */
  subtle?: boolean;
  /** Optional gesture mood. Defaults to "idle". */
  mood?: Mood;
};

/**
 * Backwards-compatible thin wrapper. New code should import
 * `AgentDNACharacter` directly. `<Mascot />` was the previous name and is
 * preserved so we don't churn existing call sites.
 */
export function Mascot({
  size = 120,
  className = "",
  glow = true,
  float = true,
  subtle = false,
  mood = "idle",
}: Props) {
  const variant = subtle || !glow ? "subtle" : "default";
  return (
    <AgentDNACharacter
      size={size}
      variant={variant}
      mood={mood}
      float={float}
      className={className}
    />
  );
}

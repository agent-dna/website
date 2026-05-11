import { motion } from "framer-motion";
import agentDNACharacter from "../assets/ab.png";

/**
 * AgentDNACharacter — brand character system.
 *
 * The PNG body (`src/assets/ab.png`) is preserved untouched. Around it we
 * layer a small "gesture rig":
 *
 *   1. ambient halo (intensity scales with `variant`)
 *   2. abstract arms — short capsule appendages that emerge from the
 *      shoulder line and animate per `mood`
 *   3. the PNG body itself, with a subtle mood-driven tilt
 *   4. mood-specific overlays (shield arc, sweep trails)
 *   5. optional HUD scanline (`scan` prop, defaults off — never reads as a face)
 *
 * The rig is intentionally restrained: in `idle` mood the arms are fully
 * invisible, so the default state is the original logo with only the float +
 * halo personality. Arms only appear when context calls for a gesture.
 *
 * Variants:
 *   subtle     — ambient observer (hero graph corner, dashboard chrome)
 *   default    — standalone brand element (CTA strip, AgentsStory)
 *   prominent  — final-CTA hero treatment with orbital rings + graph backdrop
 *   badge      — bare PNG only, no rig (for inline pills / table cells)
 *
 * Moods:
 *   idle      — arms hidden, body upright (default)
 *   guide     — right arm extended outward, body leans toward gesture
 *   protect   — both arms forward + shield arc, gentle glow pulse
 *   untangle  — arms swept diagonally outward + sweep trails, continuous oscillation
 */

import type { CSSProperties } from "react";

type Variant = "subtle" | "default" | "prominent" | "badge";
export type Mood = "idle" | "guide" | "protect" | "untangle";

type Props = {
  size?: number;
  variant?: Variant;
  mood?: Mood;
  float?: boolean;
  /** Subtle HUD scanline — opt-in, off by default. Never reads as a face. */
  scan?: boolean;
  className?: string;
  alt?: string;
};

/* ---------- Mood → arm/body parameters ---------- */

type ArmState = { rotate: number; scaleY: number; opacity: number };

const LEFT_ARM: Record<Mood, ArmState> = {
  idle:     { rotate: -10,  scaleY: 0.5,  opacity: 0 },
  guide:    { rotate: -10,  scaleY: 0.55, opacity: 0.35 },
  protect:  { rotate: -45,  scaleY: 0.95, opacity: 0.92 },
  untangle: { rotate: -95,  scaleY: 1.0,  opacity: 0.92 },
};

const RIGHT_ARM: Record<Mood, ArmState> = {
  idle:     { rotate: 10,   scaleY: 0.5,  opacity: 0 },
  guide:    { rotate: 70,   scaleY: 1.0,  opacity: 0.92 },
  protect:  { rotate: 45,   scaleY: 0.95, opacity: 0.92 },
  untangle: { rotate: 95,   scaleY: 1.0,  opacity: 0.92 },
};

/** Body tilt per mood (degrees) — gives subtle posture cues. */
const BODY_TILT: Record<Mood, number> = {
  idle:     0,
  guide:    2.5,   // leans toward the right gesture
  protect:  0,     // stable defensive stance
  untangle: 0,
};

/* ============================================================
 * Component
 * ============================================================ */

export function AgentDNACharacter({
  size = 96,
  variant = "default",
  mood = "idle",
  float = true,
  scan = false,
  className = "",
  alt = "AgentDNA",
}: Props) {
  if (variant === "badge") {
    return (
      <img
        src={agentDNACharacter}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        className={className}
        style={{ width: size, height: size, display: "inline-block" }}
      />
    );
  }

  if (variant === "prominent") {
    return (
      <Prominent size={size} mood={mood} float={float} className={className} alt={alt} scan={scan} />
    );
  }

  return (
    <CharacterCore
      size={size}
      variant={variant}
      mood={mood}
      float={float}
      scan={scan}
      className={className}
      alt={alt}
    />
  );
}

/* ---------- Character core (subtle + default) ---------- */

function CharacterCore({
  size,
  variant,
  mood,
  float,
  scan,
  className,
  alt,
}: Required<Omit<Props, "size">> & { size: number }) {
  // Halo intensity by variant
  const halo: CSSProperties =
    variant === "subtle"
      ? {
          background:
            "radial-gradient(closest-side, rgba(45,125,255,0.22), rgba(45,125,255,0) 72%)",
          filter: "blur(6px)",
          transform: "scale(1.18)",
        }
      : {
          background:
            "radial-gradient(closest-side, rgba(45,125,255,0.42), rgba(45,125,255,0) 70%)",
          filter: "blur(8px)",
          transform: "scale(1.32)",
        };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size, isolation: "isolate" }}
      animate={float ? { y: [0, -6, 0] } : undefined}
      transition={
        float ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined
      }
    >
      {/* (1) ambient halo — pulses a touch in protect mood */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full"
        style={halo}
        animate={
          mood === "protect"
            ? { opacity: [0.85, 1, 0.85] }
            : { opacity: 1 }
        }
        transition={
          mood === "protect"
            ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />

      {/* (2) arms layer — paints behind the body */}
      {variant !== "badge" && <ArmsLayer mood={mood} />}

      {/* (3) body — the PNG itself, with subtle tilt by mood */}
      <motion.img
        src={agentDNACharacter}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        className="relative block"
        style={{ width: size, height: size }}
        animate={{ rotate: BODY_TILT[mood] }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
      />

      {/* (4) mood-specific front overlays */}
      {mood === "protect" && <ShieldArc />}
      {mood === "untangle" && <SweepTrails />}

      {/* (5) optional HUD scanline */}
      {scan && <Scanline />}
    </motion.div>
  );
}

/* ---------- Prominent variant (FinalCTA) ---------- */

function Prominent({
  size,
  mood,
  float,
  className,
  alt,
  scan,
}: {
  size: number;
  mood: Mood;
  float: boolean;
  className: string;
  alt: string;
  scan: boolean;
}) {
  const halo = size * 1.7;
  const ring1 = size * 1.3;
  const ring2 = size * 1.55;
  const ring3 = size * 1.85;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: halo, height: halo, isolation: "isolate" }}
    >
      {/* outer glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(45,125,255,0.55), rgba(45,125,255,0.10) 55%, rgba(45,125,255,0) 75%)",
          filter: "blur(14px)",
        }}
      />

      {/* orbital rings */}
      <OrbitRing size={ring1} duration={36} stroke="rgba(255,255,255,0.16)" thickness={1} />
      <OrbitRing size={ring2} duration={52} stroke="rgba(255,255,255,0.12)" thickness={1} reverse />
      <OrbitRing size={ring3} duration={68} stroke="rgba(255,255,255,0.08)" thickness={1} dashed />

      {/* faint hex-weave graph backdrop */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40"
      >
        {[
          [10, 100, 100, 30],
          [10, 100, 100, 170],
          [190, 100, 100, 30],
          [190, 100, 100, 170],
          [60, 30, 140, 30],
          [60, 170, 140, 170],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(110,157,255,0.55)"
            strokeWidth={0.7}
            strokeDasharray="2 4"
          />
        ))}
        {[
          [10, 100], [100, 30], [100, 170], [190, 100],
          [60, 30], [140, 30], [60, 170], [140, 170],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.4} fill="#9EBEFF" />
        ))}
      </svg>

      {/* character core (with arms + tilt + mood overlays) */}
      <CharacterCore
        size={size}
        variant="default"
        mood={mood}
        float={float}
        scan={scan}
        className=""
        alt={alt}
      />

      {/* electric rim accent dots (4 around) */}
      {[0, 90, 180, 270].map((angle, i) => (
        <AccentDot key={i} angle={angle} radius={ring1 / 2} delay={i * 0.6} />
      ))}
    </div>
  );
}

/* ---------- Arms ---------- */

function ArmsLayer({ mood }: { mood: Mood }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Arm mood={mood} side="left" />
      <Arm mood={mood} side="right" />
    </div>
  );
}

function Arm({ mood, side }: { mood: Mood; side: "left" | "right" }) {
  const state = side === "left" ? LEFT_ARM[mood] : RIGHT_ARM[mood];
  const isLeft = side === "left";

  // Anchor the shoulder near the silhouette edge so arms read as emerging
  // from behind the character, not pasted on top.
  const shoulderX = isLeft ? "26%" : "74%";
  const shoulderY = "56%";

  // Continuous gentle oscillation when in untangle mood — the arms feel
  // like they're actively reorganizing the network.
  const oscillate =
    mood === "untangle"
      ? { rotate: [state.rotate - 6, state.rotate + 6, state.rotate - 6] }
      : undefined;

  return (
    <motion.div
      className="absolute"
      style={{
        left: shoulderX,
        top: shoulderY,
        width: "6%",
        height: "22%",
        marginLeft: "-3%",
        borderRadius: "9999px",
        // capsule with a brighter "hand" toward the bottom
        background:
          "linear-gradient(180deg, rgba(10,34,64,0.95) 0%, rgba(10,34,64,0.95) 55%, #2D7DFF 100%)",
        boxShadow: "0 0 6px rgba(45,125,255,0.45)",
        transformOrigin: "top center",
      }}
      animate={
        oscillate
          ? { ...oscillate, scaleY: state.scaleY, opacity: state.opacity }
          : { rotate: state.rotate, scaleY: state.scaleY, opacity: state.opacity }
      }
      transition={
        oscillate
          ? {
              rotate: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
              scaleY: { type: "spring", stiffness: 110, damping: 16 },
              opacity: { duration: 0.4 },
            }
          : { type: "spring", stiffness: 110, damping: 16 }
      }
    >
      {/* hand — slightly bulbous bright tip */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: "-12%",
          width: "180%",
          height: "32%",
          background:
            "radial-gradient(circle at center, #2D7DFF 0%, #1D5FD9 55%, rgba(45,125,255,0) 100%)",
          filter: "drop-shadow(0 0 6px rgba(45,125,255,0.65))",
        }}
      />
    </motion.div>
  );
}

/* ---------- Mood overlays ---------- */

function ShieldArc() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="adna-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D7DFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2D7DFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* arc — sits in front of the body, suggesting protection */}
      <path
        d="M 18 60 Q 50 85 82 60"
        fill="none"
        stroke="url(#adna-shield)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <path
        d="M 24 62 Q 50 80 76 62"
        fill="none"
        stroke="rgba(45,125,255,0.45)"
        strokeWidth={0.8}
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </motion.svg>
  );
}

function SweepTrails() {
  // Two short fading streaks behind the arms during untangle mood —
  // suggests the character is actively reorganizing network paths.
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.path
        d="M 14 55 Q 30 30 22 16"
        fill="none"
        stroke="rgba(110,157,255,0.7)"
        strokeWidth={1.1}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M 86 55 Q 70 80 78 92"
        fill="none"
        stroke="rgba(110,157,255,0.7)"
        strokeWidth={1.1}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </svg>
  );
}

function Scanline() {
  // Horizontal HUD line + leading dot. Sits at ~38% height, well outside the
  // "face zone" — reads as scanner, never as eyes.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: "26%",
        right: "26%",
        top: "38%",
        height: 1,
      }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(45,125,255,0) 0%, rgba(45,125,255,0.7) 50%, rgba(45,125,255,0) 100%)",
        }}
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute h-1 w-1 rounded-full"
        style={{
          background: "#2D7DFF",
          top: -1.5,
          boxShadow: "0 0 6px rgba(45,125,255,0.9)",
        }}
        animate={{ left: ["0%", "100%", "0%"] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ---------- Prominent helpers ---------- */

function OrbitRing({
  size,
  duration,
  stroke,
  thickness,
  dashed = false,
  reverse = false,
}: {
  size: number;
  duration: number;
  stroke: string;
  thickness: number;
  dashed?: boolean;
  reverse?: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        border: `${thickness}px ${dashed ? "dashed" : "solid"} ${stroke}`,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

function AccentDot({
  angle,
  radius,
  delay,
}: {
  angle: number;
  radius: number;
  delay: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-electric-300"
      style={{
        left: `calc(50% + ${x}px - 3px)`,
        top: `calc(50% + ${y}px - 3px)`,
        boxShadow: "0 0 10px rgba(45,125,255,0.85)",
      }}
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

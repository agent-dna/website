import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileSignature,
  Minus,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import type {
  ATGC,
  Outcome,
  WorkflowStage,
} from "./graphs/heroData";

/**
 * Live AgentDNA Control Plane
 *
 * Renders the active workflow's stages as a vertical list. Each row shows
 * the stage title, the ATGC subset that applies at that hop, and the
 * outcome chip. The current stage's description is shown in a footer
 * below the list so the panel stays compact regardless of how many stages
 * a workflow has.
 *
 * Subtitle communicates the core concept: ATGC is applied continuously
 * across every hop — sometimes the full set, sometimes the relevant
 * subset.
 */

const ATGC_COLORS: Record<ATGC, { bg: string; fg: string }> = {
  A: { bg: "#0A2240", fg: "#FFFFFF" },
  C: { bg: "#1D5FD9", fg: "#FFFFFF" },
  G: { bg: "#2D7DFF", fg: "#FFFFFF" },
  T: { bg: "#3E7DFF", fg: "#FFFFFF" },
};

type Props = {
  workflowLabel: string;
  stages: WorkflowStage[];
  /** Index of the active stage. -1 = idle (none yet). */
  currentStageIndex: number;
};

export function AgentDNAControlPlane({
  workflowLabel,
  stages,
  currentStageIndex,
}: Props) {
  const currentStage =
    currentStageIndex >= 0 && currentStageIndex < stages.length
      ? stages[currentStageIndex]
      : undefined;

  return (
    <div className="rounded-2xl border border-soft-200 bg-white/95 shadow-card backdrop-blur">
      {/* Header */}
      <div className="border-b border-soft-200 px-3 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-electric-500 opacity-60" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-electric-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-500">
              Live Control Plane
            </span>
          </div>
          <span className="rounded-full border border-soft-200 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-ink-mute">
            {workflowLabel}
          </span>
        </div>
        <p className="mt-1 text-[9px] leading-tight text-ink-mute">
          ATGC controls applied at every hop — full check or relevant subset.
        </p>
      </div>

      {/* Stage list */}
      <ul className="space-y-0.5 px-1.5 py-1.5">
        {stages.map((stage, i) => (
          <Row
            key={stage.id}
            stage={stage}
            index={i}
            isCurrent={i === currentStageIndex}
            isDone={i < currentStageIndex}
          />
        ))}
      </ul>

      {/* Description footer */}
      {currentStage && (
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-t border-soft-200 px-3 py-1.5"
        >
          <p className="text-[10px] leading-snug text-navy-500">
            {currentStage.description}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- row ---------- */

function Row({
  stage,
  index,
  isCurrent,
  isDone,
}: {
  stage: WorkflowStage;
  index: number;
  isCurrent: boolean;
  isDone: boolean;
}) {
  // Tone selection
  const tone = isCurrent
    ? stage.outcome === "blocked"
      ? "deny"
      : stage.outcome === "risk-confirmed"
        ? "warn"
        : "active"
    : isDone
      ? stage.outcome === "blocked"
        ? "deny-done"
        : "done"
      : "default";

  const palette = paletteFor(tone);

  return (
    <motion.li
      initial={{ opacity: 0.55 }}
      animate={{ opacity: tone === "default" ? 0.6 : 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1.5 rounded-md border px-1.5 py-1 transition-colors"
      style={{ borderColor: palette.border, background: palette.bg }}
    >
      {/* index circle */}
      <span
        className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full font-mono text-[8.5px] font-bold"
        style={{ background: palette.indexBg, color: palette.indexFg }}
      >
        {index + 1}
      </span>

      {/* title */}
      <span
        className="flex-1 truncate text-[10px] font-semibold"
        style={{ color: palette.title }}
      >
        {stage.title}
      </span>

      {/* ATGC pills */}
      <span className="flex flex-none items-center gap-0.5">
        {stage.atgc.map((letter) => (
          <span
            key={letter}
            className="flex h-3.5 w-3.5 items-center justify-center rounded font-mono text-[8.5px] font-bold"
            style={{
              background: ATGC_COLORS[letter].bg,
              color: ATGC_COLORS[letter].fg,
              opacity: tone === "default" ? 0.4 : 1,
            }}
          >
            {letter}
          </span>
        ))}
      </span>

      {/* outcome icon */}
      <OutcomeIcon outcome={stage.outcome} tone={tone} />
    </motion.li>
  );
}

function OutcomeIcon({
  outcome,
  tone,
}: {
  outcome: Outcome;
  tone: Tone;
}) {
  const { Icon, color } = (() => {
    switch (outcome) {
      case "allowed":
        return { Icon: CheckCircle2, color: tone === "default" ? "#94A3B8" : "#10B981" };
      case "limited":
        return { Icon: Minus, color: tone === "default" ? "#94A3B8" : "#1D5FD9" };
      case "blocked":
        return { Icon: XCircle, color: tone === "default" ? "#94A3B8" : "#EF4444" };
      case "conditional":
        return { Icon: Clock, color: tone === "default" ? "#94A3B8" : "#F59E0B" };
      case "recorded":
        return { Icon: FileSignature, color: tone === "default" ? "#94A3B8" : "#2D7DFF" };
      case "risk-confirmed":
        return { Icon: ShieldAlert, color: tone === "default" ? "#94A3B8" : "#F59E0B" };
    }
  })();
  return <Icon className="h-3 w-3 flex-none" style={{ color }} />;
}

/* ---------- palette ---------- */

type Tone = "default" | "active" | "done" | "deny" | "deny-done" | "warn";

function paletteFor(tone: Tone) {
  switch (tone) {
    case "default":
      return {
        border: "rgba(10,34,64,0.10)",
        bg: "white",
        indexBg: "#EDF3FB",
        indexFg: "#475569",
        title: "#64748B",
      };
    case "active":
      return {
        border: "#9EBEFF",
        bg: "#EAF2FF",
        indexBg: "#0A2240",
        indexFg: "#FFFFFF",
        title: "#0A2240",
      };
    case "done":
      return {
        border: "#CEDFFF",
        bg: "#FFFFFF",
        indexBg: "#EAF2FF",
        indexFg: "#1D5FD9",
        title: "#0A2240",
      };
    case "deny":
      return {
        border: "#FDA4AF",
        bg: "#FFF1F2",
        indexBg: "#7F1D1D",
        indexFg: "#FFFFFF",
        title: "#9F1239",
      };
    case "deny-done":
      return {
        border: "#FECACA",
        bg: "#FFFBFC",
        indexBg: "#FEE2E2",
        indexFg: "#B91C1C",
        title: "#9F1239",
      };
    case "warn":
      return {
        border: "#FCD34D",
        bg: "#FFFBEB",
        indexBg: "#92400E",
        indexFg: "#FFFFFF",
        title: "#92400E",
      };
  }
}

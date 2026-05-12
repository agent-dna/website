import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileSignature,
  Minus,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import type { ATGC, Outcome, WorkflowStage } from "./graphs/heroData";

type Props = {
  workflowLabel: string;
  stages: WorkflowStage[];
  currentStageIndex: number;
  onStepClick?: (index: number) => void;
};

const ATGC_COLORS: Record<ATGC, { bg: string; fg: string }> = {
  A: { bg: "#0A2240", fg: "#FFFFFF" },
  T: { bg: "#1D5FD9", fg: "#FFFFFF" },
  G: { bg: "#2D7DFF", fg: "#FFFFFF" },
  C: { bg: "#3E7DFF", fg: "#FFFFFF" },
};

function outcomeConfig(outcome: Outcome, state: "active" | "done" | "idle") {
  const muted = state === "idle";
  switch (outcome) {
    case "allowed":
      return { Icon: CheckCircle2,  color: muted ? "#CBD5E1" : "#10B981" };
    case "limited":
      return { Icon: Minus,         color: muted ? "#CBD5E1" : "#3B82F6" };
    case "blocked":
      return { Icon: XCircle,       color: muted ? "#CBD5E1" : "#EF4444" };
    case "conditional":
      return { Icon: Clock,         color: muted ? "#CBD5E1" : "#F59E0B" };
    case "recorded":
      return { Icon: FileSignature, color: muted ? "#CBD5E1" : "#6366F1" };
    case "risk-confirmed":
      return { Icon: ShieldAlert,   color: muted ? "#CBD5E1" : "#F59E0B" };
  }
}

export function AgentDNAControlPlane({
  workflowLabel,
  stages,
  currentStageIndex,
  onStepClick,
}: Props) {
  const progress =
    currentStageIndex < 0
      ? 0
      : Math.round(((currentStageIndex + 1) / stages.length) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-soft-200 bg-white shadow-card">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 border-b border-soft-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy-500">
            Control Plane
          </span>
        </div>
        <span className="rounded-full border border-soft-200 bg-soft-50 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-ink-mute">
          {workflowLabel}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-[2px] w-full bg-soft-100">
        <motion.div
          className="h-full bg-gradient-to-r from-electric-500 to-indigo-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* ── Stage list ── */}
      <ul className="space-y-px px-2 py-2">
        {stages.map((stage, i) => {
          const state =
            i === currentStageIndex ? "active" :
            i < currentStageIndex   ? "done"   : "idle";
          const { Icon, color } = outcomeConfig(stage.outcome, state);
          const isBlocked = stage.outcome === "blocked";

          return (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: state === "idle" ? 0.4 : 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={onStepClick ? () => onStepClick(i) : undefined}
              className={`relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all ${
                onStepClick ? "cursor-pointer" : ""
              } ${
                state === "active"
                  ? isBlocked
                    ? "bg-red-50 ring-1 ring-red-200"
                    : "bg-electric-50 ring-1 ring-electric-200"
                  : state === "done"
                  ? "bg-soft-50"
                  : "hover:bg-soft-50"
              }`}
            >
              {/* Active left accent */}
              {state === "active" && (
                <span
                  className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full ${
                    isBlocked ? "bg-red-400" : "bg-electric-400"
                  }`}
                />
              )}

              {/* Step number */}
              <span
                className={`flex h-4 w-4 flex-none items-center justify-center rounded-full font-mono text-[8.5px] font-bold ${
                  state === "active"
                    ? isBlocked
                      ? "bg-red-500 text-white"
                      : "bg-electric-500 text-white"
                    : state === "done"
                    ? "bg-navy-500/10 text-navy-500"
                    : "bg-soft-200 text-ink-mute"
                }`}
              >
                {i + 1}
              </span>

              {/* Title */}
              <span
                className={`flex-1 truncate text-[10.5px] font-semibold leading-tight ${
                  state === "active"
                    ? isBlocked ? "text-red-700" : "text-navy-500"
                    : state === "done"
                    ? "text-navy-500/70"
                    : "text-ink-mute"
                }`}
              >
                {stage.title}
              </span>

              {/* ATGC pills */}
              <span className="flex flex-none items-center gap-0.5">
                {stage.atgc.map((letter) => (
                  <span
                    key={letter}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded font-mono text-[8px] font-bold"
                    style={
                      state === "idle"
                        ? { background: "#F1F5F9", color: "#94A3B8" }
                        : { background: ATGC_COLORS[letter].bg, color: ATGC_COLORS[letter].fg }
                    }
                  >
                    {letter}
                  </span>
                ))}
              </span>

              {/* Outcome icon */}
              <Icon className="h-3 w-3 flex-none" style={{ color }} />

              {/* Pulsing dot on active */}
              {state === "active" && !isBlocked && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-electric-500 opacity-50" />
                    <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-electric-500" />
                  </span>
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

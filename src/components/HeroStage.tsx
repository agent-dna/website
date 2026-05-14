import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { HeroExecutionGraph } from "./graphs/HeroExecutionGraph";
import { AgentDNAControlPlane } from "./AgentDNAControlPlane";
import { ATGCLegend } from "./ATGCLegend";
import { ProvenanceRecordCard } from "./ProvenanceRecordCard";
import type { WorkflowDef } from "./graphs/heroData";

/**
 * HeroStage — pure presentational visual.
 * State (workflow + currentStageIndex) lives in `<Hero />`.
 *
 *   Desktop (lg+):
 *     graph card with overlays:
 *       top-left  — Live status chip
 *       top-right — Live AgentDNA Control Plane
 *       bottom-left — Stage callout
 *       bottom-right — Provenance Record card (last stage)
 *     ATGC legend strip below
 *
 *   Below lg:
 *     graph card with status + step-callout overlays only
 *     ATGC legend
 *     stacked Control Plane card
 *     stacked Provenance Record card
 */

export function HeroStage({
  workflow,
  currentStageIndex,
  onNext,
}: {
  workflow: WorkflowDef;
  currentStageIndex: number;
  onNext?: () => void;
}) {
  const currentStage =
    currentStageIndex >= 0 && currentStageIndex < workflow.stages.length
      ? workflow.stages[currentStageIndex]
      : undefined;
  const isFinalStage = currentStageIndex >= workflow.stages.length - 1;
  const showProvenance = isFinalStage && currentStage?.outcome === "recorded";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
      <div className="relative h-[380px] w-full overflow-hidden rounded-3xl border border-soft-200 bg-white shadow-card sm:h-[440px] md:h-[480px] lg:h-[460px] xl:h-[500px]">
        {/* depth wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(45,125,255,0.06) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 50% at 80% 100%, rgba(45,125,255,0.05) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        <HeroExecutionGraph
          workflow={workflow}
          currentStageIndex={currentStageIndex}
        />

        {/* Live status chip — top-left */}
        <div className="absolute left-3 top-3 rounded-full border border-soft-200 bg-white/95 px-2.5 py-1 text-[10.5px] font-medium text-navy-500 backdrop-blur">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          <span className="font-mono uppercase tracking-wider">{workflow.label}</span>
          {currentStage && (
            <>
              <span className="mx-1.5 text-ink-mute">·</span>
              <span className="font-mono">{currentStageIndex + 1}/{workflow.stages.length}</span>
            </>
          )}
        </div>

        {/* Control Plane — overlay (lg+ only) */}
        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute right-3 top-3 hidden w-[228px] lg:block"
        >
          <AgentDNAControlPlane
            workflowLabel={workflow.label}
            stages={workflow.stages}
            currentStageIndex={currentStageIndex}
          />
        </motion.div>

        {/* Stage callout — bottom-left */}
        <StageCallout
          workflow={workflow}
          currentStageIndex={currentStageIndex}
        />

        {/* Provenance Record — overlay bottom-right (lg+ only) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showProvenance ? 1 : 0, y: showProvenance ? 0 : 12 }}
          transition={{ duration: 0.55 }}
          className="pointer-events-none absolute bottom-3 right-3 hidden w-[228px] lg:block"
        >
          <ProvenanceRecordCard
            visible={showProvenance}
            hash={workflow.provenance.hash}
            lines={workflow.provenance.lines.slice(0, 5)}
          />
        </motion.div>
      </div>

        {/* Next-workflow button — outside the card, right edge */}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Show next workflow"
            className="group absolute right-[-32px] top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-soft-200 bg-white text-navy-500 shadow-soft transition-all hover:border-electric-300 hover:bg-electric-50 hover:text-electric-600 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* ATGC legend — below the graph */}
      <ATGCLegend />

      {/* Stacked panels for below-lg */}
      <div className="grid gap-3 lg:hidden">
        <AgentDNAControlPlane
          workflowLabel={workflow.label}
          stages={workflow.stages}
          currentStageIndex={currentStageIndex}
        />
        <ProvenanceRecordCard
          visible={showProvenance}
          hash={workflow.provenance.hash}
          lines={workflow.provenance.lines}
        />
      </div>
    </div>
  );
}

/* ---------- stage callout ---------- */

function StageCallout({
  workflow,
  currentStageIndex,
}: {
  workflow: WorkflowDef;
  currentStageIndex: number;
}) {
  const currentStage =
    currentStageIndex >= 0 && currentStageIndex < workflow.stages.length
      ? workflow.stages[currentStageIndex]
      : undefined;

  const title = currentStage?.title ?? "Workflow assembled";
  const letters = currentStage?.atgc ?? [];
  const description =
    currentStage?.description ??
    "User prompt awaiting AgentDNA verification.";

  return (
    <motion.div
      key={currentStageIndex}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute bottom-3 left-3 max-w-[260px]"
    >
      <div className="flex items-start gap-2 rounded-xl border border-electric-200 bg-white/95 px-2.5 py-2 shadow-soft backdrop-blur">
        <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-navy-500 font-mono text-[11px] font-extrabold text-white">
          {currentStageIndex >= 0 ? currentStageIndex + 1 : "0"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[12px] font-semibold text-navy-500">
              {title}
            </span>
            {letters.length > 0 && (
              <span className="ml-auto flex flex-none items-center gap-0.5">
                {letters.map((l) => (
                  <span
                    key={l}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded bg-navy-500 font-mono text-[8.5px] font-bold text-white"
                  >
                    {l}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] leading-snug text-ink-subtle line-clamp-2">
            {description}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

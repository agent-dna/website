import { motion } from "framer-motion";
import { HeroExecutionGraph } from "./graphs/HeroExecutionGraph";
import { AgentDNAControlPlane } from "./AgentDNAControlPlane";
import { ATGCLegend } from "./ATGCLegend";
import { ProvenanceRecordCard } from "./ProvenanceRecordCard";
import type { WorkflowDef } from "./graphs/heroData";

export function HeroStage({
  workflow,
  currentStageIndex,
  onStepClick,
}: {
  workflow: WorkflowDef;
  currentStageIndex: number;
  onStepClick?: (index: number) => void;
}) {
  const currentStage =
    currentStageIndex >= 0 && currentStageIndex < workflow.stages.length
      ? workflow.stages[currentStageIndex]
      : undefined;
  const isFinalStage = currentStageIndex >= workflow.stages.length - 1;
  const showProvenance = isFinalStage && currentStage?.outcome === "recorded";

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-soft-200 bg-white shadow-card"
        style={{ height: "clamp(360px, 48vh, 560px)" }}
      >
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
        <div className="absolute left-4 top-4 rounded-full border border-soft-200 bg-white/95 px-2.5 py-1 text-[10.5px] font-medium text-navy-500 backdrop-blur">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          <span className="font-mono uppercase tracking-wider">{workflow.label}</span>
          {currentStage && (
            <>
              <span className="mx-1.5 text-ink-mute">·</span>
              <span className="font-mono">{currentStageIndex + 1}/{workflow.stages.length}</span>
            </>
          )}
        </div>

        {/* Provenance Record — top-right inside graph */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showProvenance ? 1 : 0, y: showProvenance ? 0 : 8 }}
          transition={{ duration: 0.55 }}
          className="pointer-events-none absolute bottom-4 right-4 w-[220px]"
        >
          <ProvenanceRecordCard
            visible={showProvenance}
            hash={workflow.provenance.hash}
            lines={workflow.provenance.lines.slice(0, 5)}
          />
        </motion.div>

      </div>

      {/* Stacked panels for below-lg */}
      <div className="grid gap-3 lg:hidden">
        <AgentDNAControlPlane
          workflowLabel={workflow.label}
          stages={workflow.stages}
          currentStageIndex={currentStageIndex}
          onStepClick={onStepClick}
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

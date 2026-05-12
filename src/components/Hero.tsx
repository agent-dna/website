import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroStage } from "./HeroStage";
import { HeroPromptInput } from "./HeroPromptInput";
import { AgentDNAControlPlane } from "./AgentDNAControlPlane";
import { WORKFLOWS, type WorkflowDef } from "./graphs/heroData";

const WORKFLOW_ICON: Record<string, string> = {
  finance:  "💼",
  devops:   "⚙️",
  it:       "🖥️",
  security: "🔒",
};

export function Hero() {
  const [activeId, setActiveId] = useState<string>(WORKFLOWS[0].id);
  const [stageIndex, setStageIndex] = useState<number>(-1);
  const timeoutsRef = useRef<number[]>([]);

  const workflow = WORKFLOWS.find((w) => w.id === activeId)!;

  function runWorkflow(wf: WorkflowDef) {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
    setStageIndex(-1);
    let elapsed = 1.4;
    wf.stages.forEach((stage, i) => {
      const t = window.setTimeout(() => setStageIndex(i), elapsed * 1000);
      timeoutsRef.current.push(t);
      elapsed += stage.duration;
    });
  }

  useEffect(() => {
    runWorkflow(workflow);
    return () => timeoutsRef.current.forEach(window.clearTimeout);
  }, [activeId]);

  function handleTabClick(id: string) {
    setActiveId(id);
  }

  function handleStepClick(index: number) {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
    setStageIndex(index);
  }

  const submitted = stageIndex >= 0;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white pt-32 lg:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-pale-radial"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(45,125,255,0.10) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="container-page pb-4 lg:pb-6">
        {/* Centered header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-navy-500 sm:text-[40px] lg:text-[48px] xl:text-[54px]"
          >
            The{" "}
            <span className="relative whitespace-nowrap text-electric-600">
              CONTROL PLANE
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-electric-500/70 via-electric-500/40 to-transparent" />
            </span>
            <br />
            for agentic workflows.
          </motion.h1>

          {/* Workflow tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2"
          >
            {WORKFLOWS.map((wf) => {
              const isActive = wf.id === activeId;
              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => handleTabClick(wf.id)}
                  className={`relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 ${
                    isActive
                      ? "bg-electric-500 text-white shadow-[0_6px_16px_rgba(45,125,255,0.3)]"
                      : "border border-soft-200 bg-white text-navy-500 hover:bg-soft-50"
                  }`}
                >
                  <span className="text-[13px]">{WORKFLOW_ICON[wf.id]}</span>
                  {wf.label}
                  {isActive && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-60" />
                      <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Graph + control plane */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-10 grid items-stretch gap-6 lg:grid-cols-12"
          >
            {/* Graph — left */}
            <div className="lg:col-span-9 lg:-ml-4">
              <HeroStage
                workflow={workflow}
                currentStageIndex={stageIndex}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Control plane + prompt — right */}
            <div className="flex h-full flex-col lg:col-span-3">
              <AgentDNAControlPlane
                workflowLabel={workflow.label}
                stages={workflow.stages}
                currentStageIndex={stageIndex}
                onStepClick={handleStepClick}
              />
              <div className="mt-3">
                <HeroPromptInput prompt={workflow.prompt} submitted={submitted} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

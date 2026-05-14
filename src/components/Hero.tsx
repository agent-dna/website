import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import { HeroStage } from "./HeroStage";
import { HeroPromptInput } from "./HeroPromptInput";
import { WORKFLOWS, type WorkflowDef } from "./graphs/heroData";

/**
 * Hero — copy + prompt on the left (40%), execution graph on the right (60%).
 *
 * The graph is the hero image: it must be visible above the fold on desktop.
 * Hero owns the workflow random pick + stage state machine so the prompt
 * card and the graph stay in lock-step.
 *
 * For local dev / demos, ?workflow=finance|devops|it|security overrides the
 * random pick. Hidden from the UI.
 */

function pickWorkflow(): WorkflowDef {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("workflow");
      if (id) {
        const found = WORKFLOWS.find((w) => w.id === id);
        if (found) return found;
      }
    } catch {
      /* fall through */
    }
  }
  return WORKFLOWS[Math.floor(Math.random() * WORKFLOWS.length)];
}

export function Hero() {
  const [workflow, setWorkflow] = useState<WorkflowDef>(pickWorkflow);
  /** -1 = idle (prompt typing), 0..n-1 = active stage. */
  const [stageIndex, setStageIndex] = useState<number>(-1);

  const cycleWorkflow = () => {
    setStageIndex(-1);
    setWorkflow((current) => {
      const idx = WORKFLOWS.findIndex((w) => w.id === current.id);
      return WORKFLOWS[(idx + 1) % WORKFLOWS.length];
    });
  };

  useEffect(() => {
    // Brief idle pause so the prompt typewriter has time to complete.
    let elapsed = 1.6;
    const timeouts: number[] = [];
    workflow.stages.forEach((stage, i) => {
      timeouts.push(window.setTimeout(() => setStageIndex(i), elapsed * 1000));
      elapsed += stage.duration;
    });
    return () => timeouts.forEach(window.clearTimeout);
  }, [workflow]);

  const submitted = stageIndex >= 0;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white pt-32 lg:pt-40"
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

      <div className="container-page pb-10 lg:pb-12">
        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Left column — copy + prompt (~40%) */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              ATGC protection for agentic workflows
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-3 font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.02em] text-navy-500 sm:text-[44px] lg:text-[48px] xl:text-[56px]"
            >
              The{" "}
              <span className="relative whitespace-nowrap text-electric-600">
                control plane
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-electric-500/70 via-electric-500/40 to-transparent" />
              </span>
              {" "}for agentic workflows.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-10 flex flex-wrap items-center gap-2.5 lg:mt-12"
            >
              <a href="#demo" className="btn-primary">
                Book a Demo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#platform" className="btn-secondary">
                <PlayCircle className="h-4 w-4" />
                View in Action
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-12 lg:mt-14"
            >
              <HeroPromptInput
                prompt={workflow.prompt}
                supportLine={workflow.promptSupportLine}
                submitted={submitted}
              />
            </motion.div>
          </div>

          {/* Right column — execution graph (~60%) */}
          <div className="lg:col-span-7">
            <HeroStage
              workflow={workflow}
              currentStageIndex={stageIndex}
              onNext={cycleWorkflow}
            />
          </div>
        </div>

        {/* Outcome metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="mt-10 flex flex-nowrap items-center justify-center gap-x-6 overflow-x-auto border-t border-soft-200 pt-6 lg:mt-14 lg:gap-x-10"
        >
          {[
            { value: "100%", label: "identity coverage" },
            { value: "0", label: "unverified actions" },
            { value: "90%+", label: "blast-radius reduction" },
          ].map((m, i, arr) => (
            <div key={m.label} className="flex flex-none items-center gap-x-6 whitespace-nowrap lg:gap-x-10">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[24px] font-extrabold tracking-[-0.01em] text-navy-500 sm:text-[28px]">
                  {m.value}
                </span>
                <span className="text-[13px] font-bold text-navy-500 sm:text-[14px]">
                  {m.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-1.5 w-1.5 rounded-full bg-soft-200 sm:inline-block"
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

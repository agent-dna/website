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
  const [workflow] = useState<WorkflowDef>(pickWorkflow);
  /** -1 = idle (prompt typing), 0..n-1 = active stage. */
  const [stageIndex, setStageIndex] = useState<number>(-1);

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
      className="relative overflow-hidden bg-white pt-20 lg:pt-24"
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

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-3 max-w-[520px] text-[14px] leading-[1.55] text-ink-subtle sm:text-[15px]"
            >
              AgentDNA applies{" "}
              <span className="font-medium text-navy-500">
                Authentication, Trust, Governance and Control
              </span>{" "}
              across AI agents, agentic workflows, APIs, MCP servers, service
              accounts and other non-human identities&nbsp;— making every
              action traceable, scoped, and provable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 flex flex-wrap items-center gap-2.5"
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
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5"
            >
              <HeroPromptInput prompt={workflow.prompt} submitted={submitted} />
            </motion.div>
          </div>

          {/* Right column — execution graph (~60%) */}
          <div className="lg:col-span-7">
            <HeroStage workflow={workflow} currentStageIndex={stageIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}

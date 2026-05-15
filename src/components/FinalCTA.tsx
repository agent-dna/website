import { ArrowRight, MessageCircle } from "lucide-react";
import { AgentDNACharacter } from "./AgentDNACharacter";

export function FinalCTA() {
  return (
    <section id="demo" className="relative bg-white py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-navy-radial px-6 py-16 text-white shadow-card sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-500/70 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 -top-20 h-96 w-96 rounded-full bg-electric-500/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-electric-500/15 blur-3xl"
          />

          {/* faint DAG background */}
          <svg
            viewBox="0 0 800 400"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
          >
            {[
              [80, 80, 240, 200],
              [80, 320, 240, 200],
              [240, 200, 440, 100],
              [240, 200, 440, 300],
              [440, 100, 640, 200],
              [440, 300, 640, 200],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            ))}
            {[
              [80, 80],
              [80, 320],
              [240, 200],
              [440, 100],
              [440, 300],
              [640, 200],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={5} fill="#FFFFFF" />
            ))}
          </svg>

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                Secure your AI agents{" "}
                <span className="text-electric-300">before they scale</span>{" "}
                beyond control.
              </h3>
              <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
                Bring identity, authorization, and provenance to every agent
                action with AgentDNA.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://agentdna.io/beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Book a Demo <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#talk" className="btn-ghost-light">
                  <MessageCircle className="h-4 w-4" />
                  Talk to Our Team
                </a>
              </div>
            </div>

            <div className="relative hidden justify-end lg:col-span-4 lg:flex">
              <AgentDNACharacter size={180} variant="prominent" mood="protect" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, PlayCircle } from "lucide-react";
import { AgentDNACharacter } from "./AgentDNACharacter";

export function CTAStrip() {
  return (
    <section className="relative bg-white py-16">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-navy-radial px-6 py-12 text-white shadow-card sm:px-10 sm:py-14 lg:px-14">
          {/* electric scan line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-500/70 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-electric-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-electric-500/10 blur-3xl"
          />

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="relative lg:col-span-8">
              <div className="flex flex-wrap gap-3">
                <a href="#demo" className="btn-primary">
                  Book Demo <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#video" className="btn-ghost-light">
                  <PlayCircle className="h-4 w-4" />
                  View in Action
                </a>
              </div>
            </div>

            <div className="relative hidden justify-end lg:col-span-4 lg:flex">
              <AgentDNACharacter size={140} variant="default" mood="guide" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

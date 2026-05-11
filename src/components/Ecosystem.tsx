import { ArrowRight } from "lucide-react";
import {
  ECOSYSTEM_ROW_ONE,
  ECOSYSTEM_ROW_TWO,
  type EcoItem,
} from "../data/ecosystem";
import { BrandLogo } from "./BrandLogo";

/**
 * Ecosystem section — compact integration marquee.
 *
 *   - Two rows of integration cards
 *   - Row 1 slides left, Row 2 slides right (opposite directions)
 *   - Continuous infinite scroll (~42s and ~48s per loop)
 *   - Paused on section hover via `group-hover:[animation-play-state:paused]`
 *   - Soft fade masks at both edges so cards glide in and out smoothly
 *
 * Each row's content is rendered twice in sequence so a 50% translateX
 * shift loops seamlessly.
 */

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative bg-white py-14">
      <div className="container-page">
        {/* Compact header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ecosystem</span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.015em] text-navy-500 sm:text-[28px] lg:text-[32px] lg:leading-[1.1]">
            Built for the Agentic Enterprise Ecosystem
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-ink-subtle sm:text-[14.5px]">
            Connect AgentDNA across identity providers, SaaS apps, AI
            platforms, cloud systems, developer tools, and data platforms.
          </p>
        </div>

        {/* Marquee rows (group enables pause-on-hover) */}
        <div className="group mt-7 space-y-2.5">
          <MarqueeRow items={ECOSYSTEM_ROW_ONE} direction="left" />
          <MarqueeRow items={ECOSYSTEM_ROW_TWO} direction="right" />
        </div>

        {/* Small text link */}
        <div className="mt-5 text-center">
          <a
            href="#integrations"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-electric-700 hover:text-electric-600"
          >
            View all integrations
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Marquee row
 * ============================================================ */

function MarqueeRow({
  items,
  direction,
}: {
  items: EcoItem[];
  direction: "left" | "right";
}) {
  // Render the items twice so the inner track is exactly 2× wide.
  // Translating it by -50% wraps seamlessly back to the start.
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      {/* Left edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-20 bg-gradient-to-r from-white to-transparent"
      />
      {/* Right edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 sm:w-20 bg-gradient-to-l from-white to-transparent"
      />

      <div
        className={`flex w-max gap-2.5 ${
          direction === "left"
            ? "animate-marqueeLeft"
            : "animate-marqueeRight"
        } group-hover:[animation-play-state:paused]`}
        style={{ willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <IntegrationCard
            key={`${item.slug}-${i}`}
            item={item}
            ariaHidden={i >= items.length}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Integration card — compact rounded rect with logo + name
 * ============================================================ */

function IntegrationCard({
  item,
  ariaHidden,
}: {
  item: EcoItem;
  ariaHidden: boolean;
}) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="group/card flex h-[68px] w-[128px] flex-none flex-col items-center justify-center gap-1.5 rounded-xl border border-soft-200 bg-white px-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-electric-300 hover:shadow-card sm:w-[136px]"
    >
      <span className="opacity-70 transition-opacity group-hover/card:opacity-100">
        <BrandLogo slug={item.slug} size={22} bare title={item.name} />
      </span>
      <span className="line-clamp-1 text-[10.5px] font-medium text-navy-500/80 transition-colors group-hover/card:text-electric-700">
        {item.name}
      </span>
    </div>
  );
}

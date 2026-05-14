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
    <section id="ecosystem" className="relative bg-white pb-14 pt-16 lg:pt-20">
      <div className="container-page">
        {/* Compact header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ecosystem</span>
          <h2 className="mt-3 font-display text-[28px] font-semibold tracking-[-0.015em] text-navy-500 sm:text-[36px] lg:text-[42px] lg:leading-[1.1]">
            Built for the Agentic Enterprise Ecosystem
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-ink-subtle sm:text-[14.5px]">
            Connect AgentDNA across{" "}
            <span className="font-semibold text-navy-500">identity providers</span>,{" "}
            <span className="font-semibold text-navy-500">SaaS apps</span>,{" "}
            <span className="font-semibold text-navy-500">AI platforms</span>,{" "}
            <span className="font-semibold text-navy-500">cloud systems</span>,{" "}
            <span className="font-semibold text-navy-500">developer tools</span>, and{" "}
            <span className="font-semibold text-navy-500">data platforms</span>.
          </p>
        </div>

        {/* Marquee rows (group enables pause-on-hover) */}
        <div className="group mt-7 -mx-6 rounded-2xl bg-[#0A2240] py-5 lg:-mx-10">
          <div className="space-y-2.5">
            <MarqueeRow items={ECOSYSTEM_ROW_ONE} direction="left" bg="#0A2240" />
            <MarqueeRow items={ECOSYSTEM_ROW_TWO} direction="right" bg="#0A2240" />
          </div>
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
  bg = "#ffffff",
}: {
  items: EcoItem[];
  direction: "left" | "right";
  bg?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      {/* Left edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-20"
        style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
      />
      {/* Right edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 sm:w-20"
        style={{ background: `linear-gradient(to left, ${bg}, transparent)` }}
      />

      <div
        className={`flex w-max gap-3 ${
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
      className="group/card flex h-[82px] w-[154px] flex-none flex-col items-center justify-center gap-1 rounded-xl border-2 border-electric-300 bg-white px-2 shadow-soft transition-all hover:-translate-y-0.5 hover:border-electric-500 hover:shadow-card sm:w-[164px]"
    >
      <span className="opacity-80 transition-opacity group-hover/card:opacity-100">
        <BrandLogo slug={item.slug} size={34} bare title={item.name} />
      </span>
      <span className="line-clamp-1 text-[15px] font-extrabold text-navy-500/80 transition-colors group-hover/card:text-electric-700">
        {item.name}
      </span>
    </div>
  );
}

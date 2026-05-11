import { useMemo } from "react";
import { motion } from "framer-motion";
import { BrandLogo, brand } from "../BrandLogo";
import { AgentDNACharacter } from "../AgentDNACharacter";
import {
  HERO_AMBIENT_EDGES,
  HERO_NODES,
  edgesFiringAtStage,
  isEdgeActiveAtStage,
  isNodeActiveAtStage,
  stageMood,
  type ATGC,
  type GraphEdge,
  type GraphNode,
  type WorkflowDef,
} from "./heroData";

/**
 * HeroExecutionGraph — stage-driven workflow visualization.
 *
 * Driven by `currentStageIndex`:
 *   - Nodes with `isNodeActiveAtStage` → electric blue (cumulative)
 *   - Edges with `isEdgeActiveAtStage` → bright stroke (cumulative)
 *   - Edges firing at current stage → play their ATGC marker sequence
 *
 * Multi-letter ATGC sequences use overlapping timing so a 4-letter edge
 * (full A/C/G/T check) plays in ~4.5 s rather than 8 s sequential.
 */

const VIEW_W = 1180;
const VIEW_H = 700;

const STAGGER = 0.5;        // stagger between edges within a stage
const PULSE_CYCLE = 7.0;    // ambient pulse loop on activated workflow edges
const BADGE_DUR = 2.0;      // ATGC badge group fade-in/hold/fade-out total duration

const ATGC_COLORS: Record<ATGC, string> = {
  A: "#2D7DFF",
  C: "#1D5FD9",
  G: "#0A2240",
  T: "#3E7DFF",
};

/* ---------- helpers ---------- */

function curve(a: GraphNode, b: GraphNode): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const c1x = a.x + dx * 0.45;
  const c1y = a.y + dy * 0.08;
  const c2x = b.x - dx * 0.45;
  const c2y = b.y - dy * 0.08;
  return `M ${a.x} ${a.y} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${b.x} ${b.y}`;
}

function edgeStyle(status: GraphEdge["status"], active: boolean) {
  switch (status) {
    case "approve":
      return active
        ? { stroke: "url(#hg-edge-approve)", width: 1.4, dash: undefined as string | undefined }
        : { stroke: "rgba(10,34,64,0.14)", width: 1, dash: "3 4" };
    case "automation":
      return { stroke: "rgba(110,127,147,0.22)", width: 0.85, dash: "1 5" };
    case "pending":
      return active
        ? { stroke: "#F59E0B", width: 1.3, dash: "5 4" }
        : { stroke: "rgba(245,158,11,0.35)", width: 1, dash: "5 4" };
    case "deny":
      return active
        ? { stroke: "#EF4444", width: 1.4, dash: "5 4" }
        : { stroke: "rgba(239,68,68,0.35)", width: 1, dash: "3 4" };
    case "provenance":
      return active
        ? { stroke: "rgba(110,157,255,0.55)", width: 0.9, dash: "1 4" }
        : { stroke: "rgba(110,157,255,0.18)", width: 0.8, dash: "1 4" };
  }
}

/* ============================================================
 * Component
 * ============================================================ */

export function HeroExecutionGraph({
  workflow,
  currentStageIndex,
}: {
  workflow: WorkflowDef;
  currentStageIndex: number;
}) {
  const nodeMap = useMemo(() => {
    const m = new Map<string, GraphNode>();
    HERO_NODES.forEach((n) => m.set(n.id, n));
    return m;
  }, []);

  const allEdges = useMemo(
    () => [...HERO_AMBIENT_EDGES, ...workflow.edges],
    [workflow.edges],
  );

  const firingEdges = useMemo(
    () => edgesFiringAtStage(workflow, currentStageIndex),
    [workflow, currentStageIndex],
  );

  // Ambient blue pulses run only on the workflow's already-activated approve
  // edges so the user reads "this path is alive" — never the whole network.
  const ambientPulses = useMemo(
    () =>
      workflow.edges.filter(
        (e) =>
          e.status === "approve" &&
          isEdgeActiveAtStage(workflow, e, currentStageIndex) &&
          !firingEdges.includes(e),
      ),
    [workflow, currentStageIndex, firingEdges],
  );

  const denyEdges = useMemo(
    () =>
      workflow.edges.filter(
        (e) =>
          e.status === "deny" && isEdgeActiveAtStage(workflow, e, currentStageIndex),
      ),
    [workflow, currentStageIndex],
  );

  const pendingEdges = useMemo(
    () =>
      workflow.edges.filter(
        (e) =>
          e.status === "pending" && isEdgeActiveAtStage(workflow, e, currentStageIndex),
      ),
    [workflow, currentStageIndex],
  );

  const mood = stageMood(currentStageIndex, workflow.stages.length);

  return (
    <div className="relative h-full w-full">
      {/* faint grid wash */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,34,64,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,34,64,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(85% 75% at 50% 50%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(85% 75% at 50% 50%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 100%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="hg-edge-approve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D7DFF" />
            <stop offset="100%" stopColor="#6E9DFF" />
          </linearGradient>
          <radialGradient id="hg-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2D7DFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2D7DFF" stopOpacity="0" />
          </radialGradient>
          <filter id="hg-marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#2D7DFF" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Provenance edges behind, others in front */}
        <g>
          {allEdges
            .filter((e) => e.status === "provenance")
            .map((e) =>
              renderEdge(e, nodeMap, isEdgeActiveAtStage(workflow, e, currentStageIndex)),
            )}
        </g>
        <g>
          {allEdges
            .filter((e) => e.status !== "provenance")
            .map((e) =>
              renderEdge(e, nodeMap, isEdgeActiveAtStage(workflow, e, currentStageIndex)),
            )}
        </g>

        {/* Ambient pulses on activated workflow approve-edges */}
        <g>
          {ambientPulses.map((e) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            const path = curve(a, b);
            const begin = ((e.order ?? 0) * 0.25) % PULSE_CYCLE;
            return (
              <circle key={`pulse-${workflow.id}-${e.id}`} r={2.5} fill="#2D7DFF" opacity={0.85}>
                <animateMotion dur={`${PULSE_CYCLE}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
                <animate
                  attributeName="opacity"
                  values="0;0.95;0.95;0"
                  keyTimes="0;0.05;0.85;1"
                  dur={`${PULSE_CYCLE}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>

        {/* Edge pulses + ATGC badge groups for firing edges.
            ATGC is rendered as a *grouped* badge pill at the edge midpoint —
            not as a sequence of traveling letters. The single travelling
            pulse communicates "this edge is firing"; the badge group shows
            *which* control dimensions are being applied at this hop. */}
        <g key={`fire-${workflow.id}-${currentStageIndex}`}>
          {firingEdges.flatMap((e) => {
            if (!e.atgc?.length) return [];
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return [];
            const path = curve(a, b);
            const baseDelay = (e.order ?? 0) * STAGGER;
            return [
              <FiringPulse key={`p-${e.id}`} edge={e} path={path} delay={baseDelay} />,
              <ATGCBadgeGroup
                key={`b-${e.id}`}
                edgeId={e.id}
                from={a}
                to={b}
                letters={e.atgc}
                delay={baseDelay + 0.4}
              />,
            ];
          })}
        </g>

        {/* Deny stop pulses */}
        <g>
          {denyEdges.map((e) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const px = b.x - dx * 0.18;
            const py = b.y - dy * 0.18;
            return (
              <g key={`deny-${e.id}`}>
                <circle cx={px} cy={py} r={11} fill="#EF4444" opacity={0.18}>
                  <animate attributeName="r" values="9;15;9" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={px} cy={py} r={5} fill="#EF4444" />
                <line x1={px - 2.6} y1={py - 2.6} x2={px + 2.6} y2={py + 2.6} stroke="white" strokeWidth={1.4} />
                <line x1={px + 2.6} y1={py - 2.6} x2={px - 2.6} y2={py + 2.6} stroke="white" strokeWidth={1.4} />
              </g>
            );
          })}
        </g>

        {/* Pending review tags */}
        <g>
          {pendingEdges.map((e) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            const px = (a.x + b.x) / 2;
            const py = (a.y + b.y) / 2;
            return (
              <g key={`pend-${e.id}`}>
                <rect x={px - 30} y={py - 9} width={60} height={18} rx={9} fill="#FFFBEB" stroke="#F59E0B" />
                <text
                  x={px}
                  y={py + 3.5}
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  fontSize={9}
                  fontWeight={700}
                  fill="#92400E"
                  textAnchor="middle"
                >
                  REVIEW
                </text>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {HERO_NODES.map((n) => {
            const active = isNodeActiveAtStage(workflow, n.id, currentStageIndex);
            const labelOverride = workflow.nodeLabels?.[n.id];
            return (
              <NodeCard
                key={`${workflow.id}-${n.id}`}
                node={n}
                labelOverride={labelOverride}
                active={active}
              />
            );
          })}
        </g>

        {/* AgentDNA character — top-center, mood follows stage progress */}
        <foreignObject x={510} y={2} width={80} height={80}>
          <div className="flex h-full w-full items-start justify-center">
            <AgentDNACharacter
              size={52}
              variant="subtle"
              mood={mood}
              float
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

/* ---------- edge renderer ---------- */

function renderEdge(
  edge: GraphEdge,
  nodeMap: Map<string, GraphNode>,
  active: boolean,
) {
  const a = nodeMap.get(edge.from);
  const b = nodeMap.get(edge.to);
  if (!a || !b) return null;
  const path = curve(a, b);
  const style = edgeStyle(edge.status, active);
  return (
    <path
      key={edge.id}
      d={path}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.width}
      strokeDasharray={style.dash}
      style={{ transition: "stroke 700ms ease, stroke-width 700ms ease" }}
    />
  );
}

/* ---------- firing edge pulse ----------
 * One travelling pulse per firing edge — communicates "this edge is alive"
 * without sequencing letters. Pulse takes ~1.6s end-to-end. */

function FiringPulse({
  edge,
  path,
  delay,
}: {
  edge: GraphEdge;
  path: string;
  delay: number;
}) {
  const isDeny = edge.status === "deny";
  const color = isDeny ? "#EF4444" : "#2D7DFF";
  const dur = isDeny ? 1.2 : 1.6;
  const fadeOut = isDeny ? 0.55 : 0.9;
  return (
    <circle r={3.2} fill={color} opacity={0}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="1" path={path} fill="freeze" />
      <animate
        attributeName="opacity"
        values="0;0.95;0.95;0"
        keyTimes={`0;0.08;${fadeOut};1`}
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="1"
        fill="freeze"
      />
    </circle>
  );
}

/* ---------- ATGC badge group ----------
 * Renders the relevant ATGC subset as a single grouped pill at the midpoint
 * of the edge. Letters appear together, hold for ~1.4s, then fade out as
 * the destination node activates. */

function ATGCBadgeGroup({
  edgeId,
  from,
  to,
  letters,
  delay,
}: {
  edgeId: string;
  from: GraphNode;
  to: GraphNode;
  letters: ATGC[];
  delay: number;
}) {
  if (!letters.length) return null;

  // Midpoint of the cubic Bezier ≈ midpoint of the chord for our control
  // points. Use chord midpoint for simplicity — our curves stay near the
  // chord because control points only deflect by ~0.08 in y.
  const cx = (from.x + to.x) / 2;
  const cy = (from.y + to.y) / 2;

  // Pill dimensions
  const padX = 4;
  const cellW = 14;
  const cellGap = 2;
  const innerW = letters.length * cellW + (letters.length - 1) * cellGap;
  const totalW = innerW + padX * 2;
  const totalH = 18;

  return (
    <g
      style={{ filter: "url(#hg-marker-shadow)" }}
      transform={`translate(${cx - totalW / 2} ${cy - totalH / 2})`}
    >
      {/* pill background */}
      <rect
        width={totalW}
        height={totalH}
        rx={9}
        fill="white"
        stroke="#2D7DFF"
        strokeWidth={1}
        opacity={0}
      >
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.18;0.78;1"
          dur={`${BADGE_DUR}s`}
          begin={`${delay}s`}
          repeatCount="1"
          fill="freeze"
        />
      </rect>
      {letters.map((letter, i) => {
        const x = padX + i * (cellW + cellGap);
        return (
          <g key={`${edgeId}-${letter}-${i}`}>
            <rect
              x={x}
              y={2.5}
              width={cellW}
              height={totalH - 5}
              rx={3}
              fill={ATGC_COLORS[letter]}
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.18;0.78;1"
                dur={`${BADGE_DUR}s`}
                begin={`${delay}s`}
                repeatCount="1"
                fill="freeze"
              />
            </rect>
            <text
              x={x + cellW / 2}
              y={totalH / 2 + 3.2}
              textAnchor="middle"
              fontFamily="JetBrains Mono, ui-monospace, monospace"
              fontSize={9.5}
              fontWeight={800}
              fill="#FFFFFF"
              opacity={0}
            >
              {letter}
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.18;0.78;1"
                dur={`${BADGE_DUR}s`}
                begin={`${delay}s`}
                repeatCount="1"
                fill="freeze"
              />
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ---------- node card ---------- */

function NodeCard({
  node,
  labelOverride,
  active,
}: {
  node: GraphNode;
  labelOverride?: string;
  active: boolean;
}) {
  const w = 124;
  const h = 34;
  const entry = brand(node.slug);
  const label = labelOverride ?? node.label ?? entry?.label ?? node.slug;

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {active && (
        <circle cx={node.x} cy={node.y} r={26} fill="url(#hg-node-glow)" opacity={0.45} />
      )}

      {active && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          fill="none"
          stroke="#2D7DFF"
          strokeWidth={1.4}
          initial={{ r: 18, opacity: 0.7 }}
          animate={{ r: 44, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      )}

      <motion.g
        animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.7, times: [0, 0.4, 1], ease: "easeOut" }}
        style={{
          transformOrigin: `${node.x}px ${node.y}px`,
          transformBox: "view-box",
        }}
      >
        <foreignObject x={node.x - w / 2} y={node.y - h / 2} width={w} height={h}>
          <div
            className="flex h-full w-full items-center gap-1.5 rounded-lg bg-white px-1.5"
            style={{
              border: active ? "1px solid #9EBEFF" : "1px solid rgba(10,34,64,0.14)",
              boxShadow: active
                ? "0 4px 14px rgba(45,125,255,0.18)"
                : "0 1px 2px rgba(10,34,64,0.04)",
              opacity: active ? 1 : 0.55,
              filter: active ? "none" : "saturate(0.25)",
              transition:
                "border-color 700ms ease, box-shadow 700ms ease, opacity 700ms ease, filter 700ms ease",
            }}
          >
            <span
              className="flex h-5 w-5 flex-none items-center justify-center"
              style={{ color: entry ? `#${entry.color}` : "#0A2240" }}
            >
              <BrandLogo slug={node.slug} size={16} bare title={label} />
            </span>
            <span
              className="truncate text-[10.5px] font-semibold"
              style={{
                color: active ? "#0A2240" : "#64748B",
                transition: "color 700ms ease",
              }}
            >
              {label}
            </span>
            <span
              className="ml-auto inline-block h-1.5 w-1.5 flex-none rounded-full"
              style={{
                background: active ? "#2D7DFF" : "#CBD5E1",
                boxShadow: active ? "0 0 0 3px rgba(45,125,255,0.18)" : "none",
                transition: "background 700ms ease, box-shadow 700ms ease",
              }}
            />
          </div>
        </foreignObject>
      </motion.g>
    </motion.g>
  );
}

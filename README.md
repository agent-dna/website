<<<<<<< HEAD
# website
AgentDNA website
=======
# AgentDNA — Website

Premium white-and-blue marketing site for AgentDNA — the identity,
authorization, and provenance layer for AI agent execution.

Stack: **React 19 + TypeScript + Vite + Tailwind CSS 3 + Framer Motion + Lucide React**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
npm run preview  # preview built site
```

---

## Brand assets

Drop the real PNGs into `public/assets/`:

| File              | Purpose                                       |
|-------------------|-----------------------------------------------|
| `ab.png`          | AgentDNA mascot (used in Hero, CTAs, Story)   |
| `logo-blue.png`   | Horizontal AgentDNA logo, navy on light bg    |
| `logo-white.png`  | AgentDNA logo, white on navy bg               |

If a PNG is missing, an SVG fallback (in the same folder) renders so layout
is preserved. Replace at any time without code changes.

---

## Layout

```text
src/
  App.tsx
  index.css                          ← tailwind + design tokens
  components/
    Navbar.tsx
    Hero.tsx
    Ecosystem.tsx
    CTAStrip.tsx
    AgentsStory.tsx                  ← typing + tangle → DAG
    PlatformSteps.tsx                ← Connect / Protect / Observe
    Capabilities.tsx                 ← COCA / CBAC / IP
    MediaSection.tsx
    FinalCTA.tsx
    Footer.tsx
    Logo.tsx
    Mascot.tsx
    graphs/HeroGraph.tsx             ← animated identity graph
  data/ecosystem.ts                  ← integration list
```

---

## Design

Full design tokens (color, type, spacing, animation, frame layouts) live in
[`FIGMA_DESIGN_SPEC.md`](./FIGMA_DESIGN_SPEC.md) — paste into a Figma file
or hand to a designer to reconstruct the site 1:1.

---

## Notes

- The Tailwind config (`tailwind.config.js`) defines `navy`, `electric`, `soft`,
  `ink` palettes plus reusable shadows and gradients.
- Hero/Story animations are built with native SVG `<animate>` for the pulses
  (cheap, deterministic) and Framer Motion for component-level transitions.
- All sections use `container-page` (1240 px max, responsive padding).
- The site is fully responsive: Hero & dashboard panels collapse to single
  column under `lg`; ecosystem grid responds 8 → 6 → 4 → 3 → 2 cols.
>>>>>>> 7ee76e8 (Build AgentDNA website homepage)

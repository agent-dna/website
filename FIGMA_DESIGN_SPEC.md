# AgentDNA — Figma Design Spec

A complete design specification you can hand to a Figma file (or a designer)
to reconstruct the AgentDNA website 1:1. All values mirror the Tailwind
tokens in `tailwind.config.js` and the components in `src/components/`.

---

## 1. Brand Foundations

### Logo usage
| Surface           | Logo                                | Notes                              |
|-------------------|-------------------------------------|------------------------------------|
| Light sections    | `logo-blue` (horizontal, navy)      | Navbar, Footer-light, Hero badges  |
| Navy sections     | `logo-white` (horizontal, white)    | CTAStrip, FinalCTA, Footer         |
| Mascot / glyph    | `ab.png`                            | Hero, CTAStrip, Story, FinalCTA    |

The mascot must always appear **monochrome navy** body with **electric blue glow**
ring behind it, never tinted, never tilted more than ±6°. Float animation 6s loop.

---

## 2. Color Tokens

| Token              | Hex      | Used for                                  |
|--------------------|----------|-------------------------------------------|
| `navy.500` (DEF.)  | `#0A2240`| Primary brand, hero copy, footer bg       |
| `navy.700`         | `#07182C`| Footer, deep navy panels                  |
| `navy.300`         | `#7A99CC`| Trust strip wordmark logos                |
| `navy.200`         | `#A8BDDF`| Inactive nodes / muted strokes            |
| `navy.100`         | `#D6E1F2`| Soft borders                              |
| `navy.50`          | `#EEF3FB`| Pale tints                                |
| `electric.500` (DEF.) | `#2D7DFF` | Primary accent, CTAs, pulses          |
| `electric.600`     | `#1D5FD9`| Hover state for primary                   |
| `electric.300`     | `#6E9DFF`| Active node strokes                       |
| `electric.100`     | `#CEDFFF`| Eyebrow / chip borders                    |
| `electric.50`      | `#EAF2FF`| Eyebrow / chip fills                      |
| `soft.200`         | `#DCE6F4`| Card borders                              |
| `soft.100`         | `#EDF3FB`| Section background                        |
| `soft.50`          | `#F6F9FE`| Subtle panels, table headers              |
| `ink.DEFAULT`      | `#0E1A2B`| Body text on white                        |
| `ink.subtle`       | `#475569`| Secondary text                            |
| `ink.mute`         | `#64748B`| Tertiary / labels                         |
| Status `emerald`   | `#10B981`| Allowed / safe                            |
| Status `rose`      | `#F43F5E`| Denied / risky                            |

### Gradients
- `bg-navy-radial` — `radial-gradient(80% 60% at 50% 0%, rgba(45,125,255,0.20), transparent 60%) + linear-gradient(180deg, #0A2240, #07182C)`
- `bg-pale-radial` — `radial-gradient(60% 50% at 50% 0%, rgba(45,125,255,0.10), transparent 70%)`
- Hero light wash, Card thumbnails: `from-electric-50 via-white to-soft-50`

---

## 3. Typography

Family: **Inter** (300/400/500/600/700/800), display = same. Mono = **JetBrains Mono**.

| Style          | Size / line-height                         | Weight | Tracking |
|----------------|--------------------------------------------|--------|----------|
| H1 (hero)      | 56 / 58 (lg), 48 / 52 (sm), 36 / 42 (xs)   | 600    | -1.2     |
| H2 (section)   | 44 / 48 (lg), 36 / 42, 30 / 36             | 600    | -0.8     |
| H3 (card)      | 20 / 26                                    | 600    | -0.2     |
| Body large     | 18 / 28                                    | 400    | 0        |
| Body           | 14 / 22                                    | 400    | 0        |
| Caption / chip | 11 / 14 ALLCAPS                            | 600    | +1.6     |
| Mono           | 12 / 18                                    | 500    | 0        |

---

## 4. Spacing, Radii, Shadows

- **Container**: `1240 px` max, side padding `40 px` (lg) / `24 px` (mobile)
- **Section vertical padding**: `96 px` (`py-24`)
- **Grid gutters**: `24 px` (lg), `16 px` (md)
- **Radii**: cards `16 px` / `24 px`, pills `9999 px`, buttons `9999 px`
- **Shadows**:
  - `soft`: `0 6px 24px -8px rgba(10,34,64,0.10)`
  - `card`: `0 12px 40px -12px rgba(10,34,64,0.18)`
  - `glow`: `0 0 0 1px rgba(45,125,255,0.30), 0 8px 30px -8px rgba(45,125,255,0.45)` — primary buttons & active nodes

---

## 5. Components / Variants

### Buttons
| Variant       | Fill              | Text   | Border           | Use            |
|---------------|-------------------|--------|------------------|----------------|
| `btn-primary` | `electric.500`    | White  | none + `glow`    | Book a Demo    |
| `btn-secondary` | White           | Navy.500 | `navy.100`     | Sign in        |
| `btn-ghost-light` | `white/5`     | White  | `white/15`       | On navy bg     |

Padding `12 / 20`, font 600 / 14 px.

### Eyebrow chip
`border 1px electric.100`, `bg electric.50/70`, `text electric.700`, `11/14 ALLCAPS`, padding `4 / 12`, radius `pill`.

### Cards
- **Card-soft**: white fill, `soft.200` border, `soft` shadow → on hover lift -4 px and border `electric.200` + `card` shadow.
- **Capability cards** (3-up): include a faint `electric.50` 160px corner-glow blur top-right.
- **Resource cards**: 160px gradient thumbnail with vector path overlay (`electric.500`).

### Status badges
`emerald.50 / 700` allow, `rose.50 / 700` deny, `amber.50 / 700` warn — pill shape, 10px ALLCAPS bold.

---

## 6. Frames / Pages to create in Figma

Create 3 frame columns:
- **Desktop** 1440 × auto
- **Tablet** 834 × auto
- **Mobile** 390 × auto

### Sections (top → bottom)

1. **Navbar** — h 64 px, sticky, blur background when scrolled.
   Logo · 5 nav links · Sign in / Book a Demo.

2. **Hero** — 2 cols (5 / 7).
   Left: eyebrow → H1 (with electric "Identity" underline) → body → 2 CTAs → slider card with 3 dots and rotating title.
   Right: 880 × 520 graph card (DAG of 19 nodes in 5 columns, electric pulses, mascot at center over the AgentDNA core badge).
   Floating credential mini-cards (-3 left bottom, -3 right top).
   Trust strip with 6 monochrome wordmarks.

3. **Ecosystem** — heading + filter chips (All / Identity / Cloud / SaaS / AI / Developer / Data / Security) + grid of 88 px cards (8 cols on xl, 6/4/3/2 responsive). Total ~55 logos in 2 visual rows.

4. **CTA Strip** — full-width navy radial card (1180 × 320). Heading + body + 2 CTAs left, mascot 160 px right.

5. **Agents Are Not Humans** — full-width navy radial section.
   Centered H2 with typing effect + caret · sub line.
   Below: 2 cols (5 / 7).
     - Left: terminal log card (mac dots) streaming 8 lines with green/red dots.
     - Right: tangle → DAG visual (cross-fade), mascot in center, status pill top-right.
   Closing line under: "Identify, authorize, and trace them with AgentDNA."

6. **Platform Steps (Connect / Protect / Observe)** — soft-50 background.
   2 cols (5 / 7). Left: 3 stacked step cards with icon, number, title, body.
   Right: dashboard card with mac chrome + Live pill, content swaps:
     - Connect: mini graph + 8 system tiles
     - Protect: 4 decision rows allow/deny + footer chip
     - Observe: timeline with moving dot + 5-row table

7. **Capabilities** — 3 cards (COCA · CBAC · IP), each with icon, short code badge, title, body, chain pill row, 4 bullets.

8. **Insights & Resources** — 3 cards with 160px gradient thumbnail (path overlay), category pill, title, body, "Read more" link.

9. **Final CTA** — large navy panel with faint DAG background, headline, body, 2 CTAs, mascot 200 px right.

10. **Footer** — navy.700 bg.
    Left col (5/12): logo, description, contact, 3 social pills.
    Right (7/12): 4 columns of links (Product / Solutions / Resources / Company).
    Bottom legal row: copyright + Privacy / Terms / Security / Status.

---

## 7. Animation Recipes (set up as Smart Animate or Lottie)

| Element                              | Type                          | Timing                          |
|--------------------------------------|-------------------------------|---------------------------------|
| Hero graph pulse along edge          | x/y interp + opacity 0→1→1→0  | 4.6 s loop, staggered per edge  |
| Inactive → active node               | fill + stroke + drop-shadow   | 600 ms ease                     |
| Node "nod"                           | rotate 0 → -2 → 2 → 0         | 700 ms ease-out                 |
| Mascot float                         | y 0 → -6 → 0                  | 6 s loop                        |
| Hero slider crossfade                | y 8 → 0 + opacity             | 350 ms                          |
| Typing line                          | character reveal              | 60 ms / char                    |
| Log stream                           | row reveal                    | 380 ms / row                    |
| Tangle → DAG                         | opacity + blur cross-fade     | 900 ms                          |
| Step dashboard swap                  | y 10 → 0 + opacity            | 350 ms                          |
| Card hover                           | y -4, border electric.200     | 200 ms                          |

Reduce-motion behavior: drop pulses, keep static graph.

---

## 8. Asset Checklist for Figma file

Drop these into the Figma file under a "Brand" page:
- `logo-blue.png` (and `.svg`)
- `logo-white.png` (and `.svg`)
- `ab.png` mascot
- Inter & JetBrains Mono fonts loaded
- Color & text styles from §2 and §3 saved as Figma styles
- Components for Button (3 variants), Eyebrow, Chip, Card-soft, Capability card, Resource card, Status pill, Mac-window chrome, Step card, Logo tile

---

## 9. Quick reference — Figma layer naming

```
01-Hero / Hero-Graph / Node-Core
01-Hero / Hero-Graph / Node-Inactive
01-Hero / Hero-Graph / Node-Active
01-Hero / Hero-Graph / Edge-Inactive
01-Hero / Hero-Graph / Edge-Active
01-Hero / Slider / Dot-Active
…
```

Use this naming so Figma → code parity stays clean if you ever export back to React.

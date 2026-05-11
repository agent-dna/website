/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A2240",
          50: "#EEF3FB",
          100: "#D6E1F2",
          200: "#A8BDDF",
          300: "#7A99CC",
          400: "#3F66A1",
          500: "#0A2240",
          600: "#091E38",
          700: "#07182C",
          800: "#051221",
          900: "#030B16",
        },
        electric: {
          DEFAULT: "#2D7DFF",
          50: "#EAF2FF",
          100: "#CEDFFF",
          200: "#9EBEFF",
          300: "#6E9DFF",
          400: "#3E7DFF",
          500: "#2D7DFF",
          600: "#1D5FD9",
          700: "#1648A8",
        },
        soft: {
          50: "#F6F9FE",
          100: "#EDF3FB",
          200: "#DCE6F4",
        },
        ink: {
          DEFAULT: "#0E1A2B",
          subtle: "#475569",
          mute: "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(10, 34, 64, 0.10)",
        card: "0 12px 40px -12px rgba(10, 34, 64, 0.18)",
        glow: "0 0 0 1px rgba(45,125,255,0.30), 0 8px 30px -8px rgba(45,125,255,0.45)",
        ring: "0 0 0 6px rgba(45,125,255,0.12)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(10,34,64,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,34,64,0.06) 1px, transparent 1px)",
        "navy-radial":
          "radial-gradient(80% 60% at 50% 0%, rgba(45,125,255,0.20) 0%, rgba(10,34,64,0) 60%), linear-gradient(180deg, #0A2240 0%, #07182C 100%)",
        "pale-radial":
          "radial-gradient(60% 50% at 50% 0%, rgba(45,125,255,0.10) 0%, rgba(255,255,255,0) 70%)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marqueeLeft: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeRight: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        stepProgress: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 2.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        caret: "caret 1s steps(2) infinite",
        marqueeLeft: "marqueeLeft 42s linear infinite",
        marqueeRight: "marqueeRight 48s linear infinite",
        stepProgress: "stepProgress 5500ms linear forwards",
      },
    },
  },
  plugins: [],
};

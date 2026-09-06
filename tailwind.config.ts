import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core surfaces - dark purple only, no neutrals borrowed from elsewhere.
        void: "#0B0716",
        elevated: "#140D24",
        surface: "#1C1330",
        surface2: "#261A42",
        line: "#3A2A5C",

        // Purple ramp - the entire accent system lives here.
        purple: {
          950: "#150A2E",
          900: "#1F1040",
          800: "#2C1758",
          700: "#3D1F82",
          600: "#5B34B0",
          core: "#7C4DFF",
          500: "#7C4DFF",
          bright: "#9C6BFF",
          400: "#B18CFF",
          300: "#C9AEFF",
          glow: "#E4D6FF",
        },

        // Text - white and soft purple-white only.
        ink: "#F8F6FF",
        haze: "#C4B8E6",
        muted: "#8B7EB0",
      },
      fontFamily: {
        display: ["'Clash Display'", "'General Sans'", "sans-serif"],
        body: ["'General Sans'", "'Inter'", "sans-serif"],
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")",
        "glow-purple": "radial-gradient(circle, rgba(124,77,255,0.38) 0%, rgba(124,77,255,0) 70%)",
        "glow-soft": "radial-gradient(circle, rgba(177,140,255,0.22) 0%, rgba(177,140,255,0) 70%)",
        "moon-surface": "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E4D6FF 55%, #B18CFF 100%)",
      },
      borderRadius: {
        card: "18px",
        control: "12px",
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 70px -12px rgba(124,77,255,0.5)",
        card: "0 24px 48px -24px rgba(4,0,16,0.7)",
        "glass-inner": "inset 0 1px 0 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        xs: "6px",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(0.6deg)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        moonRise: {
          "0%": { transform: "translateY(38vh) scale(0.86)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        moonGlowPulse: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "60%": { opacity: "0.8" },
          "100%": { opacity: "0.55", transform: "scale(1)" },
        },
        brandReveal: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        rise: "rise 0.6s cubic-bezier(0.16,1,0.3,1) both",
        moonRise: "moonRise 1.4s cubic-bezier(0.16,1,0.3,1) forwards",
        moonGlowPulse: "moonGlowPulse 1.6s ease-out forwards",
        brandReveal: "brandReveal 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;

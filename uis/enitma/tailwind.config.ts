import type { Config } from "tailwindcss";

/**
 * Design System de enITma — tokens únicos y coherentes.
 * Paleta: azul aviación + cian datos sobre fondo "espacio profundo".
 * Roles semánticos (primary/accent/success/warning/error) para no usar colores
 * arbitrarios por componente.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fondos y superficies (espacio profundo).
        space: {
          950: "#05070f",
          900: "#0a0f1e",
          800: "#111a30",
          700: "#1b2745"
        },
        // Primary (azul aviación).
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7"
        },
        // Accent (cian datos).
        signal: {
          400: "#22d3ee",
          500: "#06b6d4"
        },
        // Estados semánticos.
        success: { 400: "#34d399", 500: "#10b981" },
        warning: { 400: "#fbbf24", 500: "#f59e0b" },
        danger: { 400: "#f87171", 500: "#ef4444" }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      maxWidth: {
        prose: "68ch" // ancho de lectura cómodo para párrafos
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        // Sombra elevada coherente para superficies/cards.
        elevated: "0 10px 40px -12px rgba(2, 132, 199, 0.25)"
      },
      transitionTimingFunction: {
        enitma: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;

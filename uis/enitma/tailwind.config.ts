import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta enITma: azul aviación + cian datos + fondo espacio profundo.
        space: {
          950: "#05070f",
          900: "#0a0f1e",
          800: "#111a30",
          700: "#1b2745"
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7"
        },
        signal: {
          400: "#22d3ee",
          500: "#06b6d4"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

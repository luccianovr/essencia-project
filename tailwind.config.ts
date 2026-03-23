import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold:      "#C9A84C",   // dorado principal — bordes, acentos, marcas
        "gold-lt": "#F0D080",   // dorado claro — títulos, precios
        dark:      "#0a0a0a",
        mid:       "#161616",
        "card-bg": "#111111",
        muted:     "#8a8a6a",   // dorado apagado — texto secundario
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

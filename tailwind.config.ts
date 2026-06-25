import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#101714",
        foreground: "#F7F1E7",
        copper: "#D89145",
        amber: "#E4A64E",
        peat: "#24342E",
        moss: "#8BDDAD",
        smoke: "#AEBBAD",
      },
      borderRadius: {
        card: "18px",
      },
      boxShadow: {
        glow: "0 24px 70px rgba(0,0,0,.38)",
      },
    },
  },
  plugins: [],
} satisfies Config;

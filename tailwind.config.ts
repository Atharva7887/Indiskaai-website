import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF5",
          100: "#FAF7F0",
          200: "#F3EDE0",
          300: "#E8DEC8",
        },
        navy: {
          DEFAULT: "#1E5BA8",
          50: "#EAF1FA",
          100: "#C8DBF0",
          400: "#3D78C2",
          500: "#1E5BA8",
          600: "#174888",
          700: "#103565",
          900: "#081D3A",
        },
        gold: {
          DEFAULT: "#F4C430",
          400: "#F7D366",
          500: "#F4C430",
          600: "#D9A91A",
          700: "#A8810F",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#3A3A3A",
          muted: "#6B6B6B",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

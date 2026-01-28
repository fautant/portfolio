import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui compatible colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        // Palette inspirée du CV de Félix AUTANT
        primary: {
          DEFAULT: "#FF5C93", // Rose principal
          light: "#FF8DB3",
          dark: "#E04076",
          50: "#FFF0F5",
          100: "#FFE0EB",
          200: "#FFC1D7",
          300: "#FFA3C3",
          400: "#FF7DAB",
          500: "#FF5C93",
          600: "#E04076",
          700: "#C2265A",
          800: "#A31745",
          900: "#850C33",
        },
        secondary: {
          DEFAULT: "#FF9357", // Orange
          light: "#FFB586",
          dark: "#E67843",
          50: "#FFF5EF",
          100: "#FFEADC",
          200: "#FFD5B9",
          300: "#FFC096",
          400: "#FFAA73",
          500: "#FF9357",
          600: "#E67843",
          700: "#CC5D2F",
          800: "#B3431D",
          900: "#992A0C",
        },
        accent: {
          DEFAULT: "#E8B844", // Jaune/Gold
          light: "#F0CC6E",
          dark: "#D0A22A",
          50: "#FDF8EA",
          100: "#FAF0D5",
          200: "#F5E1AB",
          300: "#F0D281",
          400: "#ECC560",
          500: "#E8B844",
          600: "#D0A22A",
          700: "#B88B1A",
          800: "#9F7412",
          900: "#865D0B",
        },
        background: {
          light: "#F5E6D3", // Beige/Crème
          dark: "#1A1A1A", // Fond sombre
          "light-alt": "#FEFBF6",
          "dark-alt": "#252525",
        },
        text: {
          dark: "#4A4A4A", // Texte principal
          light: "#F5F5F5", // Texte sur fond sombre
          muted: "#6B6B6B",
          "muted-light": "#D1D1D1",
        },
        // Dégradés prédéfinis
        gradient: {
          start: "#FF5C93", // Rose
          middle: "#FF9357", // Orange
          end: "#E8B844", // Jaune
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #FF5C93 0%, #FF9357 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FF9357 0%, #E8B844 100%)",
        "gradient-full": "linear-gradient(135deg, #FF5C93 0%, #FF9357 50%, #E8B844 100%)",
        "gradient-full-reverse": "linear-gradient(135deg, #E8B844 0%, #FF9357 50%, #FF5C93 100%)",
        "gradient-subtle": "linear-gradient(180deg, rgba(255,92,147,0.1) 0%, rgba(232,184,68,0.1) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(2.5rem, 8vw, 5rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "display": ["clamp(2rem, 6vw, 3.5rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-1": ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-2": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-3": ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.4", fontWeight: "600" }],
      },
      spacing: {
        "section": "clamp(3rem, 8vw, 6rem)",
        "section-sm": "clamp(2rem, 6vw, 4rem)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "xl": "1.5rem",
        "2xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "fade-in-up": "fadeInUp 0.6s ease-in-out",
        "fade-in-down": "fadeInDown 0.6s ease-in-out",
        "slide-in-left": "slideInLeft 0.6s ease-in-out",
        "slide-in-right": "slideInRight 0.6s ease-in-out",
        "scale-in": "scaleIn 0.4s ease-in-out",
        "bounce-slow": "bounce 3s infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 92, 147, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 92, 147, 0.6)" },
        },
      },
      boxShadow: {
        "primary": "0 4px 20px rgba(255, 92, 147, 0.25)",
        "secondary": "0 4px 20px rgba(255, 147, 87, 0.25)",
        "accent": "0 4px 20px rgba(232, 184, 68, 0.25)",
        "glow-primary": "0 0 30px rgba(255, 92, 147, 0.4)",
        "glow-secondary": "0 0 30px rgba(255, 147, 87, 0.4)",
        "card": "0 2px 15px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

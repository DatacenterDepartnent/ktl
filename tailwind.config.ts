import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
// 1. Import ฟังก์ชัน heroui เข้ามา
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // 2. เพิ่ม Path นี้เพื่อให้ Tailwind รู้จัก Class ของ HeroUI
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "125": "31.25rem",
        "75": "18.75rem",
      },
      height: {
        "125": "500px",
        "75": "18.75rem",
      },
      colors: {
        primary: "#4A6CF7",
        secondary: "#9353d3",
        "body-color": "#959CB1",
        warning: "#FBBF24",
        black: "#090E34",
        white: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-prompt)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  // 3. เพิ่ม heroui() ลงใน plugins
  plugins: [typography, heroui()],
};

export default config;

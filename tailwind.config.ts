import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 👇👇👇 เพิ่มบรรทัดนี้ครับ (สำคัญมาก!) 👇👇👇
      fontFamily: {
        sans: ["var(--font-prompt)", "sans-serif"],
      },
      // 👆👆👆 จบส่วนที่เพิ่ม 👆👆👆

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography],
};
export default config;

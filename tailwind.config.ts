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
      spacing: {
        "125": "31.25rem",
        '75': '18.75rem',  // 300px
        '125': '31.25rem', // 500px
      },
      height: {
        "125": "500px",
        '75': '18.75rem',  // 300px
        '125': '31.25rem', // 500px
      },
      colors: {
        // 👇 ก๊อปปี้ชุดนี้ไปใส่ครับ (รวมมิตรสีที่มักจะ Error)
        primary: "#4A6CF7", // สีหลัก (สีน้ำเงิน)
        secondary: "#9353d3", // สีรอง (ถ้ามี)
        dark: "#1D2144", // สี Dark Mode
        "body-color": "#959CB1", // <--- ตัวต้นเหตุของ Error รอบนี้!
        warning: "#FBBF24",

        // กันเหนียว: สีพื้นฐานบางที v4 ต้องการการประกาศซ้ำในบาง template
        black: "#090E34",
        white: "#ffffff",
      },
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
  darkMode: "class",
  plugins: [typography],
};
export default config;

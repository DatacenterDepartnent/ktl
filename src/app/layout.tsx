import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@ant-design/v5-patch-for-react-19";
import "../styles/prism-vsc-dark-plus.css";
import "../styles/index.css";
import "../styles/globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

// ✅ ปรับปรุง Metadata เพื่อให้รองรับ Favicon และ OG Image
export const metadata: Metadata = {
  title: "KTLTC - วิทยาลัยเทคนิคกันทรลักษ์",
  description: "ระบบบริหารจัดการข่าวสารและข้อมูลวิทยาลัย",
  // เพิ่ม Favicon
  icons: {
    icon: "/images/favicon.ico", // ตรวจสอบว่ามีไฟล์ที่ public/images/favicon.ico
    shortcut: "/images/favicon.ico",
    apple: "/images/logo.png", // แนะนำให้มีรูปโลโก้ PNG สำหรับ Apple Devices
  },
  // เพิ่ม Open Graph (รูปเวลาแชร์ลิงก์)
  openGraph: {
    title: "วิทยาลัยเทคนิคกันทรลักษ์ | KTLTC",
    description: "ระบบบริหารจัดการข่าวสารและข้อมูลวิทยาลัยเทคนิคกันทรลักษ์",
    url: "https://ktltc.vercel.app", // URL จริงของเว็บ
    siteName: "KTLTC",
    images: [
      {
        url: "/images/og-image.png", // ⚠️ อย่าลืมเอารูปขนาด 1200x630px ไปวางที่ public/images/
        width: 1200,
        height: 630,
        alt: "KTLTC Preview Image",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ เพิ่ม suppressHydrationWarning เพื่อแก้ Error หน้าจอแดง (คงเดิม)
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@300;400;600&family=Chakra+Petch:wght@300;400;600&family=Lato:wght@300;400;700&family=Mali:wght@300;400;600&family=Mitr:wght@300;400&family=Montserrat:wght@300;400;700&family=Open+Sans:wght@300;400;700&family=Prompt:wght@300;400;600&family=Roboto:wght@300;400;700&family=Sarabun:wght@300;400;600&family=Taviraj:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${prompt.className} ${prompt.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <SpeedInsights />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

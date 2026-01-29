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

export const metadata: Metadata = {
  title: "KTLTC - วิทยาลัยเทคนิคกันทรลักษ์",
  description: "ระบบบริหารจัดการข่าวสารและข้อมูลวิทยาลัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ เพิ่ม suppressHydrationWarning ตรงนี้ เพื่อแก้ Error หน้าจอแดง
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

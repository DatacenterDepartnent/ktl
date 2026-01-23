import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

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
    <html lang="th">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@300;400;600&family=Chakra+Petch:wght@300;400;600&family=Lato:wght@300;400;700&family=Mali:wght@300;400;600&family=Mitr:wght@300;400&family=Montserrat:wght@300;400;700&family=Open+Sans:wght@300;400;700&family=Prompt:wght@300;400;600&family=Roboto:wght@300;400;700&family=Sarabun:wght@300;400;600&family=Taviraj:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${prompt.className} ${prompt.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}

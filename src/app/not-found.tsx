"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ ใช้ router ของ Next.js
import { motion } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const ErrorContent = () => {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563EB", // Blue-600
          borderRadius: 8,
          fontFamily: "var(--font-prompt)", // ถ้ามีการ set font variable ไว้
        },
      }}
    >
      <section className="relative flex max-w-[1600px] mx-auto items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        {/* --- Background Decoration --- */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-20">
          <div className="h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-[100px] sm:h-[500px] sm:w-[500px] dark:bg-blue-600/30" />
        </div>

        <div className="text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            {/* 404 Text Effect (Background Layer) */}
            <h1 className="text-[120px] sm:text-[200px] lg:text-[280px] leading-none font-black text-slate-200 dark:text-zinc-800/50 select-none transition-colors duration-300">
              404
            </h1>

            {/* Error Message (Foreground Layer) */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 transform flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm border border-blue-200 dark:border-blue-800">
                Error Code
              </span>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl drop-shadow-sm">
                Oops! Page Not Found
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
                ขออภัย ไม่พบหน้าที่คุณต้องการ อาจมีการย้าย ลบ หรือคุณอาจพิมพ์
                URL ผิดพลาด
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-16 sm:mt-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                className="h-12 min-w-40 px-8 text-base font-medium shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/50"
              >
                กลับหน้าหลัก
              </Button>
            </Link>

            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 h-12 min-w-40 px-8 text-base font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-zinc-700 rounded-lg hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all hover:-translate-y-1"
            >
              <ArrowLeftOutlined />
              ย้อนกลับ
            </button>
          </motion.div>
        </div>
      </section>
    </ConfigProvider>
  );
};

export default ErrorContent;

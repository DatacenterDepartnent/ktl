"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const ErrorContent = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563EB", // Blue-600
          borderRadius: 8,
        },
      }}
    >
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 ">
        {/* --- Background Decoration --- */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
          {/* ปรับเป็น class มาตรฐาน หรือใช้ arbitrary ต่อไปแต่ปิดการแจ้งเตือน */}
          <div className="h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-[100px] sm:h-[500px] sm:w-[500px] " />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* 404 Text Effect */}
            <h1 className="text-[120px] leading-none font-black text-slate-200 select-none sm:text-[200px] ">
              404
            </h1>

            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 transform">
              <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Oops! Page Not Found
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-500">
                ขออภัย ไม่พบหน้าที่คุณต้องการ อาจมีการย้าย ลบ หรือคุณอาจพิมพ์
                URL ผิด
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-24 sm:flex-row relative z-20"
          >
            <Link href="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                className="h-12 min-w-40 px-8 text-base font-medium shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
              >
                กลับหน้าหลัก
              </Button>
            </Link>

            {/* นำ ArrowLeftOutlined มาใช้ตรงนี้เพื่อให้หาย Error */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 h-12 min-w-40 px-8 text-base font-medium text-slate-600 border border-slate-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all"
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

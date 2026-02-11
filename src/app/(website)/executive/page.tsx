"use client";

import { Image } from "@heroui/image";
import { motion } from "framer-motion";
import { Data } from "./data";
import {
  UserOutlined,
  StarFilled,
  TeamOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

export default function Executive() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-20 font-sans text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
      {/* --- Ambient Background --- */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[100px]" />

      <div className="container mx-auto max-w-6xl">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-yellow-700 shadow-sm dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-500">
            <TeamOutlined /> คณะผู้บริหาร
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-white">
            ทำเนียบ
            <span className="bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              ผู้บริหาร
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            ผู้นำที่มีวิสัยทัศน์
            มุ่งมั่นพัฒนาวิทยาลัยเทคนิคกันทรลักษ์สู่ความเป็นเลิศทางการอาชีวศึกษา
          </p>
        </motion.div>

        {/* --- ส่วนที่ 1: ผู้อำนวยการ (Hero Section) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-24 flex justify-center"
        >
          <div className="relative w-full max-w-lg">
            {/* Glow Effect Behind */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-400 opacity-30 blur-2xl transition duration-1000 group-hover:opacity-60"></div>

            <div className="relative overflow-hidden rounded-3xl border border-yellow-100 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              {/* Star Badge */}
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-500">
                <StarFilled style={{ fontSize: "20px" }} />
              </div>

              <div className="flex flex-col items-center text-center">
                {/* Image Container: Center Added */}
                <div className="mb-6 flex h-[400px] w-full justify-center items-center overflow-hidden rounded-2xl shadow-lg ring-4 ring-yellow-50 dark:ring-neutral-800">
                  <Image
                    src="/images/ผู้บริหาร/1.webp"
                    alt="นางสาวทักษิณา ชมจันทร์"
                    // Changed object-top to object-center
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    width={400}
                    // Force wrapper to be full width/height
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full",
                    }}
                  />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  นางสาวทักษิณา ชมจันทร์
                </h2>
                <div className="mt-2 h-1 w-16 rounded-full bg-yellow-500" />
                <p className="mt-3 text-lg font-semibold text-yellow-600 dark:text-yellow-500">
                  ผู้อำนวยการวิทยาลัยเทคนิคกันทรลักษ์
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  ดำรงตำแหน่งตั้งแต่ พ.ศ. 2566 - ปัจจุบัน
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- ส่วนที่ 2: รองผู้อำนวยการ (Grid Section) --- */}
        <div className="relative mb-12">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-6 text-lg font-bold text-slate-500 dark:bg-neutral-950">
              รองผู้อำนวยการฝ่ายต่างๆ
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Data.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-all duration-300 hover:border-yellow-200 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-yellow-900/50">
                {/* Image Container: Center Added */}
                <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-neutral-800">
                  <Image
                    src={item.img}
                    alt={item.title}
                    // Changed object-top to object-center
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    // Force wrapper to be full width/height
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full",
                    }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="relative p-6 text-center">
                  {/* Floating Icon */}
                  <div className="absolute -top-8 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-white shadow-md dark:border-neutral-900 dark:bg-neutral-800">
                    <IdcardOutlined className="text-2xl text-slate-400 group-hover:text-yellow-500" />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-yellow-600 dark:text-slate-100 dark:group-hover:text-yellow-500">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {item.secondary}
                    </p>
                    <div className="mx-auto mt-3 h-0.5 w-10 bg-slate-100 group-hover:bg-yellow-400 dark:bg-neutral-800" />
                    <p className="mt-3 line-clamp-2 text-xs text-slate-400 dark:text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

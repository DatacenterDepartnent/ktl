"use client";

import React from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";
import {
  BulbOutlined,
  AimOutlined,
  RocketOutlined,
  TeamOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  BookOutlined,
} from "@ant-design/icons";

export default function Philosophy() {
  const words = [
    "ปรัชญา วิสัยทัศน์",
    "พันธกิจ เป้าประสงค์",
    "เอกลักษณ์ อัตลักษณ์",
    "ค่านิยม คำขวัญ",
  ];

  // Animation Variants
  const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 50, damping: 20 },
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50 py-20 font-sans text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
      {/* --- Background Decoration --- */}
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-neutral-950 dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"></div>

      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-sky-400/20 blur-[100px] dark:bg-sky-900/20" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-900/20" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVar}
        className="container px-4 sm:px-6"
      >
        {/* --- Header Section --- */}
        <motion.div variants={itemVar} className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700 shadow-sm dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
            <GlobalOutlined /> Kantharalak Technical College
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white">
            ข้อมูลพื้นฐาน
            <br className="block md:hidden" />
            <span className="mt-2 block bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent md:mt-0 md:inline-block md:ml-4 dark:from-sky-400 dark:to-indigo-400">
              <FlipWords words={words} className="font-extrabold" />
            </span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            มุ่งมั่นพัฒนากำลังคนด้านวิชาชีพ สู่มาตรฐานสากล
            ด้วยนวัตกรรมและเทคโนโลยี
          </p>
        </motion.div>

        {/* --- Main Content Grid (Bento Style) --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* 1. Philosophy (Large Card) */}
          <motion.div
            variants={itemVar}
            className="col-span-1 md:col-span-6 lg:col-span-6"
          >
            <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-sky-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-50 transition-all group-hover:scale-150 dark:bg-sky-900/20" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
                  <BulbOutlined style={{ fontSize: "28px" }} />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-white">
                  ปรัชญา (Philosophy)
                </h2>
                <p className="text-3xl font-medium leading-relaxed text-sky-600 dark:text-sky-400">
                  "ฝีมือดี มีวินัย ใฝ่คุณธรรม นำสังคม"
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. Vision (Large Card) */}
          <motion.div
            variants={itemVar}
            className="col-span-1 md:col-span-6 lg:col-span-6"
          >
            <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-indigo-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-50 transition-all group-hover:scale-150 dark:bg-indigo-900/20" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                  <AimOutlined style={{ fontSize: "28px" }} />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-white">
                  วิสัยทัศน์ (Vision)
                </h2>
                <p className="mb-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  ผลิตและพัฒนากำลังคน โดยขับเคลื่อนการจัดการความรู้ด้วยเทคโนโลยี
                  เป็นประชาคมแห่งการเรียนรู้ เน้นการทำงานเป็นทีม
                </p>
                <div className="rounded-xl bg-slate-50 p-4 text-sm italic text-slate-500 dark:bg-neutral-800 dark:text-slate-400">
                  "Kantharalak Technical College (KTL-TC) Committed to keep
                  moving..."
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Mission (Full Width or Grid) */}
          <motion.div
            variants={itemVar}
            className="col-span-1 md:col-span-12 lg:col-span-8"
          >
            <div className="h-full rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                  <RocketOutlined style={{ fontSize: "20px" }} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  พันธกิจ (Mission)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "การจัดการความรู้แก่ผู้เรียน",
                  "พัฒนาความรู้ ทักษะ และการประยุกต์ใช้",
                  "ส่งเสริมคุณธรรม จริยธรรม",
                  "พัฒนาหลักสูตร อาชีวศึกษา",
                  "จัดการเรียนการสอนอาชีวศึกษา",
                  "บริหารจัดการตามหลักธรรมาภิบาล",
                  "การนำนโยบายสู่การปฏิบัติ",
                  "สร้างสังคมแห่งการเรียนรู้",
                  "พัฒนานวัตกรรมและงานวิจัย",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800"
                  >
                    <CheckCircleOutlined className="mt-1 shrink-0 text-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 4. Goal (Side Column) */}
          <motion.div
            variants={itemVar}
            className="col-span-1 md:col-span-12 lg:col-span-4"
          >
            <div className="h-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl dark:from-neutral-800 dark:to-neutral-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                  <BookOutlined style={{ fontSize: "20px" }} />
                </div>
                <h2 className="text-2xl font-bold">เป้าประสงค์ (Goal)</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "ผู้เรียนมีคุณภาพและได้มาตรฐาน",
                  "ตรงตามความต้องการของตลาดแรงงาน",
                  "มีความสามารถใช้นวัตกรรม/เทคโนโลยี",
                  "แลกเปลี่ยนเรียนรู้ระดับสากล",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300 border border-sky-500/30">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* 5. Values & Identity (Small Cards) */}
          <motion.div variants={itemVar} className="col-span-1 md:col-span-4">
            <InfoCard
              icon={<TeamOutlined />}
              color="emerald"
              title="เอกลักษณ์ (Unity)"
              desc="ผู้นำบริการวิชาชีพสู่ชุมชน"
            />
          </motion.div>
          <motion.div variants={itemVar} className="col-span-1 md:col-span-4">
            <InfoCard
              icon={<HeartOutlined />}
              color="rose"
              title="อัตลักษณ์ (Identity)"
              desc="ฝีมือดี มีคุณธรรม"
            />
          </motion.div>
          <motion.div variants={itemVar} className="col-span-1 md:col-span-4">
            <InfoCard
              icon={<CheckCircleOutlined />}
              color="amber"
              title="ค่านิยม (Values)"
              desc="ยิ้ม ไหว้ แต่งกายดี สวัสดี ขอบคุณ ขอโทษ"
            />
          </motion.div>

          {/* 6. Motto (Banner) */}
          <motion.div variants={itemVar} className="col-span-1 md:col-span-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 p-8 text-center text-white shadow-lg">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h3 className="relative z-10 mb-2 text-xl font-bold uppercase tracking-wider opacity-90">
                คำขวัญ (Motto)
              </h3>
              <p className="relative z-10 text-2xl font-medium leading-relaxed md:text-3xl">
                "เรียนรู้ปฏิบัติสู่นวัตกรรม ผู้นำด้านเทคโนโลยี
                สู่วิถีเศรษฐกิจสร้างสรรค์ <br className="hidden md:block" />
                มุ่งมั่นพัฒนากำลังคนด้านวิชาชีพ"
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Reusable Small Card Component
const InfoCard = ({
  icon,
  color,
  title,
  desc,
}: {
  icon: any;
  color: "blue" | "rose" | "emerald" | "amber";
  title: string;
  desc: string;
}) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-100",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 group-hover:bg-rose-100",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-100",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-100",
  };

  return (
    <div className="group h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/30 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-colors ${styles[color]}`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
};

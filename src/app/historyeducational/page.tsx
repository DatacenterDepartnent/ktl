"use client";

import { useState } from "react";
import { Image } from "@heroui/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageItem } from "./data"; // ตรวจสอบว่าไฟล์ data.js/ts อยู่ path นี้จริง
import {
  CalendarOutlined,
  BankOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

export default function HistoryEducational() {
  // State สำหรับเก็บ URL รูปที่ถูกคลิก
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 font-sans dark:bg-neutral-950">
      {/* --- Ambient Background --- */}
      <div className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] dark:bg-blue-900/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] dark:bg-blue-900/20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500 opacity-20 blur-2xl" />
            <div className="relative rounded-3xl">
              <Image
                src="/images/logo.webp"
                alt="KTLTC Logo"
                width={120}
                height={120}
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl dark:text-white">
            วิทยาลัยเทคนิค
            <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              กันทรลักษ์
            </span>
          </h1>
          <p className="mt-6 text-xl font-medium text-slate-500 dark:text-slate-400">
            Kantharalak Technical College
          </p>
          <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-neutral-900 dark:text-slate-300 dark:ring-neutral-800">
            <EnvironmentOutlined className="text-blue-500" />
            <span>ศรีสะเกษ, ประเทศไทย</span>
          </div>
        </motion.div>

        {/* --- Main Content Grid (History & Timeline) --- */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: History Narrative */}
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="mb-8 flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <HistoryOutlined className="text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                เกียรติประวัติและความเป็นมา
              </h2>
            </motion.div>

            <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-neutral-900 dark:ring-neutral-800"
              >
                <p className="leading-loose text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    วิทยาลัยเทคนิคกันทรลักษ์
                  </span>{" "}
                  เดิมคือ
                  <strong> "วิทยาลัยการอาชีพกันทรลักษ์"</strong>{" "}
                  ก่อตั้งขึ้นเพื่อขยายโอกาสทางการศึกษาวิชาชีพสู่ท้องถิ่น
                  โดยความร่วมมือระหว่างจังหวัดศรีสะเกษและกรมอาชีวศึกษา
                  เมื่อวันที่ 10 มิถุนายน 2534
                </p>
                <p className="mt-4 leading-loose text-slate-600 dark:text-slate-300">
                  ด้วยวิสัยทัศน์ของ <strong>นายพิสุทธิ์ บุญเจริญ</strong>{" "}
                  (ศึกษาธิการอำเภอ) และความอนุเคราะห์ที่ดินจาก
                  <strong> นายอำไพ บุญเริ่ม</strong>{" "}
                  (ผอ.โรงเรียนบ้านจานทองกวาววิทยา)
                  ทำให้ได้พื้นที่สาธารณประโยชน์ทำเลทองกว่า 105 ไร่
                  สำหรับการก่อสร้างสถานศึกษาแห่งนี้
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Timeline */}
          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 dark:bg-neutral-900 dark:shadow-none dark:ring-neutral-800">
              <div className="mb-6 flex items-center gap-3">
                <CalendarOutlined className="text-xl text-blue-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  เส้นทางแห่งกาลเวลา
                </h3>
              </div>

              <div className="relative space-y-8 pl-4 before:absolute before:left-6 before:top-2 before:h-[90%] before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-slate-200 dark:before:to-neutral-800">
                {[
                  {
                    year: "30 มี.ค. 2537",
                    title: "ประกาศจัดตั้ง",
                    desc: "กระทรวงศึกษาธิการประกาศจัดตั้ง พร้อมงบประมาณ 28.7 ล้านบาท",
                  },
                  {
                    year: "ปีการศึกษา 2539",
                    title: "เปิดรับนักศึกษารุ่นแรก",
                    desc: "เปิดสอน 4 สาขาวิชาหลัก: ช่างยนต์, ไฟฟ้า, อิเล็กทรอนิกส์, พณิชยการ",
                  },
                  {
                    year: "7 มิ.ย. 2539",
                    title: "พิธีเปิดอย่างเป็นทางการ",
                    desc: "โดย ฯพณฯ นายบรรหาร ศิลปอาชา นายกรัฐมนตรี",
                  },
                  {
                    year: "21 พ.ย. 2555",
                    title: "ยกฐานะ",
                    desc: "เปลี่ยนชื่อเป็น 'วิทยาลัยเทคนิคกันทรลักษ์'",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative pl-8"
                  >
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow dark:border-neutral-900" />
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {item.year}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Facilities Section --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-24 lg:mt-32"
        >
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.div
                variants={itemVariants}
                className="mb-2 flex items-center gap-3 text-blue-600 dark:text-blue-400"
              >
                <BankOutlined className="text-2xl" />
                <span className="font-bold uppercase tracking-wider">
                  Campus Tour
                </span>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white"
              >
                อาคารสถานที่และสิ่งแวดล้อม
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
              >
                บรรยากาศร่มรื่นบนพื้นที่กว่า 105 ไร่
                เพียบพร้อมด้วยอาคารเรียนและสิ่งอำนวยความสะดวกที่ทันสมัย
              </motion.p>
            </div>
          </div>

          {/* Main Map (Clickable) */}
          <motion.div
            variants={itemVariants}
            className="group relative mb-12 cursor-pointer overflow-hidden rounded-3xl bg-slate-200 shadow-2xl shadow-slate-200/50 dark:bg-neutral-900 dark:shadow-none"
            onClick={() =>
              setSelectedImage("/images/image/ข้อมูลด้านอาคารสถานที่.webp")
            }
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

            {/* Zoom Icon Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 hover:scale-110">
                <ZoomInOutlined className="text-3xl text-white drop-shadow-md" />
              </div>
            </div>

            <Image
              removeWrapper
              src="/images/image/ข้อมูลด้านอาคารสถานที่.webp"
              alt="แผนผังอาคารสถานที่"
              className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[500px]"
            />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <span className="inline-block rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm">
                Master Plan
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">
                แผนผังรวมวิทยาลัย
              </h3>
            </div>
          </motion.div>

          {/* Gallery Grid (Clickable) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ImageItem.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                layoutId={`gallery-img-${index}`}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-neutral-800"
                onClick={() => setSelectedImage(item.img)}
              >
                {/* Overlay on Hover */}
                <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                {/* Zoom Icon */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md shadow-lg transform scale-75 transition-transform duration-300 group-hover:scale-100">
                    <ZoomInOutlined className="text-2xl text-white drop-shadow-md" />
                  </div>
                </div>

                <Image
                  src={item.img}
                  alt={`Facility ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  removeWrapper
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- Lightbox Modal (Full Screen) --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)} // Click background to close
          >
            {/* Close Button */}
            <button
              className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none"
              onClick={() => setSelectedImage(null)}
            >
              <CloseOutlined className="text-2xl" />
            </button>

            {/* Enlarged Image */}
            <motion.img
              src={selectedImage}
              alt="Full screen view"
              className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Click image does NOT close
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

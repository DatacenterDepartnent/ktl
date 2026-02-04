"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ReadOutlined,
  CloudDownloadOutlined,
  HomeOutlined,
  RightOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

// --- Data Configuration: แยกตาม 3 Folder ---
const courseGroups = [
  {
    id: "group-1",
    title: "หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2562 (ปวช. 62)",
    docs: [
      {
        id: 101,
        title: "3.โครงสร้าง_ปวช.62",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ_พุทธศักราช_2562/3.โครงสร้าง_ปวช.62.pdf",
        type: "pdf",
      },
      {
        id: 102,
        title: "3.ประกาศการใช้หลักสูตร ปวช.62",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ_พุทธศักราช_2562/3.ประกาศการใช้หลักสูตร ปวช.62.pdf",
        type: "pdf",
      },
      {
        id: 103,
        title: "3.ปวช.62 (เล่มหลักสูตร)",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ_พุทธศักราช_2562/3.ปวช.62.pdf",
        type: "pdf",
      },
      {
        id: 104,
        title: "3.หมวดวิชาเสรี ปวช.62",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ_พุทธศักราช_2562/3.หมวดวิชาเสรี ปวช.62.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "group-2",
    title: "หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567 (ปวช. 67)",
    docs: [
      {
        id: 201,
        title: "1.ตารางเทียบ ปวส 63-67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/1.ตารางเทียบ ปวส 63-67.pdf",
        type: "pdf",
      },
      {
        id: 202,
        title: "2. 67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2. 67.pdf",
        type: "pdf",
      },
      {
        id: 203,
        title: "2. คำสั่ง ปวช. 67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2. คำสั่ง ปวช. 67.pdf",
        type: "pdf",
      },
      {
        id: 204,
        title: "2. โครงสร้าง ปวช .67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2. โครงสร้าง ปวช .67.pdf",
        type: "pdf",
      },
      {
        id: 205,
        title: "2.ตารางเทียบ 62-67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2.ตารางเทียบ 62-67.pdf",
        type: "pdf",
      },
      {
        id: 206,
        title: "2.ประกาศการใช้หลักสูตร ปวช.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2.ประกาศการใช้หลักสูตร ปวช.67.pdf",
        type: "pdf",
      },
      {
        id: 207,
        title: "2.ปวช.67 (เล่มหลักสูตร)",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2.ปวช.67.pdf",
        type: "pdf",
      },
      {
        id: 208,
        title: "2.สรุป ปวช.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2.สรุป ปวช.67.pdf",
        type: "pdf",
      },
      {
        id: 209,
        title: "2.หลักสูตรปวช.67 (ฉบับเต็ม)",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพ พุทธศักราช 2567/2.หลักสูตรปวช.67.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "group-3",
    title: "หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567 (ปวส. 67)",
    docs: [
      {
        id: 301,
        title: "1 คำสั่ง ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 คำสั่ง ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 302,
        title: "1 โครงสร้าง ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 โครงสร้าง ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 303,
        title: "1 ประกาศ ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 ประกาศ ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 304,
        title: "1 ประกาศเพิ่มเติม ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 ประกาศเพิ่มเติม ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 305,
        title: "1 สรุป ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 สรุป ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 306,
        title: "1 หลักสูตร ปวส.67 (ฉบับเต็ม)",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 หลักสูตร ปวส.67.pdf",
        type: "pdf",
      },
      {
        id: 307,
        title: "1 หลักสูตร หลักการ ปวส.67",
        href: "/pdf/ฝ่ายวิชาการ/งานพัฒนาหลักสูตรฯ/ข้อมูลหลักสูตร/หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567/1 หลักสูตร หลักการ ปวส.67.pdf",
        type: "pdf",
      },
    ],
  },
];

export default function CourseInformation() {
  const containerVar: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section className="min-h-screen font-sans py-24 px-4 bg-slate-50 dark:bg-black/50">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVar}
        className="max-w-6xl mx-auto"
      >
        {/* --- Header & Breadcrumb --- */}
        <div className="mb-16 text-center">
          <motion.div variants={itemVar} className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-bold tracking-wider uppercase border border-blue-200 dark:border-blue-800">
              Academic Documents
            </span>
          </motion.div>

          <motion.h1
            variants={itemVar}
            className="text-3xl font-black text-slate-800 md:text-4xl dark:text-white mb-4"
          >
            หลักสูตร<span className="text-blue-600">การเรียนการสอน</span>
          </motion.h1>

          <motion.div
            variants={itemVar}
            className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium"
          >
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <HomeOutlined /> Home
            </Link>
            <RightOutlined className="text-xs opacity-50" />
            <Link
              href="/academic"
              className="hover:text-blue-600 transition-colors"
            >
              Academic
            </Link>
            <RightOutlined className="text-xs opacity-50" />
            <span className="text-slate-800 dark:text-slate-200">
              Curriculum
            </span>
          </motion.div>
        </div>

        {/* --- Loop Render Groups --- */}
        <div className="space-y-16">
          {courseGroups.map((group) => (
            <div key={group.id}>
              {/* Group Title */}
              <motion.div
                variants={itemVar}
                className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <FolderOpenOutlined className="text-xl" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                  {group.title}
                </h2>
              </motion.div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.docs.map((doc) => (
                  <motion.div key={doc.id} variants={itemVar}>
                    <Link
                      href={doc.href}
                      target="_blank"
                      className="group block h-full"
                    >
                      <div className="relative h-full bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 flex flex-col">
                        <div className="flex items-start gap-4 mb-3">
                          {/* Icon Box */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <ReadOutlined />
                          </div>
                          {/* Title */}
                          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors leading-relaxed">
                            {doc.title}
                          </h3>
                        </div>

                        {/* Footer (Type & Download) */}
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                          <span className="uppercase tracking-wide text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {doc.type}
                          </span>
                          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                            <CloudDownloadOutlined /> Download
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

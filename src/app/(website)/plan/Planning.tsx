"use client";

import React from "react";
import { Image } from "@heroui/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { motion } from "framer-motion";
import { Data } from "./data";
import {
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

export default function Planning() {
  // Animation Variants
  const containerVar = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVar = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className=" bg-slate-50 font-sans text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
      <div className="container mx-auto max-w-7xl px-4">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <ProjectOutlined /> Planning & Cooperation
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl leading-tight">
            ฝ่าย
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              แผนงานและความร่วมมือ
            </span>
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-blue-500" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            มุ่งเน้นการวางแผนพัฒนาสถานศึกษาและสร้างเครือข่ายความร่วมมืออย่างยั่งยืน
          </p>
        </motion.div>

        {/* --- Main Content --- */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* 1. รองผู้อำนวยการ (Head of Department) */}
          <motion.div variants={itemVar} className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 rounded-[24px] bg-gradient-to-r from-blue-600 to-teal-600 opacity-30 blur-xl transition duration-1000 group-hover:opacity-100"></div>
              <BackgroundGradient className="relative rounded-[22px] bg-white p-6 shadow-xl dark:bg-zinc-900">
                <div className="flex flex-col items-center text-center">
                  {/* Image */}
                  <div className="mb-6 overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <Image
                      src="/images/ผู้บริหาร/3.webp"
                      alt="นายสมศักดิ์ จันทานิตย์"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      width={300}
                    />
                  </div>

                  {/* Info */}
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    นายสมศักดิ์ จันทานิตย์
                  </h2>
                  <p className="mt-2 text-base font-semibold text-blue-600 dark:text-blue-400">
                    รองผู้อำนวยการฝ่ายแผนงานและความร่วมมือ
                  </p>

                  {/* Badge */}
                  <div className="mt-6 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 dark:bg-zinc-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                      <UserOutlined />
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Deputy Director
                    </span>
                  </div>
                </div>
              </BackgroundGradient>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVar} className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-4 text-sm font-medium text-slate-500 dark:bg-neutral-950">
                <TeamOutlined className="mr-2" /> บุคลากรในสังกัด
              </span>
            </div>
          </motion.div>

          {/* 2. Personnel Grid (Data Map) */}
          <motion.div
            variants={itemVar}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Data.map((item, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="h-full">
                <BackgroundGradient className="h-full rounded-[22px] bg-white p-5 shadow-lg dark:bg-zinc-900">
                  <div className="flex h-full flex-col">
                    {/* Image */}
                    <div className="relative mb-5 overflow-hidden rounded-xl bg-slate-100">
                      <div className="aspect-[3/4] w-full">
                        <Image
                          src={item.img}
                          alt={item.title}
                          className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-110"
                          removeWrapper
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col text-center">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                        {item.title}
                      </h3>

                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {item.position}
                        </p>

                        {/* Divider Line */}
                        <div className="mx-auto my-3 h-px w-3/4 bg-slate-100 dark:bg-zinc-800"></div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                          {item.department && <p>{item.department}</p>}
                          {item.faction && (
                            <p className="font-medium text-slate-600 dark:text-slate-300">
                              {item.faction}
                            </p>
                          )}
                          {item.description && (
                            <p className="italic opacity-80">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Badge */}
                    <div className="mt-5 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:ring-zinc-700">
                        <SolutionOutlined />
                        <span>Staff Member</span>
                      </span>
                    </div>
                  </div>
                </BackgroundGradient>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

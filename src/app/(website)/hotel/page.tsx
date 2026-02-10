"use client";

import React from "react";
import { Image } from "@heroui/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { motion } from "framer-motion";
import { Data } from "./data";
import {
  CoffeeOutlined,
  CrownFilled,
  FacebookFilled,
  UserOutlined,
} from "@ant-design/icons";

export default function Hotel() {
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
    <section className="min-h-screen bg-slate-50 py-16font-sans text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
      <div className="container">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400">
            <CoffeeOutlined /> Department of Hotel Management
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            แผนกวิชา<span className="text-[#DAA520]">การโรงแรม</span>
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#DAA520]" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            ศิลปะแห่งการบริการ มาตรฐานระดับสากล
          </p>
        </motion.div>

        {/* --- Grid Content --- */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Data.map((item, index) => (
            <motion.div key={index} variants={itemVar} className="group h-full">
              <BackgroundGradient className="h-full rounded-[22px] bg-white p-5 shadow-lg transition-all hover:shadow-xl dark:bg-zinc-900">
                <div className="flex h-full flex-col">
                  {/* Image Container */}
                  <div className="relative mb-5 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                    <div className="aspect-[3/4] w-full">
                      <Image
                        src={item.img}
                        alt={item.name || "บุคลากรการโรงแรม"}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        removeWrapper
                      />
                    </div>
                    {/* Overlay Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <CrownFilled className="text-3xl text-white drop-shadow-md" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col text-center">
                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                      {item.name}
                    </h3>

                    <p className="mb-3 mt-1 text-sm font-semibold text-[#DAA520]">
                      {item.position}
                    </p>

                    <div className="mx-auto mb-3 h-px w-full bg-slate-100 dark:bg-zinc-800"></div>

                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.department && (
                        <p className="flex items-center justify-center gap-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            แผนก:
                          </span>{" "}
                          {item.department}
                        </p>
                      )}
                      {item.faction && <p>{item.faction}</p>}
                      {item.description && (
                        <p className="italic opacity-80">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Footer Badge */}
                  <div className="mt-5 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
                      <UserOutlined />
                      <span>Hotel Management</span>
                    </span>
                  </div>
                </div>
              </BackgroundGradient>
            </motion.div>
          ))}
        </motion.div>

        {/* --- Social Media Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col items-center border-t border-slate-200 pt-10 dark:border-zinc-800"
        >
          <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <FacebookFilled className="text-blue-600" /> ติดตามข่าวสารแผนก
          </h3>
          <div className="w-full max-w-[340px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100065239134417&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="340"
              height="500"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="w-full"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

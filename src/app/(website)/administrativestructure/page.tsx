"use client";

import React from "react";
import { Image } from "@heroui/image";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Data, Data1, Data2, Data3, Data4 } from "./data";
import { TeamOutlined, IdcardOutlined } from "@ant-design/icons";

// --- 1. Person Card (Director & Deputy) - แบบแนวตั้ง การ์ดใหญ่ ---
const LeaderCard = ({
  img,
  name,
  position,
  isDirector = false,
  colorClass = "bg-blue-500",
}: {
  img: string;
  name: string;
  position: string;
  isDirector?: boolean;
  colorClass?: string;
}) => {
  return (
    <div
      className={`relative flex flex-col items-center ${isDirector ? "z-20 scale-110" : "z-10"}`}
    >
      <div
        className={`relative w-64 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-zinc-900 
        ${isDirector ? "border-2 border-yellow-400" : "border border-slate-200 dark:border-zinc-800"}`}
      >
        {/* Header Color Strip */}
        <div
          className={`h-2 w-full ${isDirector ? "bg-yellow-400" : colorClass}`}
        ></div>

        <div className="p-4 text-center">
          <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full border-4 border-slate-50 shadow-sm dark:border-zinc-800">
            <Image
              src={img}
              alt={name}
              className="h-full w-full object-cover"
              removeWrapper
            />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {name}
          </h3>
          <p
            className={`text-sm font-medium ${isDirector ? "text-yellow-600" : "text-slate-500"} dark:text-slate-400`}
          >
            {position}
          </p>
        </div>
      </div>
      {/* จุดเชื่อมต่อด้านล่าง */}
      <div className="absolute -bottom-6 left-1/2 h-6 w-0.5 bg-slate-300 dark:bg-zinc-700"></div>
    </div>
  );
};

// --- 2. Staff Card - แบบแนวนอน (Horizontal) เพื่อประหยัดพื้นที่แนวตั้ง ---
const StaffCard = ({
  img,
  name,
  position,
  details,
}: {
  img: string;
  name: string;
  position?: string;
  details?: string[];
}) => {
  return (
    <div className="relative flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
      {/* รูปภาพด้านซ้าย */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={img}
          alt={name}
          className="h-full w-full object-cover"
          removeWrapper
        />
      </div>

      {/* ข้อความด้านขวา */}
      <div className="flex flex-col text-left">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
          {name}
        </h4>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {position}
        </p>
        {details && (
          <p className="text-[10px] text-slate-400 line-clamp-1">
            {details.join(", ")}
          </p>
        )}
      </div>

      {/* เส้นเชื่อมด้านซ้าย (Tree Branch) */}
      <div className="absolute -left-6 top-1/2 h-0.5 w-6 bg-slate-300 dark:bg-zinc-700"></div>
    </div>
  );
};

// --- 3. Department Section ---
const DepartmentColumn = ({
  title,
  head,
  staff,
  colorClass,
}: {
  title: string;
  head: { name: string; img: string; position: string };
  staff: any[];
  colorClass: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* เส้นแนวตั้งด้านบน เชื่อมกับเส้นหลัก */}
      <div className="h-8 w-0.5 bg-slate-300 dark:bg-zinc-700"></div>

      {/* หัวหน้าฝ่าย (Deputy) */}
      <LeaderCard
        img={head.img}
        name={head.name}
        position={head.position}
        colorClass={colorClass}
      />

      {/* Staff List Area */}
      <div className="relative mt-6 w-full pl-8 pr-2">
        {/* เส้นแกนหลักแนวตั้งของ Staff (Spine) */}
        <div className="absolute left-0 top-0 h-[calc(100%-30px)] w-0.5 bg-slate-300 dark:bg-zinc-700 ml-[calc(50%-1px)] lg:ml-0 lg:left-8"></div>

        <div className="flex flex-col gap-4">
          {staff.map((item, index) => (
            <div key={index} className="relative">
              {/* Desktop: เส้นโค้งเข้าหาการ์ด */}
              <div className="absolute -left-8 top-1/2 h-0.5 w-8 bg-slate-300 dark:bg-zinc-700 hidden lg:block"></div>
              {/* Mobile: ซ่อนเส้นนี้แล้วใช้เส้นใน Card แทน */}

              <StaffCard
                img={item.img}
                name={item.title}
                position={item.position}
                details={[item.department]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AdministrativeStructure() {
  return (
    <section className="min-h-screen overflow-x-hidden bg-slate-50 py-20 font-sans text-slate-800 dark:bg-zinc-950 dark:text-slate-200">
      <div className="container mx-auto px-4 lg:px-8">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300">
            <TeamOutlined /> Organization Chart
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            โครงสร้าง
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              การบริหารงาน
            </span>
          </h1>
        </motion.div>

        {/* ================= TREE CHART START ================= */}
        <div className="flex flex-col items-center">
          {/* 1. ผู้อำนวยการ (Director) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="relative z-10 mb-8"
          >
            <LeaderCard
              img="/images/ผู้บริหาร/1.webp"
              name="นางสาวทักษิณา ชมจันทร์"
              position="ผู้อำนวยการวิทยาลัย"
              isDirector={true}
            />
          </motion.div>

          {/* Connector Junction (จุดแยก) */}
          <div className="relative mb-8 h-8 w-full max-w-6xl">
            {/* เส้นตั้งจาก ผอ. ลงมา */}
            <div className="absolute left-1/2 top-0 h-8 w-0.5 -translate-x-1/2 bg-slate-300 dark:bg-zinc-700"></div>
            {/* เส้นนอนยาวเชื่อม 4 ฝ่าย */}
            <div className="absolute bottom-0 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-slate-300 dark:border-zinc-700"></div>
          </div>

          {/* --- 2. Departments Grid (รองผู้อำนวยการ 4 ท่าน) --- */}
          <div className="grid w-full max-w-[1600px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <DepartmentColumn
              title="ฝ่ายบริหารทรัพยากร"
              head={{
                name: "นางสาวภวิกา โพธิ์ขาว",
                img: "/images/ผู้บริหาร/5.webp",
                position: "รองผู้อำนวยการ",
              }}
              staff={Data3}
              colorClass="bg-emerald-500"
            />

            <DepartmentColumn
              title="ฝ่ายแผนงานฯ"
              head={{
                name: "นายสมศักดิ์ จันทานิตย์",
                img: "/images/ผู้บริหาร/3.webp",
                position: "รองผู้อำนวยการ",
              }}
              staff={Data2}
              colorClass="bg-blue-500"
            />

            <DepartmentColumn
              title="ฝ่ายพัฒนากิจการฯ"
              head={{
                name: "นางสาววิภาวรรณ สีแดด",
                img: "/images/ผู้บริหาร/2.webp",
                position: "รองผู้อำนวยการ",
              }}
              staff={Data1}
              colorClass="bg-rose-500"
            />

            <DepartmentColumn
              title="ฝ่ายวิชาการ"
              head={{
                name: "นายอาทร ศรีมะณี",
                img: "/images/ผู้บริหาร/4.webp",
                position: "รองผู้อำนวยการ",
              }}
              staff={Data4}
              colorClass="bg-amber-500"
            />
          </div>
        </div>

        {/* คณะกรรมการ (เสริมด้านล่าง) */}
        <div className="mt-24 border-t border-slate-200 pt-12 dark:border-zinc-800">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-700 dark:text-slate-300">
            คณะกรรมการบริหารสถานศึกษา
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Data.map((item, i) => (
              <StaffCard
                key={i}
                img={item.img}
                name={item.title}
                position={item.secondary}
                details={[item.description]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";
import {
  UserOutlined,
  ToolOutlined,
  SettingOutlined,
  FireOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  BuildOutlined,
  CalculatorOutlined,
  ShopOutlined,
  LaptopOutlined,
  CoffeeOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";

// Import Components
import Mechanic from "../mechanic/page";
import Machine from "../machine/page";
import Welder from "../welder/page";
import Electricity from "../electricity/page";
import Electronics from "../electronics/page";
import Technique from "../technique/page";
import Construct from "../construct/page";
import Accounting from "../accounting/page";
import Marketing from "../marketing/page";
import Technology from "../technology/page";
import Hotel from "../hotel/page";
import Ordinary from "../ordinary/page";
import PersonnelInformation from "./PersonnelInformation";
import ExecutiveBoard from "../executiveboard/page";

// --- Helper Component: กรอบรองหลังไอคอน ---
const IconBox = ({
  colorClass,
  children,
}: {
  colorClass: string;
  children: React.ReactNode;
}) => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${colorClass}`}
  >
    {React.cloneElement(children as React.ReactElement<any>, {
      style: { fontSize: "18px" },
    })}
  </div>
);

export default function Personnel() {
  // Animation Variants
  const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVar = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Styles สำหรับ Accordion
  const itemClasses = {
    base: "mb-2 rounded-2xl py-3 border border-slate-200 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900", // ✅ ย้ายสีพื้นหลังมาตรงนี้
    title: "font-semibold  text-medium text-slate-800 dark:text-slate-100",
    trigger:
      "py-1 px-1 data-[hover=true]:bg-slate-50 dark:data-[hover=true]:bg-neutral-800 rounded-2xl flex items-center transition-colors",
    indicator: "text-medium text-slate-400 dark:text-slate-500",
    content: "text-small px-2 pb-4 dark:text-slate-300",
  };

  return (
    <section className="dark:bg-transparent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVar}
        className=""
      >
        {/* --- Header Section --- */}
        <motion.div variants={itemVar} className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <TeamOutlined className="mr-2" /> บุคลากรของเรา
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl dark:text-white">
            ข้อมูล<span className="text-[#DAA520]">บุคลากร</span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Personnel Information Directory
          </p>
        </motion.div>

        {/* --- Accordion Menu --- */}
        <motion.div variants={itemVar}>
          <Accordion
            variant="splitted"
            className="gap-3 px-0"
            itemClasses={itemClasses}
          >
            {/* 1. ผู้บริหาร */}
            <AccordionItem
              key="1"
              aria-label="Executives"
              startContent={
                <IconBox colorClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                  <UserOutlined />
                </IconBox>
              }
              title="ผู้บริหารสถานศึกษา"
            >
              <div className="py-2">
                <ExecutiveBoard />
              </div>
            </AccordionItem>

            {/* 2. ช่างยนต์ */}
            <AccordionItem
              key="2"
              aria-label="Mechanic"
              startContent={
                <IconBox colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <ToolOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างยนต์"
            >
              <Mechanic />
            </AccordionItem>

            {/* 3. ช่างกล */}
            <AccordionItem
              key="3"
              aria-label="Machine"
              startContent={
                <IconBox colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <SettingOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างกลโรงงาน"
            >
              <Machine />
            </AccordionItem>

            {/* 4. ช่างเชื่อม */}
            <AccordionItem
              key="4"
              aria-label="Welder"
              startContent={
                <IconBox colorClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                  <FireOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างเชื่อมโลหะ"
            >
              <Welder />
            </AccordionItem>

            {/* 5. ไฟฟ้า */}
            <AccordionItem
              key="5"
              aria-label="Electricity"
              startContent={
                <IconBox colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  <ThunderboltOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างไฟฟ้ากำลัง"
            >
              <Electricity />
            </AccordionItem>

            {/* 6. อิเล็กทรอนิกส์ */}
            <AccordionItem
              key="6"
              aria-label="Electronics"
              startContent={
                <IconBox colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <WifiOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างอิเล็กทรอนิกส์"
            >
              <Electronics />
            </AccordionItem>

            {/* 7. เทคนิคพื้นฐาน */}
            <AccordionItem
              key="7"
              aria-label="Technique"
              startContent={
                <IconBox colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <ToolOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างเทคนิคพื้นฐาน"
            >
              <Technique />
            </AccordionItem>

            {/* 8. ก่อสร้าง */}
            <AccordionItem
              key="8"
              aria-label="Construct"
              startContent={
                <IconBox colorClass="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  <BuildOutlined />
                </IconBox>
              }
              title="แผนกวิชาช่างก่อสร้าง"
            >
              <Construct />
            </AccordionItem>

            {/* 9. บัญชี */}
            <AccordionItem
              key="9"
              aria-label="Accounting"
              startContent={
                <IconBox colorClass="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400">
                  <CalculatorOutlined />
                </IconBox>
              }
              title="แผนกวิชาการบัญชี"
            >
              <Accounting />
            </AccordionItem>

            {/* 10. การตลาด */}
            <AccordionItem
              key="10"
              aria-label="Marketing"
              startContent={
                <IconBox colorClass="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                  <ShopOutlined />
                </IconBox>
              }
              title="แผนกวิชาการตลาด"
            >
              <Marketing />
            </AccordionItem>

            {/* 11. เทคโนโลยี */}
            <AccordionItem
              key="11"
              aria-label="Technology"
              startContent={
                <IconBox colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <LaptopOutlined />
                </IconBox>
              }
              title="แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล"
            >
              <Technology />
            </AccordionItem>

            {/* 12. โรงแรม */}
            <AccordionItem
              key="12"
              aria-label="Hotel"
              startContent={
                <IconBox colorClass="bg-red-50 text-[#8D6E63] dark:bg-red-900/20 dark:text-[#A1887F]">
                  <CoffeeOutlined />
                </IconBox>
              }
              title="แผนกวิชาการโรงแรม"
            >
              <Hotel />
            </AccordionItem>

            {/* 13. สามัญ */}
            <AccordionItem
              key="13"
              aria-label="Ordinary"
              startContent={
                <IconBox colorClass="bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                  <ReadOutlined />
                </IconBox>
              }
              title="แผนกวิชาสามัญสัมพันธ์"
            >
              <Ordinary />
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* --- Additional Info Section --- */}
        <motion.div variants={itemVar} className="mt-16">
          <PersonnelInformation />
        </motion.div>
      </motion.div>
    </section>
  );
}

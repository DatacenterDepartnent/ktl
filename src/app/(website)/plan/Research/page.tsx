"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  DownloadOutlined,
  ExperimentOutlined, // เปลี่ยนไอคอนให้เข้ากับงานวิจัย
  FileTextOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

// ข้อมูลงานวิจัย (ตามที่คุณระบุ)
const ResearchData = [
  {
    year: "2567",
    title: "รวมเล่มโครงงาน ปีการศึกษา 2567", // ปรับชื่อให้ดูเป็นทางการขึ้นเล็กน้อย หรือใช้ "โครงงาน67" ตามเดิมก็ได้
    file: "/pdf/งานวิจัย/โครงงาน67.pdf",
  },
  {
    year: "2566",
    title: "รวมเล่มโครงงาน ปีการศึกษา 2566",
    file: "/pdf/งานวิจัย/โครงงาน66.pdf",
  },
];

export default function ResearchPage() {
  // Animation Styles
  const containerVar = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const itemClasses = {
    base: "py-0 w-full mb-4",
    title: "font-semibold text-base text-slate-800 dark:text-slate-100",
    subtitle: "text-xs text-slate-400",
    trigger:
      "px-6 py-4 bg-white dark:bg-neutral-900 data-[hover=true]:bg-slate-50 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-all",
    indicator: "text-medium text-slate-400",
    content:
      "text-small px-4 pb-6 bg-white dark:bg-neutral-900 rounded-b-2xl border-x border-b border-slate-100 dark:border-neutral-800 -mt-2 pt-6",
  };

  return (
    <section className="min-h-screen py-12 bg-slate-50/50 dark:bg-black">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVar}
        className="container mx-auto max-w-5xl px-4 md:px-8"
      >
        {/* --- Header Section --- */}
        <div className="mb-12 text-center">
          {/* Badge: งานวิจัย */}
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <ExperimentOutlined className="mr-2" /> งานวิจัยและนวัตกรรม
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl dark:text-white">
            ผลงาน<span className="text-[#DAA520]">วิจัยและสิ่งประดิษฐ์</span>
          </h1>
          <div className="mt-2 text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Research and Innovation Projects
          </div>
        </div>

        {/* --- Accordion Content --- */}
        <Accordion
          variant="splitted"
          itemClasses={itemClasses}
          className="px-0"
        >
          {ResearchData.map((item) => (
            <AccordionItem
              key={item.year}
              aria-label={item.title}
              title={item.title}
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20">
                  <ProjectOutlined className="text-xl" />
                </div>
              }
              subtitle={`ปีการศึกษา ${item.year}`}
            >
              <div className="flex flex-col gap-4">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <FileTextOutlined />
                    <span className="text-sm">เอกสารฉบับเต็ม</span>
                  </div>

                  {/* Link Preview Button */}
                  <LinkPreview url={item.file} className="inline-block">
                    <Button
                      href={item.file}
                      target="_blank"
                      size="sm"
                      color="primary"
                      variant="flat"
                      endContent={<DownloadOutlined />}
                      className="font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                    >
                      ดาวน์โหลด PDF
                    </Button>
                  </LinkPreview>
                </div>

                {/* PDF Preview (Iframe) */}
                <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner dark:border-neutral-700 dark:bg-neutral-800">
                  <iframe
                    className="h-[500px] w-full md:h-[600px] lg:h-[700px]"
                    src={item.file}
                    title={`PDF Viewer ${item.title}`}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

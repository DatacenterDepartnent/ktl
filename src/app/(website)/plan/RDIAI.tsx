"use client";

import { Image } from "@heroui/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExperimentOutlined,
  BulbFilled,
  FileSearchOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export default function RDIAI() {
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

  const responsibilities = [
    "พัฒนาองค์ความรู้ เทคโนโลยี นวัตกรรมและสิ่งประดิษฐ์ต่างๆ เพื่อประโยชน์ในการจัดการศึกษา การประกอบอาชีพ และประโยชน์โดยรวมของสังคม ชุมชน และท้องถิ่น",
    "วิเคราะห์ วิจัยและประเมินผลการใช้หลักสูตร ผลสัมฤทธิ์การจัดการเรียนการสอน การใช้เครื่องมือวัสดุ อุปกรณ์ ครุภัณฑ์ทางการศึกษา",
    "รวบรวมและเผยแพร่ผลการวิเคราะห์วิจัย และการประเมินผลนวัตกรรม สิ่งประดิษฐ์ รวมถึงผลงานทางวิชาการของครูและบุคลากร",
    "จัดทำปฏิทินการปฏิบัติงาน เสนอโครงการและรายงานการปฏิบัติงานตามลำดับขั้น",
    "ดูแล บำรุงรักษาและรับผิดชอบทรัพย์สินของสถานศึกษาที่ได้รับมอบหมาย",
  ];

  return (
    <section className=" bg-slate-50 py-12 font-sans text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
      <div>
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            <ExperimentOutlined /> Research & Development
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl leading-tight">
            งานวิจัย พัฒนา <br className="md:hidden" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              นวัตกรรมและสิ่งประดิษฐ์
            </span>
          </h1>

          {/* CTA Button to Research Page */}
          <div className="mt-8 flex justify-center">
            <Link href="/plan/Research">
              <button className="group relative px-4 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 py-3 font-medium text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50">
                <FileSearchOutlined />
                <span>ดูฐานข้อมูลงานวิจัย (SAR)</span>
                <ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-12 lg:grid-cols-2"
        >
          {/* Left Column: Image & Personnel */}
          <motion.div variants={itemVar} className="space-y-8">
            <div className="overflow-hidden rounded-3xl shadow-xl shadow-indigo-100/50 dark:bg-zinc-900 dark:shadow-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/บุคลากร/แผน/งานวิจัยพัฒนานวัตกรรมและสิ่งประดิษฐ์.webp"
                  alt="หัวหน้างานวิจัย"
                  className="h-full w-full object-cover"
                  removeWrapper
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-xl font-bold text-white">
                    หัวหน้างานวิจัยฯ
                  </h3>
                </div>
              </div>
            </div>

            <div className="">
              <div className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <TeamOutlined className="text-xl" />
                <span className="font-bold">บุคลากรในสังกัด</span>
              </div>
              <div className=" ">
                <Image
                  src="/images/บุคลากร/แผน/2.webp"
                  alt="บุคลากรงานวิจัย"
                  className="h-full w-full  "
                  removeWrapper
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Responsibilities */}
          <motion.div variants={itemVar}>
            <div className=" ">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <BulbFilled className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  ขอบข่ายหน้าที่และความรับผิดชอบ
                </h2>
              </div>

              <div className="space-y-4">
                {responsibilities.map((text, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex gap-4 rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:border-indigo-100 hover:bg-indigo-50/30 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-indigo-900"
                  >
                    <div className="shrink-0 pt-1">
                      <CheckCircleFilled className="text-lg text-indigo-500" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

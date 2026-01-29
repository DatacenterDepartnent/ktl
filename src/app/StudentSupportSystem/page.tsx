"use client";

import { motion } from "framer-motion";
import {
  TeamOutlined,
  HeartFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const StudentSupportSystem = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto dark:bg-transparent">
      <div className=" lg:px-20">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          {/* Badge: ปรับพื้นหลังให้เข้มขึ้นและตัวหนังสือสว่างขึ้นใน dark mode */}
          <span className="mb-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:bg-red-900/30 dark:text-red-300">
            Student Care & Support
          </span>

          {/* Heading: สีขาวใน dark mode */}
          <h2 className="text-3xl font-extrabold text-black md:text-4xl dark:text-white">
            ระบบดูแลช่วยเหลือ{" "}
            <span className="text-red-500 dark:text-red-400">&</span>{" "}
            คุ้มครองนักเรียน
          </h2>

          {/* Description: สีเทาอ่อนใน dark mode */}
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            ระบบสารสนเทศเพื่อการคัดกรอง เยี่ยมบ้าน และติดตามดูแลนักเรียนรายบุคคล
            เพื่อความเสมอภาคและโอกาสทางการศึกษา
          </p>
        </motion.div>

        {/* --- Content (Single Highlight Card) --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="https://kruboom.com/student/"
            target="_blank"
            className="group block w-full max-w-lg"
          >
            {/* Card Styling:
               - bg-white -> dark:bg-zinc-900
               - border-slate-200 -> dark:border-zinc-800
               - shadow -> dark:shadow-none (หรือปรับสีเงา)
            */}
            <article className="relative flex h-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-200 hover:shadow-2xl hover:shadow-red-500/15 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-500/30 dark:hover:shadow-red-900/20">
              {/* Decorative Icon Background (Glow Effect) */}
              {/* ปรับสีให้เข้มและโปร่งแสงมากขึ้นใน dark mode */}
              <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-red-50 opacity-50 blur-3xl transition-opacity group-hover:opacity-100 dark:bg-red-900/20 dark:opacity-20" />
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full bg-orange-50 opacity-50 blur-2xl transition-opacity group-hover:opacity-100 dark:bg-orange-900/20 dark:opacity-20" />

              <div className="relative mb-8">
                {/* Main Icon Wrapper */}
                {/* ปรับ Gradient ให้เป็นสีเทาเข้มใน dark mode เพื่อให้ไอคอนเด้งขึ้นมา */}
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-800">
                  <TeamOutlined className="text-5xl text-red-500 dark:text-red-400" />
                </div>

                {/* Sub Icon (Badge) */}
                <div className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-red-400">
                  <HeartFilled />
                </div>
              </div>

              {/* Title Card */}
              <h3 className="mb-3 text-2xl font-bold text-slate-800 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                เข้าสู่ระบบดูแลผู้เรียน
              </h3>

              <p className="mb-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                บันทึกข้อมูลการเยี่ยมบ้าน การคัดกรองความเสี่ยง <br />
                และรายงานผลการดำเนินงานรายบุคคล
              </p>

              {/* Button UI within Card */}
              {/* ปรับสีปุ่มปกติให้เข้มขึ้นใน dark mode */}
              <div className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-50 px-6 py-3 text-sm font-bold text-slate-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-500/30 dark:bg-zinc-800 dark:text-slate-300 dark:group-hover:bg-red-600 dark:group-hover:text-white">
                <span>Access System</span>
                <ArrowRightOutlined />
              </div>
            </article>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentSupportSystem;

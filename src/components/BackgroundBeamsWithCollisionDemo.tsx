"use client";
import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Image from "next/image"; 
import { motion } from "framer-motion";
import { LinkPreview } from "./ui/link-preview";

export default function BackgroundBeamsWithCollisionDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="py-24"
    >
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-12 max-w-7xl mx-auto px-4">
        {/* --- Item 1: รูปภาพ + ข้อความ --- */}
        <GridItem
          area="md:col-span-12"
          // ✅ นำข้อความกลับมาใส่ตรงนี้ครับ
          title={
            <div className="pt-6 text-xl md:text-2xl font-bold">
              ๒๔ ตุลาคม ๒๕๖๘
            </div>
          }
          description={
            <div className="pt-2 pb-6 leading-relaxed">
              สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ
              <br />
              พระบรมราชชนนีพันปีหลวง เสด็จสวรรคต
              <br />
              ธ สถิตในดวงใจไทยนิรันดร์
              <br />
              ด้วยเกล้าด้วยกระหม่อมขอเดชะ ข้าพระพุทธเจ้า
              <br />
              คณะผู้บริหาร ครู บุคลากรทางการศึกษา เเละนักเรียน นักศึกษา <br />
              วิทยาลัยเทคนิคกันทรลักษ์
            </div>
          }
          image={
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/wallpaper/1.webp"
                alt="สมเด็จพระนางเจ้าสิริกิติ์"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
                unoptimized // ไม้ตาย: แก้ภาพจาง/ภาพหาย
              />
            </div>
          }
        />

        {/* --- Item 2: Link Preview --- */}
        <GridItem
          area="md:col-span-12"
          title={null}
          description={null}
          image={
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
              <LinkPreview url="https://ktltc.vercel.app/news/69892ed2e016a8b49ffc9974">
                <Image
                  src="/wallpaper/2.webp"
                  alt="ข่าวประชาสัมพันธ์"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </LinkPreview>
            </div>
          }
        />
      </ul>
    </motion.div>
  );
}

// --- Component ย่อย (ไม่ต้องแก้) ---

interface GridItemProps {
  area: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  image: React.ReactNode;
}

const GridItem = ({ area, image, title, description }: GridItemProps) => {
  return (
    <li className={`list-none min-h-[10rem] ${area}`}>
      <div className="relative h-full rounded-3xl  ">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex flex-col justify-center items-center h-full m-4">
          {/* ส่วนรูปภาพ */}
          <div className="w-full">{image}</div>

          {/* ส่วนข้อความ (แสดงผลเพราะเราส่งค่าเข้าไปแล้ว) */}
          {(title || description) && (
            <div className="space-y-3 text-center mt-4">
              {title && (
                <h3 className="font-sans text-xl font-semibold md:text-2xl">
                  {title}
                </h3>
              )}
              {description && (
                <div className="font-sans text-sm md:text-base">
                  {description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

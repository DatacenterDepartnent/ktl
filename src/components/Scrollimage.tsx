"use client";

import React from "react";
import { Carousel, ConfigProvider } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";

const slides = [
  "/images/ปก/19.webp",
  "/images/ปก/17.webp",
  "/images/ปก/18.webp",
  "/images/ปก/8.webp",
  "/images/ปก/1.webp",
  "/images/ปก/2.webp",
];

const Scrollimage: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            dotActiveWidth: 30,
            dotWidth: 8,
            dotHeight: 4,
          },
        },
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        // ปรับความกว้างและระยะห่างให้ดูเป็นระเบียบ
        className="relative w-full max-w-7xl mx-auto mt-4 mb-8 px-4 overflow-hidden"
      >
        <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200/50 bg-slate-100">
          <Carousel
            arrows
            infinite
            autoplay
            autoplaySpeed={5000}
            effect="fade"
            className="group custom-carousel-fix"
          >
            {slides.map((src, index) => (
              <div
                key={index}
                // ✅ แก้ไข: บังคับสัดส่วนเป็นแนวนอน 16:9 เสมอ ไม่ใช้ vh แล้ว
                className="relative aspect-video w-full"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />

                <div className="absolute bottom-8 left-8 z-20 text-white hidden md:block">
                  <h2 className="text-2xl font-bold tracking-tight uppercase opacity-90">
                    Kantharalak Technical College
                  </h2>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <style jsx global>{`
          /* 1. จัดตำแหน่งชุดจุด (Dots) */
          .custom-carousel-fix .slick-dots {
            bottom: 20px !important;
          }

          /* 2. ปรับแต่งปุ่มลูกศร (พื้นหลังวงกลม) */
          .custom-carousel-fix .slick-prev,
          .custom-carousel-fix .slick-next {
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 48px !important;
            height: 48px !important;
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 50% !important;
            z-index: 30 !important;

            /* ใช้ Flexbox บังคับกึ่งกลาง */
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* 3. ล้างค่าเดิมของ Ant Design ทิ้งทั้งหมด */
          .custom-carousel-fix .slick-prev::after,
          .custom-carousel-fix .slick-next::after {
            content: "" !important; /* ลบตัวอักษร ‹ › ออก */
            position: static !important;
            display: block !important;
            width: 12px !important; /* ขนาดความกว้างของลูกศร */
            height: 12px !important; /* ขนาดความสูงของลูกศร */
            border-top: 3px solid white !important; /* ความหนาของเส้น */
            border-right: 3px solid white !important;
            background: transparent !important;
            transform: none !important;
            margin: 0 !important;
          }

          /* 4. วาดทิศทางลูกศรใหม่ให้กึ่งกลางเป๊ะ */
          .custom-carousel-fix .slick-prev::after {
            transform: rotate(-135deg) !important; /* หมุนไปทางซ้าย */
            margin-left: 4px !important; /* ชดเชยน้ำหนักสายตาให้ดูบาลานซ์ */
          }

          .custom-carousel-fix .slick-next::after {
            transform: rotate(45deg) !important; /* หมุนไปทางขวา */
            margin-right: 4px !important; /* ชดเชยน้ำหนักสายตาให้ดูบาลานซ์ */
          }

          /* ปรับตำแหน่งปุ่มเมื่อ Hover */
          .custom-carousel-fix.group:hover .slick-prev {
            left: 20px;
            opacity: 1;
          }
          .custom-carousel-fix.group:hover .slick-next {
            right: 20px;
            opacity: 1;
          }

          /* Hover State ของปุ่ม */
          .custom-carousel-fix .slick-prev:hover,
          .custom-carousel-fix .slick-next:hover {
            background: #2563eb !important; /* Blue-600 */
            border-color: #2563eb !important;
            transform: translateY(-50%) scale(1.1) !important;
          }

          /* ซ่อนในมือถือ */
          @media (max-width: 768px) {
            .custom-carousel-fix .slick-prev,
            .custom-carousel-fix .slick-next {
              display: none !important;
            }
          }
        `}</style>
      </motion.section>
    </ConfigProvider>
  );
};

export default Scrollimage;

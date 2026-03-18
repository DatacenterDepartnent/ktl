"use client";

import React, { useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function BackgroundBeamsWithCollisionDemo({
  data,
}: {
  data: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || !data.imageUrl) return null;

  const hasContent = data.title || data.description;

  return (
    <BackgroundBeamsWithCollision className="relative w-full max-w-4xl mx-auto rounded-3xl my-2 overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex flex-col w-full">
        {/* 1. ส่วนรูปภาพ (อยู่ด้านบน) */}
        <div className="relative w-full overflow-hidden">
          <img
            src={data.imageUrl}
            alt={data.title || "Poster"}
            className="w-full h-auto block object-cover"
          />
        </div>

        {/* 2. ส่วนเนื้อหา (อยู่ด้านล่างรูป ไม่ทับกัน) */}
        {hasContent && (
          <div className="relative z-20 p-6 md:p-8 flex flex-col gap-3">
            {data.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
                {data.title}
              </h2>
            )}

            {data.description && (
              <div className="flex flex-col gap-3">
                <p
                  className={`text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed transition-all duration-500 ${
                    !isExpanded ? "line-clamp-2" : ""
                  }`}
                >
                  {data.description}
                </p>

                {/* ปุ่มอ่านเพิ่มเติม */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline w-fit transition-all"
                >
                  <span>{isExpanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม..."}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* เส้นตกแต่งด้านล่าง */}
            <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
          </div>
        )}
      </div>

      {/* Beams Effect จะยังคงแสดงอยู่พื้นหลังของทั้ง Card */}
    </BackgroundBeamsWithCollision>
  );
}

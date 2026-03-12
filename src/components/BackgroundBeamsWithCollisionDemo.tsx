import React from "react";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function BackgroundBeamsWithCollisionDemo({
  data,
}: {
  data: any;
}) {
  if (!data || !data.imageUrl) return null;

  const hasContent = data.title || data.description;

  return (
    <BackgroundBeamsWithCollision className="relative w-full max-w-4xl mx-auto rounded-3xl my-2  ">
      {/* Container สำหรับรูปภาพ - ใช้เป็น Relative เพื่อให้ความสูงยืดตามภาพได้ */}
      <div className="relative w-full z-0">
        <img
          src={data.imageUrl}
          alt={data.title || "Poster"}
          className="w-full h-auto block" // w-full และ h-auto จะรักษา Aspect Ratio เดิมของภาพไว้
        />

        {/* Overlay เฉพาะเมื่อมีข้อความ */}
        {hasContent && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        )}
      </div>

      {/* ส่วนข้อความ (จะแสดงทับด้านล่างของรูปภาพ) */}
      {hasContent && (
        <div className=" ">
          <div className="space-y-2">
            {data.title && (
              <h2 className="text-2xl pt-6 md:text-4xl font-black leading-tight drop-shadow-md ">
                {data.title}
              </h2>
            )}
            {data.description && (
              <p className="text-base md:text-lg font-medium italic leading-relaxed drop-shadow-sm line-clamp-2">
                {data.description}
              </p>
            )}
            <div className="h-1 w-16 bg-blue-500 rounded-full mt-2"></div>
          </div>
        </div>
      )}

      {/* Beams Effect ยังคงทำงานกระจายทั่วแผ่น */}
    </BackgroundBeamsWithCollision>
  );
}

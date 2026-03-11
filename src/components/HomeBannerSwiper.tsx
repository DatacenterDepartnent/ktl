"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HomeBannerSwiper() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/banners?isActive=true")
      .then((res) => res.json())
      .then((data) => {
        setBanners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-8">
        {/* Skeleton ที่มีสัดส่วนเท่ากับแบนเนอร์จริง */}
        <div className="w-full aspect-[21/9] bg-slate-200 animate-pulse rounded-[2.5rem]" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 my-8 relative z-0 group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        // กำหนด Class ให้บังคับสัดส่วนภาพเต็ม 21:9
        className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl  aspect-[21/9] w-full"
      >
        {banners.map((banner: any, index: number) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-full ">
              {banner.linkUrl ? (
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BannerImage
                    src={banner.imageUrl}
                    alt={banner.title}
                    isFirst={index === 0} // โหลดรูปแรกด้วย Priority สูงสุด
                  />
                </a>
              ) : (
                <BannerImage
                  src={banner.imageUrl}
                  alt={banner.title}
                  isFirst={index === 0}
                />
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div className="swiper-button-prev !text-white !w-10 !h-10 !bg-black/20 hover:!bg-black/50 !rounded-full !after:text-[14px] opacity-0 group-hover:opacity-100 transition-all duration-300 ml-6"></div>
        <div className="swiper-button-next !text-white !w-10 !h-10 !bg-black/20 hover:!bg-black/50 !rounded-full !after:text-[14px] opacity-0 group-hover:opacity-100 transition-all duration-300 mr-6"></div>
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: #e11d48 !important;
          width: 20px !important;
          border-radius: 5px !important;
        }
      `}</style>
    </div>
  );
}

function BannerImage({
  src,
  alt,
  isFirst,
}: {
  src: string;
  alt: string;
  isFirst: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill // สำคัญ: ทำให้รูปขยายเต็ม Container
        priority // สำคัญ: ทำให้โหลดเร็วขึ้นในหน้าแรก
        className="object-cover object-center" // สำคัญ: ทำให้รูปไม่เบี้ยวและเต็มกรอบ
        sizes="(max-width: 1280px) 100vw, 1280px"
        quality={85} // ปรับสมดุลความชัดกับขนาดไฟล์ (80-90 กำลังดี)
      />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </>
  );
}

"use client";

import { useState } from "react";
import { FiYoutube, FiChevronDown, FiPlus, FiMinus } from "react-icons/fi";

interface SocialFeed {
  _id: string;
  platform: "facebook" | "youtube";
  title: string;
  url: string;
  embedId?: string;
}

export default function SocialFeedDisplay({ feeds }: { feeds: SocialFeed[] }) {
  const youtubeFeeds = feeds.filter((f) => f.platform === "youtube");
  const facebookFeeds = feeds.filter((f) => f.platform === "facebook");

  // ✅ 1. เพิ่ม State สำหรับควบคุมการแสดงผล
  const [showAll, setShowAll] = useState(false);

  // ✅ 2. กำหนดจำนวนเริ่มต้นที่จะแสดง (เช่น 3 รายการ)
  const itemsToShow = showAll ? youtubeFeeds.length : 3;

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
        {/* Header ส่วนรับชมวิดีโอ */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-red-100 dark:shadow-none">
            <FiYoutube className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-800 dark:text-white mb-2 tracking-tight">
            รับชมวิดีโอ <span className="text-red-600">YouTube</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            คลิกที่รายการเพื่อรับชมวิดีโอกิจกรรม
          </p>
        </div>

        {/* รายการวิดีโอ */}
        <div className="space-y-4">
          {youtubeFeeds.length > 0 ? (
            // ✅ 3. ใช้ slice เพื่อตัดจำนวนรายการที่จะแสดง
            youtubeFeeds.slice(0, itemsToShow).map((feed) => (
              <details
                key={feed._id}
                className="group border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                      <FiYoutube size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                        {feed.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium mt-1">
                        Channel: KTLTC Official
                      </p>
                    </div>
                  </div>
                  <FiChevronDown
                    className="text-zinc-400 transition-transform duration-300 group-open:rotate-180"
                    size={24}
                  />
                </summary>
                <div className="p-6 pt-0 bg-zinc-50 dark:bg-zinc-800/30">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700">
                    <iframe
                      src={`https://www.youtube.com/embed/${feed.embedId}?autoplay=0`}
                      title={feed.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              </details>
            ))
          ) : (
            <p className="text-center text-zinc-400 py-10">
              ยังไม่มีวิดีโอในขณะนี้
            </p>
          )}
        </div>

        {/* ✅ 4. ปุ่มสำหรับ เปิด/ปิด ข้อมูล (จะแสดงเมื่อมีมากกว่า 3 รายการ) */}
        {youtubeFeeds.length > 3 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {showAll ? (
                <>
                  {" "}
                  <FiMinus /> แสดงน้อยลง{" "}
                </>
              ) : (
                <>
                  {" "}
                  <FiPlus /> แสดงวิดีโอทั้งหมด ({youtubeFeeds.length}){" "}
                </>
              )}
            </button>
          </div>
        )}

        {/* Facebook Section (คงเดิม) */}
        {facebookFeeds.length > 0 && (
          // ... (โค้ด Facebook เดิมของคุณ)
          <div className="mt-20">
            {/* ใส่โค้ดส่วน Facebook จากไฟล์เดิมของคุณที่นี่ */}
          </div>
        )}
      </div>
    </section>
  );
}

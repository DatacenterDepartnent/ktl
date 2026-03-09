"use client";

import { useState, useMemo } from "react"; // ✅ เพิ่ม useMemo เข้ามา
import Link from "next/link";
import Image from "next/image";
import DeleteNewsBtn from "@/components/DeleteNewsBtn";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
  author?: {
    name: string;
    image?: string;
    role?: string;
  };
}

export default function ManageNewsList({ newsList }: { newsList: NewsItem[] }) {
  const [visibleCount, setVisibleCount] = useState(12);

  // ✅ แก้ไขจุดนี้: บังคับ Sort ข้อมูลใหม่จาก 'ใหม่ไปเก่า' เสมอ
  // ป้องกันปัญหา Cache หรือ Data ไม่ยอมเรียงจากหลังบ้าน
  const sortedNews = useMemo(() => {
    return [...newsList].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // ใหม่กว่า (ค่ามิลลิวินาทีมากกว่า) จะขึ้นก่อน
    });
  }, [newsList]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // ✅ เปลี่ยนมาใช้ sortedNews แทน newsList เดิม
  const displayedNews = sortedNews.slice(0, visibleCount);

  return (
    <>
      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedNews.map((news, index) => {
          // ✅ ตรวจสอบรูปภาพจากทุก Source ที่เป็นไปได้
          const displayImage =
            news.images?.[0] || news.announcementImages?.[0] || "/no-image.png";

          const displayCategories =
            news.categories && news.categories.length > 0
              ? news.categories
              : news.category
                ? [news.category]
                : ["ไม่ระบุ"];

          // ✅ จัดการชื่อผู้เขียน (ถ้าไม่มีให้ Default เป็น 'งานศูนย์ข้อมูล')
          const authorName = news.author?.name
            ? news.author.name.split(" ")[0]
            : "งานศูนย์ข้อมูล";

          return (
            <div
              key={news._id}
              className="group border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40"
            >
              {/* Image Section */}
              <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden dark:bg-zinc-800">
                <Image
                  src={displayImage}
                  alt={news.title}
                  fill
                  priority={index < 4}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
                  {displayCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/95 backdrop-blur-sm text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm border border-blue-100 dark:bg-zinc-900/90 dark:text-blue-400 dark:border-zinc-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 text-zinc-400 dark:text-zinc-500">
                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[10px] font-bold tracking-tight">
                      {new Date(news.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-medium italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {new Date(news.createdAt).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    น.
                  </div>
                </div>

                <h3 className="text-[15px] font-extrabold text-zinc-800 mb-5 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors min-h-[3rem] dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {news.title}
                </h3>

                <div className="mb-5 flex items-center justify-between group/auth border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[130px]">
                        <span>ผู้เขียน: {authorName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-auto flex justify-between items-center gap-2 bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex gap-1">
                    <Link
                      href={`/news/${news._id}`}
                      target="_blank"
                      className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                      title="ดูหน้าเว็บ"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>

                    <Link
                      href={`/dashboard/news/edit/${news._id}`}
                      className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                      title="แก้ไข"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1"></div>

                  <DeleteNewsBtn id={news._id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleCount < sortedNews.length && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 rounded-full bg-white border border-zinc-200 text-zinc-700 font-bold shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            ดูเพิ่มเติม ({sortedNews.length - visibleCount})
          </button>
          <span className="text-xs text-zinc-400 dark:text-zinc-600">
            แสดง {displayedNews.length} จาก {sortedNews.length} รายการ
          </span>
        </div>
      )}

      {/* Not Found State */}
      {sortedNews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-200 rounded-3xl text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 dark:bg-zinc-800">
            <span className="text-3xl opacity-50">📂</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            ไม่พบรายการข่าว
          </h3>
          <p className="text-zinc-500 mt-1 dark:text-zinc-400">
            เริ่มสร้างข่าวประชาสัมพันธ์ใหม่ได้เลย
          </p>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
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
  // ✅ เพิ่มฟิลด์เหล่านี้เพื่อให้รองรับข้อมูลที่ส่งจาก Add News หน้าล่าสุด
  userName?: string;
  userImage?: string;
  // 💡 รองรับโครงสร้างเก่า (ถ้ามี)
  author?: {
    name: string;
    image?: string;
    role?: string;
  };
}

export default function ManageNewsList({ newsList }: { newsList: NewsItem[] }) {
  const [visibleCount, setVisibleCount] = useState(12);

  // บังคับ Sort ข้อมูลจาก 'ใหม่ไปเก่า'
  const sortedNews = useMemo(() => {
    return [...newsList].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [newsList]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const displayedNews = sortedNews.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedNews.map((news, index) => {
          const displayImage =
            news.images?.[0] || news.announcementImages?.[0] || "/no-image.png";

          const displayCategories =
            news.categories && news.categories.length > 0
              ? news.categories
              : news.category
                ? [news.category]
                : ["ไม่ระบุ"];

          // ✅ ตรวจสอบชื่อผู้เขียน (เช็ค userName ก่อน ถ้าไม่มีค่อยเช็ค author.name)
          const rawAuthorName =
            news.userName || news.author?.name || "งานศูนย์ข้อมูล";
          const authorName = rawAuthorName.split(" ")[0]; // เอาแค่ชื่อแรก

          // ✅ ดึงรูปโปรไฟล์ผู้เขียน
          const authorAvatar = news.userImage || news.author?.image || null;

          return (
            <div
              key={news._id}
              className="group border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white dark:bg-zinc-900 dark:border-zinc-800"
            >
              {/* Image Section */}
              <div className="relative w-full aspect-4/3 bg-zinc-100 overflow-hidden dark:bg-zinc-800">
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

                <h3 className="text-[15px] font-extrabold text-zinc-800 mb-5 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors min-h-12 dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {news.title}
                </h3>

                {/* ✅ Author Section ปรับปรุงใหม่ให้มีรูป Avatar */}
                <div className="mb-5 flex items-center justify-between border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-4">
                  <div className="flex items-center gap-2">
                    {authorAvatar ? (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <Image
                          src={authorAvatar}
                          alt={authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] dark:bg-zinc-800">
                        👤
                      </div>
                    )}
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      โดย: {authorName}
                    </span>
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

                  <div className="w-px h-10 bg-slate-100 dark:bg-zinc-800 mx-1"></div>

                  {/* ✅ แก้ไขตรงนี้: เพิ่ม prop title เพื่อให้ปุ่มลบนำไปบันทึก Log ได้ */}
                  <DeleteNewsBtn id={news._id} title={news.title} />
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
            className="px-8 py-3 rounded-full bg-white border border-zinc-200 text-zinc-700 font-bold shadow-sm hover:bg-zinc-50 transition-all active:scale-95 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200"
          >
            ดูเพิ่มเติม ({sortedNews.length - visibleCount})
          </button>
        </div>
      )}
    </>
  );
}

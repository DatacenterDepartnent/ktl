"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Configuration ---
const FILTER_CATEGORIES = [
  { value: "All", label: "ทุกหมวดหมู่" },
  { value: "PR", label: "ข่าวประชาสัมพันธ์" },
  { value: "Newsletter", label: "จดหมายข่าว" },
  { value: "Internship", label: "ฝึกประสบการณ์" },
  { value: "Announcement", label: "ข่าวประกาศ" },
  { value: "Bidding", label: "ประกวดราคา" },
  { value: "Order", label: "คำสั่งวิทยาลัย" },
];

const MONTHS = [
  { value: "All", label: "ทุกเดือน" },
  { value: "0", label: "มกราคม" },
  { value: "1", label: "กุมภาพันธ์" },
  { value: "2", label: "มีนาคม" },
  { value: "3", label: "เมษายน" },
  { value: "4", label: "พฤษภาคม" },
  { value: "5", label: "มิถุนายน" },
  { value: "6", label: "กรกฎาคม" },
  { value: "7", label: "สิงหาคม" },
  { value: "8", label: "กันยายน" },
  { value: "9", label: "ตุลาคม" },
  { value: "10", label: "พฤศจิกายน" },
  { value: "11", label: "ธันวาคม" },
];

// URL Redirect ปีเก่า
const REDIRECT_URLS: Record<string, string> = {
  "2566": "https://ktltcv1.vercel.app/pressrelease/2566",
  "2567": "https://ktltcv1.vercel.app/pressrelease/2567",
  "2568": "https://ktltcv3.vercel.app/pressrelease/2568",
};

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
}

// ✅ 1. เพิ่มฟังก์ชัน getGridClass ตามที่คุณต้องการ
function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  // ปรับให้รองรับได้ถึง 4 คอลัมน์ตามจำนวนข่าวที่มี
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

export default function NewsListClient({
  initialNews = [],
}: {
  initialNews: NewsItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  // --- Redirect Logic ---
  useEffect(() => {
    if (REDIRECT_URLS[selectedYear]) {
      const confirmMsg = `คุณเลือกดูข้อมูลปี ${selectedYear}\nระบบจะพาคุณไปยังเว็บไซต์เวอร์ชันเก่า ต้องการดำเนินการต่อหรือไม่?`;
      if (window.confirm(confirmMsg)) {
        window.open(REDIRECT_URLS[selectedYear], "_blank");
      }
      setSelectedYear("All");
    }
  }, [selectedYear]);

  // --- Filter Logic ---
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    initialNews.forEach((news) => {
      const year = new Date(news.createdAt).getFullYear() + 543;
      years.add(year.toString());
    });
    years.add("2566");
    years.add("2567");
    years.add("2568");
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [initialNews]);

  const filteredNews = useMemo(() => {
    let result = Array.isArray(initialNews) ? initialNews : [];

    if (selectedCategory !== "All") {
      result = result.filter((news) => {
        const cats = news.categories || (news.category ? [news.category] : []);
        return cats.includes(selectedCategory);
      });
    }

    if (selectedYear !== "All" && !REDIRECT_URLS[selectedYear]) {
      result = result.filter((news) => {
        const year = new Date(news.createdAt).getFullYear() + 543;
        return year.toString() === selectedYear;
      });
    }

    if (selectedMonth !== "All") {
      result = result.filter((news) => {
        const month = new Date(news.createdAt).getMonth();
        return month.toString() === selectedMonth;
      });
    }

    return result;
  }, [initialNews, selectedCategory, selectedMonth, selectedYear]);

  const paginatedNews = filteredNews.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 12); // โหลดเพิ่มทีละ 12 (ลงตัวกับ 2, 3, 4)

  return (
    <div className="w-full">
      {/* --- Filter Section --- */}
      <div className="mb-16 bg-white/70 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] border border-slate-200/60 top-24 z-20 shadow-xl shadow-slate-200/30 dark:bg-slate-900/80 dark:border-slate-700 dark:shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Category */}
          <div className="relative group">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700"
            >
              {FILTER_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Year */}
          <div className="relative group">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700"
            >
              <option value="All">ทุกปี พ.ศ.</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  พ.ศ. {year} {REDIRECT_URLS[year] ? "🔗" : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Month */}
          <div className="relative group">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- News Grid --- */}
      {paginatedNews.length > 0 ? (
        // ✅ 2. ใช้ฟังก์ชัน getGridClass ที่นี่ เพื่อปรับ Column ตามจำนวนข่าวที่แสดง
        <div
          className={`grid gap-8 md:gap-10 ${getGridClass(paginatedNews.length)}`}
        >
          {paginatedNews.map((news) => {
            const coverImage =
              news.announcementImages?.[0] ||
              news.images?.[0] ||
              "/no-image.png";

            const displayCategories =
              news.categories && news.categories.length > 0
                ? news.categories
                : news.category
                  ? [news.category]
                  : ["General"];

            return (
              <Link
                key={news._id}
                href={`/news/${news._id}`}
                className="group flex flex-col bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container (Aspect 4:3) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <Image
                    src={coverImage}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Category Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
                    {displayCategories.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border border-slate-100 dark:border-slate-800"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Details */}
                <div className="px-6 py-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px w-10 bg-blue-600/30 group-hover:w-16 transition-all duration-700 ease-in-out dark:bg-blue-500/50"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] dark:text-slate-500">
                      {new Date(news.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-[1.35] group-hover:text-blue-600 transition-colors duration-300 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {news.title}
                  </h3>

                  <p className="mt-4 text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium opacity-70 dark:text-slate-400">
                    คลิกเพื่ออ่านรายละเอียดกิจกรรมและความเคลื่อนไหวที่เกิดขึ้นอย่างครบถ้วน...
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-all duration-300 transform group-hover:translate-x-2 dark:text-slate-300 dark:group-hover:text-blue-400">
                      อ่านบทความฉบับเต็ม
                    </span>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-500 dark:border-slate-700 dark:group-hover:bg-blue-500 dark:group-hover:border-blue-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-48 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <span className="text-5xl opacity-20">📂</span>
          </div>
          <h4 className="text-xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
            ไม่พบข้อมูลที่คุณค้นหา
          </h4>
          <p className="text-slate-400 mt-2 font-medium dark:text-slate-500">
            กรุณาลองเปลี่ยนเงื่อนไขการกรองข้อมูลใหม่
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedMonth("All");
              setSelectedYear("All");
            }}
            className="mt-8 text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors underline decoration-2 underline-offset-8 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* --- Load More --- */}
      {filteredNews.length > visibleCount && (
        <div className="flex flex-col items-center justify-center mt-24 space-y-6">
          <button
            onClick={handleLoadMore}
            className="group relative px-16 py-5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all duration-500 active:scale-95 dark:bg-slate-800 dark:hover:bg-blue-600"
          >
            Load More Stories
          </button>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] dark:text-slate-500">
            {filteredNews.length - visibleCount} เรื่องราวเพิ่มเติมในฟีด
          </p>
        </div>
      )}
    </div>
  );
}

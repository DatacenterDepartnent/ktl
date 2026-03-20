"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  authorId?: string;
  author?: {
    name: string;
  };
}

function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
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

  useEffect(() => {
    if (REDIRECT_URLS[selectedYear]) {
      const confirmMsg = `คุณเลือกดูข้อมูลปี ${selectedYear}\nระบบจะพาคุณไปยังเว็บไซต์เวอร์ชันเก่า ต้องการดำเนินการต่อหรือไม่?`;
      if (window.confirm(confirmMsg)) {
        window.open(REDIRECT_URLS[selectedYear], "_blank");
      }
      setSelectedYear("All");
    }
  }, [selectedYear]);

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
  const handleLoadMore = () => setVisibleCount((prev) => prev + 12);

  return (
    <div className="w-full">
      {/* --- Filter Section (คงเดิม) --- */}
      <div className="mb-16 bg-white/70 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] border border-slate-200/60 shadow-xl dark:bg-slate-900/80 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {FILTER_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">ทุกปี พ.ศ.</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                พ.ศ. {year} {REDIRECT_URLS[year] ? "🔗" : ""}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- News Grid --- */}
      {paginatedNews.length > 0 ? (
        <div
          className={`grid gap-8 md:gap-10 ${getGridClass(paginatedNews.length)}`}
        >
          {paginatedNews.map((news) => {
            const coverImage =
              news.announcementImages?.[0] ||
              news.images?.[0] ||
              "/no-image.png";
            return (
              <Link
                key={news._id}
                href={`/news/${news._id}`}
                className="group flex flex-col bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={coverImage}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="px-6 py-8 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center justify-between mb-5 gap-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-blue-600/30 group-hover:w-12 transition-all duration-700"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider dark:text-slate-500">
                        {/* ✅ แสดงวันที่และเวลา */}
                        {new Date(news.createdAt).toLocaleString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) + " น."}
                      </span>
                    </div>

                    {/* ✅ ส่วนแสดงชื่อผู้เขียน */}
                    {news.author?.name && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/20 transition-colors group-hover:bg-blue-100/50">
                        <svg
                          className="w-3 h-3 text-blue-500/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-[9px] font-bold text-blue-600/80 dark:text-blue-400/80 uppercase">
                          {news.author.name.split(" ")[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-[1.35] group-hover:text-blue-600 transition-colors dark:text-slate-100 dark:group-hover:text-blue-400">
                    {news.title}
                  </h3>
                  <p className="mt-4 text-slate-500 text-sm leading-relaxed line-clamp-2 opacity-70">
                    คลิกเพื่ออ่านรายละเอียดกิจกรรมและความเคลื่อนไหว...
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-all transform group-hover:translate-x-2 dark:text-slate-300">
                      อ่านบทความฉบับเต็ม
                    </span>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
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
        /* --- Empty State --- */
        <div className="py-48 text-center flex flex-col items-center">
          <span className="text-5xl opacity-20 mb-8">📂</span>
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            ไม่พบข้อมูลที่คุณค้นหา
          </h4>
        </div>
      )}
    </div>
  );
}

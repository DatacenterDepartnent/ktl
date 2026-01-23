"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// ข้อมูลหมวดหมู่
const FILTER_CATEGORIES = [
  { value: "All", label: "ทุกหมวดหมู่" },
  { value: "PR", label: "ข่าวประชาสัมพันธ์" },
  { value: "Newsletter", label: "จดหมายข่าว" },
  { value: "Internship", label: "ฝึกประสบการณ์" },
  { value: "Announcement", label: "ข่าวประกาศ" },
  { value: "Bidding", label: "ประกวดราคา" },
  { value: "Order", label: "คำสั่งวิทยาลัย" },
];

// ชื่อเดือนภาษาไทย
const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const getCategoryLabel = (val: string) => {
  const found = FILTER_CATEGORIES.find((c) => c.value === val);
  return found ? found.label : val;
};

interface NewsItem {
  _id: string;
  title: string;
  category?: string; // รองรับข้อมูลเก่า
  categories?: string[]; // ✅ รองรับข้อมูลใหม่ (Array)
  images?: string[];
  createdAt: string;
}

export default function NewsListClient({
  initialNews,
}: {
  initialNews: NewsItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State สำหรับกรอง วัน/เดือน/ปี
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  // 1. ดึงรายการ "ปี" ที่มีข่าวอยู่จริง
  const availableYears = useMemo(() => {
    const years = new Set(
      initialNews.map((news) => new Date(news.createdAt).getFullYear()),
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [initialNews]);

  // 2. ระบบกรองข่าว (Filter Logic)
  const filteredNews = useMemo(() => {
    let result = initialNews;

    // ✅ แก้ไข Logic การกรองหมวดหมู่ (สำคัญ!)
    if (selectedCategory !== "All") {
      result = result.filter((news) => {
        // 1. เช็คแบบใหม่ (Array): ถ้ามี categories และมีค่าที่เลือกอยู่ใน array นั้น
        if (news.categories && news.categories.length > 0) {
          return news.categories.includes(selectedCategory);
        }
        // 2. เช็คแบบเก่า (String): ถ้าตรงกันเป๊ะๆ (เผื่อข้อมูลเก่า)
        if (news.category) {
          return news.category === selectedCategory;
        }
        return false;
      });
    }

    // กรองคำค้นหา
    if (searchQuery) {
      result = result.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // กรองวันที่
    if (selectedDate) {
      result = result.filter((news) => {
        const newsDate = new Date(news.createdAt).toISOString().split("T")[0];
        return newsDate === selectedDate;
      });
    } else {
      if (selectedYear !== "All") {
        result = result.filter(
          (news) =>
            new Date(news.createdAt).getFullYear() === parseInt(selectedYear),
        );
      }
      if (selectedMonth !== "All") {
        result = result.filter(
          (news) =>
            new Date(news.createdAt).getMonth() === parseInt(selectedMonth),
        );
      }
    }

    return result;
  }, [
    initialNews,
    searchQuery,
    selectedCategory,
    selectedYear,
    selectedMonth,
    selectedDate,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedYear("All");
    setSelectedMonth("All");
    setSelectedDate("");
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10  text-zinc-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* --- Header Section --- */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            คลังข่าวสาร
          </h2>
          <p className="text-slate-500 mt-2">
            ค้นหาและติดตามความเคลื่อนไหวทั้งหมดของวิทยาลัย
          </p>
        </div>

        {/* --- Filter Control Section (Card Design) --- */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8 mb-12">
          {/* แถว 1: ค้นหา และ หมวดหมู่ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
            {/* Search Input */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="พิมพ์หัวข้อข่าวที่ต้องการค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-0 text-slate-900 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white transition-all sm:text-sm sm:leading-6"
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 bg-slate-50 border-0 text-slate-900 rounded-xl ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white transition-all sm:text-sm sm:leading-6 appearance-none cursor-pointer"
              >
                {FILTER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg
                  className="h-4 w-4"
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
              </div>
            </div>
          </div>

          {/* แถว 2: กรองเวลา */}
          <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
              {/* Group: ปี/เดือน */}
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedDate("");
                  }}
                  className="w-1/2 md:w-auto px-4 py-2.5 bg-slate-50 border-0 text-slate-700 rounded-lg ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                >
                  <option value="All">ทุกปี</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      พ.ศ. {year + 543}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDate("");
                  }}
                  className="w-1/2 md:w-auto px-4 py-2.5 bg-slate-50 border-0 text-slate-700 rounded-lg ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                >
                  <option value="All">ทุกเดือน</option>
                  {THAI_MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:flex items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                OR
              </div>

              {/* Date Picker */}
              <div className="w-full md:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full md:w-auto px-4 py-2.5 bg-slate-50 border-0 text-slate-700 rounded-lg ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 transition-all text-sm font-semibold w-full xl:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              ล้างตัวกรอง
            </button>
          </div>
        </div>

        {/* --- News Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((news) => {
            // ✅ เตรียมข้อมูลหมวดหมู่เพื่อแสดงผล (รองรับทั้งเก่าและใหม่)
            const displayCats =
              news.categories && news.categories.length > 0
                ? news.categories
                : news.category
                  ? [news.category]
                  : ["ทั่วไป"];

            return (
              <Link
                key={news._id}
                href={`/news/${news._id}`}
                className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={news.images?.[0] || "/no-image.png"}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* ✅ แสดง Tag หมวดหมู่ (วนลูปแสดงครบทุกอัน) */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
                    {displayCats.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/95 backdrop-blur shadow-sm text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-100"
                      >
                        {getCategoryLabel(cat)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-slate-400 text-xs font-medium">
                      {new Date(news.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-blue-600 text-sm font-bold group/btn">
                    อ่านรายละเอียด
                    <svg
                      className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- Empty State --- */}
        {filteredNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              ไม่พบข่าวที่ค้นหา
            </h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              ลองปรับเปลี่ยนคำค้นหา หรือเลือกช่วงเวลาอื่น
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              ดูข่าวทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

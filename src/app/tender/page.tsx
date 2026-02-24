import clientPromise from "@/lib/db";
import NewsListClient from "@/components/NewsListClient";
import Link from "next/link";

// Interface สำหรับข้อมูล
interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
}

async function getTenderData(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ดึงข้อมูลโดยกรองเฉพาะหมวดหมู่ "Bidding" (ประกวดราคา)
    const tenderNews = await db
      .collection("news")
      .find({
        $or: [{ category: "Bidding" }, { categories: { $in: ["Bidding"] } }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(JSON.stringify(tenderNews));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function TenderPage() {
  const tenderData = await getTenderData();

  return (
    <main className=" bg-slate-50 text-slate-800 dark:bg-transparent dark:text-slate-200 container px-4">
      <div className="">
        {/* --- Header Section (UX/UI สไตล์เดียวกับหน้าประกาศและคำสั่ง) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="space-y-2 border-l-4 border-amber-500 pl-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-xs dark:text-amber-400">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              Procurement & Bidding
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              ข่าว{" "}
              <span className="text-amber-600 dark:text-amber-500">
                ประกวดราคา
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-lg dark:text-slate-400 font-medium">
              ประกาศจัดซื้อจัดจ้าง ผลการประกวดราคา
              และเอกสารสอบราคาของวิทยาลัยเทคนิคกันทรลักษ์
            </p>
          </div>

          <Link
            href="/news?category=Bidding"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-full font-bold text-sm shadow-md shadow-amber-100 hover:bg-amber-700 transition-all hover:shadow-lg active:scale-95 group dark:shadow-none dark:bg-amber-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            ดูประกาศทั้งหมด
          </Link>
        </div>

        {/* --- Grid Content (ซ่อนแถบเมนู Filter ด้านบน) --- */}
        <div className="[&_.mb-16.bg-white\/70]:hidden [&_.mb-16.dark\:bg-slate-900\/80]:hidden">
          <NewsListClient initialNews={tenderData} />
        </div>

        {/* --- Empty State --- */}
        {tenderData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-600">
            <p className="text-lg font-semibold">
              ไม่พบข้อมูลประกาศประกวดราคาในขณะนี้
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

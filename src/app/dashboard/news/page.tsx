import clientPromise from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import DeleteNewsBtn from "@/components/DeleteNewsBtn";

interface NewsItem {
  _id: string;
  title: string;
  // ✅ แก้ type ให้รองรับทั้งแบบเก่า (string) และแบบใหม่ (string[])
  category?: string;
  categories?: string[];
  images?: string[];
  createdAt: string;
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(news));
  } catch {
    return [];
  }
}

export default async function ManageNewsPage() {
  const newsList = await getNews();

  return (
    <div className="max-w-7xl mx-auto w-full  p-8 text-zinc-800">
      {/* Header (ใช้โค้ด Responsive ที่ให้ไปก่อนหน้านี้) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            จัดการข่าวสาร
          </h1>
          <p className="text-zinc-500 mt-1 text-sm md:text-base">
            รายการข่าวประชาสัมพันธ์ทั้งหมด
          </p>
        </div>

        <Link
          href="/dashboard/news/add"
          className="w-full md:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 md:py-2.5 rounded-xl md:rounded-full font-bold hover:bg-blue-500 shadow-md shadow-blue-200 transition-all active:scale-95 text-sm md:text-base"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          เพิ่มข่าวใหม่
        </Link>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newsList.map((news) => {
          // ✅ Logic แปลงข้อมูล: รองรับทั้งระบบเก่า (category) และใหม่ (categories)
          const displayCategories =
            news.categories && news.categories.length > 0
              ? news.categories
              : news.category
                ? [news.category]
                : ["ไม่ระบุ"];

          return (
            <div
              key={news._id}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* ส่วนรูปภาพ */}
              <div className="relative w-full aspect-4/3 bg-zinc-100 overflow-hidden">
                <Image
                  src={news.images?.[0] || "/no-image.png"}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* ✅ แสดงหมวดหมู่ (Loop แสดง Tag) */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
                  {displayCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/95 backdrop-blur-sm text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm border border-blue-100"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* ส่วนเนื้อหา */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-zinc-400 text-xs font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(news.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-zinc-100">
                  <Link
                    href={`/dashboard/news/edit/${news._id}`}
                    className="flex items-center text-zinc-500 hover:text-blue-600 font-bold text-sm transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    แก้ไข
                  </Link>

                  <DeleteNewsBtn id={news._id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {newsList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-200 rounded-3xl bg-white text-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl opacity-50">📂</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-800">ไม่พบรายการข่าว</h3>
          <p className="text-zinc-500 mt-1">
            เริ่มสร้างข่าวประชาสัมพันธ์ใหม่ได้เลย
          </p>
        </div>
      )}
    </div>
  );
}

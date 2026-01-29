import clientPromise from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import DeleteNewsBtn from "@/components/DeleteNewsBtn";

export const revalidate = 0;

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[]; // ✅ เพิ่มฟิลด์นี้
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
      .project({
        title: 1,
        category: 1,
        categories: 1,
        images: 1,
        announcementImages: 1, // ✅ ดึงมาด้วยเพื่อให้เลือกใช้เป็นปกได้
        createdAt: 1,
      })
      .toArray();

    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function ManageNewsPage() {
  const newsList = await getNews();

  return (
    <div className="max-w-7xl mx-auto w-full p-4 text-zinc-800 dark:text-zinc-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight dark:text-white">
            จัดการข่าวสาร
          </h1>
          <p className="text-zinc-500 mt-1 text-sm md:text-base dark:text-zinc-400">
            รายการข่าวประชาสัมพันธ์ทั้งหมด ({newsList.length} รายการ)
          </p>
        </div>

        <Link
          href="/dashboard/news/add"
          className="w-full md:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-3 md:py-2.5 rounded-xl md:rounded-full font-bold hover:bg-blue-500 shadow-md shadow-blue-200 transition-all active:scale-95 text-sm md:text-base dark:shadow-none dark:hover:bg-blue-500"
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
        {newsList.map((news, index) => {
          // ✅ Logic เลือกรูปปก
          const displayImage =
            news.images?.[0] || news.announcementImages?.[0] || "/no-image.png";

          const displayCategories =
            news.categories && news.categories.length > 0
              ? news.categories
              : news.category
                ? [news.category]
                : ["ไม่ระบุ"];

          return (
            <div
              key={news._id}
              className="group border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40"
            >
              {/* ส่วนรูปภาพ */}
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

              {/* ส่วนเนื้อหา */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-zinc-400 text-[11px] font-medium dark:text-zinc-500">
                  <svg
                    className="w-3.5 h-3.5"
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

                <h3 className="text-base font-bold text-zinc-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors min-h-[3rem] dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {news.title}
                </h3>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={`/dashboard/news/edit/${news._id}`}
                    className="flex items-center text-zinc-500 hover:text-blue-600 font-bold text-sm transition-colors dark:text-zinc-400 dark:hover:text-blue-400"
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
    </div>
  );
}

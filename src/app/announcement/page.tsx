import clientPromise from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  content?: string;
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
}

async function getAnnouncements(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const query = {
      $or: [
        { category: "Announcement" },
        { categories: "Announcement" },
        { category: "ข่าวประกาศ" },
        { categories: "ข่าวประกาศ" },
      ],
    };

    const news = await db
      .collection("news")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

const truncateText = (text: string, length: number) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "") || "";
};

export default async function AnnouncementPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="bg-slate-50 text-slate-800 dark:bg-transparent dark:text-slate-200 container px-4">
      <div className="">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="space-y-2 border-l-4 border-red-500 pl-4">
            <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Latest Updates
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              ข่าวประกาศ <span className="text-red-500">ประชาสัมพันธ์</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-lg dark:text-slate-400">
              รวมประกาศ ข่าวสาร และคำสั่งต่างๆ ของวิทยาลัยเทคนิคกันทรลักษ์
            </p>
          </div>

          <Link
            href="/news?category=Announcement"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full font-bold text-sm shadow-md shadow-red-200 hover:bg-red-600 transition-all hover:shadow-lg active:scale-95 group dark:shadow-none dark:hover:bg-red-600"
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

        {/* --- Grid Section --- */}
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {announcements.map((news) => {
              const coverImage =
                news.announcementImages && news.announcementImages.length > 0
                  ? news.announcementImages[0]
                  : news.images && news.images.length > 0
                    ? news.images[0]
                    : "/no-image.png";

              return (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full bg-white dark:bg-slate-900 dark:border-slate-800 dark:hover:shadow-black/40"
                >
                  {/* Image Area */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-700 border border-slate-100 dark:bg-slate-900/90 dark:text-slate-300 dark:border-slate-700">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500"
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
                      {new Date(news.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <Image
                      src={coverImage}
                      alt={news.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-2">
                      <h4 className="text-red-600 text-xs font-extrabold uppercase tracking-wider mb-1 dark:text-red-500">
                        วิทยาลัยเทคนิคกันทรลักษ์
                      </h4>
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors dark:text-slate-100 dark:group-hover:text-red-400">
                        {news.title}
                      </h3>
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed dark:text-slate-400">
                      {news.content
                        ? truncateText(stripHtml(news.content), 100)
                        : "คลิกเพื่ออ่านรายละเอียดเพิ่มเติม..."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-red-500 text-sm font-bold group/btn dark:border-slate-800 dark:text-red-400">
                      อ่านประกาศ
                      <svg
                        className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1"
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-600">
            <svg
              className="w-16 h-16 mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-lg font-semibold">ยังไม่มีประกาศในขณะนี้</p>
            <p className="text-sm">โปรดรอติดตามการอัปเดตเร็วๆ นี้</p>
          </div>
        )}
      </div>
    </main>
  );
}

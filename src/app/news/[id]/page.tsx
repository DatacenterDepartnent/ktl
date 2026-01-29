import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";

import { FootTitle } from "@/components/FootTitle";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  content?: string;
  images?: string[];
  announcementImages?: string[];
  links?: { label: string; url: string }[];
  createdAt: Date | string;
}

// 1. Fetch current news detail
async function getNewsDetail(id: string): Promise<NewsItem | null> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    if (!ObjectId.isValid(id)) return null;
    const news = await db.collection("news").findOne({ _id: new ObjectId(id) });
    if (!news) return null;
    return JSON.parse(JSON.stringify(news));
  } catch {
    return null;
  }
}

// 2. Fetch adjacent news (Previous/Next)
async function getAdjacentNews(currentNews: NewsItem) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const currentId = new ObjectId(currentNews._id);
    const currentDate = new Date(currentNews.createdAt);

    const prevNews = await db
      .collection("news")
      .find({
        $or: [
          { createdAt: { $lt: currentDate } },
          { createdAt: currentDate, _id: { $lt: currentId } },
        ],
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(1)
      .project({ _id: 1, title: 1 })
      .toArray();

    const nextNews = await db
      .collection("news")
      .find({
        $or: [
          { createdAt: { $gt: currentDate } },
          { createdAt: currentDate, _id: { $gt: currentId } },
        ],
      })
      .sort({ createdAt: 1, _id: 1 })
      .limit(1)
      .project({ _id: 1, title: 1 })
      .toArray();

    return {
      prev:
        prevNews.length > 0 ? JSON.parse(JSON.stringify(prevNews[0])) : null,
      next:
        nextNews.length > 0 ? JSON.parse(JSON.stringify(nextNews[0])) : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

// ✅ ปรับ Logic Grid Class ให้เหมือนตัวอย่าง
function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"; // 2 รูป แบ่งครึ่ง
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // 3 รูป แบ่ง 3
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // 4+ รูป แบ่ง 4
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNewsDetail(id);

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-black">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4 dark:text-slate-100">
          ไม่พบข้อมูลข่าวสารที่คุณต้องการ
        </h1>
        <Link
          href="/news"
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const { prev, next } = await getAdjacentNews(news);
  const displayCategories = news.categories?.length
    ? news.categories
    : news.category
      ? [news.category]
      : ["ข่าวทั่วไป"];

  return (
    <div className="min-h-screen text-slate-800 antialiased dark:bg-transparent dark:text-slate-200">
      <main className=" py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Breadcrumb & Metadata */}
          <header className="space-y-6">
            <Link
              href="/news"
              className="inline-flex items-center text-slate-400 hover:text-blue-600 text-sm font-semibold group transition-colors dark:text-slate-500 dark:hover:text-blue-400"
            >
              <svg
                className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              ย้อนกลับหน้าข่าวสาร
            </Link>
            <div className="flex flex-wrap gap-2">
              {displayCategories.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 leading-tight dark:text-white">
              <div className="text-center">วิทยาลัยเทคนิคกันทรลักษ์</div>
            </div>
            <time className="text-slate-400 text-sm block dark:text-slate-500">
              เผยแพร่เมื่อ:{" "}
              {new Date(news.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          {/* Content */}
          <article
            className="prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-img:rounded-2xl dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: news.content || "" }}
          />

          {/* Links */}
          {news.links && news.links.length > 0 && (
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 dark:text-white">
                ลิงก์ที่เกี่ยวข้องและเอกสารดาวน์โหลด
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group dark:border-zinc-700 dark:hover:border-blue-500 bg-white dark:bg-zinc-900"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-blue-600 truncate mr-4 dark:text-slate-300 dark:group-hover:text-blue-400">
                      {link.label}
                    </span>
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all dark:text-slate-600 dark:group-hover:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          <FootTitle />

          {/* ✅✅✅ ส่วนที่แก้ไข: Gallery (ปรับให้เหมือนตัวอย่าง) ✅✅✅ */}
          {news.images && news.images.length > 0 && (
            <section className="pt-12 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  ประมวลภาพกิจกรรม ({news.images.length})
                </h3>
              </div>

              <div
                className={`grid gap-6 transition-all duration-300 ${getGridClass(
                  news.images.length,
                )}`}
              >
                {news.images.map((img, idx) => {
                  const isSingleImage = news.images!.length === 1; // เช็คว่าเป็นรูปเดียวหรือไม่

                  return (
                    <div
                      key={idx}
                      // --- ปรับปรุง Container ตามตัวอย่าง ---
                      className={`relative group overflow-hidden rounded-2xl ${
                        isSingleImage
                          ? "flex max-h-[80vh] items-center justify-center py-4" // รูปเดียว: จัดกลาง สูงไม่เกินจอ
                          : "aspect-[4/3] " // หลายรูป: บังคับสัดส่วน 4:3
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        // กำหนดขนาดให้ next/image
                        width={isSingleImage ? 1200 : 800}
                        height={isSingleImage ? 800 : 600}
                        // --- ปรับปรุง Style รูปภาพ ---
                        className={`transition-transform duration-700 group-hover:scale-110 ${
                          isSingleImage
                            ? "!h-auto !w-auto max-h-full max-w-full object-contain shadow-lg rounded-xl" // รูปเดียว: ไม่โดนตัด แสดงเต็มใบ
                            : "h-full w-full object-cover" // หลายรูป: เต็มพื้นที่ (Crop) เพื่อความสวยงามของ Grid
                        }`}
                        // ถ้าหลายรูป ให้บังคับ CSS ให้เต็มกรอบ aspect-[4/3]
                        style={
                          !isSingleImage
                            ? { width: "100%", height: "100%" }
                            : {}
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* --- Announcement/Document Images (ส่วนนี้คงเดิม: แสดงเต็มใบ) --- */}
          {news.announcementImages && news.announcementImages.length > 0 && (
            <section className="pt-16 max-w-3xl mx-auto space-y-10 border-t border-slate-100 dark:border-zinc-800">
              <div className="space-y-8">
                {news.announcementImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 dark:shadow-none dark:border dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Document ${idx + 1}`}
                      width={1200}
                      height={1600}
                      className="w-full h-auto"
                      style={{ width: "100%", height: "auto" }}
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Navigation System --- */}
          <nav className="pt-12 mt-12 border-t border-slate-100 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {/* Previous Button */}
              <div className="flex flex-col">
                {prev ? (
                  <Link
                    href={`/news/${prev._id}`}
                    className="group flex flex-col h-full p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all shadow-sm dark:border-zinc-800 dark:hover:border-blue-500"
                  >
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="hidden md:inline">ข่าวก่อนหน้า</span>
                    </span>
                    <p className="font-semibold text-sm md:text-base text-slate-700 group-hover:text-slate-900 line-clamp-2 dark:text-slate-300 dark:group-hover:text-white">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div className="h-full p-5 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-300 uppercase font-bold dark:border-zinc-800">
                    จุดเริ่มต้น
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex flex-col text-right">
                {next ? (
                  <Link
                    href={`/news/${next._id}`}
                    className="group flex flex-col items-end h-full p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all shadow-sm dark:border-zinc-800 dark:hover:border-blue-500"
                  >
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="hidden md:inline">ข่าวถัดไป</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                    <p className="font-semibold text-sm md:text-base text-slate-700 group-hover:text-slate-900 line-clamp-2 dark:text-slate-300 dark:group-hover:text-white">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <div className="h-full p-5 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-300 uppercase font-bold dark:border-zinc-800">
                    ข่าวล่าสุด
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
}

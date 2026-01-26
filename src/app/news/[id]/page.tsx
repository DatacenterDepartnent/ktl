import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FootTitle } from "@/components/FootTitle";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  content?: string;
  images?: string[];
  // ✅ เพิ่ม Interface สำหรับรูปประกาศ
  announcementImages?: string[];
  links?: { label: string; url: string }[];
  createdAt: string;
}

// ฟังก์ชันดึงข้อมูลข่าวตาม ID
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

// ฟังก์ชันดึงข่าว ก่อนหน้า/ถัดไป
async function getAdjacentNews(createdAt: string) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const prevNews = await db
      .collection("news")
      .find({ createdAt: { $lt: createdAt } })
      .sort({ createdAt: -1 })
      .limit(1)
      .project({ _id: 1, title: 1 })
      .toArray();

    const nextNews = await db
      .collection("news")
      .find({ createdAt: { $gt: createdAt } })
      .sort({ createdAt: 1 })
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

// ✅ ปรับ Logic Grid Class ให้เหมือนตัวอย่าง (Modern Layout)
function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  // ฐานคือ 1 คอลัมน์, จอเล็ก (sm) ขึ้นไปเป็น 2 คอลัมน์
  const base = "grid-cols-1 sm:grid-cols-2";

  // จอใหญ่ (lg) ปรับตามจำนวนรูป (สูงสุด 4)
  if (count === 2) return `${base} lg:grid-cols-2`;
  if (count === 3) return `${base} lg:grid-cols-3`;
  return `${base} lg:grid-cols-4`;
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
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold mb-2">ไม่พบข่าวดังกล่าว</h1>
        <Link
          href="/news"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-bold shadow-md"
        >
          กลับไปหน้าข่าวสาร
        </Link>
      </div>
    );
  }

  const { prev, next } = await getAdjacentNews(news.createdAt);

  const displayCategories =
    news.categories && news.categories.length > 0
      ? news.categories
      : news.category
        ? [news.category]
        : ["ทั่วไป"];

  return (
    <div className="min-h-screen pb-20 font-sans text-slate-800 transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:px-8">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-8 pl-1 flex">
          <Link
            className="flex items-center gap-1 text-slate-600  hover:text-blue-500 transition-colors font-medium text-sm group"
            href="/"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="pr-1">Home</span>
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors font-medium text-sm group"
          >
            <span className="text-slate-400">/</span>
            <span>News</span>
          </Link>
        </div>

        <article className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <header className="space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/50 px-3 py-1 text-xs font-semibold text-blue-600">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(news.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {displayCategories.map((cat, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex justify-center md:text-left text-3xl leading-tight font-bold tracking-tight text-slate-700 md:text-4xl lg:text-5xl ">
              {/* {news.title} */}
              <p>วิทยาลัยเทคนิคกันทรลักษ์</p>
            </div>
          </header>

          {/* เนื้อหาข่าว (Content) */}
          <section className="prose prose-lg max-w-none text-slate-600">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: news.content || "<p>ไม่มีรายละเอียดเนื้อหา</p>",
              }}
            />
          </section>

          {/* ลิงก์ / ไฟล์ดาวน์โหลด */}
          {news.links && news.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              {news.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="opacity-80">
            <FootTitle />
          </div>

          {/* ✅ Gallery Section (ปรับปรุงใหม่ตามตัวอย่าง) */}
          {news.images && news.images.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2 text-slate-700">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold">
                  {news.images.length === 1 ? "Featured Image" : "Gallery"} (
                  {news.images.length})
                </h3>
              </div>

              {/* Grid Layout แบบ Modern */}
              <div
                className={`grid gap-4 transition-all duration-300 ${getGridClass(news.images.length)}`}
              >
                {news.images.map((img, index) => (
                  <div
                    key={index}
                    // ✅ ใช้ Style ตามตัวอย่าง: rounded-xl, bg-slate-200, ring-1
                    className="relative overflow-hidden rounded-xl bg-slate-200 shadow-sm ring-1 ring-black/5 aspect-4/3 group"
                  >
                    <Image
                      src={img}
                      alt={`News Image ${index + 1}`}
                      fill
                      // ✅ ใช้ object-cover เพื่อให้รูปเต็มกรอบสวยงาม และเพิ่ม Hover Effect
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ✅ ส่วนแสดงรูปประกาศ (Announcement Images) */}
          {news.announcementImages && news.announcementImages.length > 0 && (
            <section className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 gap-6">
                {news.announcementImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-3/4 md:aspect-auto md:min-h-200 w-full"
                  >
                    <Image
                      src={img}
                      alt={`Announcement ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation Previous / Next */}
          <nav className="border-t border-slate-200 pt-8">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/news/${prev._id}`}
                  className="group flex w-1/2 items-center justify-start gap-3 pr-4 transition-all hover:-translate-x-1"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors group-hover:border-blue-300 group-hover:bg-blue-50">
                    <svg
                      className="w-4 h-4 text-slate-400 transition-colors group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-medium tracking-wide text-slate-400 uppercase">
                      Previous
                    </span>
                    <span className="line-clamp-1 text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-600">
                      {prev.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="w-1/2" />
              )}

              {next ? (
                <Link
                  href={`/news/${next._id}`}
                  className="group flex w-1/2 items-center justify-end gap-3 pl-4 transition-all hover:translate-x-1"
                >
                  <div className="text-right hidden sm:block">
                    <span className="block text-xs font-medium tracking-wide text-slate-400 uppercase">
                      Next
                    </span>
                    <span className="line-clamp-1 text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-600">
                      {next.title}
                    </span>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors group-hover:border-blue-300 group-hover:bg-blue-50">
                    <svg
                      className="w-4 h-4 text-slate-400 transition-colors group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div className="w-1/2" />
              )}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}

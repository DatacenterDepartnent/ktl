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

// ฟังก์ชันคำนวณ Grid Class (สำหรับ Gallery ทั่วไป)
function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2 md:grid-cols-2";
  if (count === 3) return "grid-cols-1 md:grid-cols-3";
  if (count === 4) return "grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
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
    <div className="min-h-screen pb-20 font-sans text-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <Link
            href="/news"
            className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
          >
            <svg
              className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
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
            ย้อนกลับไปหน้าข่าวสาร
          </Link>
        </div>

        <article className="max-w-4xl mx-auto overflow-hidden">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {displayCategories.map((cat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100"
                >
                  {cat}
                </span>
              ))}
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
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
                {new Date(news.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight text-slate-900 tracking-tight text-center">
              {news.title}
            </h1>
          </div>

          {/* เนื้อหาข่าว (Content) */}
          <div className="my-8 max-w-4xl mx-auto">
            <div
              className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md whitespace-pre-wrap leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{
                __html: news.content || "<p>ไม่มีรายละเอียดเนื้อหา</p>",
              }}
            />
          </div>

          {/* ลิงก์ / ไฟล์ดาวน์โหลด */}
          {news.links && news.links.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8 mb-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                ลิงก์ที่เกี่ยวข้อง
              </h3>
              <div className="flex flex-wrap gap-3">
                {news.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pb-12 pt-4">
            <FootTitle />
          </div>

          {/* Gallery Section (รูปทั่วไป) */}
          {news.images && news.images.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                ประมวลภาพกิจกรรม ({news.images.length})
              </h3>

              <div className={`grid gap-4 ${getGridClass(news.images.length)}`}>
                {news.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden   group hover:shadow-xl   border-slate-200"
                  >
                    <Image
                      src={img}
                      alt={`News Image ${index + 1}`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ ส่วนแสดงรูปประกาศ (Announcement Images) - ย้ายมาล่างสุด และแก้ UI */}
          {news.announcementImages && news.announcementImages.length > 0 && (
            <div className="max-w-2xl mx-auto mb-12">
              {/* ✅ บังคับ Grid 1 Column ทุกหน้าจอ */}
              <div className="grid grid-cols-1 gap-6">
                {news.announcementImages.map((img, index) => (
                  // ✅ เอา border และ shadow ออก, คง rounded-xl ไว้
                  <div
                    key={index}
                    className="relative aspect-3/4 md:aspect-auto md:min-h-200 w-full rounded-xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Announcement ${index + 1}`}
                      fill
                      className="object-contain" // ใช้ contain เพื่อให้เห็นเอกสารครบทั้งใบ
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Previous / Next */}
          <div className="max-w-4xl mx-auto mt-10 mb-12 border-t border-slate-100 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/news/${prev._id}`}
                  className="group flex flex-col p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    ข่าวก่อนหน้า
                  </span>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700 line-clamp-1">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/news/${next._id}`}
                  className="group flex flex-col items-end text-right p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    ข่าวถัดไป
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700 line-clamp-1">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

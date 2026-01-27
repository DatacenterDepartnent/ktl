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
  announcementImages?: string[];
  links?: { label: string; url: string }[];
  createdAt: Date | string;
}

// 1. ดึงข้อมูลข่าวสารปัจจุบัน
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

// 2. ดึงข่าวถัดไปและก่อนหน้า (Logic แม่นยำสูง)
async function getAdjacentNews(currentNews: NewsItem) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const currentId = new ObjectId(currentNews._id);
    const currentDate = new Date(currentNews.createdAt);

    // ข่าวก่อนหน้า (เก่ากว่า)
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

    // ข่าวถัดไป (ใหม่กว่า)
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

function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          ไม่พบข้อมูลข่าวสารที่คุณต้องการ
        </h1>
        <Link
          href="/news"
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg"
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
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Breadcrumb & Metadata */}
          <header className="space-y-6">
            <Link
              href="/news"
              className="inline-flex items-center text-slate-400 hover:text-blue-600 text-sm font-semibold group transition-colors"
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
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-lg border border-blue-100"
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {/* {news.title} */}
              <div className="text-center">วิทยาลัยเทคนิคกันทรลักษ์</div>
            </div>
            <time className="text-slate-400 text-sm block">
              เผยแพร่เมื่อ:{" "}
              {new Date(news.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          {/* เนื้อหาข่าว */}
          <article
            className="prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: news.content || "" }}
          />

          {/* ลิงก์แนบ */}
          {news.links && news.links.length > 0 && (
            <section className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                ลิงก์ที่เกี่ยวข้องและเอกสารดาวน์โหลด
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all group"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-blue-600 truncate mr-4">
                      {link.label}
                    </span>
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
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

          {/* --- ประมวลภาพกิจกรรม (Gallery) --- */}
          {news.images && news.images.length > 0 && (
            <section className="pt-12 border-t border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  ประมวลภาพกิจกรรม ({news.images.length})
                </h3>
              </div>
              <div className={`grid gap-6 ${getGridClass(news.images.length)}`}>
                {news.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100"
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- รูปประกาศ/จดหมายข่าว (Documents) --- */}
          {news.announcementImages && news.announcementImages.length > 0 && (
            <section className="pt-16 max-w-2xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  ประกาศ / เอกสารแนบ
                </h3>
                <p className="text-slate-400 text-sm">
                  เลื่อนเพื่ออ่านรายละเอียดเอกสารอย่างเป็นทางการ
                </p>
              </div>
              <div className="space-y-8">
                {news.announcementImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full rounded-2xl overflow-hidden shadow-md"
                  >
                    <Image
                      src={img}
                      alt={`Document ${idx + 1}`}
                      width={1200}
                      height={1600}
                      className="w-full h-auto object-contain rounded-2xl"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Navigation System (Next/Prev) --- */}
          <nav className="pt-12 mt-12 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {/* Previous Button */}
              <div className="flex flex-col">
                {prev ? (
                  <Link
                    href={`/news/${prev._id}`}
                    className="group flex flex-col h-full p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all shadow-sm"
                  >
                    <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
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
                      <span className="md:hidden">Previous</span>
                      <span className="hidden md:inline">Previous News</span>
                    </span>
                    <p className="font-bold text-[11px] md:text-base text-slate-600 group-hover:text-slate-900 line-clamp-2 leading-snug">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div className="h-full p-5 rounded-3xl border border-dashed border-slate-100 flex items-center justify-center text-[10px] text-slate-200 uppercase font-black">
                    Oldest Post
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex flex-col text-right">
                {next ? (
                  <Link
                    href={`/news/${next._id}`}
                    className="group flex flex-col items-end h-full p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all shadow-sm"
                  >
                    <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                      <span className="md:hidden">Next</span>
                      <span className="hidden md:inline">Next News</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                    <p className="font-bold text-[11px] md:text-base text-slate-600 group-hover:text-slate-900 line-clamp-2 leading-snug">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <div className="h-full p-5 rounded-3xl border border-dashed border-slate-100 flex items-center justify-center text-[10px] text-slate-200 uppercase font-black">
                    Latest Post
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

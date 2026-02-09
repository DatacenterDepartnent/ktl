import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import { FootTitle } from "@/components/FootTitle";

// --- Icons ---
const IconChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const IconChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IconArrowLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const IconDownload = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const IconExternalLink = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

// ✅ เพิ่ม videoEmbeds ใน Interface
interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  content?: string;
  images?: string[];
  announcementImages?: string[];
  links?: { label: string; url: string }[];
  videoEmbeds?: string[]; // <--- เพิ่มตรงนี้
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

// 2. Fetch adjacent news
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

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNewsDetail(id);

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-6 text-center">
        <div className="text-6xl mb-6 opacity-20">🔍</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          ไม่พบข้อมูลข่าวสาร
        </h1>
        <Link
          href="/news"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <main className="pb-16 md:pb-24">
        {/* --- Hero / Header Section --- */}
        <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-12 pb-12 md:pb-16 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <IconArrowLeft />
              </div>
              ย้อนกลับหน้าข่าวสาร
            </Link>

            {/* Title & Meta */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {displayCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {/* {news.title} */}
                <p className="text-center">วิทยาลัยเทคนิคกันทรลักษ์</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-zinc-800 pt-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  เผยแพร่เมื่อ:
                </div>
                <time className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(news.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-12 space-y-4">
          {/* --- Content Body --- */}
          <article
            className="prose prose-lg prose-slate dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: news.content || "" }}
          />

          <div className="">
            <FootTitle />
          </div>
          <hr className="border-slate-200 dark:border-zinc-800" />

          {/* --- 🎥 Video Section (เพิ่มส่วนนี้) --- */}
          {news.videoEmbeds && news.videoEmbeds.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-red-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  วิดีโอประกอบ
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.videoEmbeds.map((embedCode, index) => (
                  <div
                    key={index}
                    className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black border border-slate-200 dark:border-zinc-800 [&>iframe]:w-full [&>iframe]:h-full"
                    dangerouslySetInnerHTML={{ __html: embedCode }}
                  />
                ))}
              </div>
            </section>
          )}

          {news.links && news.links.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                  <IconDownload />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  เอกสารและลิงก์ที่เกี่ยวข้อง
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {news.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center p-5 bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative Gradient on Hover */}
                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate text-base">
                        {link.label}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono truncate mt-1 group-hover:text-slate-500 transition-colors">
                        {link.url}
                      </p>
                    </div>

                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                      <IconExternalLink />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
          {/* --- Documents / Posters Section --- */}
          {news.announcementImages && news.announcementImages.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  จดหมายข่าวประชาสัมพันธ์
                </h3>
              </div>
              <div className="flex flex-col gap-10">
                {news.announcementImages.map((img, idx) => (
                  <a
                    key={idx}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 ring-1 ring-slate-900/5 dark:ring-white/10 cursor-zoom-in hover:opacity-95 transition-opacity"
                  >
                    <Image
                      src={img}
                      alt={`Announcement ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                      priority={idx === 0}
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* --- Gallery Section --- */}
          {news.images && news.images.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ประมวลภาพกิจกรรม
                  <span className="text-slate-400 font-normal text-lg ml-2">
                    ({news.images.length})
                  </span>
                </h3>
              </div>
              <div
                className={`${news.images.length < 5 ? "columns-1" : "columns-1 sm:columns-2 lg:columns-3"} gap-4 space-y-4`}
              >
                {/* {news.images.map((img, idx) => (
                  <a
                    key={idx}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid cursor-zoom-in"
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ width: "100%", height: "auto" }}
                      className="transition-transform duration-700 hover:scale-105"
                    />
                  </a>
                ))} */}
                {news.images.map((img, idx) => (
                  <div className="block relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid cursor-zoom-in">
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ width: "100%", height: "auto" }}
                      className="transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Navigation --- */}
          <nav className="border-t border-slate-200 dark:border-zinc-800 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/news/${prev._id}`}
                  className="group flex flex-col p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <IconChevronLeft />
                    <span>ข่าวก่อนหน้า</span>
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white line-clamp-2 leading-relaxed">
                    {prev.title}
                  </h4>
                </Link>
              ) : (
                <div className="hidden md:block"></div>
              )}

              {next ? (
                <Link
                  href={`/news/${next._id}`}
                  className="group flex flex-col items-end text-right p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <span>ข่าวถัดไป</span>
                    <IconChevronRight />
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white line-clamp-2 leading-relaxed">
                    {next.title}
                  </h4>
                </Link>
              ) : (
                <div className="hidden md:block"></div>
              )}
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
}

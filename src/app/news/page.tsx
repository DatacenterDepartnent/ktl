import clientPromise from "@/lib/db";
import NewsListClient from "@/components/NewsListClient";
import RefreshButton from "@/components/RefreshButton";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const collection = db.collection("news");

    try {
      await collection.createIndex({ createdAt: -1 });
    } catch (idxError) {
      console.log("Index check:", idxError);
    }

    const news = await collection
      .find({})
      .project({
        title: 1,
        category: 1,
        categories: 1,
        createdAt: 1,
        images: { $slice: 1 },
        announcementImages: { $slice: 1 },
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function AllNewsPage() {
  const newsList = await getNews();

  return (
    <main className="min-h-screen text-slate-900 dark:text-slate-200 antialiased dark:bg-transparent">
      {/* Hero Section / Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pt-32 pb-16 md:pt-40 md:pb-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                News &{" "}
                <span className="text-blue-600 dark:text-blue-500">Events</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
                เกาะติดทุกความเคลื่อนไหว กิจกรรม
                และประกาศสำคัญจากวิทยาลัยเทคนิคกันทรลักษ์
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Refresh Feed
              </span>
              <RefreshButton />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* ข้อมูลสถิติเล็กๆ เพื่อ UX ที่ดี */}
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
              Showing {newsList.length} Latest Updates
            </span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>

          {/* รายการข่าว (NewsListClient จะจัดการ Grid ข้างในเอง) */}
          <div className="relative">
            <NewsListClient initialNews={newsList} />
          </div>

          {/* Footer Note */}
          {newsList.length > 0 && (
            <div className="mt-20 text-center">
              <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                สิ้นสุดรายการข่าวปัจจุบัน
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

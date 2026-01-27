import clientPromise from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import ViewAllButton from "@/components/ViewAllButton";

// Interface ข้อมูลข่าว
interface NewsItem {
  _id: string;
  title: string;
  category: string;
  images?: string[];
  content?: string;
  createdAt: string;
}

// ดึงข่าว 4 รายการ
async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();
    return JSON.parse(JSON.stringify(news));
  } catch {
    return [];
  }
}

// Helper: แปลงวันที่เป็นภาษาไทย
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function PressRelease() {
  const latestNews = await getLatestNews();

  return (
    <main className="flex-col relative max-w-7xl mx-auto flex items-center justify-between">
      <div className="container px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex gap-4">
            <div className="w-1.5 bg-orange-500 rounded-full h-auto self-stretch"></div>

            <div className="space-y-1">
              <h4 className="text-orange-500 font-bold text-xs tracking-widest uppercase">
                Update News
              </h4>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
                ข่าวประชาสัมพันธ์
              </h1>
              <p className="text-zinc-500 text-sm">
                ติดตามข่าวสารและกิจกรรมล่าสุดของเรา
              </p>
            </div>
          </div>

          <ViewAllButton />
        </div>

        {/* --- News Grid (4 การ์ดเรียงกัน) --- */}
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((news) => (
              <Link
                href={`/news/${news._id}`}
                key={news._id}
                className="group flex flex-col  rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
              >
                {/* 1. รูปภาพ (สัดส่วน 4:3 เหมือนในรูป) */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={news.images?.[0] || "/no-image.png"}
                    alt={news.title}
                    unoptimized // 👈 ใส่ตรงนี้เพื่อบังคับให้แสดงรูปโดยไม่เช็ค config
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* 2. เนื้อหาการ์ด */}
                <div className="p-5 flex flex-col flex-1">
                  {/* วันที่ (ไอคอนปฏิทิน + วันที่ไทย) */}
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
                    {formatDate(news.createdAt)}
                  </div>

                  {/* หัวข้อข่าว (ตัวหนา สีเข้ม) */}
                  <h3 className="text-lg font-bold text-zinc-800 mb-3 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                    {news.title}
                  </h3>

                  {/* เนื้อหาย่อ (Snippet สีเทา) */}
                  <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                    {news.content?.replace(/<[^>]+>/g, "") ||
                      "อ่านรายละเอียดเพิ่มเติม..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // กรณีไม่มีข่าว
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-300 rounded-2xl /50">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-zinc-600">
              ยังไม่มีข่าวประชาสัมพันธ์
            </h3>
            <p className="text-zinc-400">โปรดรอติดตามการอัปเดตเร็วๆ นี้</p>
          </div>
        )}
      </div>
    </main>
  );
}

import clientPromise from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import ViewAllNewslettersButton from "@/components/ViewAllNewslettersButton";

interface NewsItem {
  _id: string;
  title: string;
  category?: string;
  categories?: string[];
  images?: string[];
  announcementImages?: string[];
  createdAt: string;
}

// ✅ ฟังก์ชันดึงข้อมูลจาก Database (เฉพาะจดหมายข่าว)
async function getNewsletters(): Promise<NewsItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // Query: หาข่าวที่มีหมวดหมู่เป็น "Newsletter"
    const query = {
      $or: [
        { category: "Newsletter" },
        { categories: "Newsletter" },
        { category: "จดหมายข่าวประชาสัมพันธ์" },
        { categories: "จดหมายข่าวประชาสัมพันธ์" },
      ],
    };

    const newsletters = await db
      .collection("news")
      .find(query)
      .sort({ createdAt: -1 }) // เรียงจากใหม่ไปเก่า
      .limit(3) // ✅ ดึงมาแค่ 3 เรื่องล่าสุด
      .toArray();

    return JSON.parse(JSON.stringify(newsletters));
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return [];
  }
}

export default async function NewsletterPage() {
  const newsletters = await getNewsletters();

  return (
    <main className="text-slate-800 dark:text-slate-200 container px-4">
      {/* --- Header Section --- */}
      <section className="pb-10 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          <span className="text-slate-800 dark:text-white">จดหมายข่าว</span>
          <span className="text-yellow-500">ประชาสัมพันธ์</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base dark:text-slate-400">
          ติดตามวารสารและข่าวสารกิจกรรมต่างๆ ผ่านรูปแบบจดหมายข่าวอิเล็กทรอนิกส์
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* --- Newsletter Grid --- */}
      <section className="">
        {newsletters.length > 0 ? (
          <>
            {/* ✅ ปรับ Grid ให้แสดง 3 คอลัมน์ ตั้งแต่หน้าจอขนาดกลาง (md) ขึ้นไป */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {newsletters.map((news, index) => {
                // Logic เลือกรูปภาพ: ใช้รูปประกาศเป็นปกก่อน ถ้าไม่มีค่อยใช้รูปทั่วไป
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
                    className="group relative block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2 h-full dark:border-slate-800 dark:shadow-black/40" // เพิ่ม h-full เพื่อให้การ์ดสูงเท่ากัน
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur shadow-md px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 dark:bg-slate-900/90 dark:text-slate-300">
                        <svg
                          className="w-4 h-4 text-yellow-500"
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
                        // ✅ FIX: เพิ่ม sizes เพื่อแก้ Warning และเพิ่ม Performance
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                      <div className="bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block mb-2 text-white shadow-sm">
                        จดหมายข่าวประชาสัมพันธ์
                      </div>

                      <h3 className="text-lg font-bold leading-snug line-clamp-2 mb-2 group-hover:text-yellow-300 transition-colors">
                        {news.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                        <span>อ่านรายละเอียดเพิ่มเติม</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ปุ่มดูข้อมูลทั้งหมด */}
            <div className="mt-16 text-center">
              <ViewAllNewslettersButton />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <div className="text-4xl mb-4 opacity-50">📭</div>
            <p className="text-slate-500 font-medium dark:text-slate-400">
              ยังไม่มีจดหมายข่าวในขณะนี้
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

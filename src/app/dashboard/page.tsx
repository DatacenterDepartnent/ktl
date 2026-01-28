import clientPromise from "@/lib/db";
import Link from "next/link";
import LogoutBtn from "@/components/LogoutBtn";
import { v2 as cloudinary } from "cloudinary";

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getStats() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. ดึงข้อมูลจำนวน (Counts)
    const totalNews = await db.collection("news").countDocuments();
    const totalNav = await db.collection("navbar").countDocuments({
      parentId: null, // นับเฉพาะเมนูหลักระดับบนสุด
    });
    const totalPages = await db.collection("pages").countDocuments();

    // 2. นับจำนวนรูปภาพรวมจากทุกข่าว
    const imageStats = await db
      .collection("news")
      .aggregate([
        {
          $project: {
            imageCount: {
              $add: [
                {
                  $cond: {
                    if: { $isArray: "$images" },
                    then: { $size: "$images" },
                    else: 0,
                  },
                },
                {
                  $cond: {
                    if: { $isArray: "$announcementImages" },
                    then: { $size: "$announcementImages" },
                    else: 0,
                  },
                },
              ],
            },
          },
        },
        { $group: { _id: null, totalImages: { $sum: "$imageCount" } } },
      ])
      .toArray();
    const totalImagesCount =
      imageStats.length > 0 ? imageStats[0].totalImages : 0;

    // 3. คำนวณขนาดพื้นที่ MongoDB (Data Size)
    const dbStats = await db.stats();
    const dbSizeMB = (dbStats.storageSize / (1024 * 1024)).toFixed(2);

    // 4. ดึงพื้นที่การใช้งานจาก Cloudinary
    let cloudUsageMB = "0.00";
    try {
      const cloudResult = await cloudinary.api.usage();
      cloudUsageMB = (cloudResult.storage.usage / (1024 * 1024)).toFixed(2);
    } catch (err) {
      console.error("Cloudinary Error:", err);
    }

    return {
      totalNews,
      totalNav,
      totalPages,
      totalImagesCount,
      dbSizeMB,
      cloudUsageMB,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalNews: 0,
      totalNav: 0,
      totalPages: 0,
      totalImagesCount: 0,
      dbSizeMB: "0.00",
      cloudUsageMB: "0.00",
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 text-zinc-800 dark:text-zinc-200">
      {/* --- ส่วนหัว (Header) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-blue-600 uppercase tracking-tighter dark:text-blue-500">
            Dashboard
          </h1>
          <p className="font-bold text-lg mt-2 text-zinc-500 dark:text-zinc-400">
            ภาพรวมระบบวิทยาลัยเทคนิคกันทรลักษ์
          </p>
        </div>
        <LogoutBtn />
      </div>

      {/* --- ส่วนแสดงสถิติ (Stats Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-16">
        {/* Card 1: ข่าวทั้งหมด */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">
            ข่าวทั้งหมด
          </h3>
          <p className="text-3xl font-black text-zinc-900 mt-2 dark:text-white">
            {stats.totalNews}
          </p>
          <div className="absolute right-2 top-2 text-2xl opacity-10">📰</div>
        </div>

        {/* Card 2: เมนู (ลิงก์) */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">
            เมนูหลัก (ลิงก์)
          </h3>
          <p className="text-3xl font-black text-purple-600 mt-2 dark:text-purple-400">
            {stats.totalNav}
          </p>
          <div className="absolute right-2 top-2 text-2xl opacity-10">🔗</div>
        </div>

        {/* Card 3: จำนวนหน้า */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">
            หน้าเนื้อหา
          </h3>
          <p className="text-3xl font-black text-yellow-500 mt-2 dark:text-yellow-400">
            {stats.totalPages}
          </p>
          <div className="absolute right-2 top-2 text-2xl opacity-10">📝</div>
        </div>

        {/* Card 4: จำนวนรูปภาพ */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-black/40">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">
            จำนวนรูปภาพ
          </h3>
          <p className="text-3xl font-black text-pink-500 mt-2 dark:text-pink-400">
            {stats.totalImagesCount}
          </p>
          <div className="absolute right-2 top-2 text-2xl opacity-10">🖼️</div>
        </div>

        {/* Card 5: พื้นที่ MongoDB */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-emerald-900/20 dark:border-emerald-900/50">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-emerald-600 dark:text-emerald-400">
            DB Usage ฟรีสูงสุด 512 MB
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.dbSizeMB}
            </p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              MB
            </span>
          </div>
          <div className="absolute right-2 top-2 text-2xl opacity-10 text-emerald-600 dark:text-emerald-400">
            💾
          </div>
        </div>

        {/* Card 6: พื้นที่ Cloudinary */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden dark:bg-blue-900/20 dark:border-blue-900/50">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-blue-600 dark:text-blue-400">
            Cloud Usage ฟรีสูงสุด 10-15 GB 20,000 รูป โดยประมาณ
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-2xl font-black text-blue-700 dark:text-blue-300">
              {stats.cloudUsageMB}
            </p>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
              MB
            </span>
          </div>
          <div className="absolute right-2 top-2 text-2xl opacity-10 text-blue-600 dark:text-blue-400">
            ☁️
          </div>
        </div>
      </div>

      {/* --- ส่วนเมนูลัด (Quick Actions) --- */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 mb-8 border-l-8 border-blue-600 pl-6 dark:text-white dark:border-blue-500">
          เมนูลัด (Quick Actions)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/news"
            className="group bg-white border border-zinc-200 hover:border-blue-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-blue-500 dark:hover:shadow-black/40"
          >
            <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all dark:grayscale-0">
              📰
            </span>
            <h3 className="text-xl font-bold text-zinc-800 group-hover:text-blue-600 transition-colors dark:text-zinc-100 dark:group-hover:text-blue-400">
              จัดการข่าวสาร
            </h3>
            <p className="text-zinc-500 mt-2 text-sm dark:text-zinc-400">
              เพิ่ม ลบ แก้ไข ข่าวสารและกิจกรรม
            </p>
          </Link>

          <Link
            href="/dashboard/navbar"
            className="group bg-white border border-zinc-200 hover:border-purple-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-purple-500 dark:hover:shadow-black/40"
          >
            <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all dark:grayscale-0">
              🔗
            </span>
            <h3 className="text-xl font-bold text-zinc-800 group-hover:text-purple-600 transition-colors dark:text-zinc-100 dark:group-hover:text-purple-400">
              จัดการเมนู
            </h3>
            <p className="text-zinc-500 mt-2 text-sm dark:text-zinc-400">
              แก้ไขลิงก์และลำดับเมนูบนหัวเว็บ
            </p>
          </Link>

          <Link
            href="/dashboard/pages"
            className="group bg-white border border-zinc-200 hover:border-yellow-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-yellow-500 dark:hover:shadow-black/40"
          >
            <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all dark:grayscale-0">
              📝
            </span>
            <h3 className="text-xl font-bold text-zinc-800 group-hover:text-yellow-500 transition-colors dark:text-zinc-100 dark:group-hover:text-yellow-400">
              จัดการเนื้อหา
            </h3>
            <p className="text-zinc-500 mt-2 text-sm dark:text-zinc-400">
              สร้างแก้ไขหน้าเว็บ ประวัติ/วิสัยทัศน์
            </p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group bg-zinc-900 border border-zinc-800 p-6 rounded-2xl transition-all shadow-lg hover:shadow-zinc-300 hover:-translate-y-1 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:shadow-black/50"
          >
            <span className="text-4xl mb-4 block">🌏</span>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              ดูหน้าเว็บจริง
            </h3>
            <p className="text-zinc-400 mt-2 text-sm">
              เปิดหน้าเว็บไซต์หลักในแท็บใหม่
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

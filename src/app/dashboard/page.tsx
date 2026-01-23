import clientPromise from "@/lib/db";
import Link from "next/link";
import LogoutBtn from "@/components/LogoutBtn";

// ฟังก์ชันดึงข้อมูลสถิติ
async function getStats() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const totalNews = await db.collection("news").countDocuments();
    const prNews = await db
      .collection("news")
      .countDocuments({ category: "PR" });
    const orders = await db
      .collection("news")
      .countDocuments({ category: "Order" });

    // ✅ แก้ไข: นับเฉพาะเมนูที่มีลิงก์จริง (ไม่นับ #, ค่าว่าง, หรือ null)
    const totalNav = await db.collection("navbar").countDocuments({
      parentId: null, // นับเฉพาะเมนูระดับบนสุด (Parent)
    });

    const totalPages = await db.collection("pages").countDocuments();

    // นับจำนวนรูปภาพทั้งหมดในระบบ
    const imageStats = await db
      .collection("news")
      .aggregate([
        {
          $project: {
            imageCount: {
              $cond: {
                if: { $isArray: "$images" },
                then: { $size: "$images" },
                else: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalImages: { $sum: "$imageCount" },
          },
        },
      ])
      .toArray();

    const totalImages = imageStats.length > 0 ? imageStats[0].totalImages : 0;

    return { totalNews, prNews, orders, totalNav, totalPages, totalImages };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalNews: 0,
      prNews: 0,
      orders: 0,
      totalNav: 0,
      totalPages: 0,
      totalImages: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 text-zinc-800">
      {/* --- ส่วนหัว (Header) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-zinc-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-blue-600 uppercase tracking-tighter">
            Dashboard
          </h1>
          <p className="font-bold text-lg mt-2 text-zinc-500">
            ภาพรวมระบบวิทยาลัยเทคนิคกันทรลักษ์
          </p>
        </div>
        <LogoutBtn />
      </div>

      {/* --- ส่วนแสดงสถิติ (Stats Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* Card 1: ข่าวทั้งหมด */}
        <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
          <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-400">
            ข่าวทั้งหมด
          </h3>
          <p className="text-5xl font-black text-zinc-900 mt-4">
            {stats.totalNews}
          </p>
          <div className="absolute right-4 top-4 text-4xl opacity-10 grayscale">
            📰
          </div>
        </div>

        {/* Card 2: รูปภาพทั้งหมด */}
        <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
          <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-400">
            รูปภาพในระบบ
          </h3>
          <p className="text-5xl font-black text-pink-500 mt-4">
            {stats.totalImages}
          </p>
          <div className="absolute right-4 top-4 text-4xl opacity-10 grayscale">
            🖼️
          </div>
        </div>

        {/* Card 3: เนื้อหาหน้าเว็บ */}
        <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-400">
            เนื้อหาหน้าเว็บ
          </h3>
          <p className="text-5xl font-black text-yellow-500 mt-4">
            {stats.totalPages}
          </p>
        </div>

        {/* Card 4: เมนูหัวเว็บ (ที่มีลิงก์) */}
        <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-400">
            เมนูหัวเว็บ (ลิงก์)
          </h3>
          <p className="text-5xl font-black text-purple-600 mt-4">
            {stats.totalNav}
          </p>
        </div>
      </div>

      {/* --- ส่วนเมนูลัด (Quick Actions) --- */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 mb-8 border-l-8 border-blue-600 pl-6">
          เมนูลัด (Quick Actions)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. ปุ่มจัดการข่าว */}
          <Link
            href="/dashboard/news"
            className="group bg-white border border-zinc-200 hover:border-blue-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">
                📰
              </span>
              <h3 className="text-xl font-bold text-zinc-800 group-hover:text-blue-600 transition-colors">
                จัดการข่าวสาร
              </h3>
              <p className="text-zinc-500 mt-2 text-sm">
                เพิ่ม ลบ แก้ไข ข่าวสารและกิจกรรม
              </p>
            </div>
          </Link>

          {/* 2. ปุ่มจัดการเมนู */}
          <Link
            href="/dashboard/navbar"
            className="group bg-white border border-zinc-200 hover:border-purple-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">
                🔗
              </span>
              <h3 className="text-xl font-bold text-zinc-800 group-hover:text-purple-600 transition-colors">
                จัดการเมนู
              </h3>
              <p className="text-zinc-500 mt-2 text-sm">
                แก้ไขลิงก์และลำดับเมนูบนหัวเว็บ
              </p>
            </div>
          </Link>

          {/* 3. ปุ่มจัดการเนื้อหา Pages */}
          <Link
            href="/dashboard/pages"
            className="group bg-white border border-zinc-200 hover:border-yellow-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">
                📝
              </span>
              <h3 className="text-xl font-bold text-zinc-800 group-hover:text-yellow-500 transition-colors">
                จัดการเนื้อหา (Pages)
              </h3>
              <p className="text-zinc-500 mt-2 text-sm">
                สร้างแก้ไขหน้าเว็บ เช่น ประวัติ, วิสัยทัศน์
              </p>
            </div>
          </Link>

          {/* 4. ปุ่มดูหน้าเว็บจริง */}
          <Link
            href="/"
            target="_blank"
            className="group bg-white border border-zinc-200 hover:border-green-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">
                🌏
              </span>
              <h3 className="text-xl font-bold text-zinc-800 group-hover:text-green-600 transition-colors">
                ดูหน้าเว็บจริง
              </h3>
              <p className="text-zinc-500 mt-2 text-sm">
                เปิดหน้าเว็บไซต์หลักในแท็บใหม่
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

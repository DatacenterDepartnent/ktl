import clientPromise from "@/lib/db";
import Link from "next/link";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth"; // ดึง auth() จากไฟล์ v5 ของคุณ

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getDashboardData() {
  try {
    // 1. ดึง Session จริง (UX: ตามที่คุณระบุ)
    const session = await auth();
    if (!session) return null;

    const username = session?.user?.name || (session?.user as any)?.username;
    const role = (session?.user as any)?.role;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 2. ดึงสถิติจริงจาก MongoDB
    const totalNews = await db.collection("news").countDocuments();
    const totalNav = await db
      .collection("navbar")
      .countDocuments({ parentId: null });
    const totalPages = await db.collection("pages").countDocuments();

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
    const dbStats = await db.stats();
    const dbSizeMB = (dbStats.storageSize / (1024 * 1024)).toFixed(2);

    let cloudUsageMB = "0.00";
    try {
      const cloudResult = await cloudinary.api.usage();
      cloudUsageMB = (cloudResult.storage.usage / (1024 * 1024)).toFixed(2);
    } catch (err) {
      console.error(err);
    }

    return {
      user: { username, role },
      stats: {
        totalNews,
        totalNav,
        totalPages,
        totalImagesCount,
        dbSizeMB,
        cloudUsageMB,
      },
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500 font-bold italic">Unauthorized Access</p>
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        {/* --- 1. UX/UI HEADER (Real Session Data) --- */}
        <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  System Live
                </span>
              </div>
              <h1 className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
                Over<span className="text-blue-600">view</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
                วิทยาลัยเทคนิคกันทรลักษ์ • แผงควบคุมระบบบริหารจัดการ
              </p>
            </div>

            {/* Profile Section ดึงจาก Session จริง */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 pr-6 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                {user.username?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase leading-none mb-1">
                  {user.role || "MEMBER"}
                </p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                  {user.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. STATS GRID (UX/UI: Bento Style) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <StatCard
              label="ข่าวสาร"
              value={stats.totalNews}
              icon="📰"
              color="blue"
            />
            <StatCard
              label="เมนู"
              value={stats.totalNav}
              icon="🔗"
              color="purple"
            />
            <StatCard
              label="หน้าเว็บ"
              value={stats.totalPages}
              icon="📝"
              color="amber"
            />
            <StatCard
              label="รูปภาพ"
              value={stats.totalImagesCount}
              icon="🖼️"
              color="pink"
            />
          </div>

          <UsageCard
            title="Database"
            value={stats.dbSizeMB}
            max={512}
            unit="MB"
            icon="💾"
            color="emerald"
          />
          <UsageCard
            title="Cloudinary"
            value={stats.cloudUsageMB}
            max={15000}
            unit="MB"
            icon="☁️"
            color="blue"
          />
        </div>

        {/* --- 3. QUICK ACTIONS (UX/UI: Rounded [2rem]) --- */}
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-8 flex items-center gap-4">
          Quick Management{" "}
          <span className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard href="/dashboard/news" title="ข่าวสาร" icon="📰" />
          <ActionCard href="/dashboard/navbar" title="เมนูเว็บ" icon="🔗" />
          <ActionCard href="/dashboard/pages" title="เนื้อหา" icon="📝" />
          <ActionCard href="/" title="หน้าเว็บจริง" icon="🌏" external />
        </div>
      </div>
    </div>
  );
}

// --- Reusable Sub-Components (UX/UI ฉบับที่คุณส่งมา) ---

function StatCard({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/10",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/10",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/10",
    pink: "text-pink-600 bg-pink-50 dark:bg-pink-900/10",
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-[2rem] shadow-sm group transition-all hover:shadow-md">
      <div
        className={`w-10 h-10 rounded-2xl ${colors[color]} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function UsageCard({ title, value, max, unit, icon, color }: any) {
  const percentage = Math.min((parseFloat(value) / max) * 100, 100);
  const colorClass = color === "emerald" ? "bg-emerald-500" : "bg-blue-500";
  const textColor = color === "emerald" ? "text-emerald-600" : "text-blue-600";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span
            className={`text-[11px] font-black uppercase tracking-widest ${textColor}`}
          >
            {title}
          </span>
          <span className="text-2xl group-hover:rotate-12 transition-transform">
            {icon}
          </span>
        </div>
        <p className="text-4xl font-black text-zinc-900 dark:text-white">
          {value}{" "}
          <span className="text-sm text-zinc-400 font-bold">{unit}</span>
        </p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-2 uppercase">
          <span>Usage</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ href, title, icon, external }: any) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-400 text-xs mt-1 font-bold">
        Manage system data →
      </p>
    </Link>
  );
}

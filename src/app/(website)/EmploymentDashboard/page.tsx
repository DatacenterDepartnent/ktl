// src/app/EmploymentDashboard/page.tsx

import Link from "next/link";
import SuveryList from "@/components/SuveryList";
import { Isuvery } from "@/components/Isuvery";
import connectDB from "@/lib/mongodb"; // ✅ ใช้ Direct DB Connection
import Suvery from "@/lib/models/suvery"; // ✅ เรียก Model โดยตรง
import {
  Briefcase,
  GraduationCap,
  Users,
  UserX,
  FilePlus,
  BarChart3,
  XCircle,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ✅ 1. Interface สำหรับ Next.js 15
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ✅ 2. ฟังก์ชันดึงข้อมูลจาก DB โดยตรง (เร็วกว่า fetch)
async function getSurveysDirectly() {
  try {
    await connectDB();
    // .lean() ช่วยให้แปลงเป็น JSON Object เร็วขึ้น
    const suverys = await Suvery.find({}).sort({ _id: -1 }).lean();
    return JSON.parse(JSON.stringify(suverys));
  } catch (error) {
    console.error("❌ Database Error:", error);
    return [];
  }
}

// ✅ 3. Component StatCard (ปรับให้กดได้เฉพาะปุ่ม)
const StatCard = ({
  title,
  count,
  icon: Icon,
  colorClass,
  bgClass,
  filterValue,
  isActive,
}: {
  title: string;
  count: number;
  icon: any;
  colorClass: string;
  bgClass: string;
  filterValue?: string;
  isActive?: boolean;
}) => {
  const href = filterValue
    ? `/EmploymentDashboard?status=${filterValue}`
    : "/EmploymentDashboard";

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all dark:bg-gray-900 ${
        isActive
          ? "border-green-500 ring-2 ring-green-500/20 dark:border-green-500"
          : "border-gray-100 dark:border-gray-800"
      }`}
    >
      {/* ส่วนแสดงข้อมูล (กดไม่ได้) */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
            {count}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>

      {/* ส่วนปุ่มกด (กดได้เฉพาะตรงนี้) */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href={href}
          className={`flex w-full items-center justify-center rounded-xl py-2 text-sm font-semibold transition-colors ${
            isActive
              ? "cursor-default bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-gray-50 text-gray-600 hover:bg-green-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-600"
          }`}
        >
          {isActive ? "แสดงอยู่" : "ดูรายชื่อ"}
          {!isActive && <ChevronRight className="ml-1 h-4 w-4" />}
        </Link>
      </div>
    </div>
  );
};

export default async function EmploymentDashboard(props: PageProps) {
  // ✅ 4. รับค่า Search Params
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  const statusFilter =
    typeof searchParams?.status === "string" ? searchParams.status : "";

  // ดึงข้อมูลทั้งหมด
  let suverys: Isuvery[] = await getSurveysDirectly();

  // ✅ 5. คำนวณ Stats (จากข้อมูลทั้งหมด ก่อนกรอง)
  const stats = {
    total: suverys.length,
    working: suverys.filter((s) => s.currentStatus === "ทำงานแล้ว").length,
    notWorking: suverys.filter((s) => s.currentStatus === "ไม่ได้ทำงาน").length,
    studying: suverys.filter((s) => s.currentStatus === "ศึกษาต่อ").length,
  };

  // ✅ 6. Logic กรองข้อมูล (Filter)

  // 6.1 กรองตามสถานะ (Status)
  if (statusFilter) {
    suverys = suverys.filter((item) => item.currentStatus === statusFilter);
  }

  // 6.2 กรองตามคำค้นหา (Search Text) -> ชื่อ, รหัส, ห้องเรียน
  if (query) {
    const lowerQuery = query.toLowerCase().trim();
    suverys = suverys.filter((item) => {
      const fullName = (item.fullName || "").toLowerCase();
      const studentId = (item.studentId || "").toLowerCase();
      const roomId = (item.roomId || "").toLowerCase();

      return (
        fullName.includes(lowerQuery) ||
        studentId.includes(lowerQuery) ||
        roomId.includes(lowerQuery)
      );
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-10 font-sans transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              <span className="rounded-xl bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <BarChart3 className="h-8 w-8" />
              </span>
              Dashboard ข้อมูลศิษย์เก่า
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              จัดการและติดตามสถานะการมีงานทำของผู้สำเร็จการศึกษา
            </p>
          </div>

          <Link
            href="/suvery"
            className="group inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-300 focus:ring-4 focus:ring-green-100 dark:shadow-none dark:focus:ring-green-900"
          >
            <FilePlus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
            กรอกข้อมูลใหม่
          </Link>
        </div>

        {/* --- STATS GRID --- */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="บันทึกทั้งหมด"
            count={stats.total}
            icon={Users}
            colorClass="text-blue-600"
            bgClass="bg-blue-50 dark:bg-blue-900/20"
            filterValue=""
            isActive={!statusFilter}
          />
          <StatCard
            title="ทำงานแล้ว"
            count={stats.working}
            icon={Briefcase}
            colorClass="text-green-600"
            bgClass="bg-green-50 dark:bg-green-900/20"
            filterValue="ทำงานแล้ว"
            isActive={statusFilter === "ทำงานแล้ว"}
          />
          <StatCard
            title="ไม่ได้ทำงาน"
            count={stats.notWorking}
            icon={UserX}
            colorClass="text-red-600"
            bgClass="bg-red-50 dark:bg-red-900/20"
            filterValue="ไม่ได้ทำงาน"
            isActive={statusFilter === "ไม่ได้ทำงาน"}
          />
          <StatCard
            title="ศึกษาต่อ"
            count={stats.studying}
            icon={GraduationCap}
            colorClass="text-purple-600"
            bgClass="bg-purple-50 dark:bg-purple-900/20"
            filterValue="ศึกษาต่อ"
            isActive={statusFilter === "ศึกษาต่อ"}
          />
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {statusFilter
                ? `รายชื่อ (${statusFilter})`
                : "รายชื่อผู้กรอกข้อมูล"}
            </h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {suverys.length}
            </span>

            {(statusFilter || query) && (
              <Link
                href="/EmploymentDashboard"
                className="ml-2 flex items-center text-xs text-red-500 hover:text-red-700"
              >
                <XCircle className="mr-1 h-4 w-4" /> ล้างตัวกรอง
              </Link>
            )}
          </div>
        </div>

        {/* --- CONTENT LIST --- */}
        <div className="min-h-[400px]">
          {suverys && suverys.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <SuveryList suverys={suverys} isLoading={false} isError={false} />
            </div>
          ) : (
            // --- EMPTY STATE ---
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20">
                <FilePlus className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {query || statusFilter
                  ? "ไม่พบข้อมูลที่ค้นหา"
                  : "ยังไม่มีข้อมูลในระบบ"}
              </h3>
              <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">
                {query || statusFilter
                  ? "ลองเปลี่ยนคำค้นหา หรือเปลี่ยนตัวกรองสถานะ"
                  : "เริ่มต้นด้วยการเพิ่มข้อมูลการสำรวจใหม่ ข้อมูลจะแสดงที่นี่"}
              </p>
              {(query || statusFilter) && (
                <Link
                  href="/EmploymentDashboard"
                  className="mt-6 text-sm font-medium text-green-600 hover:underline"
                >
                  ดูข้อมูลทั้งหมด
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

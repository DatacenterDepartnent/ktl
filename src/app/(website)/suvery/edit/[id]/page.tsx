// src/app/suvery/edit/[id]/page.tsx

import SuveryEditForm from "@/components/SuveryEditForm"; // ต้องมั่นใจว่าไฟล์นี้มีอยู่จริง
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Pencil,
  Briefcase,
  GraduationCap,
  UserX,
} from "lucide-react";

// 💡 บังคับให้เป็น Dynamic Page (ไม่ Cache ข้อมูลเก่า)
export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 🚀 ฟังก์ชันดึงข้อมูลจาก DB โดยตรง (Server Action Style)
async function getSuveryById(encodedId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. 🔓 ถอดรหัส Base64 (ถ้า ID ถูก encode มาจากหน้า List)
    let id = encodedId;
    try {
      // เช็คเบื้องต้นว่าเป็น Base64 ไหม (ถ้า encodedId ไม่ใช่ ObjectId ปกติ)
      if (!ObjectId.isValid(encodedId)) {
        id = atob(encodedId);
      }
    } catch (e) {
      console.warn("ID might not be base64 encoded, using as is.");
    }

    // 2. ตรวจสอบความถูกต้องของ ObjectId ของ MongoDB
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return null;
    }

    // 3. Query ข้อมูลจาก Database
    const suveryData = await db.collection("suvery").findOne({ _id: new ObjectId(id) });

    if (!suveryData) return null;

    // 4. แปลง ObjectId และ Date เป็น String เพื่อส่งให้ Client Component ได้
    return JSON.parse(JSON.stringify(suveryData));
  } catch (error) {
    console.error("Error fetching suvery details:", error);
    return null;
  }
}

export default async function EditSuveryPage(props: EditPageProps) {
  // ✅ Next.js 15: ต้อง await params ก่อนใช้งาน
  const { id } = await props.params;

  // 🔥 ดึงข้อมูลจริงจาก Database
  const suvery = await getSuveryById(id);

  // Helper สำหรับเลือก Icon ตามสถานะ (เพื่อความสวยงามส่วน Header)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ทำงานแล้ว":
        return <Briefcase className="h-5 w-5" />;
      case "ศึกษาต่อ":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <UserX className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ทำงานแล้ว":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "ศึกษาต่อ":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    }
  };

  // --------------------------------------------------------
  // ❌ กรณีไม่พบข้อมูลใน Database (Error State)
  // --------------------------------------------------------
  if (!suvery) {
    return (
      <div className="flex max-w-[1600px] mx-auto items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800">
          <div className="bg-red-50 p-8 text-center dark:bg-red-900/20">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ไม่พบข้อมูล
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              ไม่พบข้อมูลรหัส{" "}
              <span className="font-mono text-xs bg-gray-200 px-1 rounded">
                {id}
              </span>{" "}
              ในระบบ หรือข้อมูลอาจถูกลบไปแล้ว
            </p>
          </div>
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 dark:border-gray-700 dark:bg-gray-800/50">
            <Link
              href="/EmploymentDashboard"
              className="group flex w-full items-center justify-center rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              กลับไปหน้า Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ✅ กรณีพบข้อมูล: แสดงฟอร์มแก้ไข (Success State)
  // --------------------------------------------------------
  return (
    <div className="max-w-[1600px] mx-auto bg-slate-50 font-sans text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-emerald-600 to-slate-50 opacity-90 dark:from-emerald-900 dark:to-gray-950" />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* --- Breadcrumb & Back Button --- */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/EmploymentDashboard"
            className="group flex w-fit items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ย้อนกลับ
          </Link>
          <div className="hidden text-sm font-medium text-emerald-100 sm:block">
            Dashboard / แก้ไขข้อมูล / {suvery.studentId}
          </div>
        </div>

        {/* --- Header Card --- */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-gray-900">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Pencil className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  แก้ไขข้อมูลแบบสำรวจ
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {suvery.fullName}
                    </span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    รหัสนักศึกษา: {suvery.studentId}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold ${getStatusColor(suvery.currentStatus)}`}
            >
              {getStatusIcon(suvery.currentStatus)}
              <span>{suvery.currentStatus}</span>
            </div>
          </div>

          {/* Progress Bar (Decorative) */}
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full w-full bg-emerald-500"></div>
          </div>
        </div>

        {/* --- Main Form Content --- */}
        {/* ส่งข้อมูล suvery ที่ดึงมาจาก DB เข้าไปที่ Form */}
        <div className="rounded-3xl bg-white p-1 shadow-lg dark:bg-gray-900">
          <SuveryEditForm suvery={suvery} />
        </div>
      </div>
    </div>
  );
}

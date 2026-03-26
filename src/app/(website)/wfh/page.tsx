"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  Clock,
  CalendarDays,
  User,
  FileText,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function WFHHubPage() {
  const { data: session } = useSession();

  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string;
    image: string | null;
  }>({
    name: "",
    image: null,
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Fetch latest profile data
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            name: data.name || data.username || "",
            image: data.image || null,
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();

    return () => clearInterval(timer);
  }, []);

  const userName = profileData.name || session?.user?.name || "พนักงาน (คุณ)";
  const userImage = profileData.image || session?.user?.image || null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center py-12 px-5 font-sans text-slate-800">
      {/* Header Panel (Adapted from Profile Page) */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-6 mb-8 mt-2 relative">
        <div className="flex items-center space-x-5">
          {/* Avatar Premium Design */}
          <div className="relative group/avatar cursor-pointer">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-black/10 bg-slate-100 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={36} className="text-slate-300" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1
              className="font-black text-2xl sm:text-3xl text-slate-800 leading-none tracking-tight truncate max-w-[180px] pb-2"
              title={userName}
            >
              {userName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />{" "}
                WFH MODE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clock Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100 p-8 mb-8 text-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-400 to-indigo-500"></div>
        <div className="flex justify-center mb-2">
          <Clock className="text-slate-300" size={28} />
        </div>
        <div className="text-6xl font-black tracking-tighter text-slate-800 font-mono drop-shadow-sm mb-2">
          {mounted
            ? time.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--"}
          <span className="text-2xl text-slate-400 ml-1">
            {mounted ? time.getSeconds().toString().padStart(2, "0") : "--"}
          </span>
        </div>
        <div className="flex items-center justify-center text-slate-500 space-x-2">
          <CalendarDays size={16} />
          <span className="text-sm font-medium">
            {mounted
              ? time.toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "\u00A0"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          ทำรายการลงเวลา
        </h3>

        <Link href="/check-in?action=in" className="block">
          <div className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-5 rounded-2xl flex items-center justify-between transition shadow-lg shadow-green-500/30 active:scale-[0.98] group">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition">
                <LogIn size={24} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-xl">ลงเวลาเข้างาน</h2>
                <p className="text-green-100 text-sm">
                  เข้าสู่ระบบเพื่อเริ่มทำงานวันนี้
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/check-in?action=out" className="block">
          <div className="bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white p-5 rounded-2xl flex items-center justify-between transition shadow-lg shadow-orange-500/30 active:scale-[0.98] group">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition">
                <LogOut size={24} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-xl">ลงเวลาออกงาน</h2>
                <p className="text-orange-100 text-sm">
                  บันทึกเวลาเลิกงานและกลับบ้าน
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Leave & History Options */}
      <div className="w-full max-w-xl mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/leave-request" className="block w-full">
          <div className="bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 p-5 rounded-2xl flex items-center justify-between transition shadow-md active:scale-[0.98] group h-full">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-slate-100 transition text-indigo-400 group-hover:text-indigo-600 border border-slate-100">
                <CalendarDays size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-lg text-slate-800">แจ้งลางาน</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  ป่วย กิจ พักร้อน
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/wfh/history" className="block w-full">
          <div className="bg-white border-2 border-slate-100 dark:border-zinc-800 hover:border-slate-200 text-slate-700 p-5 rounded-2xl flex items-center justify-between transition shadow-md active:scale-[0.98] group h-full">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-50 dark:bg-zinc-900 p-2.5 rounded-xl group-hover:bg-slate-100 transition text-pink-400 group-hover:text-pink-600 border border-slate-100 dark:border-zinc-800">
                <Clock size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-lg text-slate-800">
                  ประวัติของฉัน
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
                  การลงเวลา/ลางาน
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/work-report" className="block w-full sm:col-span-2">
          <div className="bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/50 text-slate-700 p-5 rounded-2xl flex items-center justify-between transition shadow-md active:scale-[0.98] group h-full">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition text-blue-500 group-hover:text-blue-600 border border-blue-100 dark:border-blue-900/30">
                <FileText size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-lg text-slate-800 dark:text-zinc-200">
                  รายงานการปฏิบัติงาน
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
                  บันทึกสรุปงานที่ทำประจำวัน
                </p>
              </div>
            </div>
            <div className="bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

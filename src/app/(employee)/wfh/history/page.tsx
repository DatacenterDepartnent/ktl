"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowLeft, CalendarDays, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function WFHHistoryPage() {
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">("attendance");
  const [attendances, setAttendances] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attRes, leaveRes] = await Promise.all([
          fetch("/api/attendance/history"),
          fetch("/api/attendance/leave")
        ]);

        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendances(attData.data || []);
        } else {
          console.error("Attendance history fetch failed");
        }
        if (leaveRes.ok) {
          const leaveData = await leaveRes.json();
          setLeaves(leaveData);
        } else {
          console.error("Leave history fetch failed");
        }
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Present") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Late") return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "Leave") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Absent") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getLeaveStatusColor = (status: string) => {
    if (status === "approved") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (status === "rejected") return "text-rose-600 bg-rose-50 border-rose-200";
    return "text-amber-600 bg-amber-50 border-amber-200";
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      sick: "ลาป่วย", personal: "ลากิจ", vacation: "ลาพักร้อน", maternity: "ลาคลอด", other: "อื่นๆ"
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/wfh" className="text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-zinc-800 p-3 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">My History</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">ตรวจสอบประวัติการลงเวลาและลางาน</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "attendance" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400"}`}
          >
            <Clock size={18} /> ประวัติเข้างาน
          </button>
          <button
            onClick={() => setActiveTab("leaves")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "leaves" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400"}`}
          >
            <FileText size={18} /> ประวัติการลางาน
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium animate-pulse">กำลังสืบค้นข้อมูลปฏิทินของท่าน...</div>
        ) : (
          <div className="space-y-4">
            {activeTab === "attendance" && (
              attendances.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                  <CalendarDays className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg">ไม่พบข้อมูลการลงเวลาเข้างาน</p>
                </div>
              ) : (
                attendances.map((record, index) => (
                  <motion.div
                    key={record._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 dark:bg-indigo-500/10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <span className="text-xs font-bold uppercase">{format(new Date(record.date || record.createdAt), "MMM", { locale: th })}</span>
                        <span className="text-2xl font-black leading-none mt-0.5">{format(new Date(record.date || record.createdAt), "dd")}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="text-base font-bold text-slate-800 dark:text-white">
                            {format(new Date(record.date || record.createdAt), "EEEE", { locale: th })}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                          {record.checkIn?.time && (
                            <p className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                              <Clock size={14} className="text-emerald-500" /> <span className="font-semibold text-slate-800 dark:text-zinc-200">{format(new Date(record.checkIn.time), "HH:mm")}</span> น. • {record.checkIn.statusTag}
                            </p>
                          )}
                          {record.checkOut?.time && (
                            <p className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                              <Clock size={14} className="text-rose-500" /> <span className="font-semibold text-slate-800 dark:text-zinc-200">{format(new Date(record.checkOut.time), "HH:mm")}</span> น.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            )}

            {activeTab === "leaves" && (
              leaves.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                  <FileText className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg">ไม่พบประวัติการส่งคำขอลางาน</p>
                </div>
              ) : (
                leaves.map((leave, index) => (
                  <motion.div
                    key={leave._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getLeaveStatusColor(leave.status)}`}>
                          {leave.status === "pending" ? "รออนุมัติจาก HR" : leave.status === "approved" ? "อนุมัติเรียบร้อย" : "ไม่อนุมัติคำขอ"}
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                          {getTypeLabel(leave.leaveType)}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-3">
                        <p className="text-sm text-slate-700 dark:text-zinc-300 flex items-center gap-2 font-medium">
                          <CalendarDays size={16} className="text-blue-500" /> 
                          ลาตั้งแต่วันที่ {format(new Date(leave.startDate), "dd MMM yy", { locale: th })} ถึง {format(new Date(leave.endDate), "dd MMM yy", { locale: th })}
                        </p>
                        <div className="text-sm text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 leading-relaxed italic">
                          &quot;{leave.reason}&quot;
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function WFHHistoryPage() {
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">(
    "attendance",
  );
  const [attendances, setAttendances] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attRes, leaveRes] = await Promise.all([
          fetch("/api/attendance/history"),
          fetch("/api/attendance/leave"),
        ]);

        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendances(attData.data || []);
        }
        if (leaveRes.ok) {
          const leaveData = await leaveRes.json();
          setLeaves(leaveData);
        }
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Present":
        return { color: "emerald", icon: CheckCircle2, label: "มาตรงเวลา" };
      case "Late":
        return { color: "amber", icon: Clock, label: "มาสาย" };
      case "Leave":
        return { color: "indigo", icon: Info, label: "ลางาน" };
      case "Absent":
        return { color: "rose", icon: XCircle, label: "ขาดงาน" };
      default:
        return { color: "slate", icon: AlertCircle, label: status };
    }
  };

  const getLeaveStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { color: "emerald", icon: CheckCircle2, label: "อนุมัติแล้ว" };
      case "rejected":
        return { color: "rose", icon: XCircle, label: "ปฏิเสธ" };
      default:
        return { color: "amber", icon: Clock, label: "รอพิจารณา" };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      sick: "ลาป่วย",
      personal: "ลากิจ",
      paternity: "ลาช่วยภริยา",
      maternity: "ลาคลอด",
      ordination: "ลาบวช",
      official: "ราชการ",
      other: "อื่นๆ",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Link
                href="/wfh"
                className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-2">
                  My <span className="text-blue-600">History</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Personal Data Management Matrix
                </p>
              </div>
            </div>
          </div>

          {/* Premium Toggle System */}
          <div className="relative flex bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/5 w-full md:w-auto overflow-hidden">
            <motion.div
              animate={{ x: activeTab === "attendance" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-xl"
            />
            <button
              onClick={() => setActiveTab("attendance")}
              className={`relative z-10 flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === "attendance" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Clock size={16} /> Attendance
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`relative z-10 flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === "leaves" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FileText size={16} /> Leave History
            </button>
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 animate-pulse h-32"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {activeTab === "attendance" ? (
                attendances.length === 0 ? (
                  <div className="text-center py-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-inner">
                    <CalendarDays className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">
                      No Attendance Matrix Found
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-zinc-600 uppercase tracking-widest">
                      Start checking in to populate this log.
                    </p>
                  </div>
                ) : (
                  attendances.map((record, index) => {
                    const cfg = getStatusConfig(record.status);
                    const StatusIcon = cfg.icon;
                    return (
                      <motion.div
                        key={record._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/2 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          {/* Date Box */}
                          <div className="bg-slate-50 dark:bg-zinc-950 w-20 h-20 rounded-4xl flex flex-col items-center justify-center shadow-inner border border-slate-100 dark:border-zinc-800 group-hover:scale-105 transition-transform duration-500">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                              {format(
                                new Date(record.date || record.createdAt),
                                "MMM",
                                { locale: th },
                              )}
                            </span>
                            <span className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-1 tracking-tighter">
                              {format(
                                new Date(record.date || record.createdAt),
                                "dd",
                              )}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-baseline gap-3 mb-2">
                              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {format(
                                  new Date(record.date || record.createdAt),
                                  "EEEE",
                                  { locale: th },
                                )}
                              </h3>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm border-${cfg.color}-100 bg-${cfg.color}-50 text-${cfg.color}-600 dark:bg-${cfg.color}-500/10 dark:text-${cfg.color}-400 dark:border-${cfg.color}-500/20`}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-slate-400">
                              {record.checkIn?.time && (
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="uppercase tracking-widest">
                                    In:
                                  </span>
                                  <span className="text-slate-800 dark:text-zinc-200 font-black">
                                    {format(
                                      new Date(record.checkIn.time),
                                      "HH:mm",
                                    )}{" "}
                                    น.
                                  </span>
                                  {record.checkIn.statusTag && (
                                    <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-[8px] font-black">
                                      {record.checkIn.statusTag}
                                    </span>
                                  )}
                                </div>
                              )}
                              {record.checkOut?.time && (
                                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-zinc-800 pl-6">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <span className="uppercase tracking-widest">
                                    Out:
                                  </span>
                                  <span className="text-slate-800 dark:text-zinc-200 font-black">
                                    {format(
                                      new Date(record.checkOut.time),
                                      "HH:mm",
                                    )}{" "}
                                    น.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t border-slate-50 dark:border-zinc-800 md:border-none pt-4 md:pt-0">
                          <div className="flex -space-x-2">
                            {[1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-sm"
                              >
                                <MapPin
                                  size={12}
                                  className="w-full h-full p-2 text-slate-300"
                                />
                              </div>
                            ))}
                          </div>
                          <ChevronRight
                            className="text-slate-200 dark:text-zinc-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                            size={20}
                          />
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : leaves.length === 0 ? (
                <div className="text-center py-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-inner">
                  <FileText className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">
                    No Leave Documents Found
                  </p>
                  <p className="text-[10px] text-slate-300 dark:text-zinc-600 uppercase tracking-widest">
                    Your leave requests will appear here once submitted.
                  </p>
                </div>
              ) : (
                leaves.map((leave, index) => {
                  const cfg = getLeaveStatusConfig(leave.status);
                  return (
                    <motion.div
                      key={leave._id || index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/2 flex flex-col gap-6 hover:shadow-2xl transition-all hover:border-blue-500/30"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-zinc-950 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl shadow-inner text-slate-400 group-hover:text-blue-500 transition-colors">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                              {getTypeLabel(leave.leaveType)}
                            </h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                              <Clock size={10} /> Request Submitted on{" "}
                              {format(new Date(leave.createdAt), "dd MMM yy", {
                                locale: th,
                              })}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm flex items-center gap-2 self-start md:self-auto border-${cfg.color}-100 bg-${cfg.color}-50 text-${cfg.color}-600 dark:bg-${cfg.color}-500/10 dark:text-${cfg.color}-400 dark:border-${cfg.color}-500/20`}
                        >
                          <cfg.icon size={14} />
                          {cfg.label}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100/50 dark:border-blue-500/10">
                            <Calendar size={18} className="text-blue-600" />
                            <div>
                              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                                Period Range
                              </p>
                              <p className="text-sm font-black text-slate-700 dark:text-zinc-200">
                                {format(
                                  new Date(leave.startDate),
                                  "dd MMM yy",
                                  { locale: th },
                                )}{" "}
                                —{" "}
                                {format(new Date(leave.endDate), "dd MMM yy", {
                                  locale: th,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800 relative group/reason overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                              <Info size={40} />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <TrendingUp
                                size={12}
                                className="text-slate-300"
                              />{" "}
                              Justification Objective
                            </p>
                            <p className="text-sm font-bold text-slate-600 dark:text-zinc-400 italic leading-relaxed">
                              &quot;{leave.reason}&quot;
                            </p>
                          </div>
                        </div>

                        {/* Action/Preview Section */}
                        <div className="flex flex-col gap-4">
                          <div className="flex-1 min-h-[100px] border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-6 group/artifact hover:bg-slate-50 dark:hover:bg-zinc-950 transition-colors">
                            {leave.attachmentUrl ? (
                              <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-emerald-500/10 border border-emerald-100">
                                  <Search size={18} />
                                </div>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">
                                  Attachment Secured
                                </p>
                                <Link
                                  href={leave.attachmentUrl}
                                  target="_blank"
                                  className="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-500/30 hover:border-blue-500 pb-0.5 transition-all"
                                >
                                  Preview Artifact
                                </Link>
                              </div>
                            ) : (
                              <div className="text-center opacity-40">
                                <XCircle size={20} className="mx-auto mb-3" />
                                <p className="text-[9px] font-black uppercase tracking-widest">
                                  No Documents Provided
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-12 pb-8 text-center border-t border-slate-100 dark:border-zinc-900/50">
          <p className="text-[9px] text-slate-300 dark:text-zinc-800 font-black uppercase tracking-[0.4em] leading-loose">
            Precision Attendance Logging Protocol <br />
            Authorized User Data Access • V2.0 Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

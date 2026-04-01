"use client";

import { useState, useEffect, useRef } from "react";
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
  Edit2,
  Save,
  Plus,
  Trash2,
  Loader2,
  Target,
  AlertTriangle,
  Lightbulb,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
 
// Utility function for client-side image compression (with Safari/iOS fallback)
const compressImage = async (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onerror = () => resolve(base64Str);
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(base64Str);
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        } catch (canvasErr) {
          console.error("Canvas compression failed, using original:", canvasErr);
          resolve(base64Str);
        }
      };
      img.src = base64Str;
    } catch (err) {
      console.error("Compression startup failed, using original:", err);
      resolve(base64Str);
    }
  });
};

export default function WFHHistoryPage() {
  const [activeTab, setActiveTab] = useState<
    "attendance" | "leaves" | "reports"
  >("attendance");
  const [attendances, setAttendances] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    summary: "",
    problems: "",
    plansNextDay: "",
    activities: [{ taskName: "", detail: "", status: "Completed" as "Completed" | "In Progress" | "Pending" }],
    images: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, leaveRes, reportRes] = await Promise.all([
        fetch("/api/attendance/history"),
        fetch("/api/attendance/leave"),
        fetch("/api/work-report"),
      ]);

      if (attRes.ok) {
        const attData = await attRes.json();
        setAttendances(attData.data || []);
      }
      if (leaveRes.ok) {
        const leaveData = await leaveRes.json();
        setLeaves(leaveData);
      }
      if (reportRes.ok) {
        const reportData = await reportRes.json();
        setReports(reportData.data || []);
      }
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleEdit = (report: any) => {
    setEditingReport(report);
    setEditFormData({
      summary: report.summary || "",
      problems: report.problems || "",
      plansNextDay: report.plansNextDay || "",
      activities:
        report.activities?.length > 0
          ? [...report.activities]
          : [{ taskName: "", detail: "", status: "Completed" }],
      images: report.images || [],
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingReport) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/work-report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingReport._id || editingReport.id,
          ...editFormData,
        }),
      });

      if (res.ok) {
        setReports(
          reports.map((r) =>
            r._id === editingReport._id || r.id === editingReport.id
              ? { ...r, ...editFormData }
              : r,
          ),
        );
        setIsEditModalOpen(false);
        setEditingReport(null);
      } else {
        const error = await res.json();
        alert("Failed to save: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Save error", error);
      alert("Error saving report");
    } finally {
      setIsSaving(false);
    }
  };

  const addActivity = () => {
    setEditFormData({
      ...editFormData,
      activities: [
        ...editFormData.activities,
        { taskName: "", detail: "", status: "Completed" },
      ],
    });
  };

  const removeActivity = (index: number) => {
    const newActivities = [...editFormData.activities];
    newActivities.splice(index, 1);
    setEditFormData({ ...editFormData, activities: newActivities });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setEditFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), compressed],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-2 md:p-4 font-sans selection:bg-blue-500/30 relative overflow-hidden text-left">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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
                  ประวัติ <span className="text-blue-600">ของฉัน</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  ประวัติการใช้งานระบบของฉัน
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/5 w-full md:w-auto overflow-hidden">
            <motion.div
              animate={{
                x:
                  activeTab === "attendance"
                    ? 0
                    : activeTab === "leaves"
                      ? "100%"
                      : "200%",
                width: "33.33%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1.5 left-1.5 bottom-1.5 bg-blue-600 rounded-xl"
            />
            <button
              onClick={() => setActiveTab("attendance")}
              className={`relative z-10 flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "attendance" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Clock size={14} />
              <span className="hidden sm:inline">การเข้างาน</span>
              <span className="sm:hidden">เข้างาน</span>
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`relative z-10 flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "leaves" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FileText size={14} />
              <span className="hidden sm:inline">การลางาน</span>
              <span className="sm:hidden">ลางาน</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`relative z-10 flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "reports" ? "text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FileText size={14} />
              <span className="hidden sm:inline">รายงานผล</span>
              <span className="sm:hidden">ผลงาน</span>
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
                  className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 animate-pulse h-32"
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
                      ไม่พบรายการ
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-zinc-600 uppercase tracking-widest">
                      เริ่มเช็คอินเพื่อบันทึกข้อมูลลงในบันทึกนี้
                    </p>
                  </div>
                ) : (
                  attendances.map((record, index) => {
                    const cfg = getStatusConfig(record.status);
                    return (
                      <motion.div
                        key={record._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/2 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-2xl transition-all"
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="bg-slate-50 dark:bg-zinc-950 w-20 h-20 rounded-4xl flex flex-col items-center justify-center shadow-inner border border-slate-100 dark:border-zinc-800 transition-transform duration-500">
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
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm border-${cfg.color}-100 bg-${cfg.color}-50 text-${cfg.color}-600 dark:bg-${cfg.color}-500/10 dark:text-${cfg.color}-400`}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-slate-400">
                              {record.checkIn?.time && (
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>
                                    เข้างาน:{" "}
                                    {format(
                                      new Date(record.checkIn.time),
                                      "HH:mm",
                                    )}{" "}
                                    น.
                                  </span>
                                </div>
                              )}
                              {record.checkOut?.time && (
                                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-zinc-800 pl-6">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <span>
                                    ออกงาน:{" "}
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
                          {/* Image Previews */}
                          <div className="flex gap-2">
                            {record.checkIn?.photoUrl && (
                              <Link
                                href={record.checkIn.photoUrl}
                                target="_blank"
                                className="w-10 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
                              >
                                <img
                                  src={record.checkIn.photoUrl}
                                  alt="In"
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                            )}
                            {record.checkOut?.photoUrl && (
                              <Link
                                href={record.checkOut.photoUrl}
                                target="_blank"
                                className="w-10 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
                              >
                                <img
                                  src={record.checkOut.photoUrl}
                                  alt="Out"
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                            )}
                          </div>
                          <ChevronRight className="text-slate-300" size={20} />
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : activeTab === "leaves" ? (
                leaves.length === 0 ? (
                  <div className="text-center py-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-inner">
                    <FileText className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">
                      ไม่พบเอกสารการลา
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
                        className="group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/2 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-950 pb-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl text-slate-400">
                              <FileText size={20} />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {getTypeLabel(leave.leaveType)}
                              </h3>
                              <p className="text-[9px] font-black text-slate-400 uppercase">
                                ส่งเมื่อ{" "}
                                {format(
                                  new Date(leave.createdAt),
                                  "dd MMM yy",
                                  { locale: th },
                                )}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${cfg.color}-50 text-${cfg.color}-600 dark:bg-${cfg.color}-500/10`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                              เหตุผล
                            </p>
                            <p className="text-sm font-medium text-slate-600 italic">
                              &quot;{leave.reason}&quot;
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                            <p className="text-[9px] font-black text-blue-400 uppercase mb-1">
                              ช่วงเวลา
                            </p>
                            <p className="text-sm font-black text-slate-700">
                              {format(new Date(leave.startDate), "dd MMM", {
                                locale: th,
                              })}{" "}
                              -{" "}
                              {format(new Date(leave.endDate), "dd MMM yy", {
                                locale: th,
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : reports.length === 0 ? (
                <div className="text-center py-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-inner">
                  <FileText className="w-16 h-16 text-slate-200 dark:text-zinc-800 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">
                    ไม่พบรายงานการทำงาน
                  </p>
                </div>
              ) : (
                reports.map((report, index) => (
                  <motion.div
                    key={report._id || report.id || index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/2 hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                      <div className="flex items-center gap-5">
                        <div className="bg-blue-50 dark:bg-blue-500/10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-blue-100 dark:border-blue-500/20">
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                            {format(
                              new Date(report.date || report.createdAt),
                              "MMM",
                              { locale: th },
                            )}
                          </span>
                          <span className="text-2xl font-black text-slate-800 dark:text-white leading-none mt-1">
                            {format(
                              new Date(report.date || report.createdAt),
                              "dd",
                            )}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1">
                            รายงานผลการปฏิบัติงาน
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar size={12} className="text-blue-500" />
                            {format(
                              new Date(report.date || report.createdAt),
                              "EEEE, d MMMM yyyy",
                              { locale: th },
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(report)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white group/btn active:scale-95 shadow-lg shadow-black/5"
                      >
                        <Edit2
                          size={14}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />
                        แก้ไขรายงาน
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <TrendingUp size={12} className="text-blue-500" />{" "}
                          สรุปผลงานสำคัญ
                        </p>
                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 line-clamp-2 italic">
                          &quot;{report.summary || "ไม่ได้ระบุสรุปผล"}&quot;
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-12 pb-8 text-center border-t border-slate-100 dark:border-zinc-900/50">
          <p className="text-[9px] text-slate-300 dark:text-zinc-800 font-black uppercase tracking-[0.4em] leading-loose">
            โพรโทคอลบันทึกการเข้างานที่แม่นยำ <br />
            สิทธิ์การเข้าถึงข้อมูลโดยผู้ใช้ที่ได้รับอนุญาต • แผงควบคุม V2.0
          </p>
        </div>
      </div>

      {/* Modernized Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 dark:border-zinc-900 flex justify-between items-center text-left bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Edit2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      ปรับปรุง{" "}
                      <span className="text-blue-600">
                        รายงานผลการปฏิบัติงาน
                      </span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      เอกสารประจำวัน :{" "}
                      {format(
                        new Date(editingReport.date || editingReport.createdAt),
                        "dd MMMM yyyy",
                        { locale: th },
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full text-slate-400 hover:text-rose-500 transition-all hover:rotate-90 active:scale-90"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-2 overflow-y-auto space-y-10 text-left custom-scrollbar-thin">
                {/* Indigo Activities Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">
                          รายละเอียดกิจกรรมหลัก
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          เพิ่มหรือระบุสถานะความคืบหน้า
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditFormData({
                          ...editFormData,
                          activities: [
                            { taskName: "", detail: "", status: "Completed" },
                            ...editFormData.activities,
                          ],
                        });
                      }}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus size={14} /> เพิ่มรายการใหม่
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editFormData.activities.map((act: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-4xl border border-slate-100 dark:border-zinc-800 transition-all hover:border-indigo-500/30"
                      >
                        <div className="flex gap-4">
                          <div className="flex-none w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xs font-black text-indigo-600">
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  หัวข้อกิจกรรม
                                </label>
                                <input
                                  value={act.taskName}
                                  onChange={(e) => {
                                    const newActs = [
                                      ...editFormData.activities,
                                    ];
                                    newActs[idx].taskName = e.target.value;
                                    setEditFormData({
                                      ...editFormData,
                                      activities: newActs,
                                    });
                                  }}
                                  className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  สถานะความสำเร็จ
                                </label>
                                <div className="flex gap-2">
                                  {(
                                    [
                                      "Completed",
                                      "In Progress",
                                      "Pending",
                                    ] as const
                                  ).map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => {
                                        const newActs = [
                                          ...editFormData.activities,
                                        ];
                                        newActs[idx].status = s;
                                        setEditFormData({
                                          ...editFormData,
                                          activities: newActs,
                                        });
                                      }}
                                      className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                                        act.status === s
                                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400"
                                      }`}
                                    >
                                      {s === "Completed"
                                        ? "สำเร็จ"
                                        : s === "In Progress"
                                          ? "กำลังทำ"
                                          : "รอ"}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                รายละเอียดเชิงลึก
                              </label>
                              <textarea
                                value={act.detail}
                                onChange={(e) => {
                                  const newActs = [...editFormData.activities];
                                  newActs[idx].detail = e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    activities: newActs,
                                  });
                                }}
                                rows={2}
                                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[11px] font-medium text-slate-600 dark:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500/20 italic resize-none"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeActivity(idx)}
                            disabled={editFormData.activities.length <= 1}
                            className="flex-none p-3 h-10 w-10 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-0"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emerald Summary Section */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest">
                        สรุปผลงานวันนี้ (Summary)
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase">
                        อธิบายภาพรวมของผลสำเร็จที่เกิดขึ้น
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={editFormData.summary}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        summary: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full bg-white dark:bg-zinc-950 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-4 text-sm font-medium text-emerald-800 dark:text-emerald-100 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none italic"
                  />
                </div>

                {/* Grid for Problems & Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-50 dark:bg-rose-500/5 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <AlertTriangle size={20} />
                      </div>
                      <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">
                        ปัญหาที่พบ
                      </h3>
                    </div>
                    <textarea
                      value={editFormData.problems}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          problems: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full bg-white dark:bg-zinc-950 border border-rose-100 dark:border-rose-800/30 rounded-2xl p-5 text-xs font-medium text-rose-800 dark:text-rose-100 outline-none resize-none"
                    />
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Lightbulb size={20} />
                      </div>
                      <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest">
                        แผนงานพรุ่งนี้
                      </h3>
                    </div>
                    <textarea
                      value={editFormData.plansNextDay}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          plansNextDay: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full bg-white dark:bg-zinc-950 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-5 text-xs font-medium text-amber-800 dark:text-amber-100 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Images Selection Section */}
                <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-700 dark:text-zinc-300 uppercase tracking-widest">
                          รูปภาพประกอบเดิม
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          คลิกกากบาทเพื่อลบ หรือกด + เพื่อเพิ่มรูปใหม่
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-full text-[10px] font-black text-blue-500 border border-slate-100 dark:border-zinc-700">
                      {editFormData.images?.length || 0} รูป
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    <AnimatePresence>
                      {editFormData.images?.map((img, idx) => (
                        <motion.div
                          key={img + idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative aspect-square group/img"
                        >
                          <img
                            src={img}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm"
                          />
                          <button
                            onClick={() => {
                              const newImgs = editFormData.images.filter(
                                (_, i) => i !== idx,
                              );
                              setEditFormData({
                                ...editFormData,
                                images: newImgs,
                              });
                            }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 active:scale-90 z-10"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Add Image Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 transition-all group/add bg-white dark:bg-zinc-950/50 shadow-sm"
                    >
                      <div className="p-1.5 bg-slate-50 dark:bg-zinc-900 rounded-full group-hover/add:scale-110 transition-transform">
                        <Plus size={16} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-tighter">
                        เพิ่มรูป
                      </span>
                    </button>
                  </div>

                  {(!editFormData.images || editFormData.images.length === 0) && (
                    <div className="py-2 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        กดปุ่ม + เพื่อเลือกรูปภาพประกอบ
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-slate-100 dark:border-zinc-800 flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-2 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? "กำลังบันทึก..." : "อัปเดตข้อมูลรายงาน"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

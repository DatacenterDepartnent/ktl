"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  ShieldCheck,
  Download,
} from "lucide-react";

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all

  const LIMIT = 20;

  const fetchLeaves = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else {
      setLoading(true);
      setSkip(0);
    }

    try {
      const currentSkip = isLoadMore ? skip + LIMIT : 0;
      const res = await fetch(
        `/api/admin/leave?status=${filter}&limit=${LIMIT}&skip=${currentSkip}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (isLoadMore) {
          setLeaves((prev) => [...prev, ...data]);
        } else {
          setLeaves(data);
        }
        setSkip(currentSkip);
        setHasMore(data.length === LIMIT);
      }
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchLeaves(false);
  }, [filter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (
      !confirm(
        `ยืนยันการตั้งสถานะเป็น ${newStatus === "approved" ? "อนุมัติ" : "ปฏิเสธ"}?`,
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        // Simple way to refresh: refetch first page or remove from current list
        // For better UX, we'll just refetch the whole visible set or a subset
        // Here we just refetch the initial state for simplicity
        fetchLeaves(false);
      } else {
        alert("ไม่สามารถอัปเดตสถานะได้");
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      sick: "ลาป่วย",
      personal: "ลากิจส่วนตัว",
      paternity: "ลาช่วยเหลือภริยาที่คลอดบุตร",
      maternity: "ลาคลอด",
      ordination: "ลาอุปสมบท",
      official: "ไปราชการ",
      other: "อื่นๆ",
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    if (status === "approved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "rejected")
      return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const exportToCSV = () => {
    if (leaves.length === 0) return alert("ไม่มีข้อมูลสำหรับ Export");

    const headers = [
      "ชื่อพนักงาน",
      "ประเภทการลา",
      "สถานะ",
      "เริ่มวันที่",
      "ถึงวันที่",
      "เหตุผล",
      "วันที่ส่งคำขอ",
    ];
    const csvData = leaves.map((leave) =>
      [
        `"${leave.user?.name || leave.user?.username || "Unknown Employee"}"`,
        `"${getTypeLabel(leave.leaveType)}"`,
        `"${leave.status === "pending" ? "รออนุมัติ" : leave.status === "approved" ? "อนุมัติ" : "ปฏิเสธ"}"`,
        `"${format(new Date(leave.startDate), "dd/MM/yyyy", { locale: th })}"`,
        `"${format(new Date(leave.endDate), "dd/MM/yyyy", { locale: th })}"`,
        `"${leave.reason.replace(/"/g, '""').replace(/\n/g, " ")}"`,
        `"${format(new Date(leave.createdAt), "dd/MM/yyyy HH:mm", { locale: th })}"`,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `leave_report_${format(new Date(), "yyyyMMdd_HHmm")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 px-2 py-4 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-indigo-500" /> ระบบอนุมัติการลางาน
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              ทบทวนและอนุมัติคำขอลาป่วย ลากิจ และตรวจสอบใบรับรองแพทย์
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto hide-scrollbar">
              {["pending", "approved", "rejected", "all"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {f === "pending"
                    ? "รออนุมัติ"
                    : f === "approved"
                      ? "อนุมัติแล้ว"
                      : f === "rejected"
                        ? "ปฏิเสธ"
                        : "ทั้งหมด"}
                </button>
              ))}
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95 shrink-0"
              title="Export ข้อมูลเป็นไฟล์ CSV/Excel"
            >
              <Download size={18} />{" "}
              <span className="hidden sm:inline">ส่งออกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
              กำลังโหลดข้อมูล...
            </div>
          ) : leaves.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-zinc-800 shadow-sm">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                ไม่มีข้อมูลคำขอลา
              </h3>
              <p className="text-slate-500 mt-1">
                ไม่พบคำขอลาในสถานะที่คุณเลือก
              </p>
            </div>
          ) : (
            <>
              {leaves.map((leave, idx) => (
                <motion.div
                  key={leave._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow"
                >
                  {/* User Info & Dates */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          {leave.user?.name ||
                            leave.user?.username ||
                            "ไม่ระบุชื่อบุคลากร"}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(leave.status)}`}
                          >
                            {leave.status}
                          </span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {getTypeLabel(leave.leaveType)}
                          </span>
                          &bull; ขอเอกสารเมื่อ{" "}
                          {format(
                            new Date(leave.createdAt),
                            "dd MMM yyyy HH:mm",
                            { locale: th },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                        <Clock size={16} className="text-indigo-500" />
                        <strong>เริ่มลา:</strong>{" "}
                        {format(new Date(leave.startDate), "dd MMM yyyy", {
                          locale: th,
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                        <Clock size={16} className="text-indigo-500" />
                        <strong>ถึง:</strong>{" "}
                        {format(new Date(leave.endDate), "dd MMM yyyy", {
                          locale: th,
                        })}
                      </div>
                    </div>

                    <div>
                      <strong className="text-xs text-slate-400 uppercase tracking-widest">
                        เหตุผล
                      </strong>
                      <p className="mt-1 text-slate-700 dark:text-zinc-300">
                        {leave.reason}
                      </p>
                    </div>
                  </div>

                  {/* Attachments & Actions */}
                  <div className="lg:w-64 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-zinc-800 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <strong className="text-xs text-slate-400 uppercase tracking-widest block mb-2">
                        เอกสารแนบ
                      </strong>
                      {leave.attachmentUrl ? (
                        <a
                          href={leave.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-3 rounded-xl transition-colors font-medium border border-blue-100"
                        >
                          <FileText size={16} /> ดูรูปถ่าย/เอกสาร{" "}
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <div className="text-sm text-slate-400 italic bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                          ไม่มีไฟล์แนบส่งมา
                        </div>
                      )}
                    </div>

                    {leave.status === "pending" && (
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "approved")
                          }
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-500/20 active:scale-95"
                        >
                          <CheckCircle size={16} /> อนุมัติ
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "rejected")
                          }
                          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-rose-500/20 active:scale-95"
                        >
                          <XCircle size={16} /> ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => fetchLeaves(true)}
                    disabled={loadingMore}
                    className={`flex items-center gap-2 px-10 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                      loadingMore
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                    }`}
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        กำลังโหลดเพิ่ม...
                      </>
                    ) : (
                      "แสดงเพิ่มอีก 20 รายการ"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

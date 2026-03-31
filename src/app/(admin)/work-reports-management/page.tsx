"use client";

import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Loader2,
  X,
  Calendar,
  ChevronRight,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Trash2,
  Edit2,
  Save,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  taskName: string;
  detail: string;
  status: "Completed" | "In Progress" | "Pending";
}

export default function WorkReportsManagementPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit State
  const [editActivities, setEditActivities] = useState<Activity[]>([]);
  const [editSummary, setEditSummary] = useState("");
  const [editProblems, setEditProblems] = useState("");
  const [editPlansNextDay, setEditPlansNextDay] = useState("");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // Last 30 days for management
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/work-report?startDate=${startDate}&endDate=${endDate}`,
      );
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handleEditInit = (report: any) => {
    setSelectedReport(report);
    setEditActivities(
      report.activities?.map((a: any) => ({
        ...a,
        id: a.id || crypto.randomUUID(),
      })) || [],
    );
    setEditSummary(report.summary || "");
    setEditProblems(report.problems || "");
    setEditPlansNextDay(report.plansNextDay || "");
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/work-report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReport.id,
          activities: editActivities,
          summary: editSummary,
          problems: editProblems,
          plansNextDay: editPlansNextDay,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsEditing(false);
        setSelectedReport(null);
        fetchReports();
      } else {
        alert(json.message || "Failed to update report");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการลบรายงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      )
    )
      return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/work-report?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setReports(reports.filter((r) => r.id !== id));
        setIsDeleting(false);
        setSelectedReport(null);
      } else {
        alert(json.message || "Failed to delete report");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const addActivity = () => {
    setEditActivities([
      {
        id: crypto.randomUUID(),
        taskName: "",
        detail: "",
        status: "Completed",
      },
      ...editActivities,
    ]);
  };

  const removeActivity = (id: string) => {
    if (editActivities.length === 1) return;
    setEditActivities(editActivities.filter((a) => a.id !== id));
  };

  const updateActivityField = (
    id: string,
    field: keyof Activity,
    value: string,
  ) => {
    setEditActivities(
      editActivities.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const filteredReports = reports.filter(
    (r) =>
      r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 px-2 py-4 md:p-6 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-neutral-900 px-4 py-8 md:p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-neutral-100 uppercase tracking-tight">
                จัดการรายงานการปฏิบัติงาน
              </h1>
              <p className="text-sm text-slate-500 dark:text-neutral-400 font-bold mt-1.5 uppercase tracking-widest opacity-70">
                เฉพาะผู้ดูแลระบบสูงสุด • ควบคุมการแก้ไขและลบข้อมูล
              </p>
            </div>
          </div>

          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl shadow-md text-sm font-black hover:scale-105 transition-all active:scale-95"
          >
            <Clock size={18} className={loading ? "animate-spin" : ""} />{" "}
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-neutral-900  px-4 py-6 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
              ค้นหาพนักงาน / แผนก
            </label>
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="พิมพ์ชื่อพนักงาน หรือ แผนก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-neutral-800 border-2 border-transparent focus:border-indigo-500/20 dark:focus:border-indigo-500/30 rounded-2xl focus:outline-none transition-all font-bold placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
              วันที่เริ่ม
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                size={18}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-neutral-800 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl focus:outline-none font-black text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
              วันที่สิ้นสุด
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                size={18}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-neutral-800 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl focus:outline-none font-black text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table View for Management */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-neutral-800/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-neutral-800">
                    พนักงาน
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-neutral-800">
                    วันที่
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-neutral-800">
                    สรุปงาน
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-neutral-800">
                    กิจกรรม
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-neutral-800 text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2
                          size={40}
                          className="animate-spin text-indigo-500 mx-auto mb-4"
                        />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                          กำลังโหลดข้อมูลจัดการรายงาน...
                        </p>
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <AlertCircle
                          size={48}
                          className="text-slate-200 dark:text-neutral-800 mx-auto mb-4"
                        />
                        <p className="text-slate-400 font-black">
                          ไม่พบข้อมูลรายงานในช่วงเวลานี้
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <motion.tr
                        key={report.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <td className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 font-black">
                              {report.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-neutral-200">
                                {report.user.name}
                              </p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                                {report.user.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 text-sm font-bold text-slate-500 dark:text-neutral-400">
                          {new Date(report.date).toLocaleDateString("th-TH", {
                            timeZone: "Asia/Bangkok",
                          })}
                        </td>
                        <td className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 text-sm">
                          <p className="text-slate-600 dark:text-neutral-300 line-clamp-1 max-w-xs">
                            {report.summary}
                          </p>
                        </td>
                        <td className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800">
                          <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black text-[10px]">
                            {report.activities?.length || 0}
                          </span>
                        </td>
                        <td className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditInit(report)}
                              className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                              title="ลบรายงาน"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="flex flex-col h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                      <Edit2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 dark:text-neutral-100 leading-tight">
                        แก้ไขรายงานการปฏิบัติงาน
                      </h2>
                      <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mt-1">
                        พนักงาน: {selectedReport.user.name} •{" "}
                        {new Date(selectedReport.date).toLocaleDateString(
                          "th-TH",
                          { timeZone: "Asia/Bangkok" },
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 hover:bg-white dark:hover:bg-neutral-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-2 space-y-10 custom-scrollbar">
                  {/* Activities */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" /> Activities
                        History
                      </h4>
                      <button
                        onClick={addActivity}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                      >
                        <Plus size={14} /> Add Task
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editActivities.map((act, index) => (
                        <div
                          key={act.id}
                          className="bg-slate-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-slate-100 dark:border-neutral-800 group relative"
                        >
                          <button
                            onClick={() => removeActivity(act.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                              <input
                                type="text"
                                placeholder="ชื่อกิจกรรม / งานที่ทำ"
                                value={act.taskName}
                                onChange={(e) =>
                                  updateActivityField(
                                    act.id,
                                    "taskName",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-transparent border-b-2 border-slate-200 dark:border-neutral-700 py-2 font-bold text-slate-800 dark:text-neutral-100 focus:outline-none focus:border-blue-500 transition-colors"
                              />
                              <textarea
                                placeholder="รายละเอียด (ถ้ามี)"
                                value={act.detail}
                                onChange={(e) =>
                                  updateActivityField(
                                    act.id,
                                    "detail",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-700 mt-3 p-3 rounded-2xl text-xs text-slate-600 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 resize-none"
                                rows={2}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              {(
                                ["Completed", "In Progress", "Pending"] as const
                              ).map((s) => (
                                <button
                                  key={s}
                                  onClick={() =>
                                    updateActivityField(act.id, "status", s)
                                  }
                                  className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                    act.status === s
                                      ? s === "Completed"
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : s === "In Progress"
                                          ? "bg-blue-500 border-blue-500 text-white"
                                          : "bg-amber-500 border-amber-500 text-white"
                                      : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 text-slate-400"
                                  }`}
                                >
                                  {s === "Completed"
                                    ? "เสร็จสิ้น"
                                    : s === "In Progress"
                                      ? "กำลังดำเนินการ"
                                      : "รอดำเนินการ"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                        สรุปภาพรวม
                      </label>
                      <textarea
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-3xl text-sm font-medium text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest pl-2">
                          ปัญหาที่พบ / อุปสรรค
                        </label>
                        <textarea
                          value={editProblems}
                          onChange={(e) => setEditProblems(e.target.value)}
                          className="w-full p-4 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl text-sm font-medium text-rose-800 dark:text-rose-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest pl-2">
                          แผนงานวันถัดไป
                        </label>
                        <textarea
                          value={editPlansNextDay}
                          onChange={(e) => setEditPlansNextDay(e.target.value)}
                          className="w-full p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl text-sm font-medium text-emerald-800 dark:text-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-4 bg-slate-50/50 dark:bg-neutral-800/50">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={actionLoading}
                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-base shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
        }
      `}</style>
    </div>
  );
}

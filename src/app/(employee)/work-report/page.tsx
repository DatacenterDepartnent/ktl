"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FileText,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface Activity {
  id: string; // Unique ID for keys
  taskName: string;
  detail: string;
  status: "Completed" | "In Progress" | "Pending";
  startTime?: string;
  endTime?: string;
}

export default function WorkReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date] = useState(format(new Date(), "yyyy-MM-dd"));
  const [activities, setActivities] = useState<Activity[]>([
    { id: crypto.randomUUID(), taskName: "", detail: "", status: "Completed" },
  ]);
  const [summary, setSummary] = useState("");
  const [problems, setProblems] = useState("");
  const [plansNextDay, setPlansNextDay] = useState("");

  // Refs for auto-scroll have been removed as per user request to avoid jumping

  // Fetch existing report on load (only for today)
  useEffect(() => {
    const fetchReport = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/work-report?date=${date}`);
        const json = await res.json();
        if (json.success && json.data) {
          const report = json.data;
          setActivities(
            report.activities?.map((a: any) => ({
              ...a,
              id: a.id || crypto.randomUUID(),
            })) || [
              {
                id: crypto.randomUUID(),
                taskName: "",
                detail: "",
                status: "Completed",
              },
            ],
          );
          setSummary(report.summary || "");
          setProblems(report.problems || "");
          setPlansNextDay(report.plansNextDay || "");
        }
      } catch (err) {
        console.error("Fetch report error:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchReport();
  }, [date]);

  const addActivity = () => {
    setActivities([
      {
        id: crypto.randomUUID(),
        taskName: "",
        detail: "",
        status: "Completed",
      },
      ...activities,
    ]);
  };

  const removeActivity = (index: number) => {
    if (activities.length === 1) return;
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  const updateActivity = (
    index: number,
    field: keyof Activity,
    value: string,
  ) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setActivities(newActivities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activities.some((a) => !a.taskName.trim())) {
      setError("กรุณาระบุชื่อภารกิจให้ครบถ้วน");
      return;
    }
    if (!summary.trim()) {
      setError("กรุณาระบุสรุปภาพรวมการทำงาน");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/work-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          activities,
          summary,
          problems,
          plansNextDay,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "บันทึกข้อมูลล้มเหลว");

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/wfh");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 font-sans selection:bg-blue-500/30">
      {/* Background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/wfh"
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-2xl text-slate-600 dark:text-zinc-400 hover:text-blue-500 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Daily Work Report
              </h1>
              <p className="text-slate-500 dark:text-zinc-500 text-xs font-medium">
                บันทึกรายงานการปฏิบัติงานรายวัน
              </p>
            </div>
          </div>
          <HelpCircle className="text-slate-300 dark:text-zinc-700" size={24} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  เลือกวันที่รายงาน
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="date"
                    value={date}
                    readOnly
                    title="อนุญาตให้ลงรายงานวันต่อวันเท่านั้น"
                    className="pl-11 pr-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl font-bold text-slate-500 dark:text-zinc-400 focus:outline-none cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
              {fetching && (
                <div className="flex items-center gap-2 text-blue-500 text-sm font-bold animate-pulse">
                  <Loader2 size={16} className="animate-spin" />
                  กำลังดึงข้อมูล...
                </div>
              )}
            </div>
          </motion.div>

          {/* Activities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                รายละเอียดภารกิจ (Activities)
              </h3>
              <button
                type="button"
                onClick={addActivity}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
              >
                <Plus size={16} /> เพิ่มรายการ
              </button>
            </div>
            <AnimatePresence mode="popLayout">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 relative group"
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-slate-400">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 flex-1">
                          <input
                            type="text"
                            placeholder="ชื่อภารกิจ / Project Name"
                            value={activity.taskName}
                            onChange={(e) =>
                              updateActivity(index, "taskName", e.target.value)
                            }
                            className="w-full bg-transparent border-b border-slate-100 dark:border-zinc-800 py-2 font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {(
                            ["Completed", "In Progress", "Pending"] as const
                          ).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                updateActivity(index, "status", status)
                              }
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                                activity.status === status
                                  ? status === "Completed"
                                    ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20"
                                    : status === "In Progress"
                                      ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                      : "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                                  : "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600"
                              }`}
                            >
                              {status === "Completed"
                                ? "เสร็จสิ้น"
                                : status === "In Progress"
                                  ? "กำลังทำ"
                                  : "รอดำเนินการ"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="รายละเอียดงานที่ทำ (Optional)"
                        value={activity.detail}
                        onChange={(e) =>
                          updateActivity(index, "detail", e.target.value)
                        }
                        rows={2}
                        className="w-full bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800 rounded-2xl p-3 text-sm text-slate-600 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  สรุปภาพรวม (Summary)
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  placeholder="สรุปผลการทำงานในวันนี้..."
                  className="w-full mt-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  ปัญหาที่พบ (Problems)
                </label>
                <textarea
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  rows={2}
                  placeholder="อุปสรรคหรือปัญหาที่เกิดขึ้น..."
                  className="w-full mt-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  แผนงานวันพรุ่งนี้ (Next Day Plan)
                </label>
                <textarea
                  value={plansNextDay}
                  onChange={(e) => setPlansNextDay(e.target.value)}
                  rows={2}
                  placeholder="สิ่งที่ตั้งใจจะทำในวันถัดไป..."
                  className="w-full mt-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            </motion.div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl text-sm font-bold"
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl text-sm font-bold"
              >
                <CheckCircle2 size={18} />{" "}
                บันทึกรายงานการทำงานสำเร็จเรียบร้อยแล้ว
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || fetching}
              className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  กำลังบันทึกข้อมูล...
                </>
              ) : (
                <>
                  <Save
                    size={24}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  บันทึกรายงานประจำวัน
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

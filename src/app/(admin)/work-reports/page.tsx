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
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminWorkReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // Last 7 days by default
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

  const filteredReports = reports.filter(
    (r) =>
      r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-6 px-2 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-neutral-100 uppercase tracking-tight">
                ระบบรายงานการปฏิบัติงาน
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Review and monitor daily individual work reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-800 p-1.5 rounded-2xl border border-slate-100 dark:border-neutral-700">
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-white dark:bg-neutral-900 text-slate-800 dark:text-white rounded-xl shadow-sm text-xs font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Search Employee / Dept
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="พิมพ์ชื่อพนักงาน หรือ แผนก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              End Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <Loader2
                  size={40}
                  className="animate-spin text-indigo-500 mx-auto mb-4"
                />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  กำลังโหลดข้อมูลรายงาน...
                </p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white dark:bg-neutral-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-neutral-800">
                <AlertCircle
                  size={48}
                  className="text-slate-200 dark:text-neutral-800 mx-auto mb-4"
                />
                <p className="text-slate-400 font-bold">
                  ไม่พบข้อมูลรายงานการปฏิบัติงานในช่วงเวลาที่เลือก
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedReport(report)}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-4xl border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText size={64} />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-indigo-500">
                      <UserIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-neutral-100 text-lg leading-tight">
                        {report.user.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest leading-none mt-1">
                        {report.user.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold flex items-center gap-1.5">
                        <Calendar size={14} />{" "}
                        {new Date(report.date).toLocaleDateString("th-TH", {
                          timeZone: "Asia/Bangkok",
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black text-[10px]">
                        {report.activities?.length || 0} TASKS
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-200 dark:border-neutral-700 pb-2">
                        <ChevronRight size={14} /> Summary
                      </p>
                      <p className="text-sm text-slate-700 dark:text-neutral-300 line-clamp-2 italic leading-relaxed">
                        "{report.summary}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 dark:border-neutral-800"
            >
              <div className="p-8 space-y-8 overflow-y-auto max-h-[90vh]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-neutral-100 leading-none">
                      {selectedReport.user.name}
                    </h2>
                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-2">
                      Work Report:{" "}
                      {new Date(selectedReport.date).toLocaleDateString(
                        "th-TH",
                        {
                          timeZone: "Asia/Bangkok",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-3 bg-slate-100 dark:bg-neutral-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <section>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">
                        Activities Detail
                      </h4>
                      <div className="space-y-4">
                        {selectedReport.activities?.map(
                          (act: any, idx: number) => (
                            <div key={idx} className="flex gap-4">
                              <div className="flex-none pt-1">
                                {act.status === "Completed" ? (
                                  <CheckCircle2
                                    size={18}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <Clock size={18} className="text-blue-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-neutral-200 text-sm">
                                  {act.taskName}
                                </p>
                                {act.detail && (
                                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                    {act.detail}
                                  </p>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="p-5 bg-slate-50 dark:bg-neutral-800/50 rounded-3xl border border-slate-100 dark:border-neutral-800">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Overall Summary
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed italic">
                        "{selectedReport.summary}"
                      </p>
                    </section>

                    {selectedReport.problems && (
                      <section className="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                        <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-3">
                          Problems Found
                        </h4>
                        <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                          {selectedReport.problems}
                        </p>
                      </section>
                    )}

                    {selectedReport.plansNextDay && (
                      <section className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">
                          Next Day Plan
                        </h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          {selectedReport.plansNextDay}
                        </p>
                      </section>
                    )}
                  </div>
                </div>

                {/* Evidence Images */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <section className="pt-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-500" /> Evidence
                      Photos ({selectedReport.images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedReport.images.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-sm hover:scale-[1.02] transition-transform"
                        >
                          <img
                            src={img}
                            alt={`Evidence ${idx}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(img, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="pt-8 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>
                    Submitted:{" "}
                    {new Date(selectedReport.createdAt).toLocaleString(
                      "th-TH",
                      { timeZone: "Asia/Bangkok" },
                    )}
                  </span>
                  <span>
                    Last Updated:{" "}
                    {new Date(selectedReport.updatedAt).toLocaleString(
                      "th-TH",
                      { timeZone: "Asia/Bangkok" },
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

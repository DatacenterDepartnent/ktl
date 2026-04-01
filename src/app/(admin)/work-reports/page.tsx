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
  Download,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_TH: Record<string, string> = {
  all: "ทั้งหมด",
  teacher: "ครู",
  staff: "เจ้าหน้าที่",
  janitor: "แม่บ้าน/นักการ",
  hr: "ฝ่ายบุคคล",
  director: "ผู้บริหาร",
};

export default function AdminWorkReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const getInitials = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-emerald-500",
      "bg-indigo-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-rose-500",
      "bg-amber-500",
      "bg-cyan-500",
      "bg-violet-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

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
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchReports = async (p = 1) => {
    if (p === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await fetch(
        `/api/work-report?startDate=${startDate}&endDate=${endDate}&role=${roleFilter}&page=${p}&limit=20`,
      );
      const json = await res.json();
      if (json.success) {
        setReports((prev) => (p === 1 ? json.data : [...prev, ...json.data]));
        setTotal(json.total || 0);
        setHasMore(json.hasMore || false);
        setPage(p);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || isFetchingMore) return;
    fetchReports(page + 1);
  };

  useEffect(() => {
    fetchReports(1);
  }, [startDate, endDate, roleFilter]);

  const exportToCSV = () => {
    if (reports.length === 0) {
      alert("ไม่พบข้อมูลที่จะส่งออกครับ");
      return;
    }

    const summaryRows = [
      ["รายงานการปฏิบัติงาน (Work Report Summary)"],
      [`ช่วงวันที่`, `${startDate} ถึง ${endDate}`],
      [`หมวดหมู่พนักงาน`, `${ROLE_TH[roleFilter] || roleFilter}`],
      [`จำนวนรายงานที่โหลด`, `${reports.length} รายการ`],
      [`จำนวนรายงานทั้งหมดในระบบ`, `${total} รายการ`],
      [`วันที่ส่งออกไฟล์`, `${new Date().toLocaleString("th-TH")}`],
      [],
    ];

    const headers = [
      "วันที่",
      "ชื่อ-สกุล",
      "ตำแหน่ง",
      "แผนก",
      "สรุปภาพรวม",
      "จำนวนงานทั้งหมด",
      "จำนวนงานที่เสร็จ",
      "รายละเอียดงาน (Activities)",
      "ปัญหาที่พบ",
      "แผนงานวันถัดไป",
    ];

    const escape = (val: any) => `"${String(val || "").replace(/"/g, '""')}"`;

    const csvContent = [
      ...summaryRows.map((row) => row.map(escape).join(",")),
      headers.map(escape).join(","),
      ...reports.map((r) => {
        const d = new Date(r.date).toLocaleDateString("th-TH", {
          timeZone: "Asia/Bangkok",
        });
        const roleName = ROLE_TH[r.user?.role] || r.user?.role || "-";

        const totalTasks = r.activities?.length || 0;
        const completedTasks =
          r.activities?.filter((a: any) => a.status === "Completed").length ||
          0;

        // Detailed activities string
        const activityDetails =
          r.activities
            ?.map(
              (a: any, i: number) =>
                `${i + 1}. ${a.taskName}${a.detail ? ` (${a.detail})` : ""} [${a.status}]`,
            )
            .join(" | ") || "ไม่มีกิจกรรม";

        return [
          d,
          r.user?.name || "-",
          roleName,
          r.user?.department || "-",
          r.summary || "-",
          totalTasks,
          completedTasks,
          activityDetails,
          r.problems || "-",
          r.plansNextDay || "-",
        ]
          .map(escape)
          .join(",");
      }),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `work_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter(
    (r) =>
      r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 px-2 py-4 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-neutral-100 uppercase tracking-tight">
                ระบบรายงานการปฏิบัติงาน
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                ตรวจสอบและติดตามรายงานการปฏิบัติงานรายบุคคล
              </p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="group relative flex items-center gap-3 bg-linear-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-white dark:to-slate-100 dark:hover:from-slate-100 dark:hover:to-white dark:text-black text-white px-8 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-300 font-black active:scale-95 border border-indigo-500/50 dark:border-slate-200"
          >
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </div>
            <Download
              size={22}
              className="group-hover:translate-y-0.5 transition-transform"
            />
            <span className="tracking-tight text-lg">ออกแบบรายงาน (CSV)</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              ค้นหาจากชื่อพนักงาน / แผนก
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
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              หมวดหมู่พนักงาน
            </label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm appearance-none"
              >
                {Object.entries(ROLE_TH).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label} ({val.toUpperCase()})
                  </option>
                ))}
              </select>
              <Filter
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <div className="md:col-span-1 flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                วันที่เริ่ม
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none font-bold appearance-none scheme-light-dark text-sm"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              วันที่สิ้นสุด
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
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-2xl focus:outline-none font-bold appearance-none scheme-light-dark text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center justify-between bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 dark:border-neutral-800 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" />
              <span className="text-sm font-bold text-slate-600 dark:text-neutral-400">
                พบทั้งหมด:{" "}
                <span className="text-slate-900 dark:text-white font-black">
                  {total}
                </span>{" "}
                รายงาน
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-2">
              <Search size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-600 dark:text-neutral-400">
                แสดงอยู่:{" "}
                <span className="text-slate-900 dark:text-white font-black">
                  {reports.length}
                </span>{" "}
                รายการ
              </span>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {loading && reports.length === 0 ? (
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
                  className="bg-white dark:bg-neutral-900 p-4 rounded-4xl border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText size={64} />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    {report.user.image ? (
                      <img
                        src={report.user.image}
                        alt={report.user.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white dark:border-neutral-700"
                      />
                    ) : (
                      <div
                        className={`w-14 h-14 rounded-2xl ${getAvatarBg(report.user.name)} flex items-center justify-center text-white font-black text-xl shadow-lg border border-white dark:border-neutral-700`}
                      >
                        {getInitials(report.user.name)}
                      </div>
                    )}
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
                        {report.activities?.length || 0} งานต่างๆ
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-200 dark:border-neutral-700 pb-2">
                        <ChevronRight size={14} /> สรุปงาน
                      </p>
                      <p className="text-sm text-slate-700 dark:text-neutral-300 line-clamp-2 italic leading-relaxed">
                        "{report.summary}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      ดูรายละเอียด <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="group flex items-center gap-4 bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-900 dark:text-white px-12 py-5 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 dark:shadow-none border border-slate-200 dark:border-neutral-800 transition-all font-black text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 size={18} className="animate-spin text-indigo-500" />
                  <span>กำลังดึงข้อมูล...</span>
                </>
              ) : (
                <>
                  <RefreshCcw
                    size={18}
                    className="text-indigo-500 group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span>โหลดข้อมูลเพิ่มเติม 20 รายการ</span>
                </>
              )}
            </motion.button>
          </div>
        )}
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
                  <div className="flex items-center gap-4">
                    {selectedReport.user.image ? (
                      <img
                        src={selectedReport.user.image}
                        alt={selectedReport.user.name}
                        className="w-20 h-20 rounded-3xl object-cover shadow-2xl border-2 border-indigo-500/20"
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-3xl ${getAvatarBg(selectedReport.user.name)} flex items-center justify-center text-white font-black text-3xl shadow-2xl border-2 border-white/20`}
                      >
                        {getInitials(selectedReport.user.name)}
                      </div>
                    )}
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
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-3 bg-slate-100 dark:bg-neutral-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-6">
                    <section>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">
                        รายละเอียดกิจกรรมทางการปฏิบัติงาน
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
                        สรุปภาพรวมการทำงาน
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed italic">
                        "{selectedReport.summary}"
                      </p>
                    </section>

                    {selectedReport.problems && (
                      <section className="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                        <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-3">
                          ปัญหาและอุปสรรคที่พบ
                        </h4>
                        <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                          {selectedReport.problems}
                        </p>
                      </section>
                    )}

                    {selectedReport.plansNextDay && (
                      <section className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">
                          แผนการปฏิบัติงานวันถัดไป
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
                      <ImageIcon size={14} className="text-blue-500" />{" "}
                      รูปภาพหลักฐานประกอบ ({selectedReport.images.length})
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
                    ส่งรายงานเมื่อ:{" "}
                    {new Date(selectedReport.createdAt).toLocaleString(
                      "th-TH",
                      { timeZone: "Asia/Bangkok" },
                    )}
                  </span>
                  <span>
                    แก้ไขล่าสุดเมื่อ:{" "}
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

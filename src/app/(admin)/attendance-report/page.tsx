"use client";

import { useState, useEffect } from "react";
import { Download, Search, FileText, Loader2, X, Camera } from "lucide-react";

const STATUS_TH: Record<string, string> = {
  Present: "มาทำงาน",
  Late: "มาสาย",
  Absent: "ขาดงาน",
  Leave: "ลางาน",
};

type PhotoPreview = {
  url: string;
  label: string; // "เข้างาน" | "ออกงาน"
};

export default function AttendanceReportPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PhotoPreview | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/attendance/report?startDate=${startDate}&endDate=${endDate}`,
      );
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [startDate, endDate]);

  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      alert(
        "ไม่พบข้อมูลที่จะส่งออกครับ (เนื่องจากตารางบันทึกเวลานี้ว่างเปล่าในช่วยวันที่คุณเลือก)",
      );
      return;
    }
    const headers = [
      "วันที่",
      "ชื่อ-สกุล",
      "อีเมล",
      "เวลาเข้างาน",
      "เวลาออกงาน",
      "สถานะ",
      "ชั่วโมง OT",
    ];
    const csvRows = [headers.join(",")];

    filteredRecords.forEach((r) => {
      const d = new Date(r.date).toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" });
      const inTime = r.checkInTime
        ? new Date(r.checkInTime).toLocaleTimeString("th-TH", { timeZone: "Asia/Bangkok" })
        : "-";
      const outTime = r.checkOutTime
        ? new Date(r.checkOutTime).toLocaleTimeString("th-TH", { timeZone: "Asia/Bangkok" })
        : "-";
      csvRows.push(
        [
          `"${d}"`,
          `"${r.user?.name || "-"}"`,
          `"${r.user?.email || "-"}"`,
          `"${inTime}"`,
          `"${outTime}"`,
          `"${r.status}"`,
          `"${r.otHours || 0}"`,
        ].join(","),
      );
    });

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `attendance_report_${startDate}_to_${endDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) =>
    r.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /** แสดงเวลา — ถ้ามีรูปให้กดได้ */
  const TimeCell = ({
    time,
    photoUrl,
    label,
    colorClass,
  }: {
    time: string | null;
    photoUrl?: string | null;
    label: string;
    colorClass: string;
  }) => {
    if (!time) return <span className="text-slate-300 text-sm">-</span>;

    const timeStr = new Date(time).toLocaleTimeString("th-TH", { timeZone: "Asia/Bangkok" }) + " น.";

    if (photoUrl) {
      return (
        <button
          onClick={() => setPreview({ url: photoUrl, label })}
          title={`คลิกดูรูปหลักฐาน${label}`}
          className={`group inline-flex items-center gap-1.5 font-semibold text-sm ${colorClass} hover:underline underline-offset-2 transition-all`}
        >
          <Camera
            size={13}
            className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
          />
          {timeStr}
        </button>
      );
    }

    return (
      <span className="text-sm font-medium text-slate-500 dark:text-neutral-400">
        {timeStr}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-4 px-2 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-neutral-100">
                ระบบรายงานการเข้างาน
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Export ค้นหา และดูประวัติข้อมูลการทำงานของพนักงานทั้งหมด
              </p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold active:scale-95"
          >
            <Download size={18} /> ออกแบบรายงาน (CSV)
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-neutral-900 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              ค้นหารายชื่อพนักงาน
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="พิมพ์ชื่อพนักงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 dark:text-neutral-200"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-neutral-200"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-neutral-200"
            />
          </div>
        </div>

        {/* Legend */}
        <p className="text-xs text-slate-400 dark:text-neutral-500 flex items-center gap-1.5 px-1">
          <Camera size={12} />
          เวลาที่มีไอคอนกล้อง = คลิกเพื่อดูรูปหลักฐาน
        </p>

        {/* Table Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800 text-slate-500 dark:text-neutral-400">
                  {/* ปรับ text-xs สำหรับมือถือ และ text-sm สำหรับจอใหญ่ */}
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap">
                    วันที่
                  </th>
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap">
                    พนักงาน
                  </th>
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap">
                    เข้างาน{" "}
                    <span className="hidden sm:inline text-[10px] text-sky-600 font-normal">
                      (📷=มีรูป)
                    </span>
                  </th>
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap">
                    ออกงาน{" "}
                    <span className="hidden sm:inline text-[10px] text-sky-600 font-normal">
                      (📷=มีรูป)
                    </span>
                  </th>
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm text-center">
                    OT
                  </th>
                  <th className="px-3 md:px-4 py-3 font-bold text-xs md:text-sm">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2
                        size={24}
                        className="animate-spin mx-auto mb-2 text-blue-500"
                      />
                      <span className="text-xs md:text-sm text-slate-400">
                        กำลังโหลด...
                      </span>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-xs md:text-sm text-slate-400 font-medium"
                    >
                      ไม่พบข้อมูลการลงเวลา
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* วันที่: ปรับขนาดฟอนต์ให้เล็กลงในมือถือ */}
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-700 dark:text-neutral-300 whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString("th-TH", {
                          timeZone: "Asia/Bangkok",
                          day: "numeric",
                          month: "short",
                          year: "2-digit", // ใช้ปีแบบสั้นเพื่อประหยัดพื้นที่
                        })}
                      </td>

                      {/* ข้อมูลพนักงาน: ใช้ลอจิกซ่อน Email ในจอเล็กเพื่อประหยัดพื้นที่ */}
                      <td className="px-3 md:px-4 py-3">
                        <div className="max-w-[120px] md:max-w-none">
                          <p className="font-bold text-xs md:text-sm text-slate-800 dark:text-neutral-200 truncate">
                            {r.user.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-slate-500 truncate hidden md:block">
                            {r.user.email}
                          </p>
                        </div>
                      </td>

                      {/* เวลาเข้า/ออก: ใช้ขนาดตัวอักษรที่ยืดหยุ่น */}
                      <td className="px-3 md:px-4 py-3">
                        <TimeCell
                          time={r.checkInTime}
                          photoUrl={r.photoUrl}
                          label="เข้า"
                          colorClass="text-green-600 dark:text-green-400 text-xs md:text-sm"
                        />
                      </td>

                      <td className="px-3 md:px-4 py-3">
                        <TimeCell
                          time={r.checkOutTime}
                          photoUrl={r.checkOutPhotoUrl}
                          label="ออก"
                          colorClass="text-orange-500 dark:text-orange-400 text-xs md:text-sm"
                        />
                      </td>

                      {/* OT: ปรับ Badge ให้เล็กลง */}
                      <td className="px-3 md:px-4 py-3 text-center">
                        {r.otHours ? (
                          <span className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border border-orange-100 dark:border-orange-900/50">
                            {r.otHours} ชม.
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* สถานะ: ปรับ Padding และ Text Size */}
                      <td className="px-3 md:px-4 py-3 text-right md:text-left">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-tight rounded-md border ${
                            r.status === "Present"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : r.status === "Late"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          {STATUS_TH[r.status] || r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition z-10"
            >
              <X size={20} />
            </button>

            {/* Label badge */}
            <div
              className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow ${
                preview.label === "เข้างาน"
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              <Camera size={11} />
              หลักฐาน{preview.label}
            </div>

            <img
              src={preview.url}
              alt={`หลักฐานรูปถ่าย${preview.label}`}
              className="w-full rounded-2xl shadow-2xl border-4 border-white"
            />
            <p className="text-center text-white/70 text-xs mt-3">
              คลิกนอกรูปเพื่อปิด
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

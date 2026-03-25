'use client';

import { useState, useEffect } from 'react';
import { Download, Search, FileText, Loader2, Filter } from 'lucide-react';

export default function AttendanceReportPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Default to start of current month
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split('T')[0]; // Default to today
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance/report?startDate=${startDate}&endDate=${endDate}`);
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
      alert("ไม่พบข้อมูลที่จะส่งออกครับ (เนื่องจากตารางบันทึกเวลานี้ว่างเปล่าในช่วยวันที่คุณเลือก)");
      return;
    }
    const headers = ["วันที่", "ชื่อ-สกุล", "อีเมล", "เวลาเข้างาน", "เวลาออกงาน", "สถานะ", "ชั่วโมง OT"];
    const csvRows = [headers.join(",")];
    
    filteredRecords.forEach(r => {
      const d = new Date(r.date).toLocaleDateString("th-TH");
      const inTime = r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("th-TH") : "-";
      const outTime = r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString("th-TH") : "-";
      csvRows.push([
        `"${d}"`,
        `"${r.user?.name || '-'}"`,
        `"${r.user?.email || '-'}"`,
        `"${inTime}"`,
        `"${outTime}"`,
        `"${r.status}"`,
        `"${r.otHours || 0}"`
      ].join(","));
    });

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => r.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-neutral-100">ระบบรายงานการเข้างาน</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Export ค้นหา และดูประวัติข้อมูลการทำงานของพนักงานทั้งหมด</p>
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
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="w-full">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">ค้นหารายชื่อพนักงาน</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                 <Search size={18} />
               </div>
               <input 
                 type="text" 
                 placeholder="พิมพ์ชื่อพนักงาน..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="pl-11 pr-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 dark:text-neutral-200"
               />
             </div>
          </div>
          
          <div className="w-full">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">วันที่เริ่มต้น</label>
             <input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="px-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-neutral-200"
             />
          </div>

          <div className="w-full">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">วันที่สิ้นสุด</label>
             <input 
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="px-4 py-3 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-neutral-200"
             />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800 text-slate-500 dark:text-neutral-400">
                  <th className="px-6 py-4 font-bold text-sm">วันที่</th>
                  <th className="px-6 py-4 font-bold text-sm">ชื่อ-นามสกุลพนักงาน</th>
                  <th className="px-6 py-4 font-bold text-sm">เวลาเข้างาน</th>
                  <th className="px-6 py-4 font-bold text-sm">เวลาออกงาน</th>
                  <th className="px-6 py-4 font-bold text-sm text-center">ชั่วโมง OT</th>
                  <th className="px-6 py-4 font-bold text-sm">สถานะการทำงาน</th>
                  <th className="px-6 py-4 font-bold text-sm">หลักฐานรูปถ่าย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Loader2 size={32} className="animate-spin mx-auto mb-2 text-blue-500" />
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">ไม่พบข้อมูลการลงเวลาในช่วงนี้</td>
                  </tr>
                ) : (
                  filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-neutral-300">
                         {new Date(r.date).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                         <div>
                           <p className="font-bold text-slate-800 dark:text-neutral-200">{r.user.name}</p>
                           <p className="text-xs text-slate-500">{r.user.email || 'No email'}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-neutral-400">
                         {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("th-TH") + ' น.' : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-neutral-400">
                         {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString("th-TH") + ' น.' : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-center text-slate-500">
                         {r.otHours ? <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{r.otHours} ชม.</span> : '-'}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                           r.status === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                           r.status === 'Late' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                           'bg-red-100 text-red-700 border border-red-200'
                         }`}>
                           {r.status}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        {r.photoUrl ? (
                          <a href={r.photoUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-medium text-sm">ดูรูปแผนที่</a>
                        ) : (
                          <span className="text-slate-300 text-sm">ไม่มีรูป</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

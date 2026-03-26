"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, Edit, Save, X, Search, Database, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function DataManagementPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"attendance" | "leave">("attendance");
  const [attRecords, setAttRecords] = useState<any[]>([]);
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const [attSkip, setAttSkip] = useState(0);
  const [leaveSkip, setLeaveSkip] = useState(0);
  const [attHasMore, setAttHasMore] = useState(true);
  const [leaveHasMore, setLeaveHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const LIMIT = 20;

  const records = activeTab === "attendance" ? attRecords : leaveRecords;
  const skip = activeTab === "attendance" ? attSkip : leaveSkip;
  const hasMore = activeTab === "attendance" ? attHasMore : leaveHasMore;

  const fetchData = async (isLoadMore = false, tab = activeTab) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentSkip = isLoadMore ? (tab === "attendance" ? attSkip : leaveSkip) + LIMIT : 0;
      const res = await fetch(`/api/admin/data?type=${tab}&limit=${LIMIT}&skip=${currentSkip}`);
      const json = await res.json();
      
      if (json.success) {
        const isMore = json.data.length === LIMIT;
        if (tab === "attendance") {
          setAttRecords(prev => isLoadMore ? [...prev, ...json.data] : json.data);
          setAttSkip(currentSkip);
          setAttHasMore(isMore);
        } else {
          setLeaveRecords(prev => isLoadMore ? [...prev, ...json.data] : json.data);
          setLeaveSkip(currentSkip);
          setLeaveHasMore(isMore);
        }
      } else {
        toast.error("ดึงข้อมูลล้มเหลว: " + json.error);
      }
    } catch (err) {
      toast.error("SYSTEM_ERROR");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have records for the active tab yet
    if (activeTab === "attendance" && attRecords.length === 0) {
      fetchData(false, "attendance");
    } else if (activeTab === "leave" && leaveRecords.length === 0) {
      fetchData(false, "leave");
    } else {
        setLoading(false);
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ ระวัง: คุณกำลังจะลบข้อมูลนี้อย่างถาวร ยืนยันการลบใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/data?id=${id}&type=${activeTab}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("ลบข้อมูลสำเร็จ");
        fetchData(false, activeTab);
      } else {
        toast.error("ลบข้อมูลไม่สำเร็จ: " + json.error);
      }
    } catch (err) {
      toast.error("DELETE_FAILED");
    }
  };

  const handleEditClick = (record: any) => {
    setEditingId(record._id);
    setEditFormData({ ...record });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/data`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          type: activeTab,
          updates: editFormData
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("อัปเดตข้อมูลสำเร็จ");
        setEditingId(null);
        fetchData(false, activeTab); // Refresh current tab data
      } else {
        toast.error("อัปเดตล้มเหลว: " + json.error);
      }
    } catch (err) {
      toast.error("UPDATE_FAILED");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditFormData((prev: any) => {
      const keys = field.split(".");
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const filteredRecords = records.filter(r => 
    r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl">
              <Database size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-100">ระบบจัดการข้อมูลทั้งหมด (Super Admin Data Management)</h1>
              <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5 ">
                 <AlertCircle size={14} className="text-rose-500" /> พื้นที่อันตราย: การแก้ไขหรือลบข้อมูลในส่วนนี้จะส่งผลโดยตรงต่อฐานข้อมูลหลักทันที
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
           <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl w-full md:w-auto">
             <button 
               onClick={() => setActiveTab("attendance")}
               className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "attendance" ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400"}`}
             >
               ประวัติการลงเวลา
             </button>
             <button 
               onClick={() => setActiveTab("leave")}
               className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "leave" ? "bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400"}`}
             >
               ประวัติการลางาน
             </button>
           </div>

           <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, username, หรือ ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium text-slate-700 dark:text-zinc-200 text-sm"
              />
           </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4 font-black text-xs">Record ID</th>
                  <th className="px-6 py-4 font-black text-xs">พนักงาน</th>
                  <th className="px-6 py-4 font-black text-xs">{activeTab === "attendance" ? "วันที่ / เวลาเข้า-ออก" : "ช่วงเวลาที่ลา"}</th>
                  <th className="px-6 py-4 font-black text-xs text-center">สถานะ</th>
                  {activeTab === "leave" && <th className="px-6 py-4 font-black text-xs">ประเภทการลา</th>}
                  <th className="px-6 py-4 font-black text-xs text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                {loading && records.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-bold italic tracking-widest animate-pulse">CONNECTING TO DATABASE...</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="px-6 py-16 text-center text-rose-400 font-bold italic tracking-widest">NO RECORDS FOUND</td>
                  </tr>
                ) : (
                  filteredRecords.map(r => (
                    <tr key={r._id} className={`transition-colors ${editingId === r._id ? "bg-orange-50/50 dark:bg-orange-900/10" : "hover:bg-slate-50 dark:hover:bg-zinc-900"}`}>
                      {editingId === r._id ? (
                        /* EDIT MODE ROW */
                        <td colSpan={activeTab === "leave" ? 6 : 5} className="px-6 py-4">
                          <div className="flex flex-col space-y-4 max-w-4xl bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-inner border border-orange-100 dark:border-orange-500/20">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2">
                               <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">กำลังแก้ไขข้อมูล ID: {r._id}</h4>
                               <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                                 <X size={20} />
                               </button>
                            </div>
                            
                            {activeTab === "attendance" ? (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วันที่ (ISO)</label>
                                  <input type="text" value={editFormData.date || ""} onChange={(e) => handleInputChange("date", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" placeholder="YYYY-MM-DDTHH:mm:ss.msZ" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เวลาเข้า (ISO)</label>
                                  <input type="text" value={editFormData.checkIn?.time || ""} onChange={(e) => handleInputChange("checkIn.time", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เวลาออก (ISO)</label>
                                  <input type="text" value={editFormData.checkOut?.time || ""} onChange={(e) => handleInputChange("checkOut.time", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">สถานะ</label>
                                  <select value={editFormData.status || ""} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none font-bold">
                                    <option value="Present">Present</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วันที่เริ่ม (ISO)</label>
                                  <input type="text" value={editFormData.startDate || ""} onChange={(e) => handleInputChange("startDate", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วันสิ้นสุด (ISO)</label>
                                  <input type="text" value={editFormData.endDate || ""} onChange={(e) => handleInputChange("endDate", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">สถานะการอนุมัติ</label>
                                  <select value={editFormData.status || ""} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none font-bold">
                                    <option value="pending">pending</option>
                                    <option value="approved">approved</option>
                                    <option value="rejected">rejected</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เหตุผลเชิงลึก</label>
                                  <input type="text" value={editFormData.reason || ""} onChange={(e) => handleInputChange("reason", e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-slate-50 dark:bg-zinc-800 outline-none" />
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                               <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg">ยกเลิก</button>
                               <button onClick={handleSaveEdit} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"><Save size={14}/> บันทึกการแก้ไข (LIVE)</button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        /* NORMAL ROW */
                        <>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">{r._id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{r.user?.name || "Unknown"}</div>
                            <div className="text-xs text-slate-500">{r.user?.email || r.user?.username || "no-contact"}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
                             {activeTab === "attendance" ? (
                               <div className="flex flex-col">
                                 <span className="font-bold text-slate-700 dark:text-zinc-300">{r.date ? format(new Date(r.date), "dd MMM yyyy", { locale: th }) : "-"}</span>
                                 <span className="text-xs mt-0.5">IN: {r.checkIn?.time ? format(new Date(r.checkIn.time), "HH:mm") : "-"} | OUT: {r.checkOut?.time ? format(new Date(r.checkOut.time), "HH:mm") : "-"}</span>
                               </div>
                             ) : (
                               <div className="flex flex-col">
                                 <span className="font-bold text-slate-700 dark:text-zinc-300">{r.startDate ? format(new Date(r.startDate), "dd MMM yyyy", { locale: th }) : "-"} ถึง {r.endDate ? format(new Date(r.endDate), "dd MMM yyyy", { locale: th }) : "-"}</span>
                                 <span className="text-xs mt-0.5 max-w-[150px] truncate">{r.reason || "ไม่ระบุเหตุผล"}</span>
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                              r.status === 'Present' || r.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                              r.status === 'Late' || r.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' :
                              'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          {activeTab === "leave" && (
                            <td className="px-6 py-4">
                               <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{r.leaveType}</span>
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditClick(r)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="แก้ไข">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(r._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="ลบอย่างถาวร">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => fetchData(true)}
              disabled={loadingMore}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                loadingMore
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm shadow-slate-200/50"
              }`}
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  กำลังโหลดข้อมูล...
                </>
              ) : (
                "แสดงข้อมูลเพิ่มเติม (Load 20 More)"
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

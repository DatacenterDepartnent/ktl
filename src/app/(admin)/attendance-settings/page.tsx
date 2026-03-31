"use client";

import { useState, useEffect } from "react";
import { Save, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface RoleSetting {
  role: string;
  roleName: string;
  checkInLimit: string; // HH:mm
  checkOutTime: string; // HH:mm
}

export default function AttendanceSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<RoleSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/role-settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      toast.error("ดึงข้อมูลการตั้งค่าล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (
    role: string,
    roleName: string,
    checkInLimit: string,
    checkOutTime: string,
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/role-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, roleName, checkInLimit, checkOutTime }),
      });

      if (res.ok) {
        toast.success(`บันทึกการตั้งค่าสำหรับ ${roleName} สำเร็จ`);
        fetchSettings();
      } else {
        toast.error("บันทึกข้อมูลล้มเหลว");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-zinc-500 font-bold">กำลังโหลดข้อมูลการตั้งค่า...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 md:p-10 font-sans overflow-x-hidden">
      <Toaster />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl md:rounded-4xl border border-zinc-100 dark:border-zinc-800 shadow-sm shadow-blue-500/5">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-3xl shadow-lg shadow-blue-500/20">
            <Clock size={32} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              ตั้งค่าเวลาการลงเวลา
            </h1>
            <p className="text-[10px] font-black text-zinc-400 mt-1 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              {session?.user ? (session.user as any).role.replace('_', ' ') : 'HR / Administrator'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {settings.map((item) => (
          <div
            key={item.role}
            className="bg-white dark:bg-zinc-900 p-6 rounded-3xl md:rounded-4xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 mb-1">
                  {item.roleName}
                </h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
                  บทบาทสิทธิ์: <span className="text-blue-500">{item.role}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="flex flex-col">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                    เวลาเข้างาน (24 ชม.)
                  </label>
                  <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 rounded-2xl px-2">
                    <select
                      className="bg-transparent px-2 py-3 text-lg font-black text-zinc-800 dark:text-zinc-100 outline-none appearance-none cursor-pointer"
                      value={item.checkInLimit.split(":")[0]}
                      onChange={(e) => {
                        const mins = item.checkInLimit.split(":")[1] || "00";
                        const newValue = `${e.target.value}:${mins}`;
                        const newSettings = settings.map((s) => s.role === item.role ? { ...s, checkInLimit: newValue } : s);
                        setSettings(newSettings);
                      }}
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span className="font-black text-zinc-400">:</span>
                    <select
                      className="bg-transparent px-2 py-3 text-lg font-black text-zinc-800 dark:text-zinc-100 outline-none appearance-none cursor-pointer"
                      value={item.checkInLimit.split(":")[1]}
                      onChange={(e) => {
                        const hrs = item.checkInLimit.split(":")[0] || "00";
                        const newValue = `${hrs}:${e.target.value}`;
                        const newSettings = settings.map((s) => s.role === item.role ? { ...s, checkInLimit: newValue } : s);
                        setSettings(newSettings);
                      }}
                    >
                      {Array.from({ length: 60 }).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                    เวลาออกงาน (24 ชม.)
                  </label>
                  <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 rounded-2xl px-2">
                    <select
                      className="bg-transparent px-2 py-3 text-lg font-black text-zinc-800 dark:text-zinc-100 outline-none appearance-none cursor-pointer"
                      value={item.checkOutTime.split(":")[0]}
                      onChange={(e) => {
                        const mins = item.checkOutTime.split(":")[1] || "00";
                        const newValue = `${e.target.value}:${mins}`;
                        const newSettings = settings.map((s) => s.role === item.role ? { ...s, checkOutTime: newValue } : s);
                        setSettings(newSettings);
                      }}
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span className="font-black text-zinc-400">:</span>
                    <select
                      className="bg-transparent px-2 py-3 text-lg font-black text-zinc-800 dark:text-zinc-100 outline-none appearance-none cursor-pointer"
                      value={item.checkOutTime.split(":")[1]}
                      onChange={(e) => {
                        const hrs = item.checkOutTime.split(":")[0] || "00";
                        const newValue = `${hrs}:${e.target.value}`;
                        const newSettings = settings.map((s) => s.role === item.role ? { ...s, checkOutTime: newValue } : s);
                        setSettings(newSettings);
                      }}
                    >
                      {Array.from({ length: 60 }).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleUpdate(
                    item.role,
                    item.roleName,
                    item.checkInLimit,
                    item.checkOutTime,
                  )
                }
                disabled={saving}
                className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                บันทึก
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 p-6 rounded-3xl">
        <p className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          💡 คำแนะนำ:
        </p>
        <ul className="mt-3 space-y-2 text-xs text-blue-700/70 dark:text-blue-400/70 font-medium">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />
            การตั้งค่า "เวลาเข้างาน" จะมีผลทันทีต่อการประมวลผลสถานะ "มาสาย"
            ของการลงเวลาครั้งถัดไป
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />
            เวลาที่กำหนดควรตรวจสอบให้แน่ใจว่าถูกต้องตามระเบียบของทางวิทยาลัยฯ
          </li>
        </ul>
      </div>
    </div>
  );
}

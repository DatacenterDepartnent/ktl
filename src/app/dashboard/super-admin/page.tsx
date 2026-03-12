"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  isActive: boolean;
  phone?: string;
  lineId?: string;
  orderIndex?: number;
}

interface Summary {
  totalActions: number;
  approvals: number;
  roleChanges: number;
  updates: number;
}

interface ActivityLog {
  _id: string;
  userName: string;
  action: string;
  details: string;
  link?: string;
  timestamp: string;
  duration: number;
  ip: string;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  // 1. ดึงข้อมูล Profile Admin
  const fetchAdminProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) setAdminProfile(await res.json());
    } catch (error) {
      console.error("Profile Error:", error);
    }
  };

  // 2. ดึงข้อมูลทั้งหมด
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, summaryRes, logsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/reports/summary"),
        fetch("/api/admin/logs"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(
          data.sort(
            (a: User, b: User) => (a.orderIndex || 0) - (b.orderIndex || 0),
          ),
        );
      }
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      toast.error("SYSTEM_ERROR: โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchData();
  }, []);

  // --- Functions สำหรับจัดการ User ---

  const changeRole = async (
    targetId: string,
    newRole: string,
    targetName: string,
  ) => {
    if (!adminProfile) return toast.error("ACCESS_DENIED");
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }), // ส่งแค่ข้อมูลที่แก้ Log ให้ API จัดการเอง
      });
      if (res.ok) {
        toast.success(`UPDATED: เปลี่ยนสิทธิ์ ${targetName} สำเร็จ`);
        fetchData();
      }
    } catch (error) {
      toast.error("UPDATE_FAILED");
    }
  };

  const toggleStatus = async (
    targetId: string,
    currentStatus: boolean,
    targetName: string,
  ) => {
    if (!adminProfile) return;
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success(!currentStatus ? "USER_ACTIVATED" : "USER_SUSPENDED");
        fetchData();
      }
    } catch (error) {
      toast.error("TOGGLE_ERROR");
    }
  };

  const moveOrder = async (
    id: string,
    currentOrder: number,
    direction: "up" | "down",
  ) => {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIndex: newOrder }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      toast.error("MOVE_FAILED");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("⚠️ ต้องการล้างประวัติกิจกรรมทั้งหมดใช่หรือไม่?")) return;
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        toast.success("LOGS_CLEARED");
        fetchData();
      }
    } catch (error) {
      toast.error("CLEAR_FAILED");
    }
  };

  // --- Style Helpers ---

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "admin":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  // ✅ แก้ไขใหม่: ใช้สีทึบ (Solid) และสว่างพิเศษเพื่อให้ตัดกับพื้นหลังสีดำ
  const getActionStyle = (action: string) => {
    const act = action.toUpperCase();

    // 🔵 ตอบคำถาม (REPLY_QUESTION) - ใช้สี Cyan สว่างแบบนีออน
    if (act.includes("REPLY") || act.includes("ANSWER")) {
      return "bg-cyan-500 text-black border-cyan-300 ring-2 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] font-black";
    }

    // 🟢 คำถามจาก Guest (GUEST_QUESTION) - ใช้สีน้ำเงินสว่าง
    if (act.includes("GUEST")) {
      return "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-600/50 shadow-[0_0_15px_rgba(37,99,235,0.5)] font-black";
    }

    // 🔴 อันตราย/ลบ (DELETE) - แดงสด
    if (
      act.includes("DELETE") ||
      act.includes("WIPE") ||
      act.includes("SUSPEND")
    ) {
      return "bg-rose-600 text-white border-rose-400 ring-2 ring-rose-600/50 shadow-[0_0_15px_rgba(225,29,72,0.5)] font-black";
    }

    // 🟢 สร้าง/เพิ่ม (CREATE/POST) - เขียวสว่าง
    if (
      act.includes("CREATE") ||
      act.includes("POST") ||
      act.includes("ADD") ||
      act.includes("APPROVE")
    ) {
      return "bg-emerald-500 text-black border-emerald-300 ring-2 ring-emerald-500/50 font-black";
    }

    // 🟠 แก้ไข (UPDATE/EDIT) - ส้มสว่าง
    if (
      act.includes("UPDATE") ||
      act.includes("EDIT") ||
      act.includes("CHANGE")
    ) {
      return "bg-amber-500 text-black border-amber-300 ring-2 ring-amber-500/50 font-black";
    }

    // 🟣 ล็อกอิน (LOGIN)
    if (act.includes("LOGIN") || act.includes("AUTH")) {
      return "bg-indigo-600 text-white border-indigo-400 font-black";
    }

    return "bg-slate-700 text-slate-100 border-slate-500 font-black";
  };
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-black text-slate-400 italic">
        LOADING_SYSTEM_DATA...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-12 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Total_Activity",
            val: summary?.totalActions,
            color: "text-blue-600",
          },
          {
            label: "Identity_Approved",
            val: summary?.approvals,
            color: "text-emerald-600",
          },
          {
            label: "Permission_Changes",
            val: summary?.roleChanges,
            color: "text-rose-600",
          },
          {
            label: "System_Updates",
            val: summary?.updates,
            color: "text-orange-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {item.label}
            </p>
            <p
              className={`text-4xl font-black ${item.color} mt-2 italic tabular-nums`}
            >
              {item.val || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mb-16">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
            Member_Management
          </h1>
          <button
            onClick={fetchData}
            className="bg-slate-900 text-white text-[11px] font-black px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all uppercase italic"
          >
            Refresh_Database
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-8 text-center w-20">Order</th>
                <th className="p-8">User_Identity</th>
                <th className="p-8 text-center">Auth_Level</th>
                <th className="p-8 text-center">Protocol_Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-all group"
                >
                  <td className="p-8 text-center">
                    <div className="flex flex-col items-center gap-1 font-black text-slate-900 italic text-xl">
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "up")
                        }
                        className="text-slate-200 hover:text-blue-500 text-xs"
                      >
                        ▲
                      </button>
                      {index + 1}
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "down")
                        }
                        className="text-slate-200 hover:text-rose-500 text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="font-black text-slate-900 text-lg uppercase">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-black text-blue-600 lowercase italic">
                      @{user.username}
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeRole(user._id, e.target.value, user.name)
                      }
                      className={`text-[10px] font-black border-2 rounded-xl px-4 py-2 outline-none uppercase ${getRoleStyle(user.role)}`}
                    >
                      <option value="editor">EDITOR</option>
                      <option value="admin">ADMINISTRATOR</option>
                      <option value="super_admin">SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td className="p-8 text-center">
                    <button
                      onClick={() =>
                        toggleStatus(user._id, user.isActive, user.name)
                      }
                      className={`h-7 w-14 rounded-full transition-all relative ${user.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                    >
                      <div
                        className={`h-5 w-5 bg-white rounded-full absolute top-1 transition-all ${user.isActive ? "right-1" : "left-1"}`}
                      />
                    </button>
                  </td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/users/edit/${user._id}`)
                      }
                      className="text-[10px] font-black bg-slate-100 text-slate-500 px-6 py-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase italic border border-transparent hover:border-blue-500"
                    >
                      Edit_User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs (Dark Theme) */}
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-10 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <span className="h-3 w-3 bg-rose-500 rounded-full animate-ping"></span>
            Audit_Control_Log
          </h2>
          <button
            onClick={handleClearLogs}
            className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-6 py-3 rounded-2xl hover:bg-rose-500 hover:text-white border border-rose-500/20 uppercase tracking-widest"
          >
            Wipe_Logs
          </button>
        </div>

        <div className="p-10 max-h-[800px] overflow-y-auto space-y-8 custom-scrollbar">
          {logs.length === 0 ? (
            <p className="text-center text-slate-600 font-black italic uppercase py-20 tracking-widest">
              No_Activity_Detected
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="group border-l-2 border-white/5 pl-8 hover:border-blue-500 transition-all relative"
              >
                <div
                  className={`absolute -left-[5px] top-0 h-2 w-2 rounded-full ${log.action.includes("DELETE") ? "bg-rose-500 shadow-[0_0_8px_rose]" : "bg-slate-700 group-hover:bg-blue-500"}`}
                ></div>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="text-center bg-white/5 p-4 rounded-[1.5rem] min-w-[100px] border border-white/10">
                    <p className="text-sm font-black text-white italic tabular-nums leading-none">
                      {new Date(log.timestamp).toLocaleTimeString("th-TH")}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-black text-white text-lg uppercase italic tracking-tight">
                        {log.userName || "System"}
                      </span>
                      <span
                        className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${getActionStyle(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <div className="text-sm font-bold leading-relaxed text-slate-400">
                      {log.link ? (
                        <a
                          href={log.link}
                          className="text-emerald-400 hover:text-white flex items-center gap-2 group/link transition-all"
                        >
                          <span className="border-b border-emerald-400/30">
                            {log.details}
                          </span>
                          <span className="text-[8px] px-2 py-0.5 rounded bg-white/5 font-black italic border border-white/10 group-hover/link:bg-emerald-500 group-hover/link:text-black">
                            GO ↗
                          </span>
                        </a>
                      ) : (
                        <p>{log.details}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                        IP: {log.ip || "UNKNOWN"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

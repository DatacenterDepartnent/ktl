"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

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
  timestamp: string;
  duration: number;
  ip: string;
  isOnline: boolean;
}

export default function SuperAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  // 1. Fetch Profiles and Data
  const fetchAdminProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) setAdminProfile(await res.json());
    } catch (error) {
      console.error("Profile Error:", error);
    }
  };

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
      toast.error("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchData();
  }, []);

  // 2. Action Handlers
  const changeRole = async (
    targetId: string,
    newRole: string,
    targetName: string,
  ) => {
    if (!adminProfile) return toast.error("ไม่พบข้อมูล Admin");
    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: newRole,
          logAction: "CHANGE_ROLE",
          logDetails: `เปลี่ยนสิทธิ์ ${targetName} เป็น ${newRole.toUpperCase()}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });
      if (res.ok) {
        toast.success(`อัปเดตสิทธิ์ ${targetName} แล้ว`);
        fetchData();
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const toggleStatus = async (
    targetId: string,
    currentStatus: boolean,
    targetName: string,
  ) => {
    if (!adminProfile) return;
    const newStatus = !currentStatus;
    try {
      await fetch(`/api/admin/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: newStatus,
          logAction: newStatus ? "APPROVE" : "SUSPEND",
          logDetails: `${newStatus ? "อนุมัติ" : "ระงับ"} การใช้งานของ ${targetName}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });
      fetchData();
    } catch (error) {
      toast.error("Error");
    }
  };

  const moveOrder = async (
    id: string,
    currentOrder: number,
    direction: "up" | "down",
  ) => {
    if (!adminProfile) return;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIndex: newOrder,
          logAction: "REORDER",
          logDetails: `ปรับลำดับการแสดงผลของผู้ใช้ ID: ${id}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      toast.error("Error moving user");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("ล้างประวัติกิจกรรมทั้งหมดหรือไม่?")) return;
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        toast.success("ล้างประวัติสำเร็จ");
        fetchData();
      }
    } catch (error) {
      toast.error("ล้มเหลว");
    }
  };

  // Helper function for Role Colors
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "admin":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="animate-pulse font-black text-slate-400">
          LOADING KTLTC SYSTEM...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Summary Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Activity",
            val: summary?.totalActions,
            color: "text-blue-600",
          },
          {
            label: "Approved",
            val: summary?.approvals,
            color: "text-emerald-600",
          },
          {
            label: "Role Changes",
            val: summary?.roleChanges,
            color: "text-rose-600",
          },
          { label: "Updates", val: summary?.updates, color: "text-orange-500" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {item.label}
            </p>
            <p className={`text-3xl font-black ${item.color} mt-1`}>
              {item.val || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <h1 className="text-2xl font-black text-slate-800 italic uppercase">
            Member_Management
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase italic border border-emerald-100">
              Admin: {adminProfile?.name}
            </span>
            <button
              onClick={fetchData}
              className="text-xs font-black bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-700 transition-all"
            >
              REFRESH_DATA
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-6 text-center w-24">ลำดับ</th>
                <th className="p-6">ข้อมูลผู้ใช้</th>
                <th className="p-6">การติดต่อ</th>
                <th className="p-6 text-center">ระดับสิทธิ์</th>
                <th className="p-6 text-center">การอนุมัติ</th>
                <th className="p-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "up")
                        }
                        className="text-slate-300 hover:text-blue-500 transition-colors"
                      >
                        ▲
                      </button>
                      <span className="font-black text-slate-700 text-lg">
                        {index + 1}
                      </span>
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "down")
                        }
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-black text-slate-800 text-base">
                      {user.name}
                    </div>
                    <div className="text-[11px] font-bold text-blue-600 bg-blue-50/50 w-fit px-2 py-0.5 rounded-md mt-1 lowercase">
                      @{user.username.toLowerCase()}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs font-bold text-slate-500">
                      {user.email}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        📞 {user.phone || "-"}
                      </span>
                      <span className="text-[9px] font-black text-green-500 bg-green-50 px-1.5 py-0.5 rounded lowercase italic">
                        line: {user.lineId || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeRole(user._id, e.target.value, user.name)
                      }
                      className={`text-[10px] font-black border rounded-lg px-3 py-1.5 outline-none transition-all uppercase ${getRoleStyle(user.role)}`}
                    >
                      <option value="editor">EDITOR (USER)</option>
                      <option value="admin">ADMINISTRATOR</option>
                      <option value="super_admin">SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() =>
                        toggleStatus(user._id, user.isActive, user.name)
                      }
                      className={`h-6 w-12 rounded-full transition-all duration-300 ${user.isActive ? "bg-emerald-500" : "bg-slate-300"} relative shadow-inner`}
                    >
                      <div
                        className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${user.isActive ? "right-1" : "left-1"} shadow-md`}
                      />
                    </button>
                    <p
                      className={`text-[8px] font-black mt-1 uppercase ${user.isActive ? "text-emerald-500" : "text-slate-400"}`}
                    >
                      {user.isActive ? "Active" : "Pending"}
                    </p>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[10px] font-black bg-slate-100 text-slate-400 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase italic">
                      Edit_User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs Section */}
      <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
              <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>
              Activity_Audit_Log
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearLogs}
              className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
            >
              CLEAR_LOGS
            </button>
            <button
              onClick={fetchData}
              className="text-[10px] font-black bg-white/5 text-white/50 px-4 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-all"
            >
              REFRESH
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[600px] overflow-y-auto space-y-3 custom-scrollbar">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="text-center bg-white/10 p-3 rounded-2xl min-w-[70px] border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase">
                    Time
                  </p>
                  <p className="text-sm font-black text-white italic">
                    {new Date(log.timestamp).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base underline decoration-blue-500/30 underline-offset-4 uppercase">
                      {log.userName}
                    </span>
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${log.action === "LOGIN" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400 border border-white/5"}`}
                    >
                      {log.action}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {log.details}
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium uppercase mt-1 tracking-widest">
                    {new Date(log.timestamp).toLocaleDateString("th-TH")} • IP:{" "}
                    {log.ip}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {log.action === "LOGIN" ? (
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-500 uppercase">
                      Duration
                    </span>
                    <span className="text-xl font-black text-emerald-400 italic">
                      {log.duration} <span className="text-xs">MIN</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] font-black text-white/10 border border-white/5 px-2 py-1 rounded-lg uppercase tracking-tighter italic">
                    Secured_Action
                  </span>
                )}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-20 text-center text-slate-600 font-black italic uppercase tracking-widest">
              No Activity Records Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  isOnline: boolean;
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
      toast.error("SYSTEM_ERROR: โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchData();
  }, []);

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/edit/${userId}`);
  };

  const changeRole = async (
    targetId: string,
    newRole: string,
    targetName: string,
  ) => {
    if (!adminProfile) return toast.error("ACCESS_DENIED: ไม่พบข้อมูลผู้ดูแล");
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: newRole,
          logAction: "CHANGE_ROLE",
          logDetails: `เปลี่ยนสิทธิ์สมาชิกระดับ: ${targetName} → ${newRole.toUpperCase()}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
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
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: newStatus,
          logAction: newStatus ? "APPROVE_USER" : "SUSPEND_USER",
          logDetails: `${newStatus ? "อนุมัติ" : "ระงับ"} การเข้าใช้งานของ: ${targetName}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });
      if (res.ok) {
        toast.success(newStatus ? "USER_ACTIVATED" : "USER_SUSPENDED");
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
    if (!adminProfile) return;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIndex: newOrder,
          logAction: "REORDER_USER",
          logDetails: `ปรับลำดับการแสดงผลผู้ใช้ ID: ${id}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      toast.error("MOVE_FAILED");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("⚠️ คำเตือน: คุณต้องการล้างประวัติกิจกรรมทั้งหมดใช่หรือไม่?"))
      return;
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="animate-pulse font-black text-slate-400 uppercase italic tracking-tighter">
            KTLTC_SYSTEM_AUTHENTICATING...
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-12 bg-slate-50 min-h-screen font-sans">
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
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 transform transition-hover hover:-translate-y-1"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
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
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
              Member_Management
            </h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
              Operator_Active: {adminProfile?.name || "Initializing..."}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="group bg-slate-900 text-white text-[11px] font-black px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 uppercase italic tracking-widest"
          >
            <span>Refresh_Database</span>
            <span className="group-hover:rotate-180 transition-transform duration-500">
              ↻
            </span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="p-8 text-center">Order</th>
                <th className="p-8">User_Identity</th>
                <th className="p-8">Connectivity</th>
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
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "up")
                        }
                        className="text-slate-200 hover:text-blue-500 transition-all"
                      >
                        ▲
                      </button>
                      <span className="font-black text-slate-900 text-xl italic">
                        {index + 1}
                      </span>
                      <button
                        onClick={() =>
                          moveOrder(user._id, user.orderIndex || 0, "down")
                        }
                        className="text-slate-200 hover:text-rose-500 transition-all"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="font-black text-slate-900 text-lg uppercase tracking-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-black text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full mt-2 lowercase italic">
                      @{user.username}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="text-xs font-bold text-slate-500 mb-2">
                      {user.email}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">
                        📞 {user.phone || "-"}
                      </span>
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md lowercase italic border border-emerald-100">
                        L: {user.lineId || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeRole(user._id, e.target.value, user.name)
                      }
                      className={`text-[10px] font-black border-2 rounded-xl px-4 py-2 outline-none transition-all uppercase cursor-pointer ${getRoleStyle(user.role)}`}
                    >
                      <option value="editor">EDITOR (USER)</option>
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
                        className={`h-5 w-5 bg-white rounded-full absolute top-1 transition-all ${user.isActive ? "right-1 shadow-lg shadow-emerald-900/20" : "left-1"}`}
                      />
                    </button>
                    <p
                      className={`text-[9px] font-black mt-2 uppercase italic tracking-widest ${user.isActive ? "text-emerald-500" : "text-slate-400"}`}
                    >
                      {user.isActive ? "Access_Granted" : "Halted"}
                    </p>
                  </td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() => handleEditUser(user._id)}
                      className="text-[10px] font-black bg-slate-100 text-slate-500 px-6 py-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase italic tracking-widest border border-transparent hover:border-blue-500"
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
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <span className="h-3 w-3 bg-rose-500 rounded-full animate-ping"></span>
              Audit_Control_Log
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearLogs}
              className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-6 py-3 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 uppercase tracking-widest"
            >
              Wipe_Logs
            </button>
          </div>
        </div>

        <div className="p-10 max-h-[700px] overflow-y-auto space-y-6 custom-scrollbar">
          {logs.length === 0 && (
            <p className="text-center text-slate-600 font-black italic uppercase py-10">
              No_Activity_Detected
            </p>
          )}
          {logs.map((log) => (
            <div
              key={log._id}
              className="group border-l-2 border-white/5 pl-6 hover:border-blue-500 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="text-center bg-white/5 p-4 rounded-[1.5rem] min-w-[85px] border border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Time
                  </p>
                  <p className="text-sm font-black text-white italic tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-white text-lg hover:text-blue-400 transition-colors cursor-default uppercase italic">
                      {log.userName}
                    </span>
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        log.action.includes("DELETE")
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : log.action.includes("CREATE")
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {log.action}
                    </span>
                  </div>

                  <div className="text-sm font-bold">
                    {log.link ? (
                      <a
                        href={log.link}
                        target="_blank"
                        className="text-emerald-400 hover:text-white hover:underline flex items-center gap-2 transition-all"
                      >
                        {log.details}
                        <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 font-black uppercase tracking-tighter italic">
                          External_Link ↗
                        </span>
                      </a>
                    ) : (
                      <p
                        className={`font-black ${
                          log.action.includes("DELETE")
                            ? "text-rose-500/80"
                            : log.action.includes("UPDATE")
                              ? "text-amber-500/80"
                              : "text-slate-400"
                        }`}
                      >
                        {log.details}
                      </p>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-600 font-black uppercase mt-3 tracking-[0.2em]">
                    STAMP: {new Date(log.timestamp).toLocaleDateString("th-TH")}{" "}
                    • NET_ADDR: {log.ip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

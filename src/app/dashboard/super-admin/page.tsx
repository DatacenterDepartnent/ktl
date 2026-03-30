"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Activity,
  ShieldCheck,
  RefreshCcw,
  Search,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Terminal,
  ExternalLink,
  UserPlus,
  Settings,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Calendar } from "antd";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department?: string;
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
  module?: string;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
        fetch("/api/admin/users?_t=" + Date.now()),
        fetch("/api/admin/reports/summary?_t=" + Date.now()),
        fetch("/api/admin/logs?_t=" + Date.now()),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(
          data.sort((a: User, b: User) => {
            if (a.orderIndex !== b.orderIndex) {
              return (a.orderIndex || 0) - (b.orderIndex || 0);
            }
            return b._id.localeCompare(a._id);
          }),
        );
      }
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      toast.error("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    fetchAdminProfile();
    fetchData();
  }, []);

  const changeDepartment = async (
    targetId: string,
    newDept: string,
    targetName: string,
  ) => {
    if (!adminProfile) return toast.error("ACCESS_DENIED");
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department: newDept }),
      });
      if (res.ok) {
        toast.success(`เปลี่ยนสังกัด ${targetName} เรียบร้อย`);
        fetchData();
      }
    } catch (error) {
      toast.error("เปลี่ยนสังกัดไม่สำเร็จ");
    }
  };

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
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success(`เปลี่ยนสิทธิ์ ${targetName} เรียบร้อย`);
        fetchData();
      }
    } catch (error) {
      toast.error("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  const toggleStatus = async (
    targetId: string,
    currentStatus: boolean,
    targetName: string,
  ) => {
    if (!adminProfile) return;
    try {
      const res = await fetch(`/api/users/${targetId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success(
          !currentStatus
            ? "เปิดใช้งานผู้ใช้เรียบร้อย"
            : "ระงับการใช้งานเรียบร้อย",
        );
        fetchData();
      }
    } catch (error) {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  const deleteUser = async (targetId: string, targetName: string) => {
    if (
      !confirm(
        `⚠️ ต้องการลบสมาชิก "${targetName}" ออกจากระบบใช่หรือไม่? ไม่สามารถย้อนกลับได้`,
      )
    )
      return;
    try {
      const res = await fetch(`/api/users/${targetId}/status`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`ลบ "${targetName}" เรียบร้อย`);
        fetchData();
      } else {
        toast.error("ลบสมาชิกไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
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
      toast.error("ไม่สามารถเปลี่ยนลำดับได้");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("⚠️ ต้องการล้างประวัติกิจกรรมทั้งหมดใช่หรือไม่?")) return;
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        toast.success("ล้างประวัติเรียบร้อย");
        fetchData();
      }
    } catch (error) {
      toast.error("ไม่สามารถล้างประวัติได้");
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "super_admin":
        return "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold";
      case "director":
      case "deputy_resource":
      case "deputy_strategy":
      case "deputy_activities":
      case "deputy_student_affairs":
        return "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold";
      case "hr":
        return "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold";
      case "admin":
        return "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold";
      case "staff":
        return "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold";
      case "teacher":
        return "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 font-bold";
      case "janitor":
        return "border-stone-500 bg-stone-500/10 text-stone-700 dark:text-stone-400 font-bold";
      default:
        return "border-slate-400 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold";
    }
  };

  const getActionStyle = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("REPLY") || act.includes("ANSWER"))
      return "border-cyan-500/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold";
    if (act.includes("GUEST"))
      return "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold";
    if (
      act.includes("DELETE") ||
      act.includes("WIPE") ||
      act.includes("SUSPEND")
    )
      return "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold";
    if (
      act.includes("CREATE") ||
      act.includes("POST") ||
      act.includes("ADD") ||
      act.includes("APPROVE")
    )
      return "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
    if (
      act.includes("UPDATE") ||
      act.includes("EDIT") ||
      act.includes("CHANGE")
    )
      return "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold";
    if (act.includes("LOGIN") || act.includes("AUTH"))
      return "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold";
    return "border-slate-500/50 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold";
  };

  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans gap-4">
    <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
      กำลังเตรียมระบบ...
    </span>
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-xl">
                <ShieldCheck className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-2">
                  ศูนย์ควบคุม<span className="text-rose-600">จัดการระบบ</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  สิทธิ์ผู้ดูแลระบบสูงสุด (Super Admin)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ใช้หรือชื่อจริง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[400px] pl-14 pr-6 py-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/2"
              />
            </div>
            <button
              onClick={fetchData}
              className="p-5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        {/* Stats Summary Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "กิจกรรมทั้งหมด",
              val: summary?.totalActions,
              icon: Activity,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
              border: "border-blue-100",
            },
            {
              label: "อนุมัติสิทธิ์แล้ว",
              val: summary?.approvals,
              icon: CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-500/10",
              border: "border-emerald-100",
            },
            {
              label: "การเปลี่ยนสิทธิ์",
              val: summary?.roleChanges,
              icon: Lock,
              color: "text-rose-600",
              bg: "bg-rose-500/10",
              border: "border-rose-100",
            },
            {
              label: "การอัปเดตระบบ",
              val: summary?.updates,
              icon: Database,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              border: "border-amber-100",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 right-0 p-6 ${item.color} opacity-10 group-hover:scale-125 transition-transform duration-500`}
              >
                <item.icon size={60} />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                {item.label}
              </p>
              <h3
                className={`text-4xl font-black ${item.color} tracking-tighter tabular-nums`}
              >
                {item.val || 0}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Users Management Grid */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl rounded-4xl border border-slate-100 dark:border-zinc-800 shadow-3xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-zinc-800/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-rose-600 rounded-full" />
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                จัดการรายชื่อผู้ใช้ในระบบ
              </h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <Users size={16} className="text-slate-400" />
              <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase tabular-nums">
                รายชื่อทั้งหมด {filteredUsers.length} คน
              </span>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-950/50 text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-8 text-center w-24">ลำดับ</th>
                  <th className="p-8">ข้อมูลบุคลากร</th>
                  <th className="p-8 text-center">สิทธิ์การใช้งาน</th>
                  <th className="p-8 text-center">สังกัด / แผนก</th>
                  <th className="p-8 text-center">สถานะ</th>
                  <th className="p-8 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="hover:bg-blue-50/30 dark:hover:bg-blue-500/2 transition-colors group"
                    >
                      <td className="p-8">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() =>
                              moveOrder(user._id, user.orderIndex || 0, "up")
                            }
                            className="text-slate-300 dark:text-zinc-700 hover:text-blue-500 transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <span className="font-black text-slate-800 dark:text-white text-xl italic tabular-nums leading-none">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <button
                            onClick={() =>
                              moveOrder(user._id, user.orderIndex || 0, "down")
                            }
                            className="text-slate-300 dark:text-zinc-700 hover:text-rose-500 transition-colors"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-black text-slate-800 dark:text-white text-lg tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-blue-600 lowercase italic opacity-60">
                                @{user.username}
                              </span>
                              {!user.isActive && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase tracking-widest">
                                  รอนุมัติ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <select
                          value={user.role || "user"}
                          onChange={(e) =>
                            changeRole(user._id, e.target.value, user.name)
                          }
                          className={`text-[9px] font-black border-2 rounded-2xl px-4 py-2.5 outline-none uppercase transition-all focus:ring-4 focus:ring-current/10 ${getRoleStyle(user.role || "user")}`}
                        >
                          <option value="super_admin">
                            SUPER_ADMIN (สูงสุด)
                          </option>
                          <option value="editor">EDITOR (ดูแลเนื้อหา)</option>
                          <option value="admin">ADMIN (แอดมิน)</option>
                          <option value="director">DIRECTOR (ผอ.)</option>
                          <option value="deputy_resource">
                            รอง ผอ. (ทรัพยากร)
                          </option>
                          <option value="deputy_strategy">
                            รอง ผอ. (แผนงาน)
                          </option>
                          <option value="deputy_activities">
                            รอง ผอ. (กิจกรรม)
                          </option>
                          <option value="deputy_student_affairs">
                            รอง ผอ. (นักเรียน)
                          </option>
                          <option value="teacher">ครู (TEACHER)</option>
                          <option value="hr">ฝ่ายบุคคล (HR)</option>
                          <option value="staff">เจ้าหน้าที่ (STAFF)</option>
                          <option value="janitor">ภารโรง (JANITOR)</option>
                          <option value="user">ผู้ใช้ทั่วไป (USER)</option>
                        </select>
                      </td>
                      <td className="p-8 text-center">
                        <select
                          value={user.department || "ไม่มีสังกัด"}
                          onChange={(e) =>
                            changeDepartment(
                              user._id,
                              e.target.value,
                              user.name,
                            )
                          }
                          className="text-[9px] font-black border-2 border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-2.5 outline-none text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950 focus:border-blue-500 transition-all cursor-pointer max-w-[180px]"
                        >
                          <option value="ไม่มีสังกัด">- ไม่ระบุสังกัด -</option>
                          <option value="ผู้บริหารสถานศึกษา">
                            ผู้บริหารสถานศึกษา
                          </option>
                          <optgroup label="๑. ฝ่ายบริหารทรัพยากร">
                            <option value="งานบริหารงานทั่วไป">งานบริหารงานทั่วไป</option>
                            <option value="งานบริหารและพัฒนาทรัพยากรบุคคล">งานบริหารและพัฒนาทรัพยากรบุคคล</option>
                            <option value="งานการเงิน">งานการเงิน</option>
                            <option value="งานการบัญชี">งานการบัญชี</option>
                            <option value="งานพัสดุ">งานพัสดุ</option>
                            <option value="งานอาคารสถานที่">งานอาคารสถานที่</option>
                            <option value="งานทะเบียน">งานทะเบียน</option>
                            <option value="งานภารโรง">งานภารโรง</option>
                          </optgroup>
                          <optgroup label="๒. ฝ่ายยุทธศาสตร์และแผนงาน">
                            <option value="งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ">งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ</option>
                            <option value="งานมาตรฐานและการประกันคุณภาพ">งานมาตรฐานและการประกันคุณภาพ</option>
                            <option value="งานศูนย์ดิจิทัลและสื่อสารองค์กร">งานศูนย์ดิจิทัลและสื่อสารองค์กร</option>
                            <option value="งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์">งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์</option>
                            <option value="งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ">งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ</option>
                            <option value="งานติดตามและประเมินผลการ">งานติดตามและประเมินผลการ</option>
                          </optgroup>
                          <optgroup label="๓. ฝ่ายพัฒนากิจการนักเรียน นักศึกษา">
                            <option value="งานกิจกรรมนักเรียนนักศึกษา">งานกิจกรรมนักเรียนนักศึกษา</option>
                            <option value="งานครูที่ปรึกษาและการแนะแนว">งานครูที่ปรึกษาและการแนะแนว</option>
                            <option value="งานปกครองและความปลอดภัยนักเรียนนักศึกษา">งานปกครองและความปลอดภัยนักเรียนนักศึกษา</option>
                            <option value="งานสวัสดิการนักเรียนนักศึกษา">งานสวัสดิการนักเรียนนักศึกษา</option>
                            <option value="งานโครงการพิเศษและการบริการ">งานโครงการพิเศษและการบริการ</option>
                          </optgroup>
                          <optgroup label="๔. ฝ่ายวิชาการ">
                            <option value="งานพัฒนาหลักสูตรและการจัดการเรียนรู้">งานพัฒนาหลักสูตรและการจัดการเรียนรู้</option>
                            <option value="งานวัดผลและประเมินผล">งานวัดผลและประเมินผล</option>
                            <option value="งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ">งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ</option>
                            <option value="งานวิทยบริการและเทคโนโลยีการศึกษา">งานวิทยบริการและเทคโนโลยีการศึกษา</option>
                            <option value="งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา">งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา</option>
                            <option value="งานพัฒนาหลักสูตรสายเทคโนโลยี หรือสายปฏิบัติการ">งานพัฒนาหลักสูตรสายเทคโนโลยี หรือสายปฏิบัติการ</option>
                            <option disabled>──────────</option>
                            <option value="แผนกวิชาช่างยนต์">แผนกวิชาช่างยนต์</option>
                            <option value="แผนกวิชาช่างกลโรงงาน">แผนกวิชาช่างกลโรงงาน</option>
                            <option value="แผนกวิชาช่างเชื่อมโลหะ">แผนกวิชาช่างเชื่อมโลหะ</option>
                            <option value="แผนกวิชาช่างไฟฟ้ากำลัง">แผนกวิชาช่างไฟฟ้ากำลัง</option>
                            <option value="แผนกวิชาช่างอิเล็กทรอนิกส์">แผนกวิชาช่างอิเล็กทรอนิกส์</option>
                            <option value="แผนกวิชาช่างก่อสร้าง">แผนกวิชาช่างก่อสร้าง</option>
                            <option value="แผนกวิชาการบัญชี">แผนกวิชาการบัญชี</option>
                            <option value="แผนกวิชาการตลาด">แผนกวิชาการตลาด</option>
                            <option value="แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล">แผนกวิชาธุรกิจดิจิทัล</option>
                            <option value="แผนกวิชาการโรงแรม">แผนกวิชาการโรงแรม</option>
                          </optgroup>
                        </select>
                      </td>
                      <td className="p-8 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(user._id, user.isActive, user.name)
                          }
                          className={`h-8 w-14 rounded-full transition-all relative p-1 shadow-inner ${user.isActive ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700"}`}
                        >
                          <div
                            className={`h-5 w-5 rounded-full transition-all duration-300 ${user.isActive ? "translate-x-6 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "translate-x-0 bg-slate-400 dark:bg-zinc-500"}`}
                          />
                        </button>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3  ">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/users/edit/${user._id}`)
                            }
                            className="p-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id, user.name)}
                            className="p-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                            title="ลบผู้ใช้ออกจากระบบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs Console */}
        <div className="bg-zinc-900 rounded-4xl border border-zinc-800 shadow-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <Terminal className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  ประวัติกิจกรรมระบบ
                </h2>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                  รายการบันทึกกิจกรรมล่าสุด
                </p>
              </div>
            </div>
            <button
              onClick={handleClearLogs}
              className="px-6 py-3 bg-white/5 hover:bg-rose-500 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:border-rose-500 transition-all"
            >
              ล้างประวัติกิจกรรม
            </button>
          </div>

          <div className="p-8 max-h-[700px] overflow-y-auto custom-scrollbar-dark space-y-6">
            {logs.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <Database className="w-12 h-12 text-zinc-800 mx-auto" />
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                  ไม่พบข้อมูลบันทึกกิจกรรม
                </p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex gap-6 group/log"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${log.action.includes("DELETE") ? "bg-rose-500 shadow-rose-500/40" : "bg-zinc-700 group-hover/log:bg-blue-500"} transition-colors`}
                    />
                    <div className="flex-1 w-0.5 bg-zinc-800 my-2 group-last/log:hidden" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                      <span className="text-[11px] font-black text-zinc-500 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString("th-TH", {
                          timeZone: "Asia/Bangkok",
                          hour12: false,
                        })}
                      </span>
                      <span className="text-sm font-black text-white uppercase italic tracking-tight">
                        {log.userName || "SYSTEM_KERN"}
                      </span>
                      <span
                        className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${getActionStyle(log.action)}`}
                      >
                        {log.action}
                      </span>
                      {log.module && (
                        <span className="text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                          {log.module}
                        </span>
                      )}
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4 group-hover/log:bg-white/5 transition-colors">
                      {log.link ? (
                        <a
                          href={log.link}
                          className="text-zinc-300 hover:text-blue-400 flex items-center justify-between group/link transition-colors"
                        >
                          <span className="text-xs font-bold leading-relaxed">
                            {log.details}
                          </span>
                          <ExternalLink
                            size={14}
                            className="opacity-0 group-link:opacity-100 transition-opacity"
                          />
                        </a>
                      ) : (
                        <p className="text-xs font-bold text-zinc-400 leading-relaxed">
                          {log.details}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex items-center gap-1.5">
                          {new Date(log.timestamp).toLocaleDateString("th-TH", {
                            timeZone: "Asia/Bangkok",
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                          IP: {log.ip || "REDACTED"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer Protocol */}
        <div className="pt-12 pb-8 text-center border-t border-slate-100 dark:border-zinc-900/50">
          <p className="text-[9px] text-slate-300 dark:text-zinc-800 font-black uppercase tracking-[0.4em] leading-loose">
            ระบบจัดเก็บข้อมูลสิทธิ์ระดับสูง <br />
            เฉพาะผู้ใช้ที่ได้รับการอนุญาตเท่านั้น • รุ่นพัฒนา v2.0
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
        fetch("/api/admin/users?_t=" + Date.now()),
        fetch("/api/admin/reports/summary?_t=" + Date.now()),
        fetch("/api/admin/logs?_t=" + Date.now()), // Backend now limits to 50 for max speed
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        // เรียงลำดับ: orderIndex > newest (_id)
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

  // --- Functions สำหรับจัดการ User ---

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
        toast.success(!currentStatus ? "เปิดใช้งานผู้ใช้เรียบร้อย" : "ระงับการใช้งานเรียบร้อย");
        fetchData();
      }
    } catch (error) {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  const deleteUser = async (targetId: string, targetName: string) => {
    if (!confirm(`⚠️ ต้องการลบสมาชิก "${targetName}" ออกจากระบบใช่หรือไม่? ไม่สามารถย้อนกลับได้`)) return;
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

  // --- Style Helpers ---

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "director":
      case "deputy_director":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "hr":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
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
      <div className="flex items-center py-60 justify-center max-w-[1600px] mx-auto bg-slate-50 font-black text-slate-400 italic">
        LOADING_SYSTEM_DATA...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-2 bg-slate-50">
      <Toaster position="top-right" />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "กิจกรรมทั้งหมด",
            val: summary?.totalActions,
            color: "text-blue-600",
          },
          {
            label: "การอนุมัติข้อมูลประจำตัว",
            val: summary?.approvals,
            color: "text-emerald-600",
          },
          {
            label: "การเปลี่ยนแปลงสิทธิ์์ผู้ใช้",
            val: summary?.roleChanges,
            color: "text-rose-600",
          },
          {
            label: "การอัปเดตระบบ",
            val: summary?.updates,
            color: "text-orange-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100"
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
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
            การจัดการสมาชิก
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative group/search">
              <input
                type="text"
                placeholder="ค้นหาชื่อสมาชิกหรือ @username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all w-[300px] shadow-sm"
              />
              <svg
                className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={fetchData}
              className="bg-slate-900 text-white text-[11px] font-black px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all uppercase italic shadow-lg shadow-slate-900/10"
            >
              รีเฟรชฐานข้อมูล
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-6 text-center w-20">ลำดับ</th>
                <th className="p-6">ข้อมูลประจำตัวผู้ใช้</th>
                <th className="p-6 text-center">ระดับการอนุญาต</th>
                <th className="p-6 text-center">สังกัด / แผนก</th>
                <th className="p-6 text-center">สถานะ</th>
                <th className="p-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-all group"
                >
                  <td className="p-6 text-center">
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
                  <td className="p-6">
                    <div className="font-black text-slate-900 text-lg uppercase">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-black text-blue-600 lowercase italic">
                      @{user.username}
                    </div>
                    {!user.isActive && (
                      <span className="inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-widest">
                        ⏳ รออนุมัติ
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-center">
                    <select
                      value={user.role || "user"}
                      onChange={(e) =>
                        changeRole(user._id, e.target.value, user.name)
                      }
                      className={`text-[10px] font-black border-2 rounded-xl px-2 py-2 outline-none uppercase ${getRoleStyle(user.role || "user")}`}
                    >
                      <option value="super_admin">SUPER_ADMIN</option>
                      <option value="editor">EDITOR</option>
                      <option value="admin">ADMIN</option>
                      <option value="director">ผอ (DIRECTOR)</option>
                      <option value="deputy_director">รอง ผอ (DEPUTY)</option>
                      <option value="hr">บุคคล (HR)</option>
                      <option value="general">พนักงาน (GENERAL)</option>
                      <option value="user">USER (เดิม)</option>
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    <select
                      value={user.department || "ไม่มีสังกัด"}
                      onChange={(e) =>
                        changeDepartment(user._id, e.target.value, user.name)
                      }
                      className="text-[10px] font-black border-2 rounded-xl px-2 py-2 outline-none text-slate-600 bg-slate-50 max-w-[140px]"
                    >
                      <option value="ไม่มีสังกัด">- ไม่มี -</option>
                      <option value="ผู้บริหารสถานศึกษา">ผู้บริหารสถานศึกษา</option>

                      <optgroup label="ฝ่ายบริหารทรัพยากร">
                        <option value="งานบริหารงานทั่วไป">งานบริหารงานทั่วไป</option>
                        <option value="งานบริหารและพัฒนาทรัพยากรบุคคล">งานบริหารและพัฒนาทรัพยากรบุคคล</option>
                        <option value="งานการเงิน">งานการเงิน</option>
                        <option value="งานการบัญชี">งานการบัญชี</option>
                        <option value="งานพัสดุ">งานพัสดุ</option>
                        <option value="งานอาคารสถานที่">งานอาคารสถานที่</option>
                        <option value="งานทะเบียน">งานทะเบียน</option>
                      </optgroup>

                      <optgroup label="ฝ่ายยุทธศาสตร์และแผนงาน">
                        <option value="งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ">งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ</option>
                        <option value="งานมาตรฐานและการประกันคุณภาพ">งานมาตรฐานและการประกันคุณภาพ</option>
                        <option value="งานศูนย์ดิจิทัลและสื่อสารองค์กร">งานศูนย์ดิจิทัลและสื่อสารองค์กร</option>
                        <option value="งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์">งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์</option>
                        <option value="งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ">งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ</option>
                        <option value="งานติดตามและประเมินผล">งานติดตามและประเมินผล</option>
                      </optgroup>

                      <optgroup label="ฝ่ายกิจการนักเรียน นักศึกษา">
                        <option value="งานกิจกรรมนักเรียนนักศึกษา">งานกิจกรรมนักเรียนนักศึกษา</option>
                        <option value="งานครูที่ปรึกษาและการแนะแนว">งานครูที่ปรึกษาและการแนะแนว</option>
                        <option value="งานปกครองและความปลอดภัยนักเรียนนักศึกษา">งานปกครองและความปลอดภัยนักเรียนนักศึกษา</option>
                        <option value="งานสวัสดิการนักเรียนนักศึกษา">งานสวัสดิการนักเรียนนักศึกษา</option>
                        <option value="งานโครงการพิเศษและการบริการ">งานโครงการพิเศษและการบริการ</option>
                      </optgroup>

                      <optgroup label="ฝ่ายวิชาการ">
                        <option value="งานพัฒนาหลักสูตรและการจัดการเรียนรู้">งานพัฒนาหลักสูตรและการจัดการเรียนรู้</option>
                        <option value="งานวัดผลและประเมินผล">งานวัดผลและประเมินผล</option>
                        <option value="งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ">งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ</option>
                        <option value="งานวิทยบริการและเทคโนโลยีการศึกษา">งานวิทยบริการและเทคโนโลยีการศึกษา</option>
                        <option value="งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา">งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา</option>
                        <option value="งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ">งานพัฒนาหลักสูตรสายเทคโนโลยีหรือสายปฏิบัติการ</option>
                        {/* แผนกวิชา */}
                        <option value="แผนกวิชาช่างยนต์">แผนกวิชาช่างยนต์</option>
                        <option value="แผนกวิชาช่างกลโรงงาน">แผนกวิชาช่างกลโรงงาน</option>
                        <option value="แผนกวิชาช่างเชื่อมโลหะ">แผนกวิชาช่างเชื่อมโลหะ</option>
                        <option value="แผนกวิชาช่างไฟฟ้ากำลัง">แผนกวิชาช่างไฟฟ้ากำลัง</option>
                        <option value="แผนกวิชาช่างอิเล็กทรอนิกส์">แผนกวิชาช่างอิเล็กทรอนิกส์</option>
                        <option value="แผนกวิชาช่างเทคนิคพื้นฐาน">แผนกวิชาช่างเทคนิคพื้นฐาน</option>
                        <option value="แผนกวิชาช่างก่อสร้าง">แผนกวิชาช่างก่อสร้าง</option>
                        <option value="แผนกวิชาการบัญชี">แผนกวิชาการบัญชี</option>
                        <option value="แผนกวิชาการตลาด">แผนกวิชาการตลาด</option>
                        <option value="แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล">แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล</option>
                        <option value="แผนกวิชาการโรงแรม">แผนกวิชาการโรงแรม</option>
                        <option value="แผนกวิชาสามัญสัมพันธ์">แผนกวิชาสามัญสัมพันธ์</option>
                      </optgroup>
                    </select>
                  </td>
                  <td className="p-6 text-center">
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
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/users/edit/${user._id}`)
                        }
                        className="text-[10px] font-black bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase italic border border-transparent hover:border-blue-500"
                      >
                        แก้ไขข้อมูล
                      </button>
                      <button
                        onClick={() => deleteUser(user._id, user.name)}
                        className="text-[10px] font-black bg-rose-50 text-rose-500 px-4 py-3 rounded-2xl hover:bg-rose-600 hover:text-white transition-all uppercase italic border border-rose-100"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs (Dark Theme) */}
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <span className="h-3 w-3 bg-rose-500 rounded-full animate-ping"></span>
            บันทึกการตรวจสอบควบคุม
          </h2>
          <button
            onClick={handleClearLogs}
            className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-6 py-3 rounded-2xl hover:bg-rose-500 hover:text-white border border-rose-500/20 uppercase tracking-widest"
          >
            ล้างบันทึก
          </button>
        </div>

        <div className="p-6 max-h-[800px] overflow-y-auto space-y-8 custom-scrollbar">
          <div className="mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 ml-6">
            แสดง 50 รายการล่าสุด
          </div>
          {logs.length === 0 ? (
            <p className="text-center text-slate-600 font-black italic uppercase py-20 tracking-widest">
              ยังไม่มีบันทึกกิจกรรม
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="group border-l-2 border-white/5 pl-6 hover:border-blue-500 transition-all relative"
              >
                <div
                  className={`absolute -left-[5px] top-0 h-2 w-2 rounded-full ${log.action.includes("DELETE") ? "bg-rose-500 shadow-[0_0_8px_rose]" : "bg-slate-700 group-hover:bg-blue-500"}`}
                ></div>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="text-center bg-white/5 p-4 rounded-3xl min-w-[100px] border border-white/10">
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
                      {log.module && (
                        <span className="text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                          {log.module}
                        </span>
                      )}
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
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                        วันที่:{" "}
                        {new Date(log.timestamp).toLocaleDateString("th-TH")}
                      </p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                        IP: {log.ip || "ไม่ปรากฏ"}
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

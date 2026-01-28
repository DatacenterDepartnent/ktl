"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function SuperAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = async () => {
    try {
      // หมายเหตุ: ต้องมี API GET /api/users ที่ส่งรายชื่อทั้งหมดมาก่อนหน้านี้แล้ว
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. ฟังก์ชันเปลี่ยนสถานะ (อนุมัติ / ระงับ)
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic Update: เปลี่ยนหน้าจอทันทีให้รู้สึกเร็ว ไม่ต้องรอ Server ตอบกลับ
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isActive: !currentStatus } : u)),
    );

    try {
      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
      fetchUsers(); // ถ้าพัง ให้โหลดข้อมูลจริงกลับมา
    }
  };

  // 3. ฟังก์ชันเปลี่ยน Role
  const changeRole = async (id: string, newRole: string) => {
    if (!confirm(`ยืนยันการเปลี่ยนสิทธิ์เป็น "${newRole}"?`)) {
      fetchUsers(); // รีเซ็ต dropdown กลับถ้ากดยกเลิก
      return;
    }

    try {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );

      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
    } catch (error) {
      alert("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  // 4. ฟังก์ชันลบผู้ใช้
  const deleteUser = async (id: string) => {
    if (!confirm("⚠️ คำเตือน: คุณต้องการลบผู้ใช้นี้ถาวรใช่หรือไม่?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (error) {
      alert("ลบไม่สำเร็จ");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center text-slate-400">กำลังโหลดข้อมูล...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <span className="bg-yellow-100 text-yellow-600 p-2 rounded-xl text-2xl">
            ⚡
          </span>
          Super Admin Console
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm ml-14">
          จัดการสิทธิ์การเข้าถึงและอนุมัติบัญชีผู้ใช้งาน
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-5">ผู้ใช้งาน (User Info)</th>
                <th className="p-5">สิทธิ์ (Role)</th>
                <th className="p-5 text-center">สถานะ (Status)</th>
                <th className="p-5 text-right">จัดการ (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="group hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  {/* 1. ข้อมูลผู้ใช้ */}
                  <td className="p-5">
                    <div className="font-bold text-slate-800 dark:text-white text-base">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {user.username}
                    </div>
                    <div className="text-xs text-blue-500 mt-0.5">
                      {user.email}
                    </div>
                  </td>

                  {/* 2. Dropdown เปลี่ยนสิทธิ์ */}
                  <td className="p-5">
                    <div className="relative inline-block w-40">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user._id, e.target.value)}
                        className={`w-full appearance-none px-3 py-2 pr-8 rounded-lg text-sm font-bold border outline-none cursor-pointer transition-all ${
                          user.role === "super_admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
                            : user.role === "admin"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                              : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-400"
                        }`}
                      >
                        <option value="editor">✏️ Editor</option>
                        <option value="admin">🛡️ Admin</option>
                        <option value="super_admin">⚡ Super Admin</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">
                        ▼
                      </div>
                    </div>
                  </td>

                  {/* 3. ปุ่ม Switch อนุมัติ */}
                  <td className="p-5 text-center">
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black ${
                        user.isActive
                          ? "bg-green-500 focus:ring-green-500"
                          : "bg-zinc-200 dark:bg-zinc-700 focus:ring-zinc-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                          user.isActive ? "translate-x-8" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <div
                      className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${
                        user.isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Pending"}
                    </div>
                  </td>

                  {/* 4. ปุ่มลบ */}
                  <td className="p-5 text-right">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="ลบผู้ใช้นี้"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

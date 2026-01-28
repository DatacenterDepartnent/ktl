"use client"; // ต้องเปลี่ยนเป็น Client Component เพื่อให้กดปุ่มได้

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean; // ✅ เพิ่ม field นี้
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users"); // ต้องสร้าง API GET users ด้วยนะถ้ายังไม่มี
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

  // ✅ ฟังก์ชันเปลี่ยนสถานะ (Active/Inactive)
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic Update (เปลี่ยนหน้าจอทันทีเพื่อให้รู้สึกเร็ว)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: !currentStatus } : u,
        ),
      );

      const res = await fetch(`/api/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) throw new Error();
    } catch {
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      fetchUsers(); // โหลดข้อมูลจริงกลับมาถ้าพัง
    }
  };

  // ✅ ฟังก์ชันเปลี่ยน Role
  const changeRole = async (id: string, newRole: string) => {
    if (!confirm(`ต้องการเปลี่ยนสิทธิ์เป็น ${newRole} ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      alert("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  if (loading)
    return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            อนุมัติและกำหนดสิทธิ์ผู้ใช้งาน
          </p>
        </div>
        <Link
          href="/dashboard/users/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-500 transition-all"
        >
          + เพิ่มผู้ใช้ (Admin)
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase">
                  User Info
                </th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase">
                  Role
                </th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase text-center">
                  Status
                </th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/30"
                >
                  <td className="p-5">
                    <div className="font-bold text-slate-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.username} | {user.email}
                    </div>
                  </td>
                  <td className="p-5">
                    {/* Dropdown เปลี่ยน Role */}
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm p-1 cursor-pointer dark:text-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="p-5 text-center">
                    {/* ปุ่ม Switch เปิด/ปิด Active */}
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        user.isActive
                          ? "bg-green-500"
                          : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <div className="text-[10px] mt-1 text-slate-400">
                      {user.isActive ? "อนุมัติแล้ว" : "รออนุมัติ"}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    {/* ใส่ปุ่มลบตรงนี้ถ้าต้องการ */}
                    <button className="text-red-500 hover:underline text-sm">
                      ลบ
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

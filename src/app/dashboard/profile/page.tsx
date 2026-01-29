"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ เพิ่ม state password และ confirmPassword
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    lineId: "",
    role: "",
    password: "", // รหัสผ่านใหม่
    confirmPassword: "", // ยืนยันรหัสผ่านใหม่
  });

  // โหลดข้อมูล
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            lineId: data.lineId || "",
            role: data.role || "",
            password: "", // ค่าเริ่มต้นว่าง
            confirmPassword: "", // ค่าเริ่มต้นว่าง
          });
        }
      } catch (error) {
        console.error("Load profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // บันทึกข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ เช็คว่าถ้ารหัสผ่านไม่ตรงกัน ให้แจ้งเตือน
    if (formData.password !== formData.confirmPassword) {
      alert("❌ รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          lineId: formData.lineId,
          password: formData.password, // ส่งรหัสผ่านไป (ถ้าว่าง Backend จะไม่เปลี่ยนให้)
        }),
      });

      if (res.ok) {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว!");

        // เคลียร์ช่องรหัสผ่านหลังบันทึกเสร็จ
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        router.refresh();
      } else {
        alert("❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-400">กำลังโหลดข้อมูล...</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-18">
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-xl text-2xl">
            👤
          </span>
          ข้อมูลส่วนตัว
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm ml-14">
          แก้ไขข้อมูลส่วนตัวและรหัสผ่านของคุณ
        </p>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username & Role (Read Only) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                ระดับสิทธิ์ (Role)
              </label>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-500 uppercase font-bold text-sm">
                {formData.role}
              </div>
            </div>

            {/* General Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                ชื่อ - นามสกุล
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Line ID
              </label>
              <input
                type="text"
                value={formData.lineId}
                onChange={(e) =>
                  setFormData({ ...formData, lineId: e.target.value })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* ✅ ส่วนเปลี่ยนรหัสผ่าน (แยกโซนให้ชัดเจน) */}
            <div className="md:col-span-2 mt-4 pt-6 border-t border-dashed border-zinc-300 dark:border-zinc-700">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">
                🔐 เปลี่ยนรหัสผ่าน
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="กรอกรหัสผ่านใหม่..."
                    className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="ยืนยันรหัสผ่าน..."
                    className={`w-full bg-white dark:bg-zinc-950 border rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      formData.password &&
                      formData.password !== formData.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-zinc-700 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                saving
                  ? "bg-slate-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-95"
              }`}
            >
              {saving ? "กำลังบันทึก..." : "💾 บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

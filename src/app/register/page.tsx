"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "", // ✅ ต้องมี เพราะ Backend ต้องการ
    password: "",
    confirmPassword: "",
    name: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (formData.password.length < 6) {
      alert("❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      // ตัด confirmPassword ออกก่อนส่ง
      const { confirmPassword, ...payload } = formData;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ ข้อความสำคัญ: แจ้งให้รู้ว่าต้องรออนุมัติ
        alert(
          "✅ สมัครสมาชิกสำเร็จ!\n\nกรุณารอผู้ดูแลระบบอนุมัติบัญชีของคุณก่อนเข้าใช้งาน",
        );
        router.push("/login");
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            สมัครสมาชิก <span className="text-blue-600">Admin</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ระบบจัดการข้อมูลวิทยาลัย (KTLTC)
          </p>
        </div>

        <div className="space-y-4">
          {/* ชื่อ-นามสกุล */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              name="name"
              placeholder="ชื่อจริง นามสกุลจริง"
              className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="ตั้งชื่อผู้ใช้ (ภาษาอังกฤษ)"
              className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)"
              className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="ยืนยันรหัสผ่าน"
              className={`w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-500 ring-red-500/50"
                  : "border-gray-200 dark:border-zinc-700 focus:ring-blue-500/50"
              }`}
              onChange={handleChange}
              required
            />
          </div>

          {/* ❌ เอา Dropdown Role ออกไปแล้ว (เพราะ Backend บังคับเป็น Editor เอง) */}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังส่งข้อมูล..." : "ลงทะเบียน"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </form>
    </div>
  );
}

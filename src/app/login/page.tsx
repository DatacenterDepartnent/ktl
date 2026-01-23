"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // เพิ่ม Link เข้ามาถ้ายังไม่มี

export default function LoginPage() {
  const router = useRouter(); // เรียกใช้ router
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // --- จุดสำคัญที่ต้องแก้ ---
        router.refresh(); // 1. สั่งรีเฟรชข้อมูล Server Component (เพื่อให้ Navbar เห็นชื่อ)
        router.push("/dashboard"); // 2. ค่อยย้ายหน้า
      } else {
        const data = await res.json();
        setError(data.error || "เข้าสู่ระบบล้มเหลว");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
            KTLTC ADMIN
          </h1>
          <p className="text-zinc-400 font-medium">เข้าสู่ระบบจัดการเว็บไซต์</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 text-white p-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700"
              placeholder="กรอกชื่อผู้ใช้งาน"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 text-white p-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-zinc-500 text-sm hover:text-white transition-colors"
          >
            ← กลับไปหน้าเว็บไซต์หลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

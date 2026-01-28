"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
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
        router.refresh();
        router.push("/dashboard");
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
    <div className="max-w-7xl mx-auto w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-black">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] dark:bg-blue-600/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] dark:bg-purple-600/20" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 dark:from-blue-400 dark:to-indigo-500">
            KTLTC ADMIN
          </h1>
          <p className="text-slate-500 font-medium dark:text-zinc-400">
            เข้าสู่ระบบจัดการเว็บไซต์
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-2 dark:text-zinc-500">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:bg-zinc-950/80 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-700"
              placeholder="กรอกชื่อผู้ใช้งาน"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-2 dark:text-zinc-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:bg-zinc-950/80 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-700"
              placeholder="กรอกรหัสผ่าน"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 dark:hover:bg-blue-500"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors dark:text-zinc-500 dark:hover:text-white"
          >
            ← กลับไปหน้าเว็บไซต์หลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

/**
 * ฟังก์ชัน Helper สำหรับบันทึก Log กิจกรรม
 * ส่งข้อมูลไปที่ API: /api/admin/logs (ฟังก์ชัน POST ที่เราเพิ่มเข้าไป)
 */
async function recordActivity(data: {
  userName: string;
  action: string;
  details: string;
}) {
  try {
    await fetch("/api/admin/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ ใช้ signIn ของ NextAuth
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        // ❌ กรณี Login ไม่สำเร็จ: บันทึก Log แจ้งเตือนความพยายามที่ผิดพลาด
        await recordActivity({
          userName: username || "Unknown User",
          action: "LOGIN_FAILED",
          details: "พยายามเข้าสู่ระบบด้วยรหัสผ่านที่ผิด",
        });
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        // ✅ กรณี Login สำเร็จ: บันทึก Log เข้าสู่ระบบ
        await recordActivity({
          userName: username,
          action: "LOGIN",
          details: "เข้าสู่ระบบจัดการเนื้อหา (CMS) สำเร็จ",
        });

        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-black">
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
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-2 dark:text-zinc-500">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:bg-zinc-950/80 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-700"
                placeholder="กรอกรหัสผ่าน"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors dark:text-zinc-500 dark:hover:text-blue-400"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
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
